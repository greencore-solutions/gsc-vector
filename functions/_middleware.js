// functions/_middleware.js — a2a-vector.ai dual render: "/" answers the README as Markdown when the agent asks for text/markdown (same rule as the hubs).
export async function onRequest({ request, next, env }) {
  const url = new URL(request.url);
  const accept = request.headers.get("accept") || "";
  if (url.pathname === "/" && /text\/markdown/i.test(accept)) {
    const r = await env.ASSETS.fetch(new Request(new URL("/README.md", url), request));
    return new Response(r.body, { status: r.status, headers: { ...Object.fromEntries(r.headers), "content-type": "text/markdown; charset=utf-8", "vary": "Accept" } });
  }
  const res = await next();
  if (url.pathname === "/") { const h = new Headers(res.headers); h.set("vary", "Accept"); return new Response(res.body, { status: res.status, headers: h }); }
  return res;
}
