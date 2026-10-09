(() => {
  'use strict';
  if (!window.EKO_PAGE_READY) return;
  const root = document.documentElement;
  const loader = document.getElementById('site-loader');
  const progress = document.getElementById('loader-progress');
  const number = document.getElementById('loader-percent');
  const ring = loader.querySelector('.loader-ring-fill');
  const label = document.getElementById('loader-label');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let target = 0;
  let shown = 0;
  let assetsReady = false;
  let failed = false;
  let finishing = false;
  let frame;

  document.getElementById('main').setAttribute('aria-busy', 'true');
  function render(value) {
    const percent = Math.floor(value);
    number.textContent = `${percent}%`;
    progress.setAttribute('aria-valuenow', String(percent));
    ring.style.strokeDashoffset = String(100 - percent);
  }
  function finish() {
    if (finishing) return;
    finishing = true;
    cancelAnimationFrame(frame);
    render(100);
    const text = window.EKO_COPY?.[root.lang]?.loader;
    if (text) label.textContent = failed ? text.opening : text.ready;
    setTimeout(window.ekoFinishLoading, reducedMotion.matches || document.hidden ? 0 : 180);
  }
  function tick() {
    if (!root.classList.contains('is-loading')) return;
    shown = Math.min(target, shown + Math.max(.35, (target - shown) * .12));
    render(shown);
    if (assetsReady && shown >= 100) finish();
    else frame = requestAnimationFrame(tick);
  }
  function bounded(promise) {
    return new Promise(resolve => {
      const timeout = setTimeout(() => {failed = true; resolve();}, 16000);
      Promise.resolve(promise).then(() => {clearTimeout(timeout); resolve();}, () => {
        failed = true;
        clearTimeout(timeout);
        resolve();
      });
    });
  }
  function decodeImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => typeof image.decode === 'function' ? image.decode().then(resolve, reject) : resolve();
      image.onerror = reject;
      image.src = url;
    });
  }

  // Upgrade lazy graphics before waiting, and decode one eager copy of each unique asset.
  const imageUrls = new Set();
  document.querySelectorAll('img, svg image, link[rel="icon"]').forEach(element => {
    if (element.tagName.toLowerCase() === 'img') element.loading = 'eager';
    const source = element.currentSrc || element.getAttribute('src') || element.getAttribute('href');
    if (source) imageUrls.add(new URL(source, document.baseURI).href);
  });
  const tasks = [...imageUrls].map(decodeImage);
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    tasks.push(link.sheet ? Promise.resolve() : new Promise((resolve, reject) => {
      link.addEventListener('load', resolve, {once: true});
      link.addEventListener('error', reject, {once: true});
    }));
  });
  if (document.fonts) {
    tasks.push(document.fonts.load('550 16px "DM Sans"'), document.fonts.load('16px Mynerve'), document.fonts.ready);
  }
  let completed = 0;
  frame = requestAnimationFrame(tick);
  Promise.all(tasks.map(task => bounded(task).then(() => {
    completed += 1;
    target = Math.floor(completed / tasks.length * 100);
  }))).then(() => {
    assetsReady = true;
    target = 100;
    if (document.hidden || reducedMotion.matches) finish();
  });
  document.addEventListener('visibilitychange', () => {
    if (assetsReady && document.hidden) finish();
  });
})();
