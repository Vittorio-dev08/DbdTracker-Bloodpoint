import type { MatchRecord, DashboardRole } from '../types';

const dashboardCharacters: Array<{ name: string; role: DashboardRole }> = [
  // Killers
  { name: 'The Trapper', role: 'killer' },
  { name: 'The Wraith', role: 'killer' },
  { name: 'The Hillbilly', role: 'killer' },
  { name: 'The Nurse', role: 'killer' },
  { name: 'The Shape', role: 'killer' },
  { name: 'The Hag', role: 'killer' },
  { name: 'The Doctor', role: 'killer' },
  { name: 'The Huntress', role: 'killer' },
  { name: 'The Cannibal', role: 'killer' },
  { name: 'The Nightmare', role: 'killer' },
  { name: 'The Pig', role: 'killer' },
  { name: 'The Clown', role: 'killer' },
  { name: 'The Spirit', role: 'killer' },
  { name: 'The Legion', role: 'killer' },
  { name: 'The Plague', role: 'killer' },
  { name: 'The Ghost Face', role: 'killer' },
  { name: 'The Demogorgon', role: 'killer' },
  { name: 'The Oni', role: 'killer' },
  { name: 'The Deathslinger', role: 'killer' },
  { name: 'The Executioner', role: 'killer' },
  { name: 'The Blight', role: 'killer' },
  { name: 'The Twins', role: 'killer' },
  { name: 'The Trickster', role: 'killer' },
  { name: 'The Nemesis', role: 'killer' },
  { name: 'The Cenobite', role: 'killer' },
  { name: 'The Artist', role: 'killer' },
  { name: 'The Onryo', role: 'killer' },
  { name: 'The Dredge', role: 'killer' },
  { name: 'The Mastermind', role: 'killer' },
  { name: 'The Knight', role: 'killer' },
  { name: 'The Skull Merchant', role: 'killer' },
  { name: 'The Singularity', role: 'killer' },
  { name: 'The Xenomorph', role: 'killer' },
  { name: 'The Good Guy', role: 'killer' },
  { name: 'The Unknown', role: 'killer' },
  { name: 'The Lich', role: 'killer' },
  { name: 'The Dark Lord', role: 'killer' },
  { name: 'The Houndmaster', role: 'killer' },
  { name: 'The Ghoul', role: 'killer' },
  { name: 'The Animatronic', role: 'killer' },
  { name: 'The Krasue', role: 'killer' },
  { name: 'The First', role: 'killer' },

  // Survivors
  { name: 'Dwight Fairfield', role: 'survivor' },
  { name: 'Meg Thomas', role: 'survivor' },
  { name: 'Claudette Morel', role: 'survivor' },
  { name: 'Jake Park', role: 'survivor' },
  { name: 'Nea Karlsson', role: 'survivor' },
  { name: 'Laurie Strode', role: 'survivor' },
  { name: 'Ace Visconti', role: 'survivor' },
  { name: 'Bill Overbeck', role: 'survivor' },
  { name: 'Feng Min', role: 'survivor' },
  { name: 'David King', role: 'survivor' },
  { name: 'Quentin Smith', role: 'survivor' },
  { name: 'David Tapp', role: 'survivor' },
  { name: 'Kate Denson', role: 'survivor' },
  { name: 'Adam Francis', role: 'survivor' },
  { name: 'Jeff Johansen', role: 'survivor' },
  { name: 'Jane Romero', role: 'survivor' },
  { name: 'Ash Williams', role: 'survivor' },
  { name: 'Nancy Wheeler', role: 'survivor' },
  { name: 'Steve Harrington', role: 'survivor' },
  { name: 'Yui Kimura', role: 'survivor' },
  { name: 'Zarina Kassir', role: 'survivor' },
  { name: 'Cheryl Mason', role: 'survivor' },
  { name: 'Felix Richter', role: 'survivor' },
  { name: 'Elodie Rakoto', role: 'survivor' },
  { name: 'Yun-Jin Lee', role: 'survivor' },
  { name: 'Jill Valentine', role: 'survivor' },
  { name: 'Leon S. Kennedy', role: 'survivor' },
  { name: 'Mikaela Reid', role: 'survivor' },
  { name: 'Jonah Vasquez', role: 'survivor' },
  { name: 'Yoichi Asakawa', role: 'survivor' },
  { name: 'Haddie Kaur', role: 'survivor' },
  { name: 'Ada Wong', role: 'survivor' },
  { name: 'Rebecca Chambers', role: 'survivor' },
  { name: 'Vittorio Toscano', role: 'survivor' },
  { name: 'Thalita Lyra', role: 'survivor' },
  { name: 'Renato Lyra', role: 'survivor' },
  { name: 'Gabriel Soma', role: 'survivor' },
  { name: 'Nicolas Cage', role: 'survivor' },
  { name: 'Ellen Ripley', role: 'survivor' },
  { name: 'Alan Wake', role: 'survivor' },
  { name: 'Sable Ward', role: 'survivor' },
  { name: 'The Troupe', role: 'survivor' },
  { name: 'Lara Croft', role: 'survivor' },
  { name: 'Trevor Belmont', role: 'survivor' },
  { name: 'Taurie Cain', role: 'survivor' },
  { name: 'Rick Grimes', role: 'survivor' },
  { name: 'Michonne Grimes', role: 'survivor' },
  { name: 'Vee Boonyasak', role: 'survivor' },
  { name: 'Dustin Henderson', role: 'survivor' },
  { name: 'Eleven', role: 'survivor' },
  { name: 'Kwon Tae-young', role: 'survivor' },
];

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

