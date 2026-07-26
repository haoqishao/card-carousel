/**
 * 文字卡片轮播 - 核心逻辑
 * 读取 cards.json，实现卡片随机位置从小放大浮现、旧卡片缩小消失的循环
 */

(async function () {
  // 读取卡片数据
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

  // 从 CSS 变量读取动画参数（单位：秒）
  const appearDuration  = parseFloat(style.getPropertyValue('--card-appear-duration')) || 2;
  const holdDuration    = parseFloat(style.getPropertyValue('--card-hold-duration')) || 4;
  const disappearDuration = parseFloat(style.getPropertyValue('--card-disappear-duration')) || 3;
  const minScale        = parseFloat(style.getPropertyValue('--card-min-scale')) || 0.05;

  // 卡片池：已存在的卡片列表
  let activeCards = [];
  let cardIndex = 0;
  let isRunning = true;

  /**
   * 创建并显示一张卡片
   */
  function showCard(data) {
    const card = document.createElement('div');
    card.className = 'card';

    // 随机位置（百分比，确保卡片不超出边界）
    const left = Math.random() * 60 + 5;   // 5% ~ 65%
    const top  = Math.random() * 60 + 8;   // 8% ~ 68%

    card.style.left = left + '%';
    card.style.top  = top  + '%';

    // 构建内容
    let html = '';
    if (data.emoji) {
      html += '<span class="emoji">' + data.emoji + '</span>';
    }
    html += data.text;
    if (data.signature) {
      html += '<span class="signature">' + data.signature + '</span>';
    }
    card.innerHTML = html;

    container.appendChild(card);

    // 获取渲染尺寸后设置 transform-origin 为中心
    const rect = card.getBoundingClientRect();
    const originX = rect.width / 2;
    const originY = rect.height / 2;
    card.style.transformOrigin = originX + 'px ' + originY + 'px';

    // 先强制重排，再开始动画
    card.offsetHeight;

    // === 浮现动画：极小 → 正常大小 ===
    requestAnimationFrame(() => {
      card.style.transition = 'transform ' + appearDuration + 's ease-out, opacity ' + (appearDuration * 0.6) + 's ease-out';
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';

      // 记录活跃卡片
      const cardObj = { el: card, shownAt: Date.now() };
      activeCards.push(cardObj);
    });
  }

  /**
   * 让最旧的卡片缩小消失
   */
  function disappearOldest() {
    if (activeCards.length === 0) return;

    const oldest = activeCards.shift();
    const card = oldest.el;

    // 缩小消失动画
    card.style.transition = 'transform ' + disappearDuration + 's ease-in, opacity ' + disappearDuration + 's ease-in';
    card.style.transform = 'scale(' + minScale + ')';
    card.style.opacity = '0';

    // 动画结束后移除 DOM
    setTimeout(() => {
      if (card.parentNode) {
        card.parentNode.removeChild(card);
      }
    }, disappearDuration * 1000 + 100);
  }

  /**
   * 主循环
   */
  function nextCard() {
    if (!isRunning) return;

    // 显示新卡片
    const data = cards[cardIndex % cards.length];
    cardIndex++;
    showCard(data);

    // 如果已有卡片超过阈值，让最旧的开始缩小消失
    // 策略：当第3张卡片出现后，每出现一张新卡片，就让最旧的一张缩小消失
    if (activeCards.length >= 3) {
      disappearOldest();
    }

    // 排程下一张卡片
    setTimeout(nextCard, (appearDuration + holdDuration) * 1000);
  }

  // 启动：先显示第一张
  setTimeout(() => {
    nextCard();
  }, 500);

  // 窗口横竖屏变化时重新定位（保持卡片位置不变，不做额外处理）
})();
