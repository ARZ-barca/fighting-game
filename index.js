/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, 1024, 576);

const GRAVITY = 0.7;

const playerHealthBar = document.querySelector(".player-health");
const enemyHealthBar = document.querySelector(".enemy-health");
const timerDom = document.querySelector(".timer");
const gameOver = document.querySelector(".game-over");

const backGround = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
});
const enemy = new Fighter({
  position: { x: 500, y: 300 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
};

let timer = 60;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    timerDom.textContent = timer;
  } else {
    determineWinner({ player, enemy, timerId });
  }
}
timerId = setTimeout(decreaseTimer, 1000);

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backGround.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  enemy.velocity.x = 0;
  // enemy movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  }

  // detect for collision
  if (
    rectangularCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    enemyHealthBar.style.width = `${enemy.health}%`;
    console.log("player hit!");
  }

  if (
    rectangularCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    playerHealthBar.style.width = `${player.health}%`;
    console.log("enemy hit!");
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", function (e) {
  // console.log(e.key);
  if (e.key.toLowerCase() === "d") {
    keys.d.pressed = true;
    player.lastKey = "d";
  }
  if (e.key.toLowerCase() === "a") {
    keys.a.pressed = true;
    player.lastKey = "a";
  }
  if (e.key.toLowerCase() === "w") {
    player.velocity.y = -20;
  }
  if (e.key.toLowerCase() === " ") {
    player.attack();
  }
  if (e.key === "ArrowRight") {
    keys.ArrowRight.pressed = true;
    enemy.lastKey = "ArrowRight";
  }
  if (e.key === "ArrowLeft") {
    keys.ArrowLeft.pressed = true;
    enemy.lastKey = "ArrowLeft";
  }
  if (e.key === "ArrowUp") {
    enemy.velocity.y = -20;
  }
  if (e.key === "ArrowDown") {
    enemy.attack();
  }
});

window.addEventListener("keyup", function (e) {
  if (e.key.toLowerCase() === "d") {
    keys.d.pressed = false;
  }
  if (e.key.toLowerCase() === "a") {
    keys.a.pressed = false;
  }
  if (e.key === "ArrowRight") {
    keys.ArrowRight.pressed = false;
  }
  if (e.key === "ArrowLeft") {
    keys.ArrowLeft.pressed = false;
  }
});
