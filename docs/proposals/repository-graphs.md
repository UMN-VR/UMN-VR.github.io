# UMN VR repository graph

Status: proposal, 2026-10-08. [Open the graph](repository-split-graph.html).
Its authoritative metadata is [repository-split-graph.json](repository-split-graph.json).
The graph describes proposed boundaries, not completed extraction or deployment.

The [campus-tour tab inventory](tab-inventory.md) records all 13 current tab
IDs, their globe/panorama availability, source evidence and proposed owners.
It distinguishes current tabs from future Dev/Weather contributions, website
routes, panel sections and host-owned content/metadata.

`UMN-VR/UMN-VR.github.io` owns the club website. A proposed `UMN-VR/tour` owns
the campus experience, accessibility, photographs, placements, platform import,
branding and its developer contributions. `UMN-VR/twin-cities-content` is an
optional media release boundary; independent versioned hosting can provide it
without another repository. See the existing
[content delivery design](../content-delivery.md).

The campus tour consumes FOSS Earth's engine, UI, renderer, toolbar, sky/weather,
panorama, About viewer and developer framework. Renderer owns device/scene/frame
services; globe engine consumes it without a reverse import. The tour registers
its own toolbar callbacks and values using shared UI primitives. Generic check/setup tools remain
FOSS Earth-owned. This application has no dependency on flight code, content,
documentation or tooling. UMN documentation, research, community guidance and
the tour's release/workspace manifests remain UMN-owned. The tour supplies its
own manifest and app-specific Dev contributions; no branded graph data moves
into the shared viewer.

The JSON is the application-owned source of truth. The self-contained HTML is
generated using the shared FOSS Earth template and generator. Code,
content/metadata and publication/research/tooling arrows all run from consumer
to dependency, but only code arrows describe package imports. Scope rules
reject ownership inversion and the generator rejects literal code cycles.

From this checkout:

```sh
node ../../foss-earth/scripts/build-repository-graph.mjs --input=docs/proposals/repository-split-graph.json --out=docs/proposals/repository-split-graph.html
```

Edit the JSON or shared FOSS Earth template rather than the generated HTML.
The generated artifact records provenance and its reproduction command, works
offline and provides a text index as well as the interactive diagram. Generating
or opening it does not create repositories or deploy the tour.
