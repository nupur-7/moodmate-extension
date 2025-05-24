  const choices = { rock: '✊', paper: '✋', scissors: '✌️' };

  let userScore = 0;
  let computerScore = 0;
  let roundsPlayed = 0; // Add a counter for rounds played
  const totalRounds = 3; // Set total rounds to 3 for "best of 3"

  const userScoreEl = document.getElementById('user-score');
  const computerScoreEl = document.getElementById('computer-score');
  const userChoiceIcon = document.getElementById('user-choice-icon');
  const computerChoiceIcon = document.getElementById('computer-choice-icon');
  const resultMessage = document.getElementById('result-message');

  const buttons = {
    rock: document.getElementById('btn-rock'),
    paper: document.getElementById('btn-paper'),
    scissors: document.getElementById('btn-scissors'),
  };
  const resetBtn = document.getElementById('reset-btn');

  function getComputerChoice() {
    const keys = Object.keys(choices);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  function getResult(user, computer) {
    if (user === computer) return 'draw';
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) return 'win';
    return 'lose';
  }

  function playRound(userChoice) {
    const computerChoice = getComputerChoice();

    userChoiceIcon.textContent = choices[userChoice];
    computerChoiceIcon.textContent = choices[computerChoice];

    const result = getResult(userChoice, computerChoice);
     // Only increment round count for non-draw results
  if (result !== 'draw') {
    roundsPlayed++;
  }

    if (result === 'win') {
      userScore++;
      resultMessage.textContent = 'You Win! 🎉';
      resultMessage.style.color = 'green';
    } else if (result === 'lose') {
      computerScore++;
      resultMessage.textContent = 'You Lose! 😞';
      resultMessage.style.color = 'red';
    } else {
      resultMessage.textContent = "It's a Draw! 🤝";
      resultMessage.style.color = '#333';
    }

    userScoreEl.textContent = `You: ${userScore}`;
    computerScoreEl.textContent = `Computer: ${computerScore}`;

    checkChampion();
  }

  function checkChampion() {
    const target = 2; // best of 3, first to 2 wins
    if (userScore === target) {
      resultMessage.textContent = '🎉 You are the champion! 🎉';
      disableButtons(true);
    } else if (computerScore === target) {
      resultMessage.textContent = '😞 Computer is the champion!';
      disableButtons(true);
    }
    
  }

  function disableButtons(disabled) {
    Object.values(buttons).forEach(btn => btn.disabled = disabled);
  }

  Object.entries(buttons).forEach(([choice, btn]) => {
    btn.addEventListener('click', () => playRound(choice));
  });

  resetBtn.addEventListener('click', () => {
    userScore = 0;
    computerScore = 0;
    userChoiceIcon.textContent = '❓';
    computerChoiceIcon.textContent = '❓';
    resultMessage.textContent = 'Choose your weapon!';
    resultMessage.style.color = '#333';
    userScoreEl.textContent = 'You: 0';
    computerScoreEl.textContent = 'Computer: 0';
    disableButtons(false);
  });