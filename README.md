# Forks Events

Event feed and calendar for Forks, WA and the Olympic Peninsula: 7 Cedars
Casino in Sequim, the Clallam and Jefferson County fairgrounds, Fort Worden
in Port Townsend, and down the coast Quinault Beach Resort, the Ocean Shores
Convention Center and Little Creek Casino — with the Seattle clubs' seasons
(Seahawks, Mariners, Kraken, Storm, Reign, Sounders) in a Teams view.

Live at **https://forks.here.events/** once the domain is wired (GitHub
Pages, built by the Actions workflow once a day at noon Pacific).

A sister of lqa-events, built the way Chicago and Everett were: everything
that makes this Forks's is `site/city.js` (every team, venue, type, default,
share-code registry and string), `site/index.html`, `scripts/fetch-events.mjs`
(the sources), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json`, the manifest and icons (a Sitka spruce, rendered from
`favicon.svg`). Everything else is lqa-events' own, byte for byte — copy from
there, never edit here.

## Embed

```html
<div id="forks-events"></div>
<script src="https://forks.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Ticketmaster Discovery API** — every room by its venue id (every page):
  seven rooms, an hour to two and a half from Forks. Nothing in Forks itself
  sells through Ticketmaster, and the peninsula rooms carry only the odd tour
  date — the first build (2026-10-11) found two events, both at Little Creek.
  There is no city sweep (a radius search from Forks reaches Victoria and
  Tacoma first). Church events are left out (`isChurch`). Calls are paced
  1.5 s apart with a 429 back-off, since twelve sister builds share the key.
- **Seasons** — ESPN for the Seahawks, Storm, Reign and Sounders; MLB's stats
  API for the Mariners; the NHL's for the Kraken (`scripts/schedules.mjs`,
  shared with lqa). The clubs are Teams-view-only: their grounds are not rooms
  here and nothing of theirs enters the listing.

Next to add: the Forks Chamber's Area Events page (forkswa.com — a
hand-written WordPress page with no events plugin or feed), the Rainforest
Arts Center, Field Arts & Events Hall in Port Angeles, and the Forks Forum's
calendar, once one of them publishes something parseable.

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