// Maps a character name to the copied webp file path in the public assets folder
export function getCharacterImagePath(name: string, role: 'killer' | 'survivor'): string {
  let cleanName = name.replace(/[\s\.]/g, '');
  if (cleanName === 'LeonSKennedy') {
    cleanName = 'LeonScottKennedy';
  }

  const killerPrefixes: Record<string, string> = {
    'TheTrapper': 'K01',
    'TheWraith': 'K02',
    'TheHillbilly': 'K03',
    'TheNurse': 'K04',
    'TheShape': 'K05',
    'TheHag': 'K06',
    'TheDoctor': 'K07',
    'TheHuntress': 'K08',
    'TheCannibal': 'K09',
    'TheNightmare': 'K10',
    'ThePig': 'K11',
    'TheClown': 'K12',
    'TheSpirit': 'K13',
    'TheLegion': 'K14',
    'ThePlague': 'K15',
    'TheGhostFace': 'K16',
    'TheDemogorgon': 'K17',
    'TheOni': 'K18',
    'TheDeathslinger': 'K19',
    'TheExecutioner': 'K20',
    'TheBlight': 'K21',
    'TheTwins': 'K22',
    'TheTrickster': 'K23',
    'TheNemesis': 'K24',
    'TheCenobite': 'K25',
    'TheArtist': 'K26',
    'TheOnryo': 'K27',
    'TheDredge': 'K28',
    'TheMastermind': 'K29',
    'TheKnight': 'K30',
    'TheSkullMerchant': 'K31',
    'TheSingularity': 'K32',
    'TheXenomorph': 'K33',
    'TheGoodGuy': 'K34',
    'TheUnknown': 'K35',
    'TheLich': 'K36',
    'TheDarkLord': 'K37',
    'TheHoundmaster': 'K38',
    'TheGhoul': 'K39',
    'TheAnimatronic': 'K40',
    'TheKrasue': 'K41',
    'TheFirst': 'K42',
  };

  const survivorPrefixes: Record<string, string> = {
    'DwightFairfield': 'S01',
    'MegThomas': 'S02',
    'ClaudetteMorel': 'S03',
    'JakePark': 'S04',
    'NeaKarlsson': 'S05',
    'LaurieStrode': 'S06',
    'AceVisconti': 'S07',
    'BillOverbeck': 'S08',
    'FengMin': 'S09',
    'DavidKing': 'S10',
    'QuentinSmith': 'S11',
    'DavidTapp': 'S12',
    'KateDenson': 'S13',
    'AdamFrancis': 'S14',
    'JeffJohansen': 'S15',
    'JaneRomero': 'S16',
    'AshWilliams': 'S17',
    'NancyWheeler': 'S18',
    'SteveHarrington': 'S19',
    'YuiKimura': 'S20',
    'ZarinaKassir': 'S21',
    'CherylMason': 'S22',
    'FelixRichter': 'S23',
    'ElodieRakoto': 'S24',
    'Yun-JinLee': 'S25',
    'JillValentine': 'S26',
    'LeonScottKennedy': 'S27',
    'MikaelaReid': 'S28',
    'JonahVasquez': 'S29',
    'YoichiAsakawa': 'S30',
    'HaddieKaur': 'S31',
    'AdaWong': 'S32',
    'RebeccaChambers': 'S33',
    'VittorioToscano': 'S34',
    'ThalitaLyra': 'S35',
    'RenatoLyra': 'S36',
    'GabrielSoma': 'S37',
    'NicolasCage': 'S38',
    'EllenRipley': 'S39',
    'AlanWake': 'S40',
    'SableWard': 'S41',
    'TheTroupe': 'S42',
    'LaraCroft': 'S43',
    'TrevorBelmont': 'S44',
    'TaurieCain': 'S45',
    'RickGrimes': 'S46',
    'MichonneGrimes': 'S47',
    'VeeBoonyasak': 'S48',
    'DustinHenderson': 'S50',
    'Eleven': 'S51',
    'KwonTae-young': 'S52',
  };

  if (role === 'killer') {
    const prefix = killerPrefixes[cleanName];
    if (prefix) {
      return `/assets/Killer Icons/${prefix}_${cleanName}_Portrait.webp`;
    }
  } else {
    const prefix = survivorPrefixes[cleanName];
    if (prefix) {
      return `/assets/Survivor Icon/${prefix}_${cleanName}_Portrait.webp`;
    }
  }

  return `/assets/${role === 'killer' ? 'Killer Icons' : 'Survivor Icon'}/${name}.png`;
}

