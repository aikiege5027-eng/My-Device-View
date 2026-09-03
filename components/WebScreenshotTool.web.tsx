import html2canvas from 'html2canvas';
import { createPortal } from 'react-dom';
import '../assets/vendor/figit-dom-to-figma.min.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';

// Figma Icon: cinema (Design Token China, node 612:923)
import Cinema from '../assets/cinema.svg';
import { colorThemes, typographyTokens } from '../designTokens';

export type WebScreenshotToolProps = {
  fileName: string;
  targetId: string;
};

type FigmaConverter = {
  convert(options: {
    element: HTMLElement;
    height: number;
    name: string;
    width: number;
  }): Promise<{ toClipboardItem(): ClipboardItem }>;
};

declare global {
  interface Window {
    createFigmaConverter?: (options: {
      imageLoader: (image: { src: string }) => Promise<{ bytes: ArrayBuffer; mimeType: string }>;
      layout: 'absolute';
    }) => FigmaConverter;
  }
}

const CAPTURE_WIDTH = 375;
const CAPTURE_SCALE = 3;
const DRAG_THRESHOLD = 5;
const VIEWPORT_GUTTER = 8;
const BUTTON_SIZE = 44;
const SCREENSHOT_TOOL_Z_INDEX = 2_147_483_647;

const theme = colorThemes.light;
const buttonTypography = typographyTokens.body14Semibold;

type Position = { left: number; top: number };
type DragState = {
  moved: boolean;
  offsetX: number;
  offsetY: number;
  pointerId: number;
  startX: number;
  startY: number;
};

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('浏览器无法生成 PNG 图片'));
      }
    }, 'image/png');
  });
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function downloadPng(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

type CopyResult = 'figma' | 'png' | 'unsupported';

async function createFigmaClipboardItem(
  pngBlob: Blob,
  logicalHeight: number,
  layerName: string,
) {
  if (typeof window.createFigmaConverter !== 'function') {
    throw new Error('Figma 剪贴板转换组件加载失败');
  }

  const imageUrl = URL.createObjectURL(pngBlob);
  const stagingFrame = document.createElement('div');
  const stagingImage = document.createElement('img');

  stagingFrame.setAttribute('aria-hidden', 'true');
  Object.assign(stagingFrame.style, {
    background: theme.background.page,
    height: `${logicalHeight}px`,
    left: '-10000px',
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'fixed',
    top: '0',
    width: `${CAPTURE_WIDTH}px`,
  });
  Object.assign(stagingImage.style, {
    display: 'block',
    height: `${logicalHeight}px`,
    width: `${CAPTURE_WIDTH}px`,
  });
  stagingImage.alt = '';
  stagingImage.src = imageUrl;
  stagingFrame.appendChild(stagingImage);
  document.body.appendChild(stagingFrame);

  try {
    await stagingImage.decode();
    const converter = window.createFigmaConverter({
      imageLoader: async ({ src }) => {
        if (src === imageUrl || src === stagingImage.src) {
          return {
            bytes: await pngBlob.arrayBuffer(),
            mimeType: 'image/png',
          };
        }
        const response = await fetch(src);
        const imageBlob = await response.blob();
        return {
          bytes: await imageBlob.arrayBuffer(),
          mimeType: imageBlob.type,
        };
      },
      layout: 'absolute',
    });
    const result = await converter.convert({
      element: stagingFrame,
      height: logicalHeight,
      name: layerName,
      width: CAPTURE_WIDTH,
    });
    return result.toClipboardItem();
  } finally {
    stagingFrame.remove();
    URL.revokeObjectURL(imageUrl);
  }
}

async function copyScreenshot(
  blob: Blob,
  logicalHeight: number,
  layerName: string,
): Promise<CopyResult> {
  if (
    !window.isSecureContext
    || typeof ClipboardItem === 'undefined'
    || !navigator.clipboard?.write
  ) {
    return 'unsupported';
  }

  try {
    const figmaClipboardItem = await createFigmaClipboardItem(blob, logicalHeight, layerName);
    await navigator.clipboard.write([figmaClipboardItem]);
    return 'figma';
  } catch (error) {
    console.warn('Figma clipboard conversion failed; trying PNG clipboard.', error);
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    return 'png';
  } catch (error) {
    console.warn('PNG clipboard write failed; downloading instead.', error);
    return 'unsupported';
  }
}

type ScrollAreaSnapshot = {
  elementIndex: number;
  scrollHeight: number;
  visibleHeight: number;
};

type CaptureMeasurement = {
  captureHeight: number;
  scrollAreas: ScrollAreaSnapshot[];
};

function getElementTree(root: HTMLElement) {
  return [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];
}

function normalizeCaptureGrids(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-testid="capture-three-column-grid"]').forEach((grid) => {
    grid.querySelectorAll<HTMLElement>('[data-testid="capture-three-column-item"]').forEach((item) => {
      item.style.width = 'calc((100% - 16px) / 3)';
    });
  });
}

