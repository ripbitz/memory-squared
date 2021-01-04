// Elements from the page
let square0 = document.getElementById('square0');
let square1 = document.getElementById('square1');
let roundLabel = document.getElementById('roundLabel');
let userInputLabel = document.getElementById('userInputLabel');
let correctSequenceLabel = document.getElementById('correctSequenceLabel')

// Init tile sequence
let sequence = [];

// Init user submission sequence
let clicked = [];

// Init start round and setting round label to match
let round = 1;
roundLabel.textContent = "Round: " + round;

// Init speed to display sequence
let SHOW_SPEED = 300;
let REVERT_BACK_SPEED = 600;

// Flag to check user turn
let USER_TURN = false;

// Flag to know show the sequence
let SHOWING = true;

// Flag for game over
let GAME_OVER = false;

// Helper functions
const helpers = {
  // Change tile color to grey
  showTile: (button) => {
    button.style.backgroundColor = '#93a1ad';
  },

  // Revert tile color to red
  revertTile: (button) => {
    button.style.backgroundColor = "#A51C30"
  },

  // Make buttons have no effect
  noop: () => {
    square0.onclick = () => { return; },
    square1.onclick = () => { return; }
  },
}

// Game mechanics
const mechanics =  {
  initSequence: () => {
    for(let i = 0; i<Math.pow(round,2); i++){
      let RANDOM_CHOICE = Math.round(Math.random());
      sequence.push(RANDOM_CHOICE);
    }
  },

  startRound: () => {
    function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
    mechanics.initSequence();

    // Iterate through the generated sequence
    async function iterate() {
      for(let i = 0; i < sequence.length; i++) {
        await task1(i);
        await task2(i);
        if(i === sequence.length-1){ USER_TURN = true; }
      }
    }

    // Show tile
    async function task1(i) {
      await timer(SHOW_SPEED);
      if(sequence[i] === 0){ helpers.showTile(square0); }
      if(sequence[i] === 1){ helpers.showTile(square1); }
    }
    
    // Revert tile
    async function task2(i){
      await timer(REVERT_BACK_SPEED)
      if(sequence[i] === 0){ helpers.revertTile(square0); }
      if(sequence[i] === 1){ helpers.revertTile(square1); }
    }
    iterate();
  },

  // Handles user inputs
  userInput: () => {
    square0.onclick = () => {
      clicked.push(0);
      userInputLabel.textContent = "";
      userInputLabel.textContent = "Input: [" +  clicked + "]";
    }
    square1.onclick = () => {
      clicked.push(1);
      userInputLabel.textContent = "";
      userInputLabel.textContent = "Input: [" +  clicked + "]";
    }
  },

  // Checks user inputs
  check: () => {
    for(let i = 0; i<clicked.length; i++){
      if(clicked[i] === sequence[i]){
        continue;
      } else {
        GAME_OVER = true;
      }
    }
    if(clicked.length === sequence.length && !GAME_OVER){ mechanics.nextRound(); }
  },

  // Start the next round
  nextRound: () => {
    sequence = [];
    clicked = [];
    round++;
    roundLabel.textContent = "";
    roundLabel.textContent = "Round: " + round;
    USER_TURN = false;
    SHOWING = true;
    helpers.noop();
  },

  // End the game
  endGame: () => {
    roundLabel.textContent = "";
    roundLabel.textContent = "GAME OVER: PRESS 'R' TO RESET OR THE SPACE KEY";
    correctSequenceLabel.textContent = "Correct Sequence: [" + sequence + "]";
    helpers.noop();
  },

  // Reset the game
  reset: () => {
    sequence = [];
    clicked = [];
    round = 1;
    roundLabel.textContent = "";
    roundLabel.textContent = "Round: " + round;
    userInputLabel.textContent = "Input: []";
    USER_TURN = false;
    SHOWING = true;
    GAME_OVER = false;
    correctSequenceLabel.textContent = "";
  },
} 

// Keyboard event listeners to reset game
document.addEventListener('keydown', keyDownHandler);
function keyDownHandler(event) {
  switch (event.code) {
    case 'Space':
      mechanics.reset();
      break;
    case 'KeyR':
      mechanics.reset();
      break;
  }
}

// Main game loop
function LOOP(){
  if(!USER_TURN){
    if(SHOWING){ 
      mechanics.startRound();
      SHOWING = false;
    }
  }else{
    mechanics.userInput();
    mechanics.check();
  }

  if(GAME_OVER){ mechanics.endGame(); }
}

// Run loop every 10 ms
setInterval(LOOP, 10);