function matchesCharacterSearch(charName: string, query: string): boolean {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return true;

  // Standard name match
  if (charName.toLowerCase().includes(cleanQuery)) {
    return true;
  }

  // Shortcut rules mapping
  const shortcuts: Record<string, string[]> = {
    'the cannibal': ['buba', 'bubba'],
    'the mastermind': ['wesker'],
    'the hillbilly': ['billy'],
    'the shape': ['mayers', 'myers'],
    'the nightmare': ['freddy'],
    'the animatronic': ['freddy'],
    'the cenobite': ['pin head', 'pinhead'],
    'the good guy': ['cucky', 'chucky'],
    'the lich': ['vecna'],
    'the dark lord': ['dracula'],
    'the first': ['vecna', 'henry']
  };

  const nameLower = charName.toLowerCase();
  const allowedShortcuts = shortcuts[nameLower];
  if (allowedShortcuts) {
    return allowedShortcuts.some(sc => sc.includes(cleanQuery) || cleanQuery.includes(sc));
  }

  return false;
}

interface DashboardOptions {
  activeRole: DashboardRole;
  searchText: string;
  timerText: string;
  timerRunning: boolean;
  selectedCharacterName: string | null;
  lastKillerMatch: MatchRecord | null;
  lastSurvivorMatch: MatchRecord | null;
  shortcutKey: string;
}

export function createDashboardPage(options: DashboardOptions): string {
  const defaultCharName = options.activeRole === 'killer' ? 'The Trapper' : 'Dwight Fairfield';
  const selectedName = options.selectedCharacterName || defaultCharName;

  const filtered = dashboardCharacters.filter((character) => {
    if (character.role !== options.activeRole) {
      return false;
    }
    return matchesCharacterSearch(character.name, options.searchText);
  });

  const startDisabled = options.timerRunning;
  const startButtonText = options.timerRunning ? 'Match Running' : 'Start Match';

  const showTextList = options.searchText.trim().length > 0;

  const smallCardsHtml = filtered
    .map(
      (character) => {
        const isSelected = selectedName === character.name;
        if (showTextList) {
          return `
            <div class="character-text-row ${isSelected ? 'selected' : ''}" data-char-card="${character.name}" data-role="${character.role}">
              <div class="text-row-hover-portrait">
                <img src="${getCharacterImagePath(character.name, character.role)}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                     class="hover-portrait-image" 
                     alt="${character.name}" />
                <div class="character-portrait-fallback ${character.role}" style="font-size: 10px;">${initials(character.name)}</div>
              </div>
              <span class="char-bullet">•</span>
              <span class="char-text-name">${character.name}</span>
            </div>
          `;
        }
        return `
          <article class="character-card ${isSelected ? 'selected' : ''}" data-char-card="${character.name}" data-role="${character.role}" title="${character.name}">
            <div class="portrait-container">
              <img src="${getCharacterImagePath(character.name, character.role)}" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                   class="character-image" 
                   alt="${character.name}" />
              <div class="character-portrait-fallback ${character.role}">${initials(character.name)}</div>
              <div class="character-name-overlay">${character.name}</div>
            </div>
          </article>
        `;
      },
    )
    .join('');

  return `
    <section>
      <header class="dashboard-head">
        <h1 class="page-title">BLOODPOINT</h1>
        <h2 class="page-subtitle">DASHBOARD</h2>
        <div id="stopwatch" class="dashboard-timer">${options.timerText}</div>
      </header>

      <div class="dashboard-actions">
        <button id="start-match-btn" class="action-btn start" ${startDisabled ? 'disabled' : ''}>
          ${startButtonText}
        </button>
        <button id="end-match-btn" class="action-btn end" ${options.timerRunning ? '' : 'disabled'}>
          End Match
        </button>
      </div>

      <div class="dashboard-toolbar">
        <div class="segmented-toggle">
          <button type="button" class="${options.activeRole === 'killer' ? 'active' : ''}" data-role="killer">KILLER</button>
          <button type="button" class="${options.activeRole === 'survivor' ? 'active' : ''}" data-role="survivor">SURVIVOR</button>
        </div>
        <div class="search-input-wrapper">
          <input id="character-search" class="character-search" value="${options.searchText}" placeholder="Search character..." />
          <span class="search-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </span>
        </div>
      </div>

      <div class="character-grid ${showTextList ? 'text-list-mode' : ''}">
        ${smallCardsHtml}
      </div>

      <section class="last-matches-container">
        <div class="last-match-box">
          <h2 class="panel-label">LAST KILLER MATCH ${options.lastKillerMatch ? `(${options.lastKillerMatch.characterName.toUpperCase()})` : ''}</h2>
          ${options.lastKillerMatch 
            ? `
            <div class="last-match-content">
              <div class="portrait-container mini-portrait">
                <img src="${getCharacterImagePath(options.lastKillerMatch.characterName, 'killer')}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                     class="character-image" 
                     alt="${options.lastKillerMatch.characterName}" />
                <div class="character-portrait-fallback killer">${initials(options.lastKillerMatch.characterName)}</div>
              </div>
              <div class="last-match-metrics">
                <div class="last-match-bp-group">
                  <span class="last-match-bp-label">BP EARNED:</span>
                  <div class="last-match-bp-val-row" style="margin-top: 2px;">
                    <span class="last-match-bp">${options.lastKillerMatch.bp.toLocaleString()}</span>
                    <img src="/assets/TransparentBP.webp" class="bp-icon" alt="BP" />
                  </div>
                  <span class="last-match-meta-detail" style="font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
                    KILLER · ${options.lastKillerMatch.result} · ${options.lastKillerMatch.time}
                  </span>
                </div>
              </div>
            </div>
            `
            : `
            <div class="empty-state" style="margin: 0; padding: 10px;">
              No killer trials recorded yet. Play a match to log results!
            </div>
            `
          }
        </div>

        <div class="last-match-box">
          <h2 class="panel-label">LAST SURVIVOR MATCH ${options.lastSurvivorMatch ? `(${options.lastSurvivorMatch.characterName.toUpperCase()})` : ''}</h2>
          ${options.lastSurvivorMatch 
            ? `
            <div class="last-match-content">
              <div class="portrait-container mini-portrait">
                <img src="${getCharacterImagePath(options.lastSurvivorMatch.characterName, 'survivor')}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                     class="character-image" 
                     alt="${options.lastSurvivorMatch.characterName}" />
                <div class="character-portrait-fallback survivor">${initials(options.lastSurvivorMatch.characterName)}</div>
              </div>
              <div class="last-match-metrics">
                <div class="last-match-bp-group">
                  <span class="last-match-bp-label">BP EARNED:</span>
                  <div class="last-match-bp-val-row" style="margin-top: 2px;">
                    <span class="last-match-bp">${options.lastSurvivorMatch.bp.toLocaleString()}</span>
                    <img src="/assets/TransparentBP.webp" class="bp-icon" alt="BP" />
                  </div>
                  <span class="last-match-meta-detail" style="font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
                    SURVIVOR · ${options.lastSurvivorMatch.result} · ${options.lastSurvivorMatch.time}
                  </span>
                </div>
              </div>
            </div>
            `
            : `
            <div class="empty-state" style="margin: 0; padding: 10px;">
              No survivor trials recorded yet. Play a match to log results!
            </div>
            `
          }
        </div>
      </section>
    </section>
  `;
}

