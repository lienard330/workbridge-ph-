/**
 * WorkBridge PH — Toast Notifications
 */

const CONTAINER_ID = 'toast-container';

function getContainer() {
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = CONTAINER_ID;
    el.className = 'toast-container';
    document.body.appendChild(el);
  }
  return el;
}

export function toast(message, type = 'info') {
  const container = getContainer();
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => {
    div.style.animation = 'toastOut 0.2s ease-out forwards';
    setTimeout(() => div.remove(), 200);
  }, 3000);
}

export function toastSuccess(msg) { toast(msg, 'success'); }
export function toastError(msg) { toast(msg, 'error'); }
export function toastWarning(msg) { toast(msg, 'warning'); }
