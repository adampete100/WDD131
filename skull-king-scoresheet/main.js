// State Variables
let players = [];
let currentRound = 1;
const maxRounds = 10;
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
    currentRoundText: document.getElementById('current-round-text'),
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
  
  // Listen for changes to the global Kraken checkbox
  elements.globalKrakenCheckbox.addEventListener('change', updateGlobalKraken);
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
  elements.currentRoundText.textContent = currentRound;
  elements.scoringRoundText.textContent = currentRound;
  
  elements.roundDots.innerHTML = Array.from({ length: maxRounds }, (_, i) => 
    `<div class="dot ${i + 1 === currentRound ? 'active' : ''}"></div>`
  ).join('');

  elements.prevRoundBtn.disabled = currentRound === 1;
  elements.nextRoundBtn.disabled = currentRound === maxRounds;
  
  // Sync the tricks available text and input limits based on current round/kraken state
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
    if (parseInt(wonInput.value, 10) > availableTricks) {
      wonInput.value = availableTricks;
    }
    
    updateRowScore(row);
  });
}

// Increments or decrements the round tracker, resets the global Kraken state, and refreshes the display
function changeRound(delta) {
  const newRound = currentRound + delta;
  if (newRound >= 1 && newRound <= maxRounds) {
    currentRound = newRound;
    elements.globalKrakenCheckbox.checked = false; // Reset Kraken for the new round
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
  
  const rowHtml = `
    <div class="scoring-row" data-index="${index}">
      <div class="player-name">${player}</div>
      <div class="input-group"><label>BID</label><input type="number" class="number-input bid-input" min="0" max="${currentRound}" value="0"></div>
      <div class="input-group"><label>WON</label><input type="number" class="number-input won-input" min="0" max="${availableTricks}" value="0"></div>
      <div class="input-group"><label>BONUS</label><input type="number" class="number-input bonus-input" value="0" step="10"></div>
      <div class="score-display score-positive" id="score-display-${index}">+0</div>
    </div>
  `;
  
  elements.scoringRows.insertAdjacentHTML('beforeend', rowHtml);
  const newRow = elements.scoringRows.lastElementChild;
  newRow.querySelectorAll('input').forEach(input => input.addEventListener('input', () => updateRowScore(newRow)));
  updateRowScore(newRow);
}

// Reads values from a specific row's inputs to recalculate and display the round score dynamically
function updateRowScore(rowElement) {
  const index = rowElement.dataset.index;
  const bid = parseInt(rowElement.querySelector('.bid-input').value, 10) || 0;
  const won = parseInt(rowElement.querySelector('.won-input').value, 10) || 0;
  const bonus = parseInt(rowElement.querySelector('.bonus-input').value, 10) || 0;
  
  const score = calculateScore(bid, won, bonus, currentRound);
  const scoreDisplay = document.getElementById(`score-display-${index}`);
  
  const sign = score > 0 ? '+' : '';
  scoreDisplay.textContent = `${sign}${score}`;
  
  scoreDisplay.className = 'score-display';
  if (score > 0) scoreDisplay.classList.add('score-positive');
  else if (score < 0) scoreDisplay.classList.add('score-negative');
  else scoreDisplay.classList.add('score-zero');
}

// Executes script immediately 
init();