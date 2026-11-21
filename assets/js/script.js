document.addEventListener('DOMContentLoaded', function () {
  let isTerminalDone = false;
  let skipTriggered = false;
  let typingTimeout = null;

  const terminalContainer = document.getElementById('terminal');
  const terminalText = document.getElementById('terminal-text');
  const videoBackground = document.getElementById('myVideo');
  const audioBackground = document.getElementById('myAudio');
  const blurredBox = document.getElementById('blurred-box');
  const closeButton = document.getElementById('close-button');
  const skipButton = document.getElementById('skip-button');
  const links = document.querySelector('.links');

  if (links) links.classList.remove('links--visible');
  if (blurredBox) blurredBox.style.display = 'none';

  const gameBadges = document.querySelectorAll('.faceit, .premier, .valorant, .csgo');
  gameBadges.forEach(el => {
    el.style.display = 'none';
    el.style.opacity = '0';
  });

  const poemLines = [
    "…Dẫu sấm không vang dội",
    "dù mưa chẳng tuôn rơi…",
    "Chỉ cần em mong muốn",
    "thì ta sẽ chẳng rời."
  ];
  let poemLineIndex = 0;

  videoBackground.pause();
  audioBackground.pause();

  // 🧠 Gõ 4 câu thơ từng dòng cố định vị trí
  // Tạo con trỏ nhấp nháy
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '|';

  function typeWriter() {
    if (skipTriggered) { cursor.remove(); return; }
    if (poemLineIndex >= poemLines.length) {
      cursor.remove();
      isTerminalDone = true;
      setTimeout(() => {
        if (!skipTriggered) stopTerminalAndHide();
      }, 1200);
      return;
    }

    const line = poemLines[poemLineIndex];
    const targetEl = document.getElementById(`line-${poemLineIndex}`) || terminalText;
    let i = 0;

    // appendChild tự động di chuyển cursor từ dòng cũ sang dòng mới (không cần remove)
    targetEl.appendChild(cursor);

    function typeChar() {
      if (skipTriggered) { cursor.remove(); return; }
      if (i < line.length) {
        cursor.before(line.charAt(i));
        i++;
        typingTimeout = setTimeout(typeChar, 50);
      } else {
        poemLineIndex++;
        if (poemLineIndex < poemLines.length) {
          // Chuyển sang dòng tiếp theo sau delay — cursor giữ nguyên ở dòng cũ
          typingTimeout = setTimeout(typeWriter, 350);
        } else {
          cursor.remove();
          isTerminalDone = true;
          setTimeout(() => {
            if (!skipTriggered) stopTerminalAndHide();
          }, 1200);
        }
      }
    }

    typeChar();
  }

  // Khởi chạy gõ thơ
  typeWriter();

  // 🎯 Khi skip hoặc terminal kết thúc
  window.mainUILoaded = false;

  function handleInput() {
    if (window.mainUILoaded) return;
    window.mainUILoaded = true;
    skipTriggered = true;
    if (typingTimeout) clearTimeout(typingTimeout);
    removeEventListeners();

    if (skipButton) {
      skipButton.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      skipButton.style.opacity = '0';
      skipButton.style.transform = 'translateY(-4px)';
      setTimeout(() => skipButton.style.display = 'none', 350);
    }

    const introGlow = document.getElementById('intro-ambient-glow');
    if (introGlow) {
      introGlow.style.transition = 'opacity 0.6s ease';
      introGlow.style.opacity = '0';
      setTimeout(() => introGlow.style.display = 'none', 600);
    }

    const particlesBg = document.getElementById('particles-js');
    if (particlesBg) {
      particlesBg.style.transition = 'opacity 0.5s ease';
      particlesBg.style.opacity = '0';
      setTimeout(() => particlesBg.style.display = 'none', 500);
    }

    // Hiệu ứng tan biến mềm mại cho Terminal Window (scale nhẹ ra ngoài, blur và mờ dần)
    terminalContainer.style.transition = 'opacity 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.4s ease';
    terminalContainer.style.opacity = '0';
    terminalContainer.style.transform = 'translate(-50%, -50%) scale(1.03)';
    terminalContainer.style.filter = 'blur(10px)';
    terminalContainer.style.pointerEvents = 'none';

    // Đợi terminal tan biến phần lớn (220ms) mới mở giao diện chính để chuyển cảnh mượt mà, không va chạm
    setTimeout(() => {
      terminalContainer.style.display = 'none';
      showMainUI();
    }, 220);
  }

  function stopTerminalAndHide() {
    handleInput();
  }

  function showMainUI() {
    if (window.startMusicWithRandom) window.startMusicWithRandom();
    if (window.showMediaToggle) window.showMediaToggle();

    document.body.classList.add(localStorage.getItem('site-theme') || 'dark-glass');
    document.body.classList.add('allow-scroll');

    // Khởi tạo trạng thái ban đầu của blurredBox
    blurredBox.style.opacity = '0';
    blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(0.96)';
    blurredBox.style.filter = 'blur(6px)';
    blurredBox.style.display = 'block';

    // Sử dụng double requestAnimationFrame để chuyển cảnh GPU đạt 60fps/120fps mượt mà
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        blurredBox.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
        blurredBox.style.opacity = '1';
        blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(1)';
        blurredBox.style.filter = 'blur(0px)';
        blurredBox.classList.add('theme-ready');

        // Gỡ bỏ inline transition/filter sau khi hoàn tất để nhường quyền điều khiển cho tilt-effect.js
        setTimeout(() => {
          blurredBox.style.transition = '';
          blurredBox.style.transform = '';
          blurredBox.style.filter = '';
        }, 700);
      });
    });

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

  // 🕒 Đồng hồ footer (Live clocks)
  function initFooterClocks() {
    const timeHcm = document.getElementById('time-hcm');
    if (!timeHcm) return;

    function updateFooterClocks() {
      const now = new Date();

      // Ha Noi (UTC+7)
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

  // 🎯 Khi skip bằng nút "Bỏ qua"
  if (skipButton) skipButton.addEventListener('click', stopTerminalAndHide);

  function handleKeyPress(event) {
    if (event.code === 'Space' || event.code === 'Escape' || event.code === 'Enter' || isTerminalDone) {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
      }
      stopTerminalAndHide();
    }
  }
  function handleClick(e) {
    if (isTerminalDone) {
      // Don't close if clicking on minimize/maximize buttons
      if (e.target.closest('#minimize-button') || e.target.closest('#maximize-button')) {
        return;
      }
      stopTerminalAndHide();
    }
  }
  function addEventListeners() {
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
  }
  function removeEventListeners() {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeyPress);
  }

  // Register event listeners to handle terminal close on click or keypress
  addEventListeners();

  // --- OS WINDOW LOGIC (DRAG & BUTTONS) ---
  const terminalHeader = document.getElementById('terminal-header');
  let isDragging = false;
  let hasDragged = false;
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;

  if (terminalHeader) {
    terminalHeader.style.cursor = 'grab';
    terminalHeader.addEventListener('mousedown', (e) => {
      // Không kéo khi bấm vào các nút điều khiển
      if (e.target.closest('#close-button') || e.target.closest('#minimize-button') || e.target.closest('#maximize-button')) {
        return;
      }

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const rect = terminalContainer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      terminalHeader.style.cursor = 'grabbing';
      // Tắt transition ngay lập tức để chuyển động theo chuột không bị lag/giật
      terminalContainer.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);

      // Chỉ chuyển đổi từ center transform sang tọa độ pixel khi chuột thực sự di chuyển (> 2px)
      // Giúp việc click chuột thông thường hoàn toàn đứng yên, không giật dù chỉ 1 pixel
      if (!hasDragged && (dx > 2 || dy > 2)) {
        hasDragged = true;
        terminalContainer.style.left = (e.clientX - offsetX) + 'px';
        terminalContainer.style.top = (e.clientY - offsetY) + 'px';
        terminalContainer.style.transform = 'none';
        return;
      }

      if (hasDragged) {
        terminalContainer.style.left = (e.clientX - offsetX) + 'px';
        terminalContainer.style.top = (e.clientY - offsetY) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        terminalHeader.style.cursor = 'grab';
        terminalContainer.style.transition = '';
      }
    });
  }

  const maximizeBtn = document.getElementById('maximize-button');
  const minimizeBtn = document.getElementById('minimize-button');
  const closeBtn = document.getElementById('close-button');

  let isMaximized = false;
  let preMaxStyles = { left: '', top: '', width: '', height: '', transform: '' };

  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isMaximized) {
        preMaxStyles.left = terminalContainer.style.left;
        preMaxStyles.top = terminalContainer.style.top;
        preMaxStyles.width = terminalContainer.style.width;
        preMaxStyles.height = terminalContainer.style.height;
        preMaxStyles.transform = terminalContainer.style.transform;

        terminalContainer.style.transition = 'all 0.3s ease';
        terminalContainer.style.left = '0';
        terminalContainer.style.top = '0';
        terminalContainer.style.width = '100vw';
        terminalContainer.style.height = '100vh';
        terminalContainer.style.transform = 'none';
        isMaximized = true;
      } else {
        terminalContainer.style.left = preMaxStyles.left || '50%';
        terminalContainer.style.top = preMaxStyles.top || '50%';
        terminalContainer.style.width = preMaxStyles.width || '650px';
        terminalContainer.style.height = preMaxStyles.height || '450px';
        terminalContainer.style.transform = preMaxStyles.transform || 'translate(-50%, -50%)';
        isMaximized = false;
      }
      setTimeout(() => terminalContainer.style.transition = '', 300);
    });
  }

  let isMinimized = false;
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = document.getElementById('terminal-content');
      if (!isMinimized) {
        content.style.display = 'none';
        terminalContainer.style.transition = 'height 0.3s ease';
        terminalContainer.style.height = '48px';
        isMinimized = true;
      } else {
        terminalContainer.style.height = '450px';
        setTimeout(() => content.style.display = 'block', 300);
        isMinimized = false;
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopTerminalAndHide();
    });
  }



  // 📐 Căn giữa terminal ban đầu
  function centerTerminal() {
    if (isDragging || isMaximized || hasDragged) return; // Không can thiệp nếu user đã kéo hoặc phóng to
    terminalContainer.style.position = 'fixed';
    terminalContainer.style.left = '50%';
    terminalContainer.style.top = '50%';
    terminalContainer.style.transform = 'translate(-50%, -50%)';
  }
  centerTerminal();
  window.addEventListener('resize', centerTerminal);
  terminalText.style.textAlign = 'center';

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

  // ✨ particles (Tươi sáng theo theme Maomao: Xanh ngọc & Hồng hoa đào)
  function initParticles() {
    particlesJS("particles-js", {
      particles: {
        number: { value: 75, density: { enable: true, value_area: 850 } },
        color: { value: ["#ffffff", "#10b981", "#34d399", "#f472b6", "#fda4af"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.65,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.2, sync: false }
        },
        size: {
          value: 2.4,
          random: true,
          anim: { enable: true, speed: 1.2, size_min: 0.6, sync: false }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#34d399",
          opacity: 0.35,
          width: 1.2
        },
        move: {
          enable: true,
          speed: 0.85,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.7 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  if (window.particlesJS) initParticles();
  else {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.onload = initParticles;
    document.head.appendChild(script);
  }

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