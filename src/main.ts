window.addEventListener('error', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.height = '100%';
  errorDiv.style.backgroundColor = 'black';
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `<h1>JS Error: ${event.message}</h1><pre>${event.error ? event.error.stack : 'No stack trace'}</pre><p>Source: ${event.filename}:${event.lineno}:${event.colno}</p>`;
  document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.height = '100%';
  errorDiv.style.backgroundColor = 'black';
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `<h1>Unhandled Promise Rejection:</h1><pre>${event.reason ? (event.reason.stack || event.reason.message || event.reason) : 'No reason'}</pre>`;
  document.body.appendChild(errorDiv);
});

import './styles.css';
import { createSidebar } from './components/sidebar';
import { createDashboardPage, createHistoryPage, createStatsPage } from './components/pages';
import type { AppPage, MatchRecord, DashboardRole } from './types';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { check } from '@tauri-apps/plugin-updater';

const setAppFullscreen = async (isFullscreen: boolean) => {
  try {
    const appWindow = getCurrentWindow();
    await appWindow.setFullscreen(isFullscreen);
  } catch (e) {
    console.warn('Could not set fullscreen (not in Tauri environment):', e);
  }
};

let registeredGlobalShortcut: string | null = null;

const setupGlobalShortcut = async () => {
  try {
    const currentShortcut = localStorage.getItem('dbd_tracker_shortcut') || 'F9';
    
    // If it's already registered and hasn't changed, do nothing
    if (registeredGlobalShortcut === currentShortcut) {
      return;
    }

    // Unregister old shortcut if registered
    if (registeredGlobalShortcut) {
      try {
        await unregister(registeredGlobalShortcut);
      } catch (err) {
        console.warn('Failed to unregister old global shortcut:', err);
      }
      registeredGlobalShortcut = null;
    }

    // Register new shortcut
    await register(currentShortcut, (event) => {
      if (event.state === 'Pressed') {
        console.log(`Global shortcut pressed: ${currentShortcut}`);
        handleShortcutPress();
      }
    });
    registeredGlobalShortcut = currentShortcut;
    console.log(`Global shortcut registered: ${currentShortcut}`);
  } catch (e) {
    console.warn('Could not register global shortcut (not in Tauri environment or permission missing):', e);
  }
};

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root (#app) was not found.');
}

// -------------------------------------------------------------
// Live Application State
// -------------------------------------------------------------
let activePage: AppPage = 'dashboard';
let activeRole: DashboardRole = 'killer';
let searchText = '';
let timerSeconds = 0;
let timerIntervalId: number | null = null;
let selectedCharacterName: string | null = 'The Trapper';
let selectedStatsCharacters: string[] = []; // Up to 3 characters loaded for comparison
let statsSearchText = '';
let showEndMatchDialog = false;
let showSettingsDialog = false; // Settings modal visible state
let showConfirmClearDialog = false;
let showConfirmClearLogDialog = false;
let editingMatchId: string | null = null;
let lastActivePage: AppPage | null = null;

// -------------------------------------------------------------
// Local Storage Persistance
// -------------------------------------------------------------
const getMatches = (): MatchRecord[] => {
  try {
    const data = localStorage.getItem('dbd_tracker_matches');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse matches from localStorage:', e);
    return [];
  }
};

const saveMatches = (matches: MatchRecord[]) => {
  localStorage.setItem('dbd_tracker_matches', JSON.stringify(matches));
};

const getStatsMatches = (): MatchRecord[] => {
  try {
    const data = localStorage.getItem('dbd_tracker_stats_matches');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse stats matches from localStorage:', e);
    return [];
  }
};

const saveStatsMatches = (matches: MatchRecord[]) => {
  localStorage.setItem('dbd_tracker_stats_matches', JSON.stringify(matches));
};

// Migrate existing matches if stats matches database does not exist
if (!localStorage.getItem('dbd_tracker_stats_matches') && localStorage.getItem('dbd_tracker_matches')) {
  localStorage.setItem('dbd_tracker_stats_matches', localStorage.getItem('dbd_tracker_matches')!);
}

