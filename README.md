# UMN VR club site

The UMN VR club's site, https://umn-vr.github.io/. GitHub Pages serves it from
the `gh-pages` branch:

| Page | What it is | Made from |
| --- | --- | --- |
| `/` | The club's landing page | [index.html](index.html) and [club.css](club.css) here |
| `/archive/2026-10-11/` | The previous homepage | [archive/2026-10-11/](archive/2026-10-11/) |
| `/tour/` | Choose a campus tour | [UMN-VR/tour](https://github.com/UMN-VR/tour), its own GitHub Pages site |

The folder `Media ` ends in a space, as it always has: the landing page links
to it by that name.

## Building and deploying

The club site and the campus tours are separate publishes. This repository is
the page at https://umn-vr.github.io/. The tours are
https://umn-vr.github.io/tour/, deployed from
[UMN-VR/tour](https://github.com/UMN-VR/tour).

```sh
npm install
npm run build
npm run deploy
```

`npm run deploy` builds this site and adds it to `gh-pages`. It does not build
or publish the tour, and it does not upload photographs. Those commands are in
the tour repository. Before it builds, it records the commit of FOSS Earth's UI,
whose theme the site copies, in `deployed-from.json`, and commits and pushes
that file when the UI moved, so the build is a new version of the site. The
record and the version are FOSS Earth About's, the same for every site
([CONTRIBUTING](https://github.com/foss-earth/.github/blob/main/CONTRIBUTING.md#versions)).
`npm run deploy -- --dry-run` says what it would record and publishes nothing.

## Project policies

- [Code of conduct](https://github.com/UMN-VR/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/UMN-VR/.github/blob/main/CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](https://github.com/UMN-VR/.github/blob/main/SECURITY.md)
- [Asset notices](ASSET_NOTICES.md)
