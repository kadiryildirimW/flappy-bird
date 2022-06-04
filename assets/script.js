let normalizeNumber = number => parseFloat(parseFloat(number).toFixed(4)) 

const bird = document.getElementById('bird')
const birdHeight = normalizeNumber(getComputedStyle(bird).height)
const birdStyle = bird.style
const base = document.getElementById('base')
const pipes = document.getElementById('pipes')
const upPipe = document.getElementById('up-pipe')
const downPipe = document.getElementById('down-pipe')
const counter = document.getElementById('counter')
const gameContainer = document.getElementById('game-container')
const containerHeight = normalizeNumber(getComputedStyle(gameContainer).height)
const containerAvailHeight = containerHeight - normalizeNumber(getComputedStyle(base).height)
const curtain = document.getElementById('curtain')

pipes.addEventListener('animationiteration', () => {
  pipes.style.top = `${10 - Math.floor(Math.random() * 35)}%`
})

let gameEvent

let move
let speed
let birdTop
let upPipeLoc, downPipeLoc, birdLoc
let point
let acceleration = normalizeNumber(2 * containerAvailHeight / (50 * 1 * 50 * 1 * 0.8))
let baseLoc = base.getBoundingClientRect()

function fall () {
  move = 'fall'
  speed = 0
}

function rise () {
  if (move !== 'rise') {
    move = 'rise'
    speed = containerAvailHeight / 55
    setTimeout(fall ,300)
  }
}

function prepareTheGame() {
  point = 0
  bird.style.top = '50%'
  curtain.style.display = 'block'
  counter.innerHTML = `<img src="assets/sprites/0.png" alt="point">`
  bird.classList.add('bird-before-game')
  base.classList.add('base-move')
  pipes.classList.remove('pipes-move')
  gameEvent = 'prepared'
}

function startTheGame() {
  i = 0
  gameEvent = 'started'
  bird.classList.remove('bird-before-game')
  bird.classList.add('bird-wing-movement')
  pipes.classList.add('pipes-move')
  birdTop = normalizeNumber(getComputedStyle(bird).top)
}

let bestPoint
function finishTheGame () {
  gameEvent = 'finish'
  bird.classList.remove('bird-wing-movement')
  base.classList.remove('base-move')
  localStorage.setItem('last-point', point)
  bestPoint = localStorage.getItem('best-point')
  if (!bestPoint || point > bestPoint) localStorage.setItem('best-point', point)
  prepareTheGame()
}

let counterHTML = ''
let i
setInterval(() => {
  if (gameEvent === 'started') {
    if (move === 'rise') {
      speed -= acceleration
      birdTop -= speed
      if (birdTop + birdHeight / 2 < 0) birdTop = -birdHeight
      birdStyle.top = birdTop + 'px'
    }
    if (move === 'fall') {
      speed += acceleration
      birdTop += speed
      if (birdTop > containerAvailHeight - birdHeight / 2) {
        birdTop = containerAvailHeight - birdHeight / 2
      }
      birdStyle.top = birdTop + 'px'
    }
    upPipeLoc = upPipe.getBoundingClientRect() 
    downPipeLoc = downPipe.getBoundingClientRect()
    birdLoc = bird.getBoundingClientRect()
    if (birdLoc.right >= upPipeLoc.x && birdLoc.x <= upPipeLoc.right) {
      if (
        birdLoc.y <= upPipeLoc.bottom ||
        birdLoc.bottom >= downPipeLoc.y
      ) finishTheGame()
    }
    if (parseInt(baseLoc.y) <= parseInt(birdLoc.bottom)) finishTheGame()
    i++
    if (
      i === 50 ||
      (i - 50) % 100 === 0
      ) {
      counterHTML = ''
      point++
      point.toString().split('').forEach(num => {
        counterHTML += `<img src="assets/sprites/${num}.png" alt="point">`
      })
      counter.innerHTML = counterHTML
    }
  }
} ,20)

curtain.addEventListener('click', () => {
  if (gameEvent === 'started') rise()
  if (gameEvent === 'prepared') {
    startTheGame()
    rise()
  }
})

document.addEventListener('keydown', ({ code }) => {
  if (code === 'Space') {
    if (gameEvent === 'started') rise()
    if (gameEvent === 'prepared') {
      birdTop = normalizeNumber(getComputedStyle(bird).top)
      startTheGame()
      rise()
    }
  }
})

prepareTheGame()
