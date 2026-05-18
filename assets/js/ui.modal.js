/**
 * WorkBridge PH — Modal Dialog
 *
 * Uses the `wb-modal` namespace (not `modal`) to avoid colliding with Bootstrap's
 * own .modal class, which forces `display: none` and would render us invisible.
 */

export function openModal(options = {}) {
  // Prevent stacking: if any modal is already open, close it before opening a new one.
  // Otherwise rapid clicks (or accidental double-clicks) would layer multiple backdrops,
  // each adding 0.4 opacity, until the page goes fully black.
  document.querySelectorAll('.wb-modal-backdrop').forEach(b => b.remove());

  const { title = '', body = '', onClose, footer } = options;
  const backdrop = document.createElement('div');
  backdrop.className = 'wb-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'wb-modal';
  modal.innerHTML = `
    <div class="wb-modal-header">
      <h3 class="wb-modal-title">${title}</h3>
      <button type="button" class="btn btn-ghost btn-sm wb-modal-close" aria-label="Close">&times;</button>
    </div>
    <div class="wb-modal-body">${typeof body === 'string' ? body : ''}</div>
    ${footer ? `<div class="wb-modal-footer">${footer}</div>` : ''}
  `;

  const close = () => {
    backdrop.remove();
    onClose?.();
  };

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  modal.querySelector('.wb-modal-close')?.addEventListener('click', close);

  if (typeof body === 'function') {
    const bodyEl = modal.querySelector('.wb-modal-body');
    body(bodyEl, close);
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  return { close, modal, backdrop };
}
