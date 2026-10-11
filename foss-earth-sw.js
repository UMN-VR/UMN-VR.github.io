"use strict";
/** Extracted from Earth App/vite/appFilesWorker.js; host policy controls retention.
 * Pages are always network-first; no media cache or app/runtime is constructed. */
function install(worker, manifest) {
  const files = manifest.files.map(file => file.url);
  const paths = new Set(files.map(name => new URL(name, worker.location.href).pathname));
  // One store for the worker's own address: a build's files, whichever of its pages asked for them.
  const cacheName = `${manifest.cacheNamespace} ${new URL(worker.location.href).pathname}`;
  const base = new URL(manifest.base, worker.location.origin);
  const retained = new Set(manifest.retainedFiles.map(file => new URL(file.url, worker.location.href).pathname));
  const matchOptions = { ignoreVary: true, ignoreSearch: true };
  // Set when the page turns keeping off: until the page closes, this worker still sees its requests, and passes them by.
  let forgotten = false;

  /** A response worth keeping: the file itself, from this site. */
  const keepable = response => Boolean(response) && response.ok && response.status === 200 && response.type === "basic" && !response.redirected;

  /** The path of a URL this build lists, or null. */
  const listed = href => {
    let url;
    try { url = new URL(href, worker.location.href); } catch { return null; }
    return url.origin === worker.location.origin && paths.has(url.pathname) ? url.pathname : null;
  };

  async function answer(event, request, path) {
    const cache = await worker.caches.open(cacheName);
    const kept = await cache.match(path, matchOptions);
    if (kept) return kept;
    const response = await worker.fetch(request);
    if (keepable(response)) event.waitUntil(cache.put(path, response.clone()).catch(() => {}));
    return response;
  }

  worker.addEventListener("install", event => {
    // Nothing is fetched ahead: files are kept as the app asks for them. The new list takes over at once.
    event.waitUntil(worker.skipWaiting());
  });

  worker.addEventListener("activate", event => {
    event.waitUntil((async () => {
      // The page is asked for while the worker starts, not after.
      await worker.registration.navigationPreload?.enable().catch(() => {});
      const cache = await worker.caches.open(cacheName);
      // Older pages may still request their files. Deletion is an explicit host
      // policy; retained legacy resources survive either activation policy.
      if (manifest.retention === "current-only") for (const request of await cache.keys()) {
        if (!paths.has(new URL(request.url).pathname) && !retained.has(new URL(request.url).pathname)) await cache.delete(request);
      }
      await worker.clients.claim();
    })());
  });

  worker.addEventListener("fetch", event => {
    const request = event.request;
    if (request.method !== "GET") return;
    if (request.mode === "navigate") {
      event.respondWith((async () => {
        // The request made while the worker started, if the browser made one; a failed one is asked again, as a page without this worker would be.
        const preloaded = await Promise.resolve(event.preloadResponse).catch(() => undefined);
        return preloaded || worker.fetch(request);
      })());
      return;
    }
    if (forgotten) return;
    const path = listed(request.url);
    if (path) { event.respondWith(answer(event, request, path)); return; }
    // Existing older files are usable by still-open pages. Do not acquire an
    // unknown file merely because the worker controls the deployment root.
    const url = new URL(request.url);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
    if (retained.has(url.pathname) || manifest.retention === "retain-older") event.respondWith((async () => {
      const cache = await worker.caches.open(cacheName);
      const old = await cache.match(url.pathname, matchOptions);
      if (old) return old;
      if (retained.has(url.pathname)) return answer(event, request, url.pathname);
      return worker.fetch(request);
    })());
  });

  // The page names what it loaded before this worker controlled it; those files are kept from the browser's cache.
  worker.addEventListener("message", event => {
    const data = event.data;
    if (manifest.identity && data?.identity !== manifest.identity) return;
    if (data?.type === "foss-earth-forget") forgotten = true;
    if (data?.type !== "foss-earth-keep" || !Array.isArray(data.urls)) return;
    forgotten = false;
    event.waitUntil((async () => {
      const cache = await worker.caches.open(cacheName);
      for (const href of data.urls) {
        const path = typeof href === "string" ? listed(href) : null;
        if (forgotten || !path || await cache.match(path, matchOptions)) continue;
        const response = await worker.fetch(path, { cache: "force-cache" }).catch(() => null);
        if (keepable(response)) await cache.put(path, response).catch(() => {});
      }
    })());
  });
}

