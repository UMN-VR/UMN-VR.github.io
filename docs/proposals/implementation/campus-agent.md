# Campus implementation agent

Status: implementation assignment for the repository split proposed on
2026-10-08. This file is a prompt to give an implementation agent; writing it
does not perform extraction, create repositories or publish the site.

## Copy-ready assignment

Implement the UMN portion of the agreed repository split. You are the sole
writer for the existing `UMN-VR/UMN-VR.github.io` checkout containing this
prompt and the new UMN destination checkouts assigned to you by the migration
coordinator. The other primary
agents own the existing FOSS Earth and 0sfs checkouts. Implement campus behavior
here or in its assigned UMN owner. Send requests for shared changes to the FOSS
Earth agent instead of editing its files concurrently or copying its code.
The separate platform agent owns generic CI and installer implementation.
Follow the [coordinator's implementation index](../../../../../0sfs/docs/proposals/implementation/README.md)
for lane assignments and contract handoffs.

Read the current checkout's `AGENTS.md` before work and any instructions in
each destination. Read these specifications as the authoritative boundaries:

- [Campus tab inventory](../tab-inventory.md), covering all 13 current tab IDs.
- [Campus ownership and About boundary](../repository-graphs.md) and
  [graph source](../repository-split-graph.json).
- [Overall split](../../../../../0sfs/docs/proposals/repository-split.md),
  [FOSS image boundaries](../../../../../foss-earth/docs/proposals/image-repositories.md)
  and [content delivery](../../content-delivery.md).
- [Current site layout](../../../README.md),
  [scene preparation](../../../tools/twin-cities/README.md), and
  [campus roadmap](../../roadmap.md).

The overall specification's location in 0sfs is a planning convenience, not a
runtime, build, CI or onboarding dependency. The finished UMN projects must
work without a 0sfs checkout. Do not modify unrelated UMN organization projects.

Future VR comes from [`foss-earth/vr`](../../../../../foss-earth/docs/proposals/vr.md).
Campus behavior remains UMN-owned; the tour never imports `0sfs/vr`.
Both VR repos and the shared Search tab are deferred TODOs, excluded from
provisioning, implementation, current tab counts and migration completion.

## Deliverables and owners

| Destination | Deliverable |
| --- | --- |
| `UMN-VR/UMN-VR.github.io` | Club site, navigation, branding and deployment assembly that exposes a pinned tour release at the existing public route. The landing page remains independently editable. |
| `UMN-VR/tour` | Campus application, page entry points, scene definitions, placements, YouVisit import/build, campus-specific diagnostics and Dev contributions, integration tests, exact release/workspace manifest and application artifact. |
| `UMN-VR/about` | Campus About tab composition, campus links/credits, authored dependency graph and adapter displaying the tour's resolved release manifest. Consume the shared `foss-earth/about` presentation and graph viewer. |
| `UMN-VR/dev_installer` | Campus CLI/onboarding entry point, complete default campus workspace and component selection, consuming the shared `foss-earth/dev_installer` mechanism. Bootstrap an exact tour-owned workspace-manifest revision without importing the tour runtime. |
| Optional `UMN-VR/twin-cities-content` | An independently versioned media/source-manifest release only if the content-delivery decision needs this repository. Separate static hosting alone can provide the release boundary. Do not create an empty repository just to complete the graph. |
| UMN-owned documentation and research | Move campus implementation manuals with their implementations; retain club documentation with the club site. Keep campus studies, placement methods and unresolved accessibility/media work under UMN ownership. Dedicated catalog repos are optional, not a requirement to invent `UMN-VR/docs` or `UMN-VR/research`. Record the chosen homes and links. |
| `UMN-VR/.github` | Supply campus contribution guidance and template requirements to the coordinator/platform lane, which provisions the organization policy repository. Local workflows and project-specific instructions remain explicit in each consumer. |

The graph proposes `UMN-VR/docs` and `UMN-VR/research`, while the broader
specification permits campus catalogs to stay inside their owning applications.
Resolve each node explicitly with the coordinator: inventory material, choose a
useful independently maintained catalog or retain an owner-local catalog, and
update the graph/status with the reason. Do not silently omit the nodes, force
empty repositories or move implementation contracts away from their code merely
to fill a catalog.

The app consumes `foss-earth/engine`, `ui`, `renderer`, `toolbar`, `scenes`,
`360`, `about` and `dev` through their agreed public packages. Sky remains
shared. Weather is proposed work with its own staged specification; extraction
must not present an unimplemented Weather tab as existing campus behavior.
Device handling stays in `Felipegalind0/gamepad-tools`.

`foss-earth/search` is a deferred shared feature recorded as a TODO, not an
implementation deliverable for this assignment. Preserve current search
behavior while extracting the existing app. Do not implement a new Search tab
or a campus-specific replacement. A future Search tab is excluded from the
13-current-tab inventory and will consume the shared owner when separately
authorized and implemented.

`foss-earth/360` is the top-level image viewer. Its representation owners are
`equirectangular`, `cubemap`, `tiled-cubemap` and `preview-sheets`, with shared
contracts/cache/accounting in `images`. `scenes` owns scene schema, validation,
placement contracts and navigation orchestration. UMN owns actual campus
photographs, titles, descriptions, positions, links, credits and import rules.
Do not reintroduce a single `foss-earth/panorama` destination or a flight
dependency. Do not assign one repository per photograph or stop.

## Coordination and phase gates

Start useful campus work immediately: inspect dirty state, inventory inputs and
published paths, prepare source-to-destination mappings, gather compatibility
fixtures, and design app/content artifacts. Record current commit IDs and
dependency pins. Preserve concurrent user edits and stage only your changes.

The coordinator assigns physical destination paths, creates/provisions remotes,
installs organization policy and coordinates history cleanup. Do not assume
that a proposed GitHub repository already exists or choose a conflicting local
checkout name. Each destination has one writer until explicitly handed off.

Before switching consumers, obtain a versioned contract handoff from the FOSS
agent containing package names, public exports, immutable revisions/artifacts,
compatibility tests and these integration surfaces:

1. Globe mount/tab contributions, renderer/camera/input ports and UI/toolbar
   registration that keep existing tour behavior intact.
2. Scene validation and file verification APIs; the 360 preparation CLI;
   preview-sheet preparation/export. The current build resolves
   `scripts/prepare-panorama.mjs`, `scripts/check-scene.mjs` and imports
   `scripts/lib/previewSheet.mjs` from the installed FOSS package. Replace
   these with documented package exports or CLI entry points, never new deep
   imports into another checkout. FOSS must retain compatibility until this
   caller is migrated.
3. About metadata and graph schemas, build provenance plugin, and the
   host-supplied About contribution mounting contract.
4. `?dev=1` activation/registration and lazy loading. Generic activation belongs
   to `foss-earth/dev`; UMN supplies its own useful campus diagnostics.
5. Service-worker/app-files build integration from the FOSS agent, plus the
   shared CI guard and installer workspace schema from the platform agent.
   These tools read UMN-owned manifests and must not require a 0sfs tool or
   manifest. `UMN-VR/dev_installer` owns the campus onboarding entry point;
   `UMN-VR/tour` owns the workspace manifest, and each repo owns its workflow
   caller. Agree the bootstrap-by-immutable-manifest-reference contract early
   so setup does not require a tour checkout before it can create one.

Agree shapes using fixtures before the packages are all extracted. Build
campus adapters against stable agreed fixtures while waiting; do not fabricate
upstream exports or call integration complete using mocks alone. Run actual
consumer tests once the handoff arrives. Report a specific unresolved contract
and continue independent campus work when blocked.

History rewriting, repository deletion/recreation, force-pushes and canonical
remote switching are a coordinator-owned frozen phase. Supply inventories and
clean extraction inputs; do not perform those operations independently. Normal
implementation commits and pushes follow the coordinator's current branch and
publication plan. Deploying the live site is separate from implementation and
requires the explicit deployment instruction required by this repo's AGENTS.

## Implementation sequence

### 1. Capture the current application and content contract

Inventory `index.md`, `_config.yml`, `Media /` (including its trailing space),
`tour/twin-cities/index.html`, `src/tour/`, `vite.config.ts`, `tools/deploy.mjs`,
`tools/twin-cities/`, `public/tour/twin-cities/`, and the documentation. Distinguish
hand-authored source, generated media, release artifacts and local-only backup.

Inventory the current onboarding in `README.md`, dependency paths and scripts
in `package.json`/`package-lock.json`, Vite's sibling allowlist/deduplication,
gamepad-tools' prerequisite build, and the scene build's installed-FOSS tool
resolution. There is no existing campus installer to claim as extracted:
`UMN-VR/dev_installer` is a new campus wrapper around the shared mechanism.
Record which setup steps need public prepared content and which optional media
authoring steps need the local YouVisit backup; default setup must not depend
on obtaining that private/local-only backup.

Keep scratch/logs under `.local/`. Never delete or relocate
`.local/youvisit-backup/`: it is the only local copy of the source backup.
Inspect metadata needed for this task without publishing the backup or private
account/configuration data. Keep public provenance and genuine author/asset
credits. The current manifest has 60 photographs, 24 groups including retired
stops, and published entity IDs; verify the actual checkout instead of relying
on old byte totals in documentation. Capture links, starting views, placements,
revision fields, representation paths/dimensions/byte counts and their hashes.

### 2. Separate the tour build from club publishing

Move the campus entry points, build/import sources and their tests into the
assigned `UMN-VR/tour` checkout with the history strategy supplied by the
coordinator. Keep published `/tour/twin-cities/` URLs and entity IDs stable.
The club site consumes a pinned built tour artifact; it does not maintain a
second source copy of the tour. Give the artifact an explicit layout/manifest
so assembly can verify its files and mount path.

Preserve the Jekyll landing inputs and their asset links. Separate Vite's
current `wholeSite()` responsibility into tour output and club assembly without
silently changing GitHub Pages routing. Keep the guard against generated files
Jekyll would omit. Make base URLs, asset/worker paths and the mounted route
explicit, and test the actual published base rather than only a development
root. Remove old source entry points only after the pinned replacement builds
and the site assembly passes its checks.

### 3. Preserve media preparation and choose its release boundary

Retain `placements.json`, `youvisit.mjs`, the importer and source provenance in
their UMN owner. Never hand-edit generated `public/tour/twin-cities/` files.
Rebuild only when inputs/tool contracts require it; preserve reuse of unchanged
prepared photographs. Use a small representative fixture for iteration and
retain the full manifest/file verification at completion. Do not re-encode the
entire archive just because package paths changed.

Record a concrete decision on `twin-cities-content`: current generated size and
file count, who owns sources and releases, artifact/version/retention scheme,
whether a Git repository helps, and how the tour pins a content release. Keep
the existing delivery mode usable if hosting is undecided. A storage account
or external media upload is a separate deployment choice, not an implicit part
of extracting source code.

Preserve `VITE_TOUR_SCENE_URL`, relative media URLs and scene revision semantics.
The release contract must support immutable versioned manifest folders and
retention of every content revision used by a supported app. Validate media
before publishing its manifest. Preserve additive app/content deployment
behavior and older hashed bundles; an app-only release must not copy the media
archive or delete content. Never replace this with unconditional full-site
publication. Show separate payloads using dry runs.

### 4. Add the campus About and Dev contributions

Implement `UMN-VR/about` through the agreed shared UI/About contract. Move the
campus authored graph/metadata there. The tour supplies exact installed
versions, commit/build identity and dirty-state information as data; About
must never import the tour runtime to discover them. Keep authored proposals
visibly distinct from resolved installed dependencies. The About graph and
documentation must contain no 0sfs dependency.

Register campus-specific Dev contributions with `foss-earth/dev`: selected
scene/entity/revision, content-release URL and validation/placement provenance
are appropriate read-only diagnostics. Use actual available data and owner
ports. Do not copy flight diagnostics. Without `?dev=1`, the Dev tab and its
heavy modules are absent; with it, show the campus contributions in the shared
tab. The URL switch grants no privileged server access.

### 5. Finish release manifests, CI, onboarding and documentation

Pin a compatible set of packages and artifacts in UMN-owned release/workspace
manifests. Local sibling links may support development, but the delivered app
must build from the documented workspace without undocumented local paths.
Keep shared dependencies deduplicated where required by the renderer and UI.

Deliver `UMN-VR/dev_installer` as the campus-facing CLI. Its default sets up a
complete usable campus development workspace: tour, club assembly, About and
the declared shared source dependencies, with exact compatible pins, dependency
installation/build order and sufficient versioned prepared content to run the
current tour. The manifest distinguishes normal app work from optional media
rebuilding and states the source/size/digest of any content download before it
is performed. Do not require the local YouVisit backup for ordinary onboarding
or silently copy/upload it. Document any prerequisite that cannot be acquired
automatically and preserve the available-content development path.

Offer component selection through the shared CLI's dependency closure, such
as club, tour or About development, using named selections declared in the
tour-owned manifest. Keep the full campus setup as the default. Reuse shared
`init`, `doctor`, `sync` and `check` behavior; do not reimplement clone/update,
dependency ordering, manifest validation, dirty-checkout protection, resumable
execution or artifact verification inside the wrapper. No aircraft packages,
native flight toolchain, implicit system installation or server startup belong
to campus setup. Print the appropriate server command after setup instead.

Bootstrap by passing or retrieving the exact immutable manifest reference and
digest selected by the wrapper's release; permit an explicit alternate manifest
input through the shared contract. The repository list and pins live in that
data, not in a second list inside CLI code. The tour application must not import
the installer, and the installer must not import tour runtime code or require
the tour package to run. Setup tooling can read the tour-owned manifest as data
without a runtime dependency cycle. Retain the wrapper/shared-CLI/manifest pins
as one tested onboarding release.

Install repository-local CI callers for every UMN destination, including the
club assembly and About package. Consume the shared `foss-earth/ci` guard at an
immutable revision. Include this exact rule in contribution and agent rules:

> YOU CANNOT HAVE AI AS A CO-AUTHOR, OR YOUR CONTRIBUTIONS WILL BE REJECTED.

The guard must reject prohibited author/committer identities and attribution
trailers according to the central policy, inspect complete relevant history,
and fail rather than silently succeeding on a shallow audit. Never add AI
attribution to your own commits. Preserve genuine human and third-party asset
credits. Report existing contaminated history to the coordinator; do not
silently rewrite it or invent human attribution. The coordinator verifies
required merge checks/protection and final publication across the repositories.
Every UMN destination runs the shared consumer-conformance command through
its installed validation entry point, including content, docs/research,
installer and `.github` repos. Hand off policy/caller pins and positive/negative
attribution results for the coordinator's per-remote enforcement receipt.
Use shared fixtures, keep invalid synthetic commits out of published history,
and never skip metadata checks based on changed paths or app-test availability.

Update README commands, content-delivery instructions, tab inventory, graph,
research/manual links and report destinations for actual final owners. Keep
implementation-specific docs with their code. Record campus accessibility and
unimplemented photos/audio/video work honestly: the roadmap lists the separate
accessible version as unfinished, so extraction must preserve current keyboard
and text access and that backlog, not falsely mark the accessible version done.

## Validation and acceptance

For each code edit, run the owning repo's typecheck, related tests and lint.
Today the commands are `npm run typecheck`,
`npx vitest related --run <changed-files> --maxWorkers=50%` and `npm run lint`.
At completion run each changed repo's `npm run ci` once, respecting the agreed
machine-wide test slot. The existing campus `ci` runs lint, tests and production
build. Keep logs under `.local/` and rerun only failures that need diagnosis.
For extraction packages, establish equivalent scripts rather than claiming the
old app suite covers their new release boundary.

The current `src/tour/twinCitiesScene.test.ts` reads the generated manifest and
images from disk. A changed manifest/media directory is not discovered by
Vitest's import tracing: run that file explicitly, or retain a corresponding
forced rerun trigger. Retain `tools/twin-cities/youvisit.test.mjs` for conversion
rules. Do not weaken file-count, dimension or encoded-byte checks to make a
relocation pass. The final checked manifest and every referenced file must
match the captured baseline unless a deliberate content change is separately
documented.

Acceptance requires all of the following:

- Club `/` and the existing tour route build with valid local links and assets;
  tour release assembly includes the exact pinned artifact and is reversible
  by changing the pin.
- Existing 13 tab IDs, their globe/panorama contexts, dynamic photograph title,
  settings IDs/persistence, start scene and scene links remain intact. Dev is
  the explicit opt-in addition; the deferred Search tab is not an addition in
  this assignment. Keyboard focus, visible descriptions, captions,
  credits and current accessible text are preserved.
- All images, links and representations validate; both EAC and gnomonic tiled
  cubes, whole images and preview-sheet fallback remain supported by the
  consumed packages. No scene or image schema is reimplemented in UMN.
- `UMN-VR/tour → UMN-VR/about → foss-earth/about` works with resolved release
  data and no reverse import. Build metadata identifies the actual new owners.
- Current and prior supported app/content combinations remain readable. Worker
  scope, page update/report-only behavior, persisted image revisions and old
  hashed app files survive the site/tour boundary. Coordinate generic worker
  or viewer failures with FOSS instead of introducing local workarounds.
- `npm run build:app` (or its documented extracted equivalent) excludes the
  media payload; app and content deploy dry runs validate their separate inputs
  and preserve unrelated published files. No live deploy is needed to prove
  this boundary.
- A clean documented UMN workspace builds using only its declared dependencies,
  without any 0sfs checkout, deep import or copied FOSS implementation.
- `UMN-VR/dev_installer` bootstraps that complete workspace from an empty
  assigned location using a pinned manifest and shared CLI; the tour runtime
  and local-only backup are not bootstrap prerequisites. Test the default and
  at least one component selection, exact dependency closure/build order,
  artifact integrity, resumption after failure, and dirty/diverged checkout
  refusal using the shared mechanism. `doctor` is read-only, setup starts no
  server, and tested platform support and content requirements are documented.
- Each destination has the policy, CI caller, tests and documentation for its
  actual role; the optional media decision and any deferred hosting work are
  explicit. Authorship cleanup is not claimed complete before the coordinator's
  full-ref publication audit.

Use existing terminal/headless validation tools where needed for changed UI or
worker integration. Do not start a dev/preview/watch server or deploy unless
asked. Do not initiate GPU benchmarks, phone performance qualification or a
fresh performance study for a packaging change. If rendering qualification is
separately requested, use the existing FOSS scene A/B tooling and its real-GPU
and interference rules; never imply ordinary build tests qualify performance.

## Final handoff

Give the coordinator a concise ledger of source-to-destination moves, commit
and artifact IDs, exported/consumed contracts, resolved dependency/content pins,
optional media decision, checks with retained log paths, known pre-existing
failures, and outstanding external release steps. Include the rollback pins
and any compatibility shims still required. Include the campus installer
artifact/version, shared-CLI and manifest pins/digests, default/component setup
receipts, tested prerequisites/platforms and content-download policy. Do not
declare the lane complete until actual extracted packages pass the tour and
club integration checks;
proposal diagrams, empty repositories and mocked contracts are not completion.
