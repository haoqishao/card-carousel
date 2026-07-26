/**
 * 文字卡片轮播 - 极速版
 * 卡片嗖嗖浮现 → 快速缩小消失 → 眼花缭乱
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
  const MAX_CARDS = 15;

  function showCard(data) {
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
    requestAnimationFrame(() => {
      card.style.transition = 'transform 0.1s ease-out, opacity 0.08s ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    });

    // 0.6秒后缩小消失
    setTimeout(() => {
      card.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
      card.style.transform = 'scale(0.01)';
      card.style.opacity = '0';
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 450);
    }, 600);

    while (container.children.length > MAX_CARDS) {
      const old = container.firstChild;
      if (old) container.removeChild(old);
    }
  }

  function next() {
    const data = cards[index % cards.length];
    index++;
    showCard(data);
    setTimeout(next, 150); // 0.15秒出一张
  }

  setTimeout(next, 150);
})();
