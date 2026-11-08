# Whose Queensway? — An interactive Story Map

**Archiving Queensway** · National University of Singapore

DEP5118 · Community Data Gathering and Visualisation · Technical Assignment

Amira Paramitha · Danielle Berboso · Liang Rongzhi

An English and Simplified Chinese archive of Queensway Shopping Centre, connecting property, livelihoods and everyday relationships through photographs, maps, interviews and published sources.

## Explore the website

The photographic opening, history timeline and floor explorer lead into three perspectives:

- **Property & Land:** whole-property value, individual units and market context, development value, existing uses, land-use planning and collective decisions.
- **Shopkeepers & Tenants:** operating choices, different trades, relationships between businesses and the practical consequences of relocation.
- **Visitors & Customers:** reasons to visit, discovering another shop and familiar services that bring people back.

The perspectives converge in a shared conclusion, an explorable archive, participation and project information. Research sources and image credits are available through the website. Participation connects to the project questionnaires on Ushahidi.

## Run locally

The website is static and has no build step. Node.js 22 or newer is used for validation; Python 3 is used for preview.

```sh
python3 scripts/preview.py
```

Open <http://127.0.0.1:5178/>. On macOS, `python3 scripts/preview.py --start` can also manage a persistent local preview. Reload after saving a change.

Direct entries include `?story=property`, `?story=shop`, `?story=visitor`, and `?section=converge`, `?section=explore`, `?section=future`, `?section=project`. These query routes also work beneath a GitHub project-site path. Live basemap tiles and external source pages need internet access.

## Validate

```sh
node scripts/check-release.mjs
```

The check validates JavaScript syntax, JSON, local file references, project-site paths, directory/photo identities, bilingual interview clip labels and timing arithmetic. It scans public text for private-source links, local user paths and common credential patterns. Check desktop and mobile layouts, scrolling, keyboard navigation, media playback and both languages in a browser as well.

## Publish on GitHub Pages

The website is served from **`dist/`**. The repository includes a manually triggered workflow that validates the site and uploads only this directory.

1. Place the public package in a GitHub repository.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. In **Actions**, select **Validate and publish GitHub Pages**, then **Run workflow**.
4. Open the deployment URL reported by the completed workflow.

The workflow does not publish automatically on push. The original working repository can include private research records and previous revisions, so prepare a public package before uploading:

```sh
python3 scripts/prepare-github.py
```

This creates `work/github-release/` from an explicit allowlist, with no `.git` history, original research folders, verification screenshots or local hosting settings. Review this folder, then initialize or upload that public package. The preparation command performs no upload. For an unchanged generated package, `--refresh` rebuilds it and moves its previous copy to the Trash. Existing local source and preview folders remain in place.

GitHub's documentation covers [custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Maintain the site

| Location | Purpose |
| --- | --- |
| `dist/index.html`, `dist/app.js` | Entry, chapter routing, language state and scrolling. |
| `dist/opening.*`, `dist/context*`, `dist/geo-stage.js` | Opening photographs, history, original documents and geographic context. |
| `dist/narrative-system.*`, `dist/property-*`, `dist/shop-story*`, `dist/visitor-story*` | Three perspectives and their evidence displays. |
| `dist/community-*`, `dist/archive-notes.js`, `dist/site-navigation.*` | Shared conclusion, exploration, participation, project readers and navigation. |
| `dist/interview-recordings.js`, `dist/interview-audio.*` | Interview metadata and playback. |
| `dist/data/`, `dist/assets/`, `dist/vendor/` | Public research data, media, fonts and rendering dependencies. |

Update English and Chinese together, including source notes, captions, controls and accessibility labels. Match photographs by business identity, complete unit and floor. When changing interview excerpts, keep the speaker, shop, original interval and spoken content together. Preserve source dates and distinguish asking prices, recorded transactions, regional indices and planning designations.

The local research workspace retains the original media, source mapping and reproducible import/font scripts separately. Rebuilding photo or font assets requires those originals; they are not needed to run this public package.

## Attribution and licences

- **Research, interviews and field photographs:** Archiving Queensway. Full project biographies and individual source credits appear in the website.
- **OneMap:** Singapore Land Authority, under the [Singapore Open Data Licence v1.0](https://www.onemap.gov.sg/legal/opendatalicence.html).
- **OpenStreetMap:** © OpenStreetMap contributors, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/).
- **Basemap:** OpenFreeMap / OpenMapTiles, with attribution displayed on the map.
- **MapLibre GL JS:** BSD-3-Clause; the licence is retained in `dist/vendor/maplibre-LICENSE.txt`.
- **EB Garamond and Noto Serif SC:** SIL Open Font License; notices are retained in `dist/assets/fonts/`.
- **Historical photographs, published documents and other credited media:** their identified creators and publishers retain their respective rights. Credits are attached to each item; no blanket reuse licence is asserted for third-party media.
