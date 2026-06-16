import type { AppPage } from '../types';

const navItems = [
  {
    id: 'dashboard' as const,
    label: 'Dashboard',
    svg: `
      <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stylized bonfire wood logs -->
        <path d="M5 19l14-4M19 19L5 15M12 17v-4" />
        <!-- Stylized fire flame curves -->
        <path d="M12 4c-2 3-3.5 5.5-3.5 8s1.5 4.5 3.5 4.5 3.5-2 3.5-4.5S14 4 12 4z" />
        <path d="M12 7c-1 2-1.5 3.5-1.5 5s.5 2.5 1.5 2.5 1.5-1 1.5-2.5S13 7 12 7z" />
      </svg>
    `
  },
  {
    id: 'stats' as const,
    label: 'Stats',
    svg: `
      <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Stylized DBD Hook -->
        <line x1="12" y1="2" x2="12" y2="10" />
        <path d="M12 10c0 4.5 4 6 4 9s-3 3-4 3-4-1.5-4-3" />
        <path d="M8 18l-1.5 1" />
      </svg>
    `
  },
  {
    id: 'history' as const,
    label: 'History',
    svg: `
      <svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <!-- Vintage document/scroll -->
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    `
  },
];

export function createSidebar(activePage: AppPage): string {
  return `
    <aside class="left-nav">
      <div class="left-nav-items">
        ${navItems
          .map(
            (item) => `
              <button
                type="button"
                class="left-nav-item ${item.id === activePage ? 'active' : ''}"
                data-nav="${item.id}"
                title="${item.label}"
              >
                <div class="left-nav-icon-wrapper">
                  ${item.svg}
                </div>
                <span class="left-nav-label">${item.label}</span>
              </button>
            `,
          )
          .join('')}
      </div>
      <div class="left-nav-footer">
        <button type="button" class="left-nav-settings" title="Settings">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <button type="button" class="left-nav-leave" title="Exit">
          <img src="/assets/leave.webp" class="leave-icon-img" alt="Leave" />
        </button>
      </div>
    </aside>
  `;
}
