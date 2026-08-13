const indexHtml = __INDEX_HTML__;

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' || !url.pathname.includes('.')) {
      return new Response(indexHtml, {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
    const assetResponse = await env.ASSETS.fetch(request);
    return assetResponse;
  },
};

export default worker;
