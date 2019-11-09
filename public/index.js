window.onload = () => {
  const gameSpeedElement = document.getElementById('game-speed');
  const dropValue = document.getElementById('drop-value');
  const initialVal = document.getElementById('game-speed').value;

  dropValue.innerHTML = initialVal;

  dropValue.addEventListener('speed-update', (e) => {
    console.log('receiving event');
    dropValue.innerHTML = e.detail.value;
  });

  gameSpeedElement.oninput = () => {
    console.log('firing event');
    gameSpeedElement.dispatchEvent(new CustomEvent('speed-update', {
      bubbles: true,
      detail: { speed: gameSpeedElement.value }
    }));
  };
};