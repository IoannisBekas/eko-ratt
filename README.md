# Eko-Rätt AB website

A responsive, four-language accounting website with a Visify-inspired visual direction and original Eko-Rätt content.

Public website: https://ioannisbekas.github.io/eko-ratt/

GitHub Pages serves `docs` from the `main` branch. The site uses plain HTML, CSS and JavaScript; no dependencies or bundler are needed. Swedish is the default; English, Greek and Albanian are available at `/eko-ratt/en/`, `/eko-ratt/el/` and `/eko-ratt/sq/`.

Edit `index.template.html`, `docs/assets/styles.css`, `docs/assets/app.js` and the text in `docs/assets/copy.js`. Run `node prepare-site.mjs` to update the localized HTML pages and metadata before committing changes. Node.js 22 or newer is recommended for this preparation script.

Motion is in `docs/assets/motion.js` and `motion.css`: word-by-word scroll entrances, an original animated financial SVG collage, drawn annotations, pointer/scroll depth and lime hover shadows. Animations pause offscreen and can be paused by the visitor. The operating system's reduced-motion preference is respected. All graphics remain visible without the motion script.

The appointment form prepares an email to `Ekorett@gmail.com`. The visitor sends the request in their email application, and Eko-Rätt confirms the appointment. There is no automatic reservation or email-delivery backend.

The original Eko-Rätt logos are included unchanged. DM Sans and Mynerve are bundled with their SIL Open Font License files in `docs/assets`.

Three original grayscale photographic collages introduce everyday bookkeeping, year-end accounts and advisory services. The artwork was generated with the built-in image generation tool and is decorative; the multilingual captions provide all service information. Layout and gentle drift animation are in `docs/assets/collage.css`. Existing pause, visibility and reduced-motion controls apply.

The 0–100% loading screen in `docs/assets/loader.js` and `loader.css` waits for eager image decoding and both fonts before revealing the page and starting its motion. Progress measures completed readiness tasks, rather than download bytes. Failed assets settle and a 20-second bootstrap failsafe prevents permanent blocking; without JavaScript the website remains visible. Google Maps loads independently.
