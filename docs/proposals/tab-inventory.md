# Campus-tour tab inventory and proposed owners

Status: source audit and proposal, 2026-10-08. The current campus application
has **13 distinct in-app tab IDs**: 11 available on the globe and 9 while
entering or viewing a panorama. Proposed repository names describe extraction
targets, not repositories already created. The [repository graph](repository-graphs.md)
describes the broader package and publishing boundaries.

## How this application selects its tabs

The campus [entry point, `twinCities.ts:11`](../../src/tour/twinCities.ts#L11)
calls `mountGlobeApp` with only `scenes: [TWIN_CITIES]` and
`initialScene: TWIN_CITIES.id`. It defines no additional tab, panel override,
airport flag or flight integration. The shared
[`mountGlobeApp.tsx:31`](../../../../foss-earth/src/app/mountGlobeApp.tsx#L31)
passes the Controls, Interface and Settings sections; Map, Renderer, Sky,
Date and time, Scenes, About and Bug report elements; and the panorama tab
controller into the shared overlay.

The actual registry is in
[`WindowOverlay.tsx:160`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L160):
three section tabs, nine element tabs including the two panorama tabs, and
Location. Labels are defined at
[`WindowOverlay.tsx:181`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L181).
Optional elements are present in this mounting path. `additionalTabs` defaults
to an empty list at
[`WindowOverlay.tsx:140`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L140);
the tour does not supply it. `enableAirportPresets` defaults to `false` at
[`WindowOverlay.tsx:155`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L155),
so the tour's Location tab does not offer flight airport presets.

## Every current tab

The default proposal is one feature tab per feature repository. Every shared
or combined owner below is an explicit exception with its reason. Current
shared implementations remain in the existing FOSS Earth checkout until
extracted. No owner in this campus inventory imports 0sfs.

| ID | Exact title | Available context | Proposed repository decision and reason | Current source evidence |
| --- | --- | --- | --- | --- |
| `location` | Location | Globe | `foss-earth/engine`. Search, coordinates and placement use the globe's navigation/camera services; retain this public module with that integration initially rather than introducing a second navigation owner. | [`WindowOverlay.tsx:189`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L189); panel at [`:419`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L419). |
| `map` | Map | Globe | `foss-earth/engine`. Map sources, terrain/imagery loading, detail, residency and authoritative surface queries share one resource lifecycle. A future separate Map repository needs that lifecycle isolated first. | [`createGlobeApp.ts:453`](../../../../foss-earth/src/app/createGlobeApp.ts#L453). |
| `renderer` | Renderer | Both | `foss-earth/renderer`. Own device/backend/scene resources, readiness and frame scheduling together with their panel. Feature-specific observations are supplied through contracts. | [`createGlobeApp.ts:769`](../../../../foss-earth/src/app/createGlobeApp.ts#L769). |
| `sky` | Sky | Globe | `foss-earth/sky`. Shared astronomy, atmosphere and physical lighting form one world feature used by the tour. | [`createGlobeApp.ts:784`](../../../../foss-earth/src/app/createGlobeApp.ts#L784). |
| `time` | Date and time | Globe | `foss-earth/sky`, using a host-supplied scene clock. This tab sets the same astronomy/time model that Sky presents; a separate repository would divide one model. | [`createGlobeApp.ts:785`](../../../../foss-earth/src/app/createGlobeApp.ts#L785). |
| `controls` | Controls | Both | `foss-earth/engine` input/camera integration plus the existing `Felipegalind0/gamepad-tools` device/binding package. One tab combines these established owners. The campus host supplies its context; it consumes no flight-controls package. | [`createGlobeApp.ts:740`](../../../../foss-earth/src/app/createGlobeApp.ts#L740); controller editor at [`:649`](../../../../foss-earth/src/app/createGlobeApp.ts#L649). |
| `interface` | Interface | Both | `foss-earth/ui` and `foss-earth/toolbar`, with globe position/search services supplied by the host. Generic widgets/log presentation and bottom-bar layout are distinct responsibilities; neither owner imports every feature whose value it shows. | [`createGlobeApp.ts:752`](../../../../foss-earth/src/app/createGlobeApp.ts#L752). |
| `settings` | Settings | Both | `foss-earth/ui` owns registry, presets, saved records and their presentation; shared app-file/diagnostic services are injected. It is one application-wide view of registered owners, not the owner of all feature parameters or another copy of their state. | [`createGlobeApp.ts:762`](../../../../foss-earth/src/app/createGlobeApp.ts#L762); app services at [`:723`](../../../../foss-earth/src/app/createGlobeApp.ts#L723). |
| `about` | About | Both | **Dedicated `UMN-VR/about`.** Owns campus About tab composition, project information, links/credits, authored graph metadata and the release-manifest adapter. It consumes the shared `foss-earth/about` viewer. `UMN-VR/tour` retains release assembly and pins and supplies resolved build data without a reverse runtime import. | [`createGlobeApp.ts:738`](../../../../foss-earth/src/app/createGlobeApp.ts#L738); campus build metadata in [`vite.config.ts:80`](../../vite.config.ts#L80). |
| `bug-report` | Bug report | Both | `foss-earth/ui` composes reports through providers; `UMN-VR/tour` supplies its application identity/report destination. This view combines evidence from several owners rather than owning their implementations. | [`createGlobeApp.ts:733`](../../../../foss-earth/src/app/createGlobeApp.ts#L733). |
| `scenes` | Scenes | Both | `foss-earth/panorama` owns the generic scene format, loader, viewer and panel. `UMN-VR/tour` owns the offered campus scene, placements and platform import. The optional `UMN-VR/twin-cities-content` owns an independently released media package if adopted. Scenes and the two panorama tabs share one scene/viewer lifecycle. | [`createGlobeApp.ts:799`](../../../../foss-earth/src/app/createGlobeApp.ts#L799); campus scene in [`scenes.ts:8`](../../src/tour/scenes.ts#L8). |
| `panorama` | `360: <photograph title>` | Panorama | `foss-earth/panorama`, with UMN-owned photographs, captions, credits and links. This is one dynamically titled tab over the active/entering photograph, not a separate implementation or repository per photograph or campus stop. | [`panoramaTabs.ts:213`](../../../../foss-earth/src/shell/panoramaTabs.ts#L213); registered at [`WindowOverlay.tsx:179`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L179). |
| `panorama-settings` | 360 image settings | Panorama | `foss-earth/panorama`. Looking/levelling, representation, sharpness and image loading budgets govern the same camera/image lifecycle as the active photograph and Scenes tabs. | [`WindowOverlay.tsx:183`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L183); link from the photograph at [`panoramaTabs.ts:202`](../../../../foss-earth/src/shell/panoramaTabs.ts#L202). |

The active photograph title is calculated from the scene entry. The overlay's
fallback label `360` is not another tab ID. Photograph metadata stays UMN-owned
even though the tab that presents it is shared code.

## Conditional and dynamic behavior

The four globe-only tabs are listed in
[`WindowOverlay.tsx:38`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L38):
Location, Map, Sky and Date and time. The two panorama-only tabs are listed at
[`WindowOverlay.tsx:40`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L40).
Their availability is applied at
[`WindowOverlay.tsx:170`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L170).
The remaining seven tabs are offered in both contexts, including Scenes.

On entering a panorama, its tab opens minimized during the camera's approach
and appears when the photograph is on screen; closing it leaves the panorama.
This is context/lifecycle behavior of the same tab, documented and implemented
in [`WindowOverlay.tsx:123`](../../../../foss-earth/src/shell/WindowOverlay.tsx#L123)
and [`panoramaTabs.ts:18`](../../../../foss-earth/src/shell/panoramaTabs.ts#L18).
Leaving restores the globe tabs to their previous homes. Saved workspace and
compact layout changes affect placement/visibility, not ownership or tab IDs.

`?scene=<id>` chooses an offered scene without adding a tab, at
[`createGlobeApp.ts:810`](../../../../foss-earth/src/app/createGlobeApp.ts#L810).
`?panoramaTest=1` exposes validation hooks without adding a tab, at
[`createGlobeApp.ts:789`](../../../../foss-earth/src/app/createGlobeApp.ts#L789).
`?report` is a different page mode: the normal application never starts and
there are **zero in-app tabs**, as shown in
[`mountGlobeApp.tsx:17`](../../../../foss-earth/src/app/mountGlobeApp.tsx#L17)
and [`reportOnly.ts:31`](../../../../foss-earth/src/app/reportOnly.ts#L31).
The report page shares diagnostic/report components and campus identity; it
does not establish another campus feature repository.

## Future tabs and host-owned inputs

**Dev is proposed, not a current tour tab.** The proposed `foss-earth/dev`
owns generic `?dev=1` activation and contribution mechanics. `UMN-VR/tour`
would own campus-specific developer panels and data registered through that
contract. There is no current Dev registration in the audited campus entry
point or shared mount. A future contribution must extend this inventory rather
than being counted as present behavior.

**Weather is also a proposed feature, not a current tour tab.** The proposed
world model and panel belong to `foss-earth/weather`. A graph node describing
that future package does not prove the campus app already supplies its tab.

The campus [scene definition](../../src/tour/scenes.ts) and
[content preparation/import tools](../../tools/twin-cities/README.md) remain
UMN-owned. The `VITE_TOUR_SCENE_URL` override selects an independently delivered
campus content release; it transfers neither media ownership nor viewer
implementation. Generic schema, loader, panorama preparation and checking
tools belong to `foss-earth/panorama`.

The campus [build configuration](../../vite.config.ts#L80) currently supplies
the shared About panel with its repository/version metadata. After extraction,
`UMN-VR/about` owns campus-specific About code, content, authored graph metadata
and the manifest adapter; `UMN-VR/tour` owns release/workspace manifests and
supplies resolved build data. The
[About boundary](repository-graphs.md#about-code-and-data) defines this contract.
Shared presentation and setup tools read those inputs; they do not become
their owner. There is no
runtime, content or developer-setup dependency on 0sfs.

## Sections, routes and other non-tabs

The following are not additional tab IDs or automatic repository boundaries:

- Controls sections `input-method`, `camera`, `orbit`, `mouse`, `touch` and
  `controller` are sections of Controls, at
  [`createGlobeApp.ts:740`](../../../../foss-earth/src/app/createGlobeApp.ts#L740).
  The input-method section is conditionally included when its element exists;
  that condition does not add or remove the Controls tab.
- Interface sections `toolbar`, `position`, `log` and `search` are sections
  of Interface, at
  [`createGlobeApp.ts:752`](../../../../foss-earth/src/app/createGlobeApp.ts#L752).
- Settings sections Presets, Saved settings, App files and Diagnostics are
  sections of Settings, at
  [`createGlobeApp.ts:762`](../../../../foss-earth/src/app/createGlobeApp.ts#L762).
  Renderer performance/frame-budget sections are part of Renderer, at
  [`createGlobeApp.ts:773`](../../../../foss-earth/src/app/createGlobeApp.ts#L773).
- Campus stops, image links, scene choices and expandable photograph details
  are content within shared scene/panorama interfaces, not per-stop tabs.
- Bottom-bar readouts, launchers, map credits and status log are shared
  presentation surfaces. A launcher opens the existing feature tab; it does
  not create a second feature or a second settings home.
- The club landing page `/` and campus application `/tour/twin-cities/` are
  website routes, not in-app tabs. The build declares the tour page at
  [`vite.config.ts:10`](../../vite.config.ts#L10), preserves the Jekyll landing
  page inputs at [`:14`](../../vite.config.ts#L14), and loads the campus app from
  [`tour/twin-cities/index.html:11`](../../tour/twin-cities/index.html#L11).
  The proposed `UMN-VR/UMN-VR.github.io` owns club publishing and access to a
  pinned tour release; `UMN-VR/tour` owns the campus application.
- The club page's About heading and links to GoldyDog, YouTube, photogrammetry,
  WebGL demo and QR projects are ordinary [landing-page content](../../index.md),
  not tour settings tabs. Those linked organization projects are outside this
  campus migration; a heading or link supplies no reason to split them here.
- The [repository graph prototype](repository-split-graph.html), its filters
  and node details are documentation tools, not current campus application tabs.
  Graph group/node labels such as Campus tour, Campus scene/media, setup CLI,
  CI, documentation and research identify architectural responsibilities;
  they do not add tabs to the runtime inventory.
