# UMN VR club site

The UMN VR club's site, https://umn-vr.github.io/. GitHub Pages serves it from
the `gh-pages` branch:

| Page | What it is | Made from |
| --- | --- | --- |
| `/` | The club's landing page | [index.md](index.md), [_config.yml](_config.yml) and `Media ` here, rendered by Pages with Jekyll |
| `/tour/` | Choose a campus tour | [UMN-VR/tour](https://github.com/UMN-VR/tour) |
| `/tour/minneapolis/` | The Minneapolis campus | the tour and [UMN-VR/minneapolis](https://github.com/UMN-VR/minneapolis) |
| `/tour/st-paul/` | The Saint Paul campus | the tour and [UMN-VR/st-paul](https://github.com/UMN-VR/st-paul) |
| `/tour/twin-cities/` | Both campuses | the tour and [UMN-VR/twin-cities](https://github.com/UMN-VR/twin-cities) |

The folder `Media ` ends in a space, as it always has: the landing page links
to it by that name.

## Building and deploying

Check out the tour, its campus repositories and
[FOSS Earth](https://github.com/foss-earth) beside this repository, as the
tour's README describes, and build the tour first:

```sh
cd ../tour && npm install && npm run build && cd -
npm run build    # dist/: the landing page and ../tour/dist
npm run deploy   # adds dist/ to gh-pages and pushes it
```

The deploy adds files to `gh-pages` and never removes any: a visitor with the
tour already open keeps getting the app files it asks for. It writes the commit
with Git's plumbing, so the branch's 60,000 photographs are never checked out.

The photographs are published once, apart from the app. After the tour's
`npm run build:scene` rebuilds them in `../tour/public/`, deploy them with the
site:

```sh
npm run deploy -- --media ../tour/public
```

## Project policies

- [Code of conduct](https://github.com/UMN-VR/.github/blob/main/CODE_OF_CONDUCT.md)
- [Contributing](https://github.com/UMN-VR/.github/blob/main/CONTRIBUTING.md)
- [AGPL-3.0 license](LICENSE)
- [Security](https://github.com/UMN-VR/.github/blob/main/SECURITY.md)
- [Asset notices](ASSET_NOTICES.md)