// -------------------------------------------------------------
// Utility Functions
// -------------------------------------------------------------
const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const startMatch = () => {
  if (!selectedCharacterName || timerIntervalId !== null) {
    return;
  }
  timerSeconds = 0;
  timerIntervalId = window.setInterval(() => {
    timerSeconds += 1;
    const timerNode = document.getElementById('stopwatch');
    if (timerNode) {
      timerNode.textContent = formatTimer(timerSeconds);
    }
  }, 1000);
  render();
};

const triggerEndMatch = () => {
  if (timerIntervalId === null) {
    return;
  }
  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
  showEndMatchDialog = true;
  render();
};

const handleShortcutPress = () => {
  if (timerIntervalId !== null) {
    triggerEndMatch();
  } else if (selectedCharacterName) {
    startMatch();
  }
};

// Keyboard shortcut listener (browser level fallback & active window shortcut)
window.addEventListener('keydown', (event) => {
  // If global shortcut is successfully active system-wide, ignore keydown to prevent double-firing
  if (registeredGlobalShortcut) {
    return;
  }
  // Ignore hotkey while user is typing in forms or inputs
  if (
    document.activeElement?.tagName === 'INPUT' ||
    document.activeElement?.tagName === 'SELECT' ||
    document.activeElement?.tagName === 'TEXTAREA'
  ) {
    return;
  }
  const currentShortcut = localStorage.getItem('dbd_tracker_shortcut') || 'F9';
  const key = event.key;
  if (key === currentShortcut || (currentShortcut === 'Space' && key === ' ')) {
    event.preventDefault();
    handleShortcutPress();
  }
});

// -------------------------------------------------------------
// Rendering Router
// -------------------------------------------------------------
const renderActivePage = (): string => {
  const matches = getMatches();
  if (activePage === 'stats') {
    return createStatsPage({
      matches: getStatsMatches(),
      selectedStatsCharacters,
      statsSearchText,
    });
  }
  if (activePage === 'history') {
    return createHistoryPage({
      matches,
    });
  }
  const lastKillerMatch = matches.find((m) => m.role === 'killer') || null;
  const lastSurvivorMatch = matches.find((m) => m.role === 'survivor') || null;
  return createDashboardPage({
    activeRole,
    searchText,
    timerText: formatTimer(timerSeconds),
    timerRunning: timerIntervalId !== null,
    selectedCharacterName,
    lastKillerMatch,
    lastSurvivorMatch,
    shortcutKey: localStorage.getItem('dbd_tracker_shortcut') || 'F9',
  });
};

