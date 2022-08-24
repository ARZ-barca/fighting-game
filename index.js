/**@type {HTMLCanvasElement} */
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, 1024, 576);

const GRAVITY = 0.7;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastKey;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += GRAVITY;
    }
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
});
const enemy = new Sprite({
  position: { x: 500, y: 300 },
  velocity: { x: 0, y: 0 },
});

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false },
};

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
    keys.w.pressed = true;
    player.velocity.y = -20;
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
    keys.ArrowUp.pressed = true;
    enemy.velocity.y = -20;
  }
});

window.addEventListener("keyup", function (e) {
  if (e.key.toLowerCase() === "d") {
    keys.d.pressed = false;
  }
  if (e.key.toLowerCase() === "a") {
    keys.a.pressed = false;
  }
  if (e.key.toLowerCase() === "w") {
    keys.w.pressed = false;
  }
  if (e.key === "ArrowRight") {
    keys.ArrowRight.pressed = false;
  }
  if (e.key === "ArrowLeft") {
    keys.ArrowLeft.pressed = false;
  }
  if (e.key === "ArrowUp") {
    keys.w.pressed = false;
  }
});
