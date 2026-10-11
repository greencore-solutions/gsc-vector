// site/build.mjs — a2a-vector.ai: render README.md with the A2A hub chrome; serve SKILL.md, llms.txt, agent-card.json verbatim.
// Output: dist/ (index.html, index.md = README.md bytes, SKILL.md, llms.txt, README.md, .well-known/agent-card.json, styles.css, _headers).
// The repo is the only copy of the four files; this script reads them at build time. VECTOR-02 (CEO 2026-10-10).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { marked } from "marked";
const readme = readFileSync("README.md", "utf8");
const llmsFirst = readFileSync("llms.txt", "utf8").split("\n")[0].replace(/^#\s*/, "");
const title = llmsFirst.split(" · ")[0];
const hubs = [["A2A Grocery", "https://a2a-grocery.ai/"], ["A2A Cosmetics", "https://a2a-cosmetics.ai/"], ["A2A Peptides", "https://a2a-peptides.ai/"], ["A2A Retailmedia", "https://a2a-retailmedia.ai/"]];
const files = [["SKILL.md", "/SKILL.md"], ["llms.txt", "/llms.txt"], ["Agent Card", "/.well-known/agent-card.json"], ["Markdown twin", "/index.md"]];
const nav = hubs.map(([n, u]) => `<a href="${u}">${n}</a>`).join("") + files.map(([n, u]) => `<a href="${u}">${n}</a>`).join("");
const operatorLine = (readme.match(/^Operated by .*$/m) || ["Operated by GreenCore Solutions Corp. · gsc-em.com · MIT License"])[0].replace(/\*/g, "");
const ceoBlock = "Matthew Keddy, Chief Executive Officer · mk@gsc-em.com · +1 647 237 7744 · gsc-em.com · gsc-em.co.uk";
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${llmsFirst}" />
<link rel="canonical" href="https://a2a-vector.ai/" />
<link rel="stylesheet" href="/styles.css" />
<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
<link rel="alternate" type="application/json" href="/.well-known/agent-card.json" title="GSC VECTOR Agent Card" />
<link rel="alternate" type="text/markdown" href="/index.md" title="Markdown twin" />
</head>
<body>
<header class="hd"><div class="wrap"><a class="brand" href="/" aria-label="GSC VECTOR home"><svg viewBox="0 0 512 512" aria-hidden="true"><circle cx="256" cy="256" r="256" fill="#1E6BFF"/><path d="M256 133 377 341H135Z" fill="none" stroke="#FFFFFF" stroke-width="27" stroke-linejoin="round"/></svg><span class="bn">GSC VECTOR</span><span class="bt">AGENT SKILL</span></a><nav class="nav" aria-label="Primary">${nav}</nav></div></header>
<main class="wrap doc">
${marked.parse(readme)}
</main>
<footer class="ft"><div class="wrap"><div class="links">${nav}</div>
<section class="form" id="record"><h2>Put your product on the record</h2>
<form action="https://formspree.io/f/xgaoypqv" method="POST">
<label>Company <input type="text" name="company" required></label>
<label>Name <input type="text" name="name" required></label>
<label>Email <input type="email" name="email" required></label>
<label>Markets <input type="text" name="markets"></label>
<label>Message <input type="text" name="message"></label>
<button class="btn btn-o" type="submit">Send</button>
</form></section>
<p class="op">${operatorLine}</p><p class="nc">${ceoBlock}</p></div></footer>
</body>
</html>
`;
mkdirSync("dist/.well-known", { recursive: true });
writeFileSync("dist/index.html", html);
for (const f of ["README.md", "SKILL.md", "llms.txt"]) copyFileSync(f, "dist/" + f);
copyFileSync("README.md", "dist/index.md");
copyFileSync("agent-card.json", "dist/.well-known/agent-card.json");
copyFileSync("site/styles.css", "dist/styles.css");
writeFileSync("dist/_headers", `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action https://formspree.io
/SKILL.md
  Content-Type: text/markdown; charset=utf-8
/index.md
  Content-Type: text/markdown; charset=utf-8
/README.md
  Content-Type: text/markdown; charset=utf-8
/llms.txt
  Content-Type: text/plain; charset=utf-8
`);
console.log("built dist/ for", title);