const renderModal = (): string => {
  if (!showEndMatchDialog) {
    return '';
  }
  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Log Match Results</h3>
        <form id="end-match-form">
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Selected Character</label>
            <div style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase;">
              ${selectedCharacterName}
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label for="match-result">${activeRole === 'killer' ? 'Kills Score' : 'Match Result'}</label>
            ${
              activeRole === 'killer'
                ? `
                <select id="match-result" class="styled-select">
                  <option value="4 KILLS">4 Kills</option>
                  <option value="3 KILLS">3 Kills</option>
                  <option value="2 KILLS">2 Kills</option>
                  <option value="1 KILL">1 Kill</option>
                  <option value="0 KILLS">0 Kills</option>
                </select>
                `
                : `
                <select id="match-result" class="styled-select">
                  <option value="ESCAPED">Escaped</option>
                  <option value="DIED">Died</option>
                </select>
                `
            }
          </div>
          <div class="form-group" style="margin-bottom: 18px;">
            <label for="match-bp">Bloodpoints (BP) Earned</label>
            <input type="number" id="match-bp" class="character-search" placeholder="e.g. 28000" min="0" required />
          </div>
          <div class="modal-actions">
            <button type="button" id="cancel-modal-btn" class="action-btn start" style="background: transparent; border-color: var(--border-color);">Cancel</button>
            <button type="submit" class="action-btn end">Save Match</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

const renderSettingsModal = (): string => {
  if (!showSettingsDialog) {
    return '';
  }
  const currentShortcut = localStorage.getItem('dbd_tracker_shortcut') || 'F9';
  const storedFullscreen = localStorage.getItem('dbd_tracker_fullscreen');
  const isFullscreen = storedFullscreen === null ? true : storedFullscreen === 'true';

  return `
    <div class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Settings & Shortcuts</h3>
        <form id="settings-form">
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="shortcut-key">Start/End Match Shortcut Key</label>
            <select id="shortcut-key" class="styled-select">
              <option value="F7" ${currentShortcut === 'F7' ? 'selected' : ''}>F7</option>
              <option value="F8" ${currentShortcut === 'F8' ? 'selected' : ''}>F8</option>
              <option value="F9" ${currentShortcut === 'F9' ? 'selected' : ''}>F9</option>
              <option value="F10" ${currentShortcut === 'F10' ? 'selected' : ''}>F10</option>
            </select>
            <span style="font-size: 10px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
              Press this key inside the app to Start Match (after selecting a character) or End Match.
            </span>
          </div>

          <div class="form-group" style="margin-bottom: 16px;">
            <label for="fullscreen-toggle">Window Mode</label>
            <select id="fullscreen-toggle" class="styled-select">
              <option value="true" ${isFullscreen ? 'selected' : ''}>Fullscreen</option>
              <option value="false" ${!isFullscreen ? 'selected' : ''}>Windowed</option>
            </select>
          </div>
          
          <div class="form-group" style="margin-bottom: 24px;">
            <label>Data Management</label>
            <button type="button" id="clear-history-btn" class="action-btn end" style="width: 100%; font-size: 13px; padding: 8px 12px; min-width: unset; height: auto;">
              Clear Everything
            </button>
          </div>

          <div class="modal-actions">
            <button type="button" id="close-settings-btn" class="action-btn start" style="background: transparent; border-color: var(--border-color);">Cancel</button>
            <button type="submit" class="action-btn end">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

const renderConfirmClearModal = (): string => {
  if (!showConfirmClearDialog) {
    return '';
  }
  return `
    <div class="modal-overlay" style="z-index: 1100;">
      <div class="modal-content">
        <h3 class="modal-title">Are you sure?</h3>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 8px 0 16px 0;">
          This will permanently delete all your logged matches and reset your settings. This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button type="button" id="cancel-clear-btn" class="action-btn start" style="background: transparent; border-color: var(--border-color);">Cancel</button>
          <button type="button" id="confirm-clear-btn" class="action-btn end">Clear Everything</button>
        </div>
      </div>
    </div>
  `;
};

const renderConfirmClearLogModal = (): string => {
  if (!showConfirmClearLogDialog) {
    return '';
  }
  return `
    <div class="modal-overlay" style="z-index: 1100;">
      <div class="modal-content">
        <h3 class="modal-title">Clear Log History?</h3>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5; margin: 8px 0 16px 0;">
          Are you sure you want to clear your visible log history? This will not affect your stats.
        </p>
        <div class="modal-actions">
          <button type="button" id="cancel-clear-log-btn" class="action-btn start" style="background: transparent; border-color: var(--border-color);">Cancel</button>
          <button type="button" id="confirm-clear-log-btn" class="action-btn end">Clear Log</button>
        </div>
      </div>
    </div>
  `;
};

const renderEditMatchModal = (): string => {
  if (!editingMatchId) {
    return '';
  }
  const matches = getMatches();
  const match = matches.find(m => m.id === editingMatchId);
  if (!match) {
    return '';
  }
  return `
    <div class="modal-overlay" style="z-index: 1050;">
      <div class="modal-content">
        <h3 class="modal-title">Edit Match Logs</h3>
        <form id="edit-match-form">
          <div class="form-group" style="margin-bottom: 12px;">
            <label>Character</label>
            <div style="font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase;">
              ${match.characterName}
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label for="edit-match-result">${match.role === 'killer' ? 'Kills Score' : 'Match Result'}</label>
            ${
              match.role === 'killer'
                ? `
                <select id="edit-match-result" class="styled-select">
                  <option value="4 KILLS" ${match.result === '4 KILLS' ? 'selected' : ''}>4 Kills</option>
                  <option value="3 KILLS" ${match.result === '3 KILLS' ? 'selected' : ''}>3 Kills</option>
                  <option value="2 KILLS" ${match.result === '2 KILLS' ? 'selected' : ''}>2 Kills</option>
                  <option value="1 KILL" ${match.result === '1 KILL' ? 'selected' : ''}>1 Kill</option>
                  <option value="0 KILLS" ${match.result === '0 KILLS' ? 'selected' : ''}>0 Kills</option>
                </select>
                `
                : `
                <select id="edit-match-result" class="styled-select">
                  <option value="ESCAPED" ${match.result === 'ESCAPED' ? 'selected' : ''}>Escaped</option>
                  <option value="DIED" ${match.result === 'DIED' ? 'selected' : ''}>Died</option>
                </select>
                `
            }
          </div>
          <div class="form-group" style="margin-bottom: 18px;">
            <label for="edit-match-bp">Bloodpoints (BP) Earned</label>
            <input type="number" id="edit-match-bp" class="character-search" value="${match.bp}" min="0" required />
          </div>
          <div class="modal-actions">
            <button type="button" id="cancel-edit-btn" class="action-btn start" style="background: transparent; border-color: var(--border-color);">Cancel</button>
            <button type="submit" class="action-btn end">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

// -------------------------------------------------------------
// Event Bindings
// -------------------------------------------------------------
const bindEvents = (): void => {
  // Navigation tabs
  const navButtons = app.querySelectorAll<HTMLButtonElement>('[data-nav]');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextPage = button.dataset.nav as AppPage | undefined;
      if (!nextPage || nextPage === activePage) {
        return;
      }
      activePage = nextPage;
      render();
    });
  });

  // Settings button (opens settings modal)
  const settingsBtn = app.querySelector<HTMLButtonElement>('.left-nav-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      showSettingsDialog = true;
      render();
    });
  }

  // Leave button (exits application)
  const leaveBtn = app.querySelector<HTMLButtonElement>('.left-nav-leave');
  if (leaveBtn) {
    leaveBtn.addEventListener('click', async () => {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.close();
      } catch (e) {
        console.warn('Could not close window (not in Tauri environment):', e);
        window.close();
      }
    });
  }

  // Dashboard Role filter
  const roleButtons = app.querySelectorAll<HTMLButtonElement>('[data-role]');
  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const role = button.dataset.role as DashboardRole | undefined;
      if (!role || role === activeRole) {
        return;
      }
      activeRole = role;
      selectedCharacterName = role === 'killer' ? 'The Trapper' : 'Dwight Fairfield';
      render();
    });
  });

  // Search input filter
  const searchInput = app.querySelector<HTMLInputElement>('#character-search');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      searchText = target.value;
      render();
    });
  }

  // Character Grid Selection
  const charCards = app.querySelectorAll<HTMLElement>('[data-char-card]');
  charCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (timerIntervalId !== null) {
        return; // lock selection while match is running
      }
      const charName = card.dataset.charCard;
      if (charName) {
        selectedCharacterName = charName === selectedCharacterName ? null : charName;
        if (searchText) {
          searchText = '';
        }
        render();
      }
    });
  });

  // Start match timer
  const startButton = app.querySelector<HTMLButtonElement>('#start-match-btn');
  if (startButton) {
    startButton.addEventListener('click', () => {
      startMatch();
    });
  }

  // End match timer (triggers modal)
  const endButton = app.querySelector<HTMLButtonElement>('#end-match-btn');
  if (endButton) {
    endButton.addEventListener('click', () => {
      triggerEndMatch();
    });
  }

  // Stats character search input
  const statsSearchInput = app.querySelector<HTMLInputElement>('#stats-char-search');
  if (statsSearchInput) {
    statsSearchInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      statsSearchText = target.value;
      render();
    });
  }

  // Stats character list row selection
  const statsCharRows = app.querySelectorAll<HTMLElement>('[data-stats-char]');
  statsCharRows.forEach((row) => {
    row.addEventListener('click', () => {
      const charName = row.dataset.statsChar;
      if (charName) {
        if (!selectedStatsCharacters.includes(charName)) {
          if (selectedStatsCharacters.length >= 3) {
            selectedStatsCharacters.shift();
          }
          selectedStatsCharacters.push(charName);
        }
        statsSearchText = ''; // clear search query on selection
        render();
      }
    });
  });

  // Stats character list remove button click
  const removeStatsCharBtns = app.querySelectorAll<HTMLButtonElement>('[data-remove-stats-char]');
  removeStatsCharBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation(); // Stop click from bubbling up to parents
      const charName = btn.dataset.removeStatsChar;
      if (charName) {
        selectedStatsCharacters = selectedStatsCharacters.filter(name => name !== charName);
        render();
      }
    });
  });

  // End Match Modal Form Submit
  const form = app.querySelector<HTMLFormElement>('#end-match-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const resultSelect = app.querySelector<HTMLSelectElement>('#match-result');
      const bpInput = app.querySelector<HTMLInputElement>('#match-bp');
      if (resultSelect && bpInput && selectedCharacterName) {
        const matches = getMatches();
        const statsMatches = getStatsMatches();
        const newMatch: MatchRecord = {
          id: Math.random().toString(36).substring(2, 9),
          characterName: selectedCharacterName,
          role: activeRole,
          result: resultSelect.value,
          time: formatTimer(timerSeconds),
          durationSeconds: timerSeconds,
          bp: parseInt(bpInput.value) || 0,
          timestamp: Date.now(),
        };

        // cap history at 50
        matches.unshift(newMatch);
        if (matches.length > 50) {
          matches.pop();
        }
        saveMatches(matches);

        // uncapped stats matches
        statsMatches.unshift(newMatch);
        saveStatsMatches(statsMatches);

        // Reset state
        showEndMatchDialog = false;
        timerSeconds = 0;
        render();
      }
    });
  }

  // End Match Modal Cancel
  const cancelBtn = app.querySelector<HTMLButtonElement>('#cancel-modal-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      showEndMatchDialog = false;
      timerSeconds = 0;
      render();
    });
  }

  // Settings Modal Close
  const closeSettingsBtn = app.querySelector<HTMLButtonElement>('#close-settings-btn');
  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      showSettingsDialog = false;
      render();
    });
  }

  // Settings Modal Save
  const settingsForm = app.querySelector<HTMLFormElement>('#settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const keySelect = app.querySelector<HTMLSelectElement>('#shortcut-key');
      if (keySelect) {
        localStorage.setItem('dbd_tracker_shortcut', keySelect.value);
        setupGlobalShortcut();
      }
      const fullscreenSelect = app.querySelector<HTMLSelectElement>('#fullscreen-toggle');
      if (fullscreenSelect) {
        const isFullscreen = fullscreenSelect.value === 'true';
        localStorage.setItem('dbd_tracker_fullscreen', String(isFullscreen));
        setAppFullscreen(isFullscreen);
      }
      showSettingsDialog = false;
      render();
    });
  }

  // Settings Modal Clear History (triggers custom confirmation modal)
  const clearHistoryBtn = app.querySelector<HTMLButtonElement>('#clear-history-btn');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      showConfirmClearDialog = true;
      render();
    });
  }

  // Custom Confirm Clear Modal Cancel
  const cancelClearBtn = app.querySelector<HTMLButtonElement>('#cancel-clear-btn');
  if (cancelClearBtn) {
    cancelClearBtn.addEventListener('click', () => {
      showConfirmClearDialog = false;
      render();
    });
  }

  // Custom Confirm Clear Modal Confirm Action (Full Reset)
  const confirmClearBtn = app.querySelector<HTMLButtonElement>('#confirm-clear-btn');
  if (confirmClearBtn) {
    confirmClearBtn.addEventListener('click', () => {
      localStorage.removeItem('dbd_tracker_matches');
      localStorage.removeItem('dbd_tracker_stats_matches');
      localStorage.removeItem('dbd_tracker_shortcut');
      localStorage.removeItem('dbd_tracker_fullscreen');
      
      if (timerIntervalId !== null) {
        window.clearInterval(timerIntervalId);
        timerIntervalId = null;
      }

      activePage = 'dashboard';
      activeRole = 'killer';
      searchText = '';
      timerSeconds = 0;
      selectedCharacterName = 'The Trapper';
      selectedStatsCharacters = [];
      statsSearchText = '';
      showEndMatchDialog = false;
      showSettingsDialog = false;
      showConfirmClearDialog = false;

      setAppFullscreen(true);
      render();
    });
  }

  // Edit Match button click (opens edit match modal)
  const editMatchBtns = app.querySelectorAll<HTMLButtonElement>('[data-edit-match]');
  editMatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const matchId = btn.dataset.editMatch;
      if (matchId) {
        editingMatchId = matchId;
        render();
      }
    });
  });

  // Delete Match button click (removes match from logs and stats)
  const deleteMatchBtns = app.querySelectorAll<HTMLButtonElement>('[data-delete-match]');
  deleteMatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const matchId = btn.dataset.deleteMatch;
      if (matchId && confirm('Are you sure you want to delete this match? This will remove it from both your logs and stats.')) {
        const matches = getMatches();
        const statsMatches = getStatsMatches();

        saveMatches(matches.filter(m => m.id !== matchId));
        saveStatsMatches(statsMatches.filter(m => m.id !== matchId));

        render();
      }
    });
  });

  // Cancel edit match modal
  const cancelEditBtn = app.querySelector<HTMLButtonElement>('#cancel-edit-btn');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', () => {
      editingMatchId = null;
      render();
    });
  }

  // Form submit for editing match
  const editForm = app.querySelector<HTMLFormElement>('#edit-match-form');
  if (editForm) {
    editForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const resultSelect = app.querySelector<HTMLSelectElement>('#edit-match-result');
      const bpInput = app.querySelector<HTMLInputElement>('#edit-match-bp');
      if (resultSelect && bpInput && editingMatchId) {
        // Update in history logs
        const historyMatches = getMatches();
        const hIdx = historyMatches.findIndex(m => m.id === editingMatchId);
        if (hIdx !== -1) {
          historyMatches[hIdx].result = resultSelect.value;
          historyMatches[hIdx].bp = parseInt(bpInput.value) || 0;
          saveMatches(historyMatches);
        }

        // Update in stats matches
        const statsMatches = getStatsMatches();
        const sIdx = statsMatches.findIndex(m => m.id === editingMatchId);
        if (sIdx !== -1) {
          statsMatches[sIdx].result = resultSelect.value;
          statsMatches[sIdx].bp = parseInt(bpInput.value) || 0;
          saveStatsMatches(statsMatches);
        }

        editingMatchId = null;
        render();
      }
    });
  }

  // Clear Log button click (History page)
  const clearLogBtn = app.querySelector<HTMLButtonElement>('#clear-log-btn');
  if (clearLogBtn) {
    clearLogBtn.addEventListener('click', () => {
      showConfirmClearLogDialog = true;
      render();
    });
  }

  // Cancel Clear Log click
  const cancelClearLogBtn = app.querySelector<HTMLButtonElement>('#cancel-clear-log-btn');
  if (cancelClearLogBtn) {
    cancelClearLogBtn.addEventListener('click', () => {
      showConfirmClearLogDialog = false;
      render();
    });
  }

  // Confirm Clear Log click
  const confirmClearLogBtn = app.querySelector<HTMLButtonElement>('#confirm-clear-log-btn');
  if (confirmClearLogBtn) {
    confirmClearLogBtn.addEventListener('click', () => {
      saveMatches([]); // clears only the log history!
      showConfirmClearLogDialog = false;
      render();
    });
  }
};

