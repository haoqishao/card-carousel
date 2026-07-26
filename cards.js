/**
 * 文字卡片轮播 - 每次三张齐发
 */

(async function () {
  let cards;
  try {
    const res = await fetch('cards.json?' + Date.now());
    cards = await res.json();
  } catch (e) {
    return;
  }
  if (!cards || cards.length === 0) return;

  const container = document.getElementById('card-container');
  let index = 0;
  const MAX_CARDS = 30;

  function showCard(data, delay) {
    const card = document.createElement('div');
    card.className = 'card';

    card.style.left = (Math.random() * 60 + 5) + '%';
    card.style.top  = (Math.random() * 60 + 8) + '%';

    let html = '';
    if (data.emoji) html += '<span class="emoji">' + data.emoji + '</span>';
    html += data.text;
    card.innerHTML = html;

    card.style.transform = 'scale(0.01)';
    card.style.opacity = '0';
    container.appendChild(card);

    card.offsetHeight;
    setTimeout(() => {
      card.style.transition = 'transform 0.1s ease-out, opacity 0.08s ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    }, delay);

    const life = 600 + delay;
    setTimeout(() => {
      card.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      card.style.transform = 'scale(0.01)';
      card.style.opacity = '0';
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 450);
    }, life);

    while (container.children.length > MAX_CARDS) {
      const old = container.firstChild;
      if (old) container.removeChild(old);
    }
  }

  function showBatch() {
    // 一次出3张，每张间隔50ms错开
    for (let i = 0; i < 3; i++) {
      const data = cards[index % cards.length];
      index++;
      showCard(data, i * 50);
    }
    // 每0.5秒出一批
    setTimeout(showBatch, 500);
  }

  setTimeout(showBatch, 300);
})();
