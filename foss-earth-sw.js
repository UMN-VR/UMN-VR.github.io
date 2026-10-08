"use strict";
/**
 * The service worker that keeps an app's own files on the visitor's device
 * (docs/app-files.md). The appFiles Vite plugin (appFiles.ts) writes it into
 * a build as `foss-earth-sw.js`, calling `install(self, files)` with the
 * build's file names, relative to the worker.
 *
 * Each of those names carries its file's content hash, so a kept copy is
 * never out of date: it is answered from the device without asking the
 * network, however long ago it was kept. The page itself is never kept: it
 * comes from the network every time, asked for while the worker starts, so
 * a new version shows on the next visit, and its new file names are
 * downloaded once. Every other request passes by: scene images are kept by
 * the scene loader, under their revisions.
 */
function install(worker, files) {
  const paths = new Set(files.map(name => new URL(name, worker.location.href).pathname));
  // One store for the worker's own address: a build's files, whichever of its pages asked for them.
  const cacheName = `foss-earth-app-files ${new URL(worker.location.href).pathname}`;
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
      // A file this version does not list belongs to an older one: its name will not be asked for again.
      for (const request of await cache.keys()) {
        if (!paths.has(new URL(request.url).pathname)) await cache.delete(request);
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
    const path = forgotten ? null : listed(request.url);
    if (path) event.respondWith(answer(event, request, path));
  });

  // The page names what it loaded before this worker controlled it; those files are kept from the browser's cache.
  worker.addEventListener("message", event => {
    const data = event.data;
    if (data?.type === "foss-earth-forget") forgotten = true;
    if (data?.type !== "foss-earth-keep" || !Array.isArray(data.urls)) return;
    forgotten = false;
    event.waitUntil((async () => {
      const cache = await worker.caches.open(cacheName);
      for (const href of data.urls) {
        const path = typeof href === "string" ? listed(href) : null;
        if (!path || await cache.match(path, matchOptions)) continue;
        const response = await worker.fetch(path, { cache: "force-cache" }).catch(() => null);
        if (keepable(response)) await cache.put(path, response).catch(() => {});
      }
    })());
  });
}

install(self, ["assets/abstractAudioNode-PfkovOFX.js","assets/abstractSoundSource-BRF04F4i.js","assets/animation-BS8gj7fz.js","assets/buffer-Dis0Ijtw.js","assets/clusteredLightingFunctions-BMJdTjac.js","assets/clusteredLightingFunctions-D3h9uv7n.js","assets/cubemapToSphericalPolynomial-CpX0cSvv.js","assets/dataBuffer-C-wqV4qF.js","assets/dds-CQgfducd.js","assets/decorators-CN1Ng5e5.js","assets/devTools-DmD3AOL3.js","assets/dumpTools-DCA2uA7n.js","assets/effectRenderer-CkPJ29MF.js","assets/egm2008-15-nvvz7MYe.bin","assets/egm2008-30-BpPXoGjA.bin","assets/egm2008-60-bDxgbz8U.bin","assets/engineStore-CKkyXB7S.js","assets/floatingOriginMatrixOverrides-BdLiZemZ.js","assets/flowGraphAsyncExecutionBlock-l9yId0AZ.js","assets/flowGraphBlock-DicjZr_A.js","assets/flowGraphCachedOperationBlock-Dgs3UTZz.js","assets/flowGraphExecutionBlock-CAjlOkZq.js","assets/flowGraphExecutionBlockWithOutSignal-yISR07kS.js","assets/guid-BXdVC_j_.js","assets/imageryDecodeWorker-BARMbeeW.js","assets/lightConstants-wlPOJ9rv.js","assets/logger-CuBYPcDK.js","assets/ltcHelperFunctions-BMi4nyB5.js","assets/ltcHelperFunctions-D0fPO7Ji.js","assets/mainUVVaryingDeclaration-Bi-owTpY.js","assets/mainUVVaryingDeclaration-D1A6ESk3.js","assets/math.axis-B0uJO_Mu.js","assets/math.color-CzvnTGaX.js","assets/math.frustum-BmpO_7_K.js","assets/math.path-DGvzraWE.js","assets/math.plane-BUns5kps.js","assets/math.scalar.functions-CQA38JRp.js","assets/math.size-BJly4Bcd.js","assets/math.vector-lDpFf2si.js","assets/meshUboDeclaration-CmIQ_8hI.js","assets/meshUboDeclaration-D9VmL7M6.js","assets/node-Br3HAZQ9.js","assets/observable-CJ4J1f_C.js","assets/oitFinalSimpleBlend.fragment-Q5Yng1yZ.js","assets/oitFinalSimpleBlend.fragment-nGYFumis.js","assets/pickingInfo-D7ve8Nmg.js","assets/pointerEvents-_20Qj9Uk.js","assets/postprocess.vertex-Bpil2hZM.js","assets/postprocess.vertex-CWUbc_LB.js","assets/precisionDate-CfCevjl-.js","assets/samplerFragmentDeclaration-Ddqenr6W.js","assets/samplerFragmentDeclaration-I1t02tES.js","assets/scene-Bj10J6UY.js","assets/sceneUboDeclaration-CR5dQRQU.js","assets/sceneUboDeclaration-TbZ5RU0g.js","assets/screenSpaceCurvature.fragment-DGKqBbuS.js","assets/searchAirports-BLjd0dlm.js","assets/selection.fragment-Cflndmnk.js","assets/selection.fragment-DukOZGFb.js","assets/selection.vertex-BjFwEal0.js","assets/selection.vertex-Che7qAq8.js","assets/selectionOutline.fragment-DrrHq-tw.js","assets/selectionOutline.fragment-_-Zw7HTM.js","assets/shaderStore-D-XQlhUT.js","assets/spatialWebAudioUpdaterComponent-DlOLam-_.js","assets/subMesh-BajQBPGx.js","assets/texture-9JHd-QdH.js","assets/textureTools-D_DYp1BN.js","assets/thinEngine-DpWjpJl-.js","assets/tools-DGLA8K3H.js","assets/tools.functions-BWtF9eJp.js","assets/twinCities-BJYQZPbV.js","assets/twinCities-idd-1VO1.css","assets/typeStore-Cu_sj2zM.js","assets/viewer-EsCOufkZ.js","assets/volumetricLightingBlendVolume.fragment-Bz5yiNiY.js","assets/volumetricLightingBlendVolume.fragment-DIkNb-c4.js","assets/volumetricLightingRenderVolume.fragment-BO6S-Ya7.js","assets/volumetricLightingRenderVolume.fragment-BjkbGjmo.js","assets/volumetricLightingRenderVolume.vertex-BLv7CkLF.js","assets/volumetricLightingRenderVolume.vertex-DIDGm1mX.js","assets/webAudioBaseSubGraph-C73fQuIp.js","assets/webRequest-dqz0dHXK.js"]);