// -------------------------------------------------------------
// Core Render Loop (Preserves Search Input Focus)
// -------------------------------------------------------------
const render = (): void => {
  // Save scroll positions to prevent jumpiness on re-render
  const pageContainer = app.querySelector('.page-container');
  const pageScrollTop = pageContainer ? pageContainer.scrollTop : 0;

  const charGrid = app.querySelector('.character-grid');
  const gridScrollTop = charGrid ? charGrid.scrollTop : 0;

  // Save search input caret position to prevent cursor jumping
  const activeInput = document.activeElement as HTMLInputElement | null;
  const searchInputActive = activeInput && (activeInput.id === 'character-search' || activeInput.id === 'stats-char-search');
  const caretPos = searchInputActive ? activeInput.selectionStart : null;
  const activeInputId = activeInput ? activeInput.id : null;

  app.innerHTML = `
    <div class="app-bg">
      <div class="window-shell">
        ${createSidebar(activePage)}
        <main class="page-container ${activePage !== lastActivePage ? 'page-fade-in' : 'page-slide-shift'}">
          ${renderActivePage()}
        </main>
      </div>
      ${renderModal()}
      ${renderSettingsModal()}
      ${renderConfirmClearModal()}
      ${renderConfirmClearLogModal()}
      ${renderEditMatchModal()}
    </div>
  `;

  bindEvents();

  // Restore scroll positions
  const newPageContainer = app.querySelector('.page-container');
  if (newPageContainer) {
    newPageContainer.scrollTop = pageScrollTop;
  }

  const newCharGrid = app.querySelector('.character-grid');
  if (newCharGrid) {
    newCharGrid.scrollTop = gridScrollTop;
  }

  // Restore search input focus and cursor caret if they were typing
  if (searchInputActive && caretPos !== null && activeInputId) {
    const freshInput = document.getElementById(activeInputId) as HTMLInputElement | null;
    if (freshInput) {
      freshInput.focus();
      freshInput.setSelectionRange(caretPos, caretPos);
    }
  }

  // Update last active page
  lastActivePage = activePage;
};

