/**
 * 文字卡片轮播 - 中心聚集
 * 越靠近屏幕中心概率越大，范围20%~80%
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

  function showCard(data) {
    const card = document.createElement('div');
    card.className = 'card';

    // 中心概率分布：越靠近中心概率越大，范围20%~80%
    // 两个随机数平均产生钟形分布，映射到20-80
    const left = ((Math.random() + Math.random()) / 2) * 60 + 20;
    const top  = ((Math.random() + Math.random()) / 2) * 60 + 20;

    card.style.left = left + '%';
    card.style.top  = top  + '%';

    let html = '';
    if (data.emoji) html += '<span class="emoji">' + data.emoji + '</span>';
    html += data.text;
    card.innerHTML = html;

    card.style.transform = 'scale(0.01)';
    card.style.opacity = '0';
    container.appendChild(card);

    card.offsetHeight;
    requestAnimationFrame(() => {
      card.style.transition = 'transform 0.15s ease-out, opacity 0.1s ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    });

    // 5秒后缩小消失
    setTimeout(() => {
      card.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
      card.style.transform = 'scale(0.01)';
      card.style.opacity = '0';
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 550);
    }, 5000);

    while (container.children.length > MAX_CARDS) {
      const old = container.firstChild;
      if (old) container.removeChild(old);
    }
  }

  function next() {
    const data = cards[index % cards.length];
    index++;
    showCard(data);
    setTimeout(next, 100);
  }

  setTimeout(next, 300);
})();
