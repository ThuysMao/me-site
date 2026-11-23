document.addEventListener('DOMContentLoaded', function () {
  const introEl = document.getElementById('shinkai-intro');
  const skipBtn = document.getElementById('skip-button');
  const blurredBox = document.getElementById('blurred-box');
  const videoBackground = document.getElementById('myVideo');
  const audioBackground = document.getElementById('myAudio');
  const links = document.querySelector('.links');
  let introDone = false;
  let timers = [];

  if (links) links.classList.remove('links--visible');
  if (blurredBox) blurredBox.style.display = 'none';

  const gameBadges = document.querySelectorAll('.faceit, .premier, .valorant, .csgo');
  gameBadges.forEach(el => {
    el.style.display = 'none';
    el.style.opacity = '0';
  });

  if (videoBackground) videoBackground.pause();
  if (audioBackground) audioBackground.pause();

  // 1. 🌧️ Shinkai Rain Canvas Simulation
  const canvas = document.getElementById('shinkai-rain');
  let rainAnimId = null;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drops = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 90; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 18 + 12,
        xs: -1.2 + Math.random() * -0.5,
        ys: 6 + Math.random() * 5,
        a: Math.random() * 0.28 + 0.1
      });
    }

    function drawRain() {
      if (introDone) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.4)';

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.l * d.xs, d.y + d.l);
        ctx.stroke();

        d.x += d.xs;
        d.y += d.ys;
        if (d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      }
      rainAnimId = requestAnimationFrame(drawRain);
    }
    drawRain();
  }

  // 2. 🎬 Cinematic Line Reveal Sequence
  function playCinematicIntro() {
    introDone = false;
    if (introEl) introEl.classList.remove('done');

    ['s-badge', 'sl-0', 'sl-1', 'sl-2', 'sl-3', 's-author'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('revealed', 'visible');
    });

    timers.push(setTimeout(() => document.getElementById('s-badge')?.classList.add('visible'), 300));
    timers.push(setTimeout(() => document.getElementById('sl-0')?.classList.add('revealed'), 900));
    timers.push(setTimeout(() => document.getElementById('sl-1')?.classList.add('revealed'), 1900));
    timers.push(setTimeout(() => document.getElementById('sl-2')?.classList.add('revealed'), 2900));
    timers.push(setTimeout(() => document.getElementById('sl-3')?.classList.add('revealed'), 3900));
    timers.push(setTimeout(() => document.getElementById('s-author')?.classList.add('visible'), 4700));

    // Không tự động kết thúc: người dùng bắt buộc click chuột hoặc nhấn phím Space để vào
  }

  // 3. 💧 Finish & Transition to Main Site (Realistic Water Ripple & Glass Awaken)
  function finishIntro(originX, originY) {
    if (introDone) return;
    introDone = true;
    timers.forEach(t => clearTimeout(t));

    const posX = typeof originX === 'number' ? originX : window.innerWidth / 2;
    const posY = typeof originY === 'number' ? originY : window.innerHeight / 2;

    if (introEl) {
      // Primary shockwave ring (Vòng gờ sóng chính)
      const wave1 = document.createElement('div');
      wave1.classList.add('soundwave-ring');
      wave1.style.left = posX + 'px';
      wave1.style.top = posY + 'px';
      introEl.appendChild(wave1);

      // Secondary harmonic ring (Gợn sóng thứ 2 sau 140ms)
      setTimeout(() => {
        const wave2 = document.createElement('div');
        wave2.classList.add('soundwave-ring', 'harmonic');
        wave2.style.left = posX + 'px';
        wave2.style.top = posY + 'px';
        introEl.appendChild(wave2);
      }, 140);

      // Tertiary echo ring (Gợn sóng phụ thứ 3 sau 280ms)
      setTimeout(() => {
        const wave3 = document.createElement('div');
        wave3.classList.add('soundwave-ring', 'echo');
        wave3.style.left = posX + 'px';
        wave3.style.top = posY + 'px';
        introEl.appendChild(wave3);
      }, 280);
    }

    // Poem lines scatter outward as wave expands
    const lines = document.querySelectorAll('.s-line');
    lines.forEach((l, idx) => {
      setTimeout(() => l?.classList.add('soundwave-disperse'), idx * 60);
    });

    // Fade out skip button
    if (skipBtn) {
      skipBtn.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      skipBtn.style.opacity = '0';
      skipBtn.style.transform = 'translateY(-4px)';
      setTimeout(() => skipBtn.style.display = 'none', 400);
    }

    // Immediately trigger smooth cinema curtain opening and intro fade-out (180ms delay)
    setTimeout(() => {
      if (introEl) introEl.classList.add('done');
      revealMainSite();
    }, 180);

    // After animation finishes, stop rain animation and unmount intro container from GPU
    setTimeout(() => {
      if (rainAnimId) cancelAnimationFrame(rainAnimId);
      if (introEl) introEl.style.display = 'none';
    }, 1600);
  }

  function revealMainSite() {
    if (window.startMusicWithRandom) window.startMusicWithRandom();
    if (window.showMediaToggle) window.showMediaToggle();

    document.body.classList.add(localStorage.getItem('site-theme') || 'dark-glass', 'allow-scroll');

    // Smooth GPU emergence of Blurred Box Profile with Glass Awaken pulse
    if (blurredBox) {
      blurredBox.style.opacity = '0';
      blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(0.95)';
      blurredBox.style.display = 'block';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          blurredBox.classList.add('glass-awaken-pulse');
          blurredBox.style.transition = 'opacity 1.35s cubic-bezier(0.12, 0.8, 0.25, 1), transform 1.35s cubic-bezier(0.12, 0.8, 0.25, 1)';
          blurredBox.style.opacity = '1';
          blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(1)';
          blurredBox.classList.add('theme-ready');

          setTimeout(() => {
            blurredBox.classList.remove('glass-awaken-pulse');
            blurredBox.style.transition = '';
            blurredBox.style.transform = '';
          }, 1450);
        });
      });
    }

    const githubLinkButton = document.getElementById('github-link-button');
    if (githubLinkButton) {
      githubLinkButton.style.opacity = '0';
      githubLinkButton.style.display = 'block';
      setTimeout(() => {
        githubLinkButton.style.transition = 'opacity 0.8s ease';
        githubLinkButton.style.opacity = '1';
      }, 150);
    }

    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.style.opacity = '0';
      scrollContainer.style.display = 'inline-block';
      setTimeout(() => {
        scrollContainer.style.transition = 'opacity 0.8s ease';
        scrollContainer.style.opacity = '1';
        const marquee = scrollContainer.querySelector('marquee');
        if (marquee && typeof marquee.start === 'function') {
          marquee.stop();
          setTimeout(() => marquee.start(), 50);
        }
      }, 150);
    }

    if (links) {
      links.style.opacity = '0';
      links.classList.add('links--visible');
      setTimeout(() => {
        links.style.transition = 'opacity 0.8s ease';
        links.style.opacity = '1';
      }, 150);
    }

    gameBadges.forEach(badge => {
      badge.style.opacity = '0';
      badge.style.display = 'flex';
      setTimeout(() => {
        badge.style.transition = 'opacity 0.8s ease, transform 0.4s ease';
        badge.style.opacity = '1';
      }, 150);
    });

    initFooterClocks();
    initLenis();
    window.dispatchEvent(new CustomEvent('terminalDone'));
  }

  // 🕒 Live footer clocks
  function initFooterClocks() {
    const timeHcm = document.getElementById('time-hcm');
    if (!timeHcm) return;

    function updateFooterClocks() {
      const now = new Date();
      try {
        timeHcm.textContent = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch (e) {
        console.error("Error setting Ha Noi time:", e);
      }
    }

    updateFooterClocks();
    setInterval(updateFooterClocks, 1000);
  }

  // 🎮 Event Listeners for Skip / Awaken (Passing coordinate for natural ripples)
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      finishIntro(e.clientX, e.clientY);
    });
  }

  if (introEl) {
    introEl.addEventListener('click', (e) => {
      if (!e.target.closest('#skip-button')) {
        finishIntro(e.clientX, e.clientY);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
      e.preventDefault();
      finishIntro(window.innerWidth / 2, window.innerHeight / 2);
    }
  });

  // Start sequence
  playCinematicIntro();

  // 🎨 ASCII
  function getAsciiArt() {
    return `
           
  `;
  }

  // 🔊 Giới hạn âm lượng
  const audio = document.getElementById("myAudio");
  function limitVolume(volume) {
    audio.volume = Math.min(volume, 1);
  }
  limitVolume(1);


  // 🕒 Đồng hồ
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    document.getElementById('clock-date').textContent = `${time} | ${date}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 🚫 Chặn kéo thả hình ảnh
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  // 📜 Hiệu ứng fade mượt khi cuộn trang
  window.addEventListener('scroll', function () {
    const elements = document.querySelectorAll('.faceit, .premier, .valorant, .csgo, #scroll-container, #media-toggle-buttons');
    if (window.scrollY > 50) {
      elements.forEach(el => el.classList.add('scrolled-out'));
    } else {
      elements.forEach(el => el.classList.remove('scrolled-out'));
    }
  });

  // 🖱️ Lenis Smooth Scroll (khởi tạo sau khi terminal xong)
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true,
      normalizeWheel: true
    });

    const dotScrollbar = document.querySelector('.dot-scrollbar');
    const scrollbarDot = document.querySelector('.scrollbar-dot');
    let scrollTimeout;

    // Hiển thị scrollbar ngay khi terminal kết thúc
    if (dotScrollbar) {
      dotScrollbar.classList.add('is-scrolling');
      scrollTimeout = setTimeout(() => {
        dotScrollbar.classList.remove('is-scrolling');
      }, 1500);
    }

    lenis.on('scroll', (e) => {
      if (dotScrollbar && scrollbarDot) {
        dotScrollbar.classList.add('is-scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          dotScrollbar.classList.remove('is-scrolling');
        }, 1000);

        const maxScroll = e.limit;
        const currentScroll = e.scroll;
        const percentage = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
        scrollbarDot.style.top = `${percentage}%`;
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 🌙 Footer Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const siteFooter = document.querySelector('.site-footer');

  if (themeToggleBtn && siteFooter) {
    const savedTheme = localStorage.getItem('footer-theme');
    if (savedTheme === 'dark') {
      siteFooter.classList.add('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
      siteFooter.classList.toggle('dark-theme');
      const isDark = siteFooter.classList.contains('dark-theme');

      if (isDark) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('footer-theme', 'dark');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('footer-theme', 'light');
      }
    });
  }

});