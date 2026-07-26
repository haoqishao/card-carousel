/**
 * 文字卡片轮播 - 核心逻辑
 * 卡片随机位置从小快速浮现，新卡覆盖旧卡，不主动消失
 */

(async function () {
  let cards;
  try {
    const res = await fetch('cards.json');
    cards = await res.json();
  } catch (e) {
    console.error('卡片数据加载失败:', e);
    return;
  }

  if (!cards || cards.length === 0) return;

  const container = document.getElementById('card-container');
  const root = document.documentElement;
  const style = getComputedStyle(root);

  const appearDuration  = parseFloat(style.getPropertyValue('--card-appear-duration')) || 0.2;
  const holdDuration    = parseFloat(style.getPropertyValue('--card-hold-duration')) || 3;

  let cardIndex = 0;
  let totalCreated = 0;
  const MAX_CARDS = 30; // 最多保留30张，超出时静默移除最旧的

  function showCard(data) {
    const card = document.createElement('div');
    card.className = 'card';

    const left = Math.random() * 60 + 5;
    const top  = Math.random() * 60 + 8;

    card.style.left = left + '%';
    card.style.top  = top  + '%';

    let html = '';
    if (data.emoji) {
      html += '<span class="emoji">' + data.emoji + '</span>';
    }
    if (data.signature) {
      html += data.text + '<span class="signature">' + data.signature + '</span>';
    } else {
      html += data.text;
    }
    card.innerHTML = html;

    // 初始极小，不透明
    card.style.transform = 'scale(0.01)';
    card.style.opacity = '0';
    container.appendChild(card);

    // 触发重排后开始动画
    card.offsetHeight;
    requestAnimationFrame(() => {
      card.style.transition = 'transform ' + appearDuration + 's ease-out, opacity ' + (appearDuration * 0.8) + 's ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    });

    totalCreated++;

    // 静默清理：超过 MAX_CARDS 时移除最旧的
    while (container.children.length > MAX_CARDS) {
      const old = container.firstChild;
      if (old) container.removeChild(old);
    }
  }

  function nextCard() {
    const data = cards[cardIndex % cards.length];
    cardIndex++;
    showCard(data);
    setTimeout(nextCard, holdDuration * 1000);
  }

  setTimeout(nextCard, 500);
})();