// Initial Render
  render();

  // Initialize Fullscreen State on load if in Tauri
  const initFullscreen = async () => {
    const stored = localStorage.getItem('dbd_tracker_fullscreen');
    const isFullscreen = stored === null ? true : stored === 'true';
    await setAppFullscreen(isFullscreen);
  };

  const checkForUpdates = async () => {
    try {
      const update = await check();
      if (update) {
        console.log(`Found update ${update.version} from ${update.date}`);
        let downloaded = 0;
        let contentLength = 0;
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case 'Started':
              contentLength = event.data.contentLength || 0;
              console.log(`Started downloading ${contentLength} bytes`);
              break;
            case 'Progress':
              downloaded += event.data.chunkLength;
              console.log(`Downloaded ${downloaded} of ${contentLength} bytes`);
              break;
            case 'Finished':
              console.log('Download finished');
              break;
          }
        });
        console.log('Update installed successfully');
        if (confirm('A new update is available and has been installed! Would you like to close the app to apply the changes?')) {
          try {
            const appWindow = getCurrentWindow();
            await appWindow.close();
          } catch (err) {
            window.close();
          }
        }
      }
    } catch (e) {
      console.warn('Auto-updater check failed (not in Tauri context or check issue):', e);
    }
  };

  initFullscreen();
  setupGlobalShortcut();
  checkForUpdates();
