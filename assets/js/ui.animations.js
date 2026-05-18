/**
 * WorkBridge PH — Animations & Micro-interactions
 */

export function animateCounter(el, target, duration = 800) {
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function pageEnter(element) {
  if (!element) return;
  element.classList.add('page-transition');
}

export function showSkeleton(container, count = 3) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'card card-lift';
    div.innerHTML = `
      <div class="skeleton skeleton-text" style="width:60%;height:20px;margin-bottom:8px"></div>
      <div class="skeleton skeleton-text" style="width:40%;height:14px;margin-bottom:8px"></div>
      <div class="skeleton skeleton-text" style="width:100%;height:14px"></div>
    `;
    container.appendChild(div);
  }
}

export function hideSkeleton(container, contentFn) {
  if (!container) return;
  container.innerHTML = '';
  if (contentFn) contentFn(container);
}

export function simulateLoad(container, contentFn, delay = 500) {
  showSkeleton(container);
  setTimeout(() => {
    hideSkeleton(container, contentFn);
  }, delay);
}