install(self, {"schemaVersion":1,"base":"/","scope":"/","workerFile":"foss-earth-sw.js","cacheNamespace":"foss-earth-app-files","identity":null,"retention":"current-only","files":[{"url":"/assets/abstractAudioBus-IbX4iSMC.js"},{"url":"/assets/abstractAudioNode-DW4VTajR.js"},{"url":"/assets/abstractEngine.cubeTexture-uq_16wj6.js"},{"url":"/assets/abstractSoundInstance-CuuNUr0j.js"},{"url":"/assets/abstractSoundSource-DPuUWwWE.js"},{"url":"/assets/animation-CISTNmG2.js"},{"url":"/assets/animationGroup-C5touQxJ.js"},{"url":"/assets/atlasImagery.worker-DBCeQ3je.js"},{"url":"/assets/babylon-shaders-glsl-BDB5h_-g.js"},{"url":"/assets/babylon-shaders-wgsl-4lt-j9l0.js"},{"url":"/assets/baseTexture.polynomial-DKyiSAQ5.js"},{"url":"/assets/bone-BSAHU30F.js"},{"url":"/assets/brdfTextureTools-Blh0U2tW.js"},{"url":"/assets/buffer-CdnG6sKb.js"},{"url":"/assets/buffer-UQglctLJ.js"},{"url":"/assets/cubemapToSphericalPolynomial-BOxTEX_E.js"},{"url":"/assets/dataBuffer-C-wqV4qF.js"},{"url":"/assets/dds-C2dTt2az.js"},{"url":"/assets/decorators-CN1Ng5e5.js"},{"url":"/assets/devTools-DmD3AOL3.js"},{"url":"/assets/dumpTools-BgocNuoA.js"},{"url":"/assets/easing-Dm9VDgD4.js"},{"url":"/assets/effectRenderer-DM2UhEp4.js"},{"url":"/assets/egm2008-15-nvvz7MYe.bin"},{"url":"/assets/egm2008-30-BpPXoGjA.bin"},{"url":"/assets/egm2008-60-bDxgbz8U.bin"},{"url":"/assets/engineStore-CKkyXB7S.js"},{"url":"/assets/environmentTextureTools-DWz9zFoA.js"},{"url":"/assets/floatingOriginMatrixOverrides-DqSG47nr.js"},{"url":"/assets/flowGraphAssetsContext-WtUyuDAI.js"},{"url":"/assets/flowGraphAsyncExecutionBlock-Bvl308Y3.js"},{"url":"/assets/flowGraphBinaryOperationBlock-DmSGZwyK.js"},{"url":"/assets/flowGraphBlock-ERqv2EAF.js"},{"url":"/assets/flowGraphCachedOperationBlock-B_GY8dWh.js"},{"url":"/assets/flowGraphCoordinator-BO9TQ43j.js"},{"url":"/assets/flowGraphEventBlock-BU7xe34R.js"},{"url":"/assets/flowGraphExecutionBlock-Dlmpalig.js"},{"url":"/assets/flowGraphExecutionBlockWithOutSignal-BCvgF3Qh.js"},{"url":"/assets/flowGraphGLTFDataProvider-Fvg_w1jE.js"},{"url":"/assets/flowGraphUnaryOperationBlock-Bwzs7hNO.js"},{"url":"/assets/glTFLoaderAnimation-BFr27J2J.js"},{"url":"/assets/guid-BXdVC_j_.js"},{"url":"/assets/index.babylonjs-Cq0-nZNA.js"},{"url":"/assets/index.core-plugins-CgMOOvEN.js"},{"url":"/assets/lightConstants-DUaNSuF5.js"},{"url":"/assets/LoaderBase-ATuDWTDB-Dma9wrKU.js"},{"url":"/assets/logger-CuBYPcDK.js"},{"url":"/assets/math.axis-B0uJO_Mu.js"},{"url":"/assets/math.color-Q4dgtYWM.js"},{"url":"/assets/math.frustum-CcMj5eGx.js"},{"url":"/assets/math.path-DGvzraWE.js"},{"url":"/assets/math.plane-BUns5kps.js"},{"url":"/assets/math.scalar.functions-CQA38JRp.js"},{"url":"/assets/math.size-BvsHYnOu.js"},{"url":"/assets/math.vector-lDpFf2si.js"},{"url":"/assets/minneapolis-vxEfW4fY.js"},{"url":"/assets/node-9ZucUUwN.js"},{"url":"/assets/observable-CJ4J1f_C.js"},{"url":"/assets/openpbrMaterialLoadingAdapter-CzvJdK2b.js"},{"url":"/assets/pbrMaterialLoadingAdapter-Dstp4V8T.js"},{"url":"/assets/pickingInfo-DGMxPzFJ.js"},{"url":"/assets/pointerEvents-_20Qj9Uk.js"},{"url":"/assets/precisionDate-CfCevjl-.js"},{"url":"/assets/rgbdTextureTools-DJixfCto.js"},{"url":"/assets/scene-CzrUaDk5.js"},{"url":"/assets/scenes-C81o2C-b.css"},{"url":"/assets/scenes-UuDcdAXr.js"},{"url":"/assets/selector-BClk3iII.css"},{"url":"/assets/selector-Bqd_yg2E.js"},{"url":"/assets/spatialWebAudio-B-bb5ZWA.js"},{"url":"/assets/spatialWebAudioUpdaterComponent-DlOLam-_.js"},{"url":"/assets/starCatalogue-DSWPyUwb.js"},{"url":"/assets/stPaul-Br5iX1aa.js"},{"url":"/assets/subMesh-Bv03rLWE.js"},{"url":"/assets/texture-BbkUzidn.js"},{"url":"/assets/textureTools-B4jZr1Fy.js"},{"url":"/assets/thinEngine-bHOD-y2H.js"},{"url":"/assets/tools-B2YksR7s.js"},{"url":"/assets/tools.functions-CpAPkLao.js"},{"url":"/assets/twinCities-Dn0KuAO9.js"},{"url":"/assets/typeStore-Cu_sj2zM.js"},{"url":"/assets/utils-BAE1Z-JU.js"},{"url":"/assets/viewer-D8142nXI.js"},{"url":"/assets/webAudioBaseSubGraph-DhZYilV5.js"},{"url":"/assets/webRequest-dqz0dHXK.js"}],"retainedFiles":[]});
