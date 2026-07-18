// --- State Variables ---
let players = []; // Pre-populated to match your screenshot
let currentRound = 1;
const maxRounds = 10;
let gameScores = {};   // Tracks scores per player per round: { 'Adam': { 1: 20, 2: -10 } }
let roundInputs = {};  // Tracks the exact text typed into inputs per round
let krakenRounds = {}; // Remembers if Kraken was played on specific rounds
let elements = {};

// Directly binds DOM elements since the script is deferred in the head
function bindElements() {
  elements = {
    crewList: document.getElementById('crew-list'),
    newPlayerName: document.getElementById('new-player-name'),
    addPlayerBtn: document.getElementById('add-player-btn'),
    scoringRows: document.getElementById('scoring-rows'),
    prevRoundBtn: document.getElementById('prev-round'),
    nextRoundBtn: document.getElementById('next-round'),
    currentRoundText: document.getElementById('nav-current-round'), // Matched to HTML ID
    scoringRoundText: document.getElementById('scoring-round-text'),
    tricksAvailable: document.getElementById('tricks-available'),
    roundDots: document.getElementById('round-dots'),
    globalKrakenCheckbox: document.getElementById('global-kraken-checkbox')
  };
}

// Sets up the initial UI and binds all permanent event listeners
function init() {
  bindElements();
  renderRoundNav();
  renderManifest();
  renderScoringTable();
  setupEventListeners();
}

// Attaches event listeners for navigation, adding players, removing players, and the Kraken toggle
function setupEventListeners() {
  elements.addPlayerBtn.addEventListener('click', addPlayer);
  
  elements.newPlayerName.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPlayer();
    }
  });

  elements.crewList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const index = parseInt(e.target.dataset.index, 10);
      removePlayer(index);
    }
  });

  elements.prevRoundBtn.addEventListener('click', () => changeRound(-1));
  elements.nextRoundBtn.addEventListener('click', () => changeRound(1));
  
  // Listen for changes to the global Kraken checkbox and save state
  elements.globalKrakenCheckbox.addEventListener('change', (e) => {
    krakenRounds[currentRound] = e.target.checked;
    updateGlobalKraken();
  });
}

// Validates the input text, updates the array, clears the input field, and updates only the necessary UI pieces
function addPlayer() {
  const name = elements.newPlayerName.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    elements.newPlayerName.value = '';
    renderManifest();
    appendPlayerRow(name, players.length - 1);
  }
}

// Removes a specific player from the state based on index and triggers a full table re-render
function removePlayer(index) {
  players.splice(index, 1);
  renderManifest();
  renderScoringTable();
}

// Maps over the current player array to generate HTML for the crew tags, embedding the index as a data attribute
function renderManifest() {
  elements.crewList.innerHTML = players.map((player, index) => `
    <div class="crew-tag">
      <span>🏴‍☠️ ${player}</span>
      <button data-index="${index}">✕</button>
    </div>
  `).join('');
}

// Updates text nodes and pagination dots based on the currentRound state
function renderRoundNav() {
  if (elements.currentRoundText) elements.currentRoundText.textContent = currentRound;
  elements.scoringRoundText.textContent = currentRound;
  
  elements.roundDots.innerHTML = Array.from({ length: maxRounds }, (_, i) => 
    `<div class="dot ${i + 1 === currentRound ? 'active' : ''}"></div>`
  ).join('');

  elements.prevRoundBtn.disabled = currentRound === 1;
  elements.nextRoundBtn.disabled = currentRound === maxRounds;
  
  // Sync the tricks available text and input limits based on current round/kraken state
  elements.globalKrakenCheckbox.checked = krakenRounds[currentRound] || false;
  updateGlobalKraken();
}

// Adjusts the maximum allowed won tricks based on whether the Kraken was played
function updateGlobalKraken() {
  const krakenPlayed = elements.globalKrakenCheckbox.checked;
  const availableTricks = krakenPlayed ? currentRound - 1 : currentRound;
  
  elements.tricksAvailable.textContent = `${availableTricks} trick${availableTricks !== 1 ? 's' : ''} available`;
  
  const rows = document.querySelectorAll('.scoring-row');
  rows.forEach(row => {
    const wonInput = row.querySelector('.won-input');
    wonInput.max = availableTricks; // Update the HTML constraint
    
    // Clamp the value down dynamically if the Kraken destroyed a trick they previously claimed
    if (wonInput.value !== '' && parseInt(wonInput.value, 10) > availableTricks) {
      wonInput.value = availableTricks;
    }
    
    updateRowScore(row);
  });
}

// Increments or decrements the round tracker, saves history, and refreshes the display
function changeRound(delta) {
  const newRound = currentRound + delta;
  if (newRound >= 1 && newRound <= maxRounds) {
    currentRound = newRound;
    renderRoundNav();
    renderScoringTable();
  }
}

