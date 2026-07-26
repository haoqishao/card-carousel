/**
 * 文字卡片轮播
 * 卡片快速浮现 → 1秒后变小消失 → 新卡不断快速出现
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
  const MAX_CARDS = 20;

  function showCard(data) {
    const card = document.createElement('div');
    card.className = 'card';

    // 随机位置
    card.style.left = (Math.random() * 60 + 5) + '%';
    card.style.top  = (Math.random() * 60 + 8) + '%';

    // 内容
    let html = '';
    if (data.emoji) html += '<span class="emoji">' + data.emoji + '</span>';
    html += data.text;
    card.innerHTML = html;

    // 初始状态：极小不可见
    card.style.transform = 'scale(0.01)';
    card.style.opacity = '0';
    container.appendChild(card);

    // 强制重排后开始浮现动画
    card.offsetHeight;
    requestAnimationFrame(() => {
      card.style.transition = 'transform 0.2s ease-out, opacity 0.15s ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    });

    // 1秒后开始缩小消失
    setTimeout(() => {
      card.style.transition = 'transform 0.8s ease-in, opacity 0.8s ease-in';
      card.style.transform = 'scale(0.01)';
      card.style.opacity = '0';
      // 动画结束后移除 DOM
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 850);
    }, 1000);

    // 清理过旧卡片（防止内存堆积）
    while (container.children.length > MAX_CARDS) {
      const old = container.firstChild;
      if (old) container.removeChild(old);
    }
  }

  function next() {
    const data = cards[index % cards.length];
    index++;
    showCard(data);
    setTimeout(next, 300); // 每0.3秒出一张
  }

  setTimeout(next, 300);
})();