function getVerticalScrollAreas(target: HTMLElement): ScrollAreaSnapshot[] {
  return getElementTree(target).flatMap((element, elementIndex) => {
    const overflowY = window.getComputedStyle(element).overflowY;
    const canScrollVertically = overflowY === 'auto' || overflowY === 'scroll';
    if (!canScrollVertically || element.scrollHeight <= element.clientHeight + 1) {
      return [];
    }
    return [{
      elementIndex,
      scrollHeight: element.scrollHeight,
      visibleHeight: element.clientHeight,
    }];
  });
}

function hasVisibleModal() {
  return Array.from(document.querySelectorAll<HTMLElement>('[aria-modal="true"]')).some((modal) => {
    if (modal.closest('[data-screenshot-tool]')) {
      return false;
    }
    const bounds = modal.getBoundingClientRect();
    const style = window.getComputedStyle(modal);
    return bounds.width > 0
      && bounds.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden';
  });
}

function stabilizeClonedModals(clonedDocument: Document) {
  clonedDocument.querySelectorAll<HTMLElement>('[aria-modal="true"]').forEach((modal) => {
    let layer: HTMLElement | null = modal;
    while (layer && layer !== clonedDocument.body) {
      Object.assign(layer.style, {
        animation: 'none',
        animationDelay: '0s',
        animationDuration: '0s',
        opacity: '1',
        transform: 'none',
        transition: 'none',
      });
      layer = layer.parentElement;
    }
  });
}

async function measureCaptureLayout(target: HTMLElement, baseHeight: number): Promise<CaptureMeasurement> {
  const stagingHost = document.createElement('div');
  const stagingTarget = target.cloneNode(true) as HTMLElement;
  stagingTarget.removeAttribute('id');

  Object.assign(stagingHost.style, {
    height: `${baseHeight}px`,
    left: '-10000px',
    overflow: 'hidden',
    pointerEvents: 'none',
    position: 'fixed',
    top: '0',
    visibility: 'hidden',
    width: `${CAPTURE_WIDTH}px`,
    zIndex: '-1',
  });
  Object.assign(stagingTarget.style, {
    flex: 'none',
    height: `${baseHeight}px`,
    maxHeight: `${baseHeight}px`,
    maxWidth: `${CAPTURE_WIDTH}px`,
    minHeight: `${baseHeight}px`,
    minWidth: `${CAPTURE_WIDTH}px`,
    overflow: 'hidden',
    position: 'relative',
    width: `${CAPTURE_WIDTH}px`,
  });

  stagingHost.appendChild(stagingTarget);
  document.body.appendChild(stagingHost);

  try {
    normalizeCaptureGrids(stagingTarget);
    await waitForPaint();
    const scrollAreas = getVerticalScrollAreas(stagingTarget);
    const hiddenContentHeight = scrollAreas.reduce(
      (largest, area) => Math.max(largest, area.scrollHeight - area.visibleHeight),
      0,
    );
    return {
      captureHeight: Math.ceil(Math.max(
        baseHeight + hiddenContentHeight,
        stagingTarget.scrollHeight,
      )),
      scrollAreas,
    };
  } finally {
    stagingHost.remove();
  }
}

async function renderTarget(target: HTMLElement) {
  if ('fonts' in document) {
    await document.fonts.ready;
  }
  await waitForPaint();

  const targetBounds = target.getBoundingClientRect();
  const baseHeight = Math.ceil(Math.max(targetBounds.height, target.clientHeight));
  const modalVisible = hasVisibleModal();
  const { captureHeight, scrollAreas } = modalVisible
    ? { captureHeight: baseHeight, scrollAreas: [] }
    : await measureCaptureLayout(target, baseHeight);

  return html2canvas(document.body, {
    backgroundColor: theme.background.page,
    height: captureHeight,
    ignoreElements: (element) => element.closest('[data-screenshot-tool]') !== null,
    imageTimeout: 15_000,
    logging: false,
    onclone: (clonedDocument) => {
      const clonedTarget = clonedDocument.getElementById(target.id);
      if (!clonedTarget) {
        throw new Error('未找到截图区域');
      }

      Object.assign(clonedDocument.documentElement.style, {
        height: `${captureHeight}px`,
        overflow: 'visible',
        width: `${CAPTURE_WIDTH}px`,
      });
      Object.assign(clonedDocument.body.style, {
        height: `${captureHeight}px`,
        margin: '0',
        overflow: 'visible',
        width: `${CAPTURE_WIDTH}px`,
      });
      Object.assign(clonedTarget.style, {
        flex: 'none',
        height: `${captureHeight}px`,
        maxHeight: 'none',
        maxWidth: `${CAPTURE_WIDTH}px`,
        minHeight: `${captureHeight}px`,
        minWidth: `${CAPTURE_WIDTH}px`,
        overflow: 'visible',
        position: 'relative',
        width: `${CAPTURE_WIDTH}px`,
      });
      normalizeCaptureGrids(clonedTarget);
      stabilizeClonedModals(clonedDocument);

      const clonedElements = getElementTree(clonedTarget);
      scrollAreas.forEach(({ elementIndex, scrollHeight }) => {
        const clonedScrollArea = clonedElements[elementIndex];
        if (!clonedScrollArea) {
          return;
        }
        Object.assign(clonedScrollArea.style, {
          flex: '0 0 auto',
          height: `${scrollHeight}px`,
          maxHeight: 'none',
          minHeight: `${scrollHeight}px`,
          overflowY: 'visible',
        });
        clonedScrollArea.scrollTop = 0;
      });
    },
    scale: CAPTURE_SCALE,
    scrollX: 0,
    scrollY: 0,
    useCORS: true,
    width: CAPTURE_WIDTH,
    windowHeight: baseHeight,
    windowWidth: CAPTURE_WIDTH,
  });
}

function clampPosition(left: number, top: number): Position {
  return {
    left: Math.min(
      Math.max(left, VIEWPORT_GUTTER),
      Math.max(VIEWPORT_GUTTER, window.innerWidth - BUTTON_SIZE - VIEWPORT_GUTTER),
    ),
    top: Math.min(
      Math.max(top, VIEWPORT_GUTTER),
      Math.max(VIEWPORT_GUTTER, window.innerHeight - BUTTON_SIZE - VIEWPORT_GUTTER),
    ),
  };
}

const buttonBaseStyle: CSSProperties = {
  alignItems: 'center',
  background: theme.background.container,
  border: `1px solid ${theme.border.componentStroke}`,
  borderRadius: 12,
  bottom: 16,
  color: theme.text.secondary,
  cursor: 'pointer',
  display: 'flex',
  height: BUTTON_SIZE,
  justifyContent: 'center',
  left: 12,
  padding: 0,
  pointerEvents: 'auto',
  position: 'fixed',
  touchAction: 'manipulation',
  userSelect: 'none',
  width: BUTTON_SIZE,
  zIndex: 100,
  ...buttonTypography,
};

const statusStyle: CSSProperties = {
  background: theme.background.container,
  border: `1px solid ${theme.border.componentStroke}`,
  borderRadius: 8,
  bottom: 72,
  color: theme.text.secondary,
  maxWidth: 280,
  padding: '8px 12px',
  pointerEvents: 'none',
  position: 'fixed',
  right: 16,
  zIndex: 101,
  ...typographyTokens.footer12Regular,
};

/** Web-only floating capture control. Right-drag moves it; click captures PNG. */
export function WebScreenshotTool({ fileName, targetId }: WebScreenshotToolProps) {
  const [capturing, setCapturing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [status, setStatus] = useState('');
  const capturingRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    const host = document.createElement('div');
    host.dataset.screenshotTool = 'true';
    host.setAttribute('data-html2canvas-ignore', 'true');
    Object.assign(host.style, {
      inset: '0',
      pointerEvents: 'none',
      position: 'fixed',
      zIndex: String(SCREENSHOT_TOOL_Z_INDEX),
    });
    document.body.appendChild(host);
    setPortalHost(host);

    return () => {
      host.remove();
    };
  }, []);

  const showStatus = useCallback((message: string) => {
    setStatus(message);
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
    }
    statusTimerRef.current = window.setTimeout(() => {
      setStatus('');
      statusTimerRef.current = null;
    }, 4_000);
  }, []);

  useEffect(() => () => {
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!position) {
      return;
    }
    const keepInsideViewport = () => {
      setPosition((current) => current && clampPosition(current.left, current.top));
    };
    window.addEventListener('resize', keepInsideViewport);
    return () => window.removeEventListener('resize', keepInsideViewport);
  }, [position !== null]);

  const capture = useCallback(async () => {
    if (capturingRef.current) {
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) {
      showStatus('截图失败：未找到页面区域');
      return;
    }

    capturingRef.current = true;
    setCapturing(true);
    showStatus('正在生成截图…');

    try {
      const canvas = await renderTarget(target);
      const blob = await canvasToBlob(canvas);
      const logicalHeight = canvas.height / CAPTURE_SCALE;
      const layerName = fileName.replace(/\.png$/i, '');
      const copyResult = await copyScreenshot(blob, logicalHeight, layerName);

      if (copyResult === 'figma') {
        showStatus(`已复制 Figma 图层：${CAPTURE_WIDTH} × ${logicalHeight}（3× 高清）`);
      } else if (copyResult === 'png') {
        showStatus('已复制 PNG；粘贴到 Figma 后需手动缩放');
      } else {
        downloadPng(blob, fileName);
        showStatus('剪贴板不可用，截图已下载为 PNG');
      }
    } catch (error) {
      console.error('Page capture failed.', error);
      showStatus('截图失败，请重试');
    } finally {
      capturingRef.current = false;
      setCapturing(false);
    }
  }, [fileName, showStatus, targetId]);

  const finishDrag = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    dragRef.current = null;
    setDragging(false);
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (capturingRef.current || event.pointerType !== 'mouse' || event.button !== 2) {
      return;
    }

    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      moved: false,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (!drag.moved) {
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (distance < DRAG_THRESHOLD) {
        return;
      }
      drag.moved = true;
      setDragging(true);
    }

    event.preventDefault();
    setPosition(clampPosition(
      event.clientX - drag.offsetX,
      event.clientY - drag.offsetY,
    ));
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || suppressClickRef.current) {
      return;
    }
    void capture();
  };

  const buttonStyle: CSSProperties = {
    ...buttonBaseStyle,
    ...(position ? { bottom: 'auto', left: position.left, top: position.top } : null),
    cursor: dragging ? 'grabbing' : 'pointer',
    opacity: capturing ? 0.64 : 1,
  };

  if (!portalHost) {
    return null;
  }

  return createPortal(
    <>
      <button
        aria-label="截取当前页面；按住鼠标右键可拖动位置"
        disabled={capturing}
        onClick={handleClick}
        onContextMenu={(event) => event.preventDefault()}
        onLostPointerCapture={() => {
          dragRef.current = null;
          setDragging(false);
        }}
        onPointerCancel={finishDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        style={buttonStyle}
        title="左键截图，按住右键拖动"
        type="button"
      >
        <span aria-hidden="true" style={{ display: 'flex' }}>
          <Cinema color={theme.text.primary} height={20} width={20} />
        </span>
      </button>
      {status ? <div aria-live="polite" role="status" style={statusStyle}>{status}</div> : null}
    </>,
    portalHost,
  );
}
