let buttonColors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];
let gamePattern = [];
let userPattern = [];
let started = false;
let level = 0;
let score = 0;
const maxScore = 100;

const levelTitle = document.getElementById("level-title");
const scoreDisplay = document.getElementById("score");
const wrongSound = document.getElementById("wrong-sound");

// Start the game on key press or first touch
document.addEventListener("keydown", () => {
  if (!started) startGame();
});

document.addEventListener("touchstart", () => {
  if (!started) startGame();
}, { once: true });

// Handle button clicks
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function () {
    if (!started) return;
    const color = this.id;
    userPattern.push(color);
    playSound(color);
    animatePress(color);
    checkAnswer(userPattern.length - 1);
  });
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// Start game
function startGame() {
  level = 0;
  score = 0;
  gamePattern = [];
  userPattern = [];
  started = true;
  levelTitle.textContent = `Level ${level}`;
  scoreDisplay.textContent = `Score: ${score}`;
  nextSequence();
}

function nextSequence() {
  userPattern = [];
  level++;
  levelTitle.textContent = `Level ${level}`;

  const randomColor = buttonColors[Math.floor(Math.random() * buttonColors.length)];
  gamePattern.push(randomColor);
  
  // Play the full pattern
  gamePattern.forEach((color, index) => {
    setTimeout(() => {
      flashButton(color);
    }, 600 * index);
  });
}

function flashButton(color) {
  const button = document.getElementById(color);
  button.classList.add("pressed");
  playSound(color);
  setTimeout(() => button.classList.remove("pressed"), 200);
}

function animatePress(color) {
  const button = document.getElementById(color);
  button.classList.add("pressed");
  setTimeout(() => button.classList.remove("pressed"), 100);
}

function playSound(color) {
  const soundIndex = buttonColors.indexOf(color) + 1;
  const soundUrl = `https://s3.amazonaws.com/freecodecamp/simonSound${(soundIndex <= 4 ? soundIndex : 1)}.mp3`;
  new Audio(soundUrl).play();
}

function checkAnswer(currentIndex) {
  if (userPattern[currentIndex] === gamePattern[currentIndex]) {
    if (userPattern.length === gamePattern.length) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;

      if (score >= maxScore) {
        levelTitle.textContent = `🎉 You Win! Final Score: ${score}`;
        saveScore(score);
        started = false;
        return;
      }

      setTimeout(() => nextSequence(), 1000);
    }
  } else {
    wrongSound.play();
    document.body.classList.add("game-over");
    levelTitle.textContent = `Game Over! Final Score: ${score}`;
    setTimeout(() => document.body.classList.remove("game-over"), 500);
    saveScore(score);
    started = false;
  }
}

// Save high scores to localStorage
function saveScore(score) {
  let scores = JSON.parse(localStorage.getItem("simon-scores")) || [];
  scores.push(score);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5); // top 5 scores
  localStorage.setItem("simon-scores", JSON.stringify(scores));
  updateLeaderboard(scores);
}

function updateLeaderboard(scores) {
  const list = document.getElementById("score-list");
  list.innerHTML = "";
  scores.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} – ${s}`;
    list.appendChild(li);
  });
}

// On load
updateLeaderboard(JSON.parse(localStorage.getItem("simon-scores")) || []);
