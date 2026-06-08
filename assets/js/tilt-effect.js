document.addEventListener('DOMContentLoaded', function () {
  const blurredBox = document.getElementById('blurred-box');
  if (!blurredBox) return;

  blurredBox.style.setProperty('--rotate-x', '0deg');
  blurredBox.style.setProperty('--rotate-y', '0deg');

  // ─── Manual tilt (mouse hover) ───────────────────────────────────────────

  const handleTilt = (e) => {
    const rect = blurredBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 20;
    const rotateX = (centerY - y) / 20;

    blurredBox.style.setProperty('--rotate-x', `${rotateX}deg`);
    blurredBox.style.setProperty('--rotate-y', `${rotateY}deg`);
  };

  let isHovering = false;
  let manualRafId = null;

  blurredBox.addEventListener('mouseenter', () => {
    isHovering = true;
    stopAutoTilt();   // dừng auto-tilt ngay khi hover vào
  });

  blurredBox.addEventListener('mousemove', (e) => {
    if (isHovering) handleTilt(e);
  });

  blurredBox.addEventListener('mouseleave', () => {
    isHovering = false;
    blurredBox.style.setProperty('--rotate-x', '0deg');
    blurredBox.style.setProperty('--rotate-y', '0deg');
    // Đặt lại idle timer khi rời chuột
    scheduleAutoTilt();
  });

  // ─── Auto-tilt idle animation ─────────────────────────────────────────────

  let autoRafId = null;
  let autoStartTime = null;
  let idleTimer = null;

  // Biên độ nghiêng tối đa (độ) — chỉnh ở đây nếu muốn
  const MAX_TILT = 15;

  function runAutoTilt(timestamp) {
    if (isHovering) return; // an toàn: dừng nếu đang hover

    if (!autoStartTime) autoStartTime = timestamp;
    const t = (timestamp - autoStartTime) / 1000; // giây

    // Ease-in: tăng dần trong 2 giây đầu để khởi động mượt
    const easeIn = Math.min(t / 4, 1);

    // Sine wave chậm, lệch pha → chuyển động tự nhiên, không đều
    const rotateX = MAX_TILT * easeIn * Math.sin(t * 0.12);
    const rotateY = MAX_TILT * easeIn * Math.sin(t * 0.12 + 1.2);

    blurredBox.style.setProperty('--rotate-x', `${rotateX}deg`);
    blurredBox.style.setProperty('--rotate-y', `${rotateY}deg`);

    autoRafId = requestAnimationFrame(runAutoTilt);
  }

  function startAutoTilt() {
    if (isHovering) return;
    autoStartTime = null;
    blurredBox.classList.add('auto-tilting');
    autoRafId = requestAnimationFrame(runAutoTilt);
  }

  function stopAutoTilt() {
    if (autoRafId) {
      cancelAnimationFrame(autoRafId);
      autoRafId = null;
    }
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
    blurredBox.classList.remove('auto-tilting');
    // Reset về thẳng đứng mượt mà
    blurredBox.style.setProperty('--rotate-x', '0deg');
    blurredBox.style.setProperty('--rotate-y', '0deg');
  }

  function scheduleAutoTilt() {
    if (idleTimer) clearTimeout(idleTimer);
    // 5 giây không hover → bắt đầu tự nghiêng
    idleTimer = setTimeout(() => {
      if (!isHovering) startAutoTilt();
    }, 3000);
  }

  // ─── Lắng nghe terminal kết thúc ─────────────────────────────────────────

  window.addEventListener('terminalDone', () => {
    scheduleAutoTilt();
  });
});