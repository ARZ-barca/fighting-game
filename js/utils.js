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
