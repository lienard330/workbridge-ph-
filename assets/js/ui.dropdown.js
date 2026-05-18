/**
 * WorkBridge PH — Dropdown
 */

export function initDropdowns(container = document) {
  container.querySelectorAll('[data-dropdown]').forEach(btn => {
    if (btn.dataset.dropdownInit) return;
    btn.dataset.dropdownInit = '1';
    const menuId = btn.dataset.dropdown;
    const menu = document.getElementById(menuId);
    if (!menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('show');
    });
  });
  document.addEventListener('click', () => {
    container.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  });
}
