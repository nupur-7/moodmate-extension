document.addEventListener('DOMContentLoaded', () => {
    const emojis = [
        '😀', '😃', '😄', '😁', 
        '😆', '😅', '😂', '🤣'
    ];
    const fullDeck = [...emojis, ...emojis];
    let moves = 0;
    let pairsFound = 0;
    let flippedCards = [];
    let canFlip = true;
    
    const gameBoard = document.getElementById('memory-game');
    const movesDisplay = document.getElementById('moves');
    const pairsDisplay = document.getElementById('pairs');
    const restartButton = document.getElementById('restart');
    
    //Shuffle function using Fisher-Yates algorithm
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function createCard(emoji, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        
        card.addEventListener('click', flipCard);
        
        return card;
    }
    
    function flipCard() {
        const selectedCard = this;
        
        //Prevent flipping if animations are running or same card is clicked
        if (!canFlip || selectedCard.classList.contains('flipped') || 
            selectedCard.classList.contains('matched')) {
            return;
        }
        
        //Flip the card
        selectedCard.classList.add('flipped');
        
        flippedCards.push(selectedCard);
        
        //If we have flipped 2 cards
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            canFlip = false;
            
            // Check if cards match
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                setTimeout(() => {
                    flippedCards.forEach(card => card.classList.add('matched'));
                    flippedCards = [];
                    canFlip = true;
                    pairsFound++;
                    pairsDisplay.textContent = pairsFound;
                    
                    // Check if game is won
                    if (pairsFound === emojis.length) {
                        setTimeout(() => {
                            alert(`Congratulations! You won in ${moves} moves!`);
                        }, 500);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    function initializeGame() {
        //Reset variables
        moves = 0;
        pairsFound = 0;
        flippedCards = [];
        canFlip = true;
        movesDisplay.textContent = '0';
        pairsDisplay.textContent = '0';
        
        gameBoard.innerHTML = '';
        
        //Shuffle emojis and create cards
        const shuffledDeck = shuffle(fullDeck);
        
        // Create and append cards
        shuffledDeck.forEach((emoji, index) => {
            const card = createCard(emoji, index);
            gameBoard.appendChild(card);
        });
    }
    
    //initialize game
    initializeGame();
    
    restartButton.addEventListener('click', initializeGame);
});