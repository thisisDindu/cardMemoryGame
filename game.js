const cardsArray = [
    { id: 1, content: 'images/IMG_8473.JPG' },
    { id: 2, content: 'images/IMG_8479.JPG' },
    { id: 3, content: 'images/IMG_8738.JPG' },
    { id: 4, content: 'images/IMG_8739.JPG' },
    { id: 5, content: 'images/IMG_8770.JPG'  },
    { id: 6, content: 'images/IMG_8737.JPG' },
    { id: 7, content: 'images/IMG_8736.JPG' },
    { id: 8, content: 'images/carousel1.JPG' },
    { id: 9, content: 'images/carousel2.JPG' },
];
let timeLeft
let score=0
let highScore=0
let gameOver=false;
let flippedCards = [];
let matchedCards = [];
let lockBoard = false;
let pairsCount;
let cardSet;
let moves=0
let timer
let winStatus=document.querySelector("#winStatus")


const gameBoard = document.getElementById('game-board');
gameBoard.style.display="none"
const restartBtn = document.getElementById('restart-btn');

document.querySelectorAll(".difficulty button").forEach(btn=>{
    btn.addEventListener("click",()=>{
        pairsCount=btn.dataset.level
        gameBoard.style.display="grid"
        setupGame()
    })
})

function getCardsForLevel(pairsCount) {
    const selected=cardsArray.slice(0,pairsCount)
    cardSet=[...selected,...selected]
    return shuffle(cardSet)
}

function shuffle(array) {
    for (let i=array.length-1;i>0; i--) {
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]]
    }
    return array
// return array.sort(() => Math.random() - 0.5);
}

function setTimer() {
   
    winStatus.textContent=""
    clearInterval(timer);
    timeLeft = 90;
    document.getElementById('timer').textContent = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            if (matchedCards.length != cardSet.length) {
                winStatus.textContent="⏰TIME UP! YOU LOSE"
                moves=0
                document.getElementById("moves").innerHTML=moves
                lockBoard=true
            }
        }
        }, 1000);
}

function setupGame() {
    document.getElementById('timing').style.display="none"
    clearInterval(timer);
    winStatus.textContent=""
    highScore=localStorage.getItem("highScore")||0
    document.querySelector("#highScore").innerHTML=highScore
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedCards = [];
    lockBoard = false;
    moves=0
    gameOver=false
    document.getElementById("moves").innerHTML=moves
    const shuffled=getCardsForLevel(pairsCount)
    // const shuffled = shuffle([...cardsArray]);
    shuffled.forEach(cardData => {
    const card = createCard(cardData);
    gameBoard.appendChild(card);
    });
    document.getElementById("extreme").addEventListener("click",()=>{
        document.getElementById('timing').style.display="block"
        setTimer()
    })

}



function createCard(cardData) {
const card = document.createElement('div');
card.classList.add('card');
card.dataset.id = cardData.id;

card.innerHTML = `
<div class="card-inner">
<div class="card-back"></div>
<div class="card-front">
<img src="${cardData.content}" alt="cardimage">
</div>
</div>
`;
card.addEventListener('click', () =>{
    handleCardClick(card)
    if (gameOver==false) {
        moves++
    }
    document.getElementById("moves").innerHTML=moves
});
return card;
}


function handleCardClick(card) {
if (lockBoard || flippedCards.includes(card) || matchedCards.includes(card)) return;

card.classList.add('flipped');
flippedCards.push(card);

if (flippedCards.length === 2) {
    lockBoard = true;
    const [card1, card2] = flippedCards;

    if (card1.dataset.id === card2.dataset.id) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        lockBoard = false;

        if (matchedCards.length === cardSet.length) {
            clearInterval(timer);
            gameOver=true
            setTimeout(() => {
                // alert('You win! 🎉')
                winStatus.textContent="YOU WIN"
                score++
                document.querySelector("#score").innerHTML=score
                if (score>highScore) {
                    highScore=score
                    document.querySelector("#highScore").innerHTML=highScore
                    localStorage.setItem("highScore",highScore)
                }
            }, 300);
        }
    }else {
        setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        lockBoard = false;
        }, 1000);
    }
}
}



restartBtn.addEventListener('click', ()=>{
    clearInterval(timer);
    document.getElementById('timing').style.display="none"
    setupGame()
});
setupGame();