interface StatsOptions {
  matches: MatchRecord[];
  selectedStatsCharacters: string[];
  statsSearchText: string;
}

export function createStatsPage(options: StatsOptions): string {
  const matches = options.matches;
  const statsFiltered = options.statsSearchText.trim()
    ? dashboardCharacters.filter((c) =>
        matchesCharacterSearch(c.name, options.statsSearchText)
      )
    : [];

  const statsSearchResultsHtml = statsFiltered
    .map(
      (c) => `
      <div class="stats-search-row ${options.selectedStatsCharacters.includes(c.name) ? 'selected' : ''}" data-stats-char="${c.name}">
        ${c.name}
      </div>
    `
    )
    .join('');

  const totalTrials = matches.length;
  const totalBP = matches.reduce((acc, m) => acc + m.bp, 0);
  const survTrials = matches.filter((m) => m.role === 'survivor').length;
  const killerTrials = matches.filter((m) => m.role === 'killer').length;
  
  const totalSeconds = matches.reduce((acc, m) => acc + m.durationSeconds, 0);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const timePlayedText = hrs > 0 ? `${hrs} hour ${mins}` : `${mins} min`;
  const bpPerHour = totalSeconds > 0 ? Math.round(totalBP / (totalSeconds / 3600)) : 0;

  // Find character's role
  const getRole = (name: string): 'killer' | 'survivor' => {
    const found = dashboardCharacters.find((c) => c.name === name);
    return found ? found.role : 'killer';
  };

  const getCharacterStatsHtml = (charName: string, active: boolean): string => {
    const charRole = getRole(charName);
    const charMatches = matches.filter((m) => m.characterName === charName);
    
    let statsDetailText = 'No trials logged for this character.';
    if (charMatches.length > 0) {
      if (charRole === 'survivor') {
        const escapes = charMatches.filter((m) => m.result === 'ESCAPED').length;
        const escapeRatio = Math.round((escapes / charMatches.length) * 100);
        statsDetailText = `ESCAPE / DEATH RATIO: ${escapeRatio}% Escaped / ${100 - escapeRatio}% Sacrificed`;
      } else {
        const totalKills = charMatches.reduce((acc, m) => {
          const kills = parseInt(m.result.split(' ')[0]) || 0;
          return acc + kills;
        }, 0);
        const avgKills = (totalKills / charMatches.length).toFixed(1);
        statsDetailText = `AVG. KILL RATIO: ${avgKills} Kills/Match`;
      }
    }

    return `
      <article class="character-stat-row ${active ? 'active' : ''}">
        <div class="portrait-container mini-portrait">
          <img src="${getCharacterImagePath(charName, charRole)}" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
               class="character-image" 
               alt="${charName}" />
          <div class="character-portrait-fallback ${charRole}">${initials(charName)}</div>
        </div>
        <div class="character-stat-details">
          <p class="char-stat-name">CHARACTER: ${charName} (${charMatches.length} Matches)</p>
          <p class="char-stat-desc">${statsDetailText}</p>
        </div>
        <button type="button" class="remove-stats-char-btn" data-remove-stats-char="${charName}" title="Remove character">
          &times;
        </button>
      </article>
    `;
  };

  return `
    <section>
      <header class="page-header-center">
        <h1 class="page-title">BLOODPOINT</h1>
        <h2 class="page-subtitle">STATS</h2>
      </header>

      <section class="page-block">
        <div class="stats-grid">
          <article class="stat-card">
            <span class="stat-label">TOTAL TRIALS:</span>
            <span class="stat-value">${totalTrials}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">TOTAL BP:</span>
            <span class="stat-value">${totalBP.toLocaleString()}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">SURV. TRIALS:</span>
            <span class="stat-value">${survTrials}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">KILLER TRIALS:</span>
            <span class="stat-value">${killerTrials}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">BP/HR:</span>
            <span class="stat-value">${bpPerHour.toLocaleString()}</span>
          </article>
          <article class="stat-card">
            <span class="stat-label">TIME PLAYED:</span>
            <span class="stat-value">${timePlayedText}</span>
          </article>
        </div>

        <div class="stats-filter">
          <div class="search-input-wrapper">
            <input id="stats-char-search" class="character-search" value="${options.statsSearchText}" placeholder="Search character..." />
            <span class="search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
          ${
            options.statsSearchText.trim()
              ? `
              <div class="stats-search-results">
                ${statsSearchResultsHtml || '<div class="empty-state" style="margin: 0; padding: 10px;">No matching characters found</div>'}
              </div>
              `
              : ''
          }
        </div>

        ${
          options.selectedStatsCharacters.length > 0 
            ? `
            <div class="character-stats-container">
              ${options.selectedStatsCharacters.map(charName => getCharacterStatsHtml(charName, true)).join('')}
            </div>
            `
            : `
            <div class="empty-state" style="margin: 0; padding: 15px;">
              Please search and select up to 3 characters to view detailed statistics.
            </div>
            `
        }
      </section>
    </section>
  `;
}

interface HistoryOptions {
  matches: MatchRecord[];
}

const renderHistoryStatus = (row: MatchRecord): string => {
  if (row.result === 'ESCAPED') {
    return `
      <div class="history-row-result result-escaped">
        <span class="result-icon-wrapper">
          <img src="/assets/IconHelp_exitGates.webp" class="history-status-img escape" alt="Escaped" />
        </span>
        <span class="result-text">${row.result}</span>
      </div>
    `;
  }
  if (row.result === 'DIED') {
    return `
      <div class="history-row-result result-die">
        <span class="result-icon-wrapper">
          <img src="/assets/Mori.webp" class="history-status-img die" alt="Died" />
        </span>
        <span class="result-text">${row.result}</span>
      </div>
    `;
  }
  
  const killsCount = parseInt(row.result.split(' ')[0]) || 0;
  let talliesHtml = '';
  for (let i = 0; i < killsCount; i++) {
    talliesHtml += `<img src="/assets/Atl_Hud_PB_Kill.webp" class="history-status-img kill-tally" alt="Kill" />`;
  }
  if (killsCount === 0) {
    talliesHtml = `<span style="font-size: 11px; color: var(--text-muted);">No Kills</span>`;
  }
  return `
    <div class="history-row-result result-kill">
      <span class="result-icon-wrapper tally-wrapper">
        ${talliesHtml}
      </span>
      <span class="result-text">${row.result}</span>
    </div>
  `;
};

export function createHistoryPage(options: HistoryOptions): string {
  const matches = options.matches;
  const lastMatch = matches.length > 0 ? matches[0] : null;

  return `
    <section>
      <header class="page-header-center">
        <h1 class="page-title">BLOODPOINT</h1>
        <h2 class="page-subtitle">MATCH HISTORY</h2>
      </header>

      <section class="page-block">
        <article class="history-featured">
          <h3 class="panel-label">LAST PLAYED MATCH</h3>
          ${lastMatch 
            ? `
            <div class="history-featured-card">
              <div class="portrait-container mini-portrait">
                <img src="${getCharacterImagePath(lastMatch.characterName, lastMatch.role)}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                     class="character-image" 
                     alt="${lastMatch.characterName}" />
                <div class="character-portrait-fallback ${lastMatch.role}">${initials(lastMatch.characterName)}</div>
              </div>
              <div class="featured-details-container">
                <div class="featured-char-name-row">
                  <span class="featured-char-name">${lastMatch.characterName.toUpperCase()} (${lastMatch.role === 'killer' ? 'Killer' : 'Survivor'})</span>
                </div>
                <div class="featured-divider"></div>
                <div class="featured-metrics-row">
                  <div class="featured-metric-item">
                    <span class="featured-label">SCORE:</span>
                    <span class="featured-value ${lastMatch.role === 'killer' ? 'highlight-red' : ''}">${lastMatch.result}</span>
                  </div>
                  <div class="featured-metric-sep"></div>
                  <div class="featured-metric-item">
                    <span class="featured-label">TIME:</span>
                    <span class="featured-value">${lastMatch.time}</span>
                  </div>
                  <div class="featured-metric-sep"></div>
                  <div class="featured-metric-item">
                    <span class="featured-label">BP EARNED:</span>
                    <div class="bp-inline-wrapper">
                      <span class="featured-value">${lastMatch.bp.toLocaleString()}</span>
                      <img src="/assets/TransparentBP.webp" class="bp-icon-small" alt="BP" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `
            : `
            <div class="empty-state" style="margin: 0; padding: 15px;">
              No matches recorded yet. Start a trial from the Dashboard!
            </div>
            `
          }
        </article>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          <h3 class="panel-label" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">LOG ARCHIVE (${matches.length}/50)</h3>
          ${matches.length > 0 
            ? `
            <button type="button" id="clear-log-btn" class="action-btn end" style="font-size: 11px; padding: 4px 10px; min-width: unset; height: auto; margin: 0;">
              Clear Log
            </button>
            `
            : ''
          }
        </div>
        ${matches.length > 0 
          ? `
          <div class="history-list">
            ${matches
              .map(
                (row) => `
                  <article class="history-match-row">
                    <div class="portrait-container mini-portrait">
                      <img src="${getCharacterImagePath(row.characterName, row.role)}" 
                           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                           class="character-image" 
                           alt="${row.characterName}" />
                      <div class="character-portrait-fallback ${row.role}">${initials(row.characterName)}</div>
                    </div>
                    ${renderHistoryStatus(row)}
                    <div class="history-row-time">
                      <span class="history-meta-label">TIME:</span>
                      <span class="history-meta-value">${row.time}</span>
                    </div>
                    <div class="history-row-bp">
                      <span class="history-meta-label">BP:</span>
                      <div class="bp-inline-wrapper">
                        <span class="history-meta-value">${row.bp.toLocaleString()}</span>
                        <img src="/assets/TransparentBP.webp" class="bp-icon-small" alt="BP" />
                      </div>
                    </div>
                    <button type="button" class="edit-match-btn" data-edit-match="${row.id}" title="Edit Match">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  </article>
                `,
              )
              .join('')}
          </div>
          `
          : `
          <div class="empty-state">
            No matches archived yet.
          </div>
          `
        }
      </section>
    </section>
  `;
}
