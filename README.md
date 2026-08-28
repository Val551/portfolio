# Portfolio

A personal portfolio built as a console home screen rather than a scrolling page.
There is no nav bar and no long scroll: the row of app tiles *is* the navigation,
and opening one covers the screen the way a game hub does.

Live: _not deployed yet_

## The idea

The PlayStation 5 system UI is the reference, and the goal was to translate its
actual mechanics rather than its surface. Three of them carry the whole design:

- **Focus is the interaction model.** Exactly one tile is focused, and
  everything else responds to it — the title, the key art, the ambient hue, and
  the position and colour of the light in the room.
- **The background is the colour system, not decoration.** A layered ambient
  field (key light, drifting blobs, two parallax bokeh layers, grain) is tinted
  by whatever is selected and pans as the selection moves along the row.
- **The theme never costs legibility.** A scrim sits between the ambient layer
  and every piece of type, and the palette is measured against the brightest
  point the room can reach rather than against a flat swatch.

## Stack

- Next.js (App Router) with `output: "export"` — a fully static site, no server
- TypeScript, React
- Tailwind CSS v4, CSS-first `@theme` tokens
- **Zero runtime dependencies** beyond `next`, `react`, and `react-dom`

No animation library, no UI kit, no icon package. The reticles, the ambient
system, and the motion are all hand-written CSS and SVG.

## Notes on a few decisions

**Colour is OKLCH throughout,** with `@property` used to register the ambient
hue and a couple of other custom properties so they interpolate natively — the
room's colour crossfade costs no JavaScript.

**Contrast is measured, not estimated.** The ambient layer means text sits on an
arbitrary backdrop, so the ink ramp was checked by compositing every painted
layer into a canvas and sampling the result at each text node, across all five
section hues. The numbers and the method are recorded in
`src/styles/theme.css`.

**Motion is positional, not event-driven.** The ambient pan is derived from the
focused tile's index, so the resting state is correct on its own and the
transitions only describe how it travels between resting states. Nothing on the
page is ever gated behind an animation having fired — a lesson learned the hard
way after content shipped blank in a throttled renderer.

**The contact form composes a `mailto:` rather than posting.** The site is a
static export with no backend, so a form that appeared to send would either need
a third-party endpoint or would silently drop messages. It validates, then hands
a fully-composed message to the visitor's own mail client, and says so on the
button.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Structure

```
src/
  app/          layout, global stylesheet
  components/
    console/    boot sequence, shell, tile row, reticle artwork
    hubs/       the five sections
    chrome/     ambient background, clock
  content/      all copy and data, typed
  styles/       design tokens
```

All copy lives in `src/content` as typed data, so no prose is embedded in a
component and counts shown in the UI are derived from the content itself.
