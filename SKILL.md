---
name: a2a-vector
description: Trade on GSC's agentic grocery marketplace. Use when an agent needs to find, verify, confirm by barcode, price, order or pay for grocery, cosmetics or peptides products from 353,510 makers across 20 markets, or to buy grocery retail media. Covers the six VECTOR steps (Verified, Exchange, Confirmed, Traffic, Open-to-place, Retail media) and the gate sequence the hubs enforce.
license: MIT
metadata:
  operator: GreenCore Solutions Corp. (GSC)
  version: "1.1.0"
  surface: https://a2a-vector.ai
  standards: OAuth 2.1, Model Context Protocol (MCP), Agent-to-Agent (A2A), x402
---

# A2A-VECTOR

A2A-VECTOR is how an AI agent trades on GSC. GSC runs the agentic grocery marketplace: 353,510 makers, 8,619 retail banners, 1,973,447 points of sale, 20 markets. Everything below is served over open standards; there is nothing proprietary to install beyond this file.

Read this once. Then call the tools in the order given. The hubs refuse out-of-order calls.

## When to use this skill

- A buyer's agent (retailer, distributor, importer, private label) needs to source, qualify, price or order a product for a market.
- A maker's or brand's agent needs to check whether its product is on the record, confirmed by its barcode and orderable in a market.
- An agent needs to buy grocery retail media (placement, promotion) rather than product.
- Any agent needs to settle a trade machine-to-machine.

Not for consumer shopping. Trade only.

## The doors

| Hub | MCP door (streamable-http) | A2A endpoint |
|---|---|---|
| A2A Grocery | `https://mcp.a2a-grocery.ai/mcp` | `https://a2a-grocery.ai/a2a` |
| A2A Cosmetics | `https://mcp.a2a-cosmetics.ai/mcp` | `https://a2a-cosmetics.ai/a2a` |
| A2A Peptides | `https://mcp.a2a-peptides.ai/mcp` | `https://a2a-peptides.ai/a2a` |
| A2A Retailmedia | `https://mcp.a2a-retailmedia.ai/mcp` | `https://a2a-retailmedia.ai/a2a` |

Each hub publishes its own agent card at `/.well-known/agent-card.json` and `llms.txt` at the root. Per-market A2A endpoints exist as `<country>.a2a-grocery.ai/a2a` (fr, de, it, es, pl, uk, nl, be, ch, us, ca, mx, br, jp, kr, in, vn, th, sg, au).

Reads need no credential. Writes (order intents, hand-offs) need an OAuth 2.1 client-credentials Bearer from `https://a2a-registry.ai` (register at `/oauth/register`, scope `<hub>.transact`).

## The six steps

### V — Verified: who is trading

Always first. On the hub for the product category:

1. `resolve_jurisdiction` with the market (ISO country code; UK for the United Kingdom).
2. `resolve_actor` with the trading party (maker, brand owner, distributor, importer, retailer) and its identifier.
3. `gate_transaction` with the jurisdiction and actor results.

Every later tool checks for an `allow` decision from step 3 (peptides may return `require_rx`). Without it, availability, price, documents, order and hand-off tools refuse. The signed trading record behind this step is the A2A Passport (`https://a2a-passport.ai`).

### E — Exchange: how it is paid

Order intents settle on x402 (USDC on Base) after the gate. A refused intent is not settled and not charged. Receipts are signed. The payment door is `https://gsc-x402.ai`; the hub's agent card lists x402 under `securitySchemes`. Do not collect card numbers or bank details; there are none in this flow.

### C — Confirmed: is this the product it says it is

Before pricing or ordering, confirm the product by its barcode:

- `fetch_gtin(gtin, market)` on `https://gtinfetch.ai/mcp` (or `GET https://gtinfetch.ai/01/{gtin14}`) returns the signed record: product, brand, maker, where it has been seen and when, `confidence` (`confirmed` · `seen` · `unknown`) and the source pages. Treat `unknown` as not confirmed; never guess a product from its digits.
- On the hub: `get_market_status`, `get_label_and_claims` (grocery, cosmetics) or `get_label_and_indication` (peptides), `get_enforcement_watch`.

Every record carries `claim_status` (`listed` · `claimed` · `verified`) and every field carries its source page. Prefer `verified` and `confirmed`. Surface `notice` to the human when one is present.

### T — Traffic: what is moving

Live AI agent traffic for the marketplace is published at `https://gsc-radar.ai`. Use it to report, not to rank; the hubs carry no rank for sale and no ads.

### O — Open-to-place: find, choose, order

With an `allow` in hand, on the hub:

1. `search_cleared_items` for the category, market and lane (ambient, chilled, frozen, fresh; organic, free-from, plant-based, artisan, origin, premium).
2. `get_item`, `compare_items` (`compare_presentations` on A2A Peptides), `get_product_documents` to qualify. `find_verified_supplier` (or `find_licensed_supplier` on peptides) when the question starts from a maker rather than a product.
3. `verify_gtin` (grocery, cosmetics) or `verify_serialization` (peptides).
4. `get_availability`, then `get_price`.
5. `create_order_intent`. This is the write that needs the Bearer and settles on x402.
6. `a2a_handoff` to pass the task to the counterparty's agent when the trade needs it.
7. `log_audit` at the end of every session.

For a maker checking its own range, stop after step 3 and report `claim_status` and `confidence` per market.

### R — Retail media: buy the shelf, not the product

Same gate (V), same payment (E), on `https://mcp.a2a-retailmedia.ai/mcp`. Media is bought by agents against the same maker, banner and market record used for product. Agencies enter at `https://gsc-agency.ai`.

## The two GSC agent classes

- **Maker agents** — one per maker; sell product, buy media. Trade through the same gate as any outside agent.
- **Media placement agents (MPAs)** — one per retail banner; sell the shelf and the media on it through A2A Retailmedia. Buying agents are the retailers' own procurement agents; the hubs answer them.

An agent's card carries `claim_status`: `listed` answers from the record and routes; `claimed` or `verified` trades.

## Test before you trade

elyssah is the sandbox maker on A2A Cosmetics (`https://elyssah.ai`), a fictional brand kept for integration. Run the six steps against its range end to end before touching a real maker's record. Orders against elyssah settle nothing.

## Rules the hubs enforce

- Gate first: jurisdiction → actor → gate before anything else. No exceptions.
- No ads, no rank for sale, trade only. Results are records, not recommendations.
- Research-use stock is not listed and not sold on A2A Peptides.
- When a trade needs a person, the human door is https://gsc-navigator.ai — one desk behind all four hubs.
- Artificial intelligence makes mistakes. Carry the hub `notice` through to the human.

## Operator

GreenCore Solutions Corp. (GSC) · Vancouver, Canada · London, UK · Microsoft AI Cloud Partner · D-U-N-S 24-336-6774 · `https://gsc-em.com` · `https://github.com/greencore-solutions`