// Implements standard Skull King math rules for point calculation based on round, bid, and tricks won
function calculateScore(bid, won, bonus, round) {
  let score = 0;
  
  if (bid === 0) {
    if (won === 0) {
      score = round * 10;
    } else {
      score = -(round * 10);
    }
  } else {
    if (bid === won) {
      score = bid * 20;
    } else {
      score = -(Math.abs(bid - won) * 10);
    }
  }
  
  return score + bonus;
}

// Clears the current table container and reconstructs it by looping over all current players
function renderScoringTable() {
  elements.scoringRows.innerHTML = '';
  players.forEach((player, index) => {
    appendPlayerRow(player, index);
  });
}

// Generates the HTML for a single player's scoring row, appends it to the table, and attaches input listeners
function appendPlayerRow(player, index) {
  const krakenPlayed = elements.globalKrakenCheckbox.checked;
  const availableTricks = krakenPlayed ? currentRound - 1 : currentRound;
  
  // Look up saved inputs from history so values persist when switching rounds
  const saved = (roundInputs[currentRound] && roundInputs[currentRound][player]) || { bid: '', won: '', bonus: '' };
  
  const rowHtml = `
    <div class="scoring-row" data-index="${index}" data-player="${player}">
      <div class="player-name">${player}</div>
      <div class="input-group">
        <label>BID</label>
        <input type="number" class="number-input bid-input" min="0" max="${currentRound}" placeholder="0" value="${saved.bid}">
      </div>
      <div class="input-group">
        <label>WON</label>
        <input type="number" class="number-input won-input" min="0" max="${availableTricks}" placeholder="0" value="${saved.won}">
      </div>
      <div class="input-group">
        <label>BONUS</label>
        <input type="number" class="number-input bonus-input" placeholder="0" step="10" value="${saved.bonus}">
      </div>
      <div class="score-wrapper">
        <div id="score-display-${index}" class="score-display round-score score-zero">0</div>
        <div id="total-score-${index}" class="total-score">Total: 0</div>
      </div>
    </div>
  `;
  
  elements.scoringRows.insertAdjacentHTML('beforeend', rowHtml);
  const newRow = elements.scoringRows.lastElementChild;
  newRow.querySelectorAll('input').forEach(input => input.addEventListener('input', () => updateRowScore(newRow)));
  
  // Ensure state tracking objects exist for this player
  if (!gameScores[player]) gameScores[player] = {};
  if (!roundInputs[currentRound]) roundInputs[currentRound] = {};

  updateRowScore(newRow);
}

// Reads values from a specific row's inputs to recalculate and display the round score and total score dynamically
function updateRowScore(rowElement) {
  const index = rowElement.dataset.index;
  const player = rowElement.dataset.player;
  
  // Get string values first so we can check if they are blank
  const bidStr = rowElement.querySelector('.bid-input').value;
  const wonStr = rowElement.querySelector('.won-input').value;
  const bonusStr = rowElement.querySelector('.bonus-input').value;
  
  const scoreDisplay = document.getElementById(`score-display-${index}`);
  const totalScoreDisplay = document.getElementById(`total-score-${index}`);
  
  // Save exact inputs to state so round switching doesn't delete them
  if (!roundInputs[currentRound]) roundInputs[currentRound] = {};
  roundInputs[currentRound][player] = { bid: bidStr, won: wonStr, bonus: bonusStr };
  
  // If either required input is completely empty, don't run math
  if (bidStr === '' || wonStr === '') {
     scoreDisplay.textContent = '0';
     scoreDisplay.className = 'score-display round-score score-zero';
     gameScores[player][currentRound] = 0; 
  } else {
     // Safe to parse as integers
     const bid = parseInt(bidStr, 10);
     const won = parseInt(wonStr, 10);
     const bonus = parseInt(bonusStr, 10) || 0;
     
     const score = calculateScore(bid, won, bonus, currentRound);
     
     const sign = score > 0 ? '+' : '';
     scoreDisplay.textContent = `${sign}${score}`;
     
     scoreDisplay.className = 'score-display round-score';
     if (score > 0) scoreDisplay.classList.add('score-positive');
     else if (score < 0) scoreDisplay.classList.add('score-negative');
     else scoreDisplay.classList.add('score-zero');
     
     gameScores[player][currentRound] = score; // Save to memory
  }
  
  // --- Calculate and output Total Score ---
  let totalScore = 0;
  if (gameScores[player]) {
      Object.values(gameScores[player]).forEach(s => totalScore += s);
  }
  if (totalScoreDisplay) {
      totalScoreDisplay.textContent = `Total: ${totalScore}`;
  }
}

// Executes script immediately 
init();