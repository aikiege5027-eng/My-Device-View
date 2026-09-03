export type WebScreenshotToolProps = {
  fileName: string;
  targetId: string;
};

/** Native fallback: page capture is available only in the browser build. */
export function WebScreenshotTool(_props: WebScreenshotToolProps) {
  return null;
}
