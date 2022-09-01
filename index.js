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

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
});
const enemy = new Sprite({
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

function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  gameOver.style.display = "block";
  if (player.health === enemy.health) {
    gameOver.textContent = "tie";
  } else if (player.health > enemy.health) {
    gameOver.textContent = "player 1 wins";
  } else if (player.health < enemy.health) {
    gameOver.textContent = "player 2 wins";
  }
}

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
