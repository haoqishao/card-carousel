/**
 * 文字卡片轮播 - 点击开始 + 爱心锚点聚集
 * 24个锚点沿心形轮廓分布，点击开始后同步播放音乐
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

    // 爱心形状锚点：24个点沿心形轮廓分布
    function genHeart(count) {
      const pts = [];
      for (let i = 0; i < count; i++) {
        const t = (i / count) * 2 * Math.PI;
        const sx = 16 * Math.pow(Math.sin(t), 3);
        const sy = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        pts.push([50 + 2.0 * sx, 50 - 2.0 * sy]);  // 屏幕居中，翻转y使心尖朝下
      }
      return pts;
    }
    const heartAnchors = genHeart(24);
    const anchor = heartAnchors[Math.floor(Math.random() * 24)];
    const offset = ((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 14;
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

    // 6秒后缩小消失
    setTimeout(() => {
      card.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
      card.style.transform = 'scale(0.01)';
      card.style.opacity = '0';
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 550);
    }, 6000);

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

  window.startCards = function() { setTimeout(next, 300); };
})();
