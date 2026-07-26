/**
 * 文字卡片轮播 - 五锚点聚集
 * 中心 + 四角区块中心，五个概率最高点，向周围递减
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

    // 五锚点高斯分布：中心(50,50) + 四角区块中心(25,25)(75,25)(25,75)(75,75)
    const anchors = [[50,50], [25,25], [75,25], [25,75], [75,75]];
    const anchor = anchors[Math.floor(Math.random() * 5)];
    const offset = ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 28;
    const left = Math.max(1, Math.min(99, anchor[0] + offset));
    const top  = Math.max(1, Math.min(99, anchor[1] + offset));

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
