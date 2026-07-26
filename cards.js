/**
 * 文字卡片轮播 - 满屏版
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
  const MAX_CARDS = 60;

  function showCard(data, delay) {
    const card = document.createElement('div');
    card.className = 'card';

    // 满屏随机位置：0~85% 覆盖整个屏幕
    card.style.left = (Math.random() * 82) + '%';
    card.style.top  = (Math.random() * 82) + '%';

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
    // 一次出6张，更快填满屏幕
    for (let i = 0; i < 6; i++) {
      const data = cards[index % cards.length];
      index++;
      showCard(data, i * 40);
    }
    // 每0.4秒出一批
    setTimeout(showBatch, 400);
  }

  setTimeout(showBatch, 300);
})();
