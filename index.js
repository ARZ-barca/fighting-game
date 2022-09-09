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
  offset: { x: 215, y: 157 },
  imageSrc: "./assets/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 160,
    height: 50,
  },
});
const enemy = new Fighter({
  position: { x: 500, y: 300 },
  velocity: { x: 0, y: 0 },
  offset: { x: 215, y: 167 },
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 6,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: { x: -170, y: 50 },
    width: 170,
    height: 50,
  },
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

  c.fillStyle = "rgba(255, 255, 255, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // enemy gets hit
  if (
    rectangularCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.frame === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to(".enemy-health", {
      width: `${enemy.health}%`,
    });
    console.log("player hit!");
  }

  // if player misses
  if (player.isAttacking && player.frame === 4) {
    player.isAttacking = false;
  }

  // player gets hit

  if (
    rectangularCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.frame === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to(".player-health", {
      width: `${player.health}%`,
    });
    console.log("enemy hit!");
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.frame === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener("keydown", function (e) {
  if (!player.dead) {
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
    // console.log(e.key);
  }
  if (!enemy.dead) {
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
