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

  const terminalTextContent = [
    "[BOOT] Initializing...",
    "[BOOT] Loading profile core...",
    "IP: Loading...",
    "[SYNC] Connecting Discord presence...",
    "[SYNC] Loading media engine...",
    "[OK] All systems online.",
    "System ready. Drag me around or click Red [X] to close."
  ];
  let currentIndex = 0;

  videoBackground.pause();
  audioBackground.pause();

  // 🧠 Gõ text từng dòng
  function typeWriter() {
    if (skipTriggered) return;
    const line = currentIndex === 0 ? getAsciiArt() : terminalTextContent[currentIndex - 1];
    let i = 0;

    function typeChar() {
      if (skipTriggered) return;
      if (i < line.length) {
        terminalText.textContent += line.charAt(i);
        i++;
        const speed =
          line.startsWith("[BOOT]") || line.startsWith("[SYNC]") || line.startsWith("[OK]")
            ? 22
            : line.startsWith("user@")
              ? 38
              : 28;

        typingTimeout = setTimeout(typeChar, speed);
      } else {
        terminalText.textContent += "\n";
        currentIndex++;
        if (currentIndex < terminalTextContent.length + 1) {
          typeWriter();
        } else {
          isTerminalDone = true;
          handleInput(); // Auto load UI when boot completes, but keep terminal
        }
      }
    }

    typeChar();
  }

  //  const kills = [
  //  ["GB0-7", ["./assets/pfp/deagle.png", "./assets/pfp/awp.png", "./assets/pfp/g3sg1.png", "./assets/pfp/r8.png", "./assets/pfp/ak47.png", "./assets/pfp/ssg08.png"], "s1mple", ["./assets/pfp/headshot.png", "./assets/pfp/wallbang.png"]],
  //  ["GB0-7", ["./assets/pfp/deagle.png", "./assets/pfp/awp.png", "./assets/pfp/g3sg1.png", "./assets/pfp/r8.png", "./assets/pfp/ak47.png", "./assets/pfp/ssg08.png"], "Valve Corporation", ["./assets/pfp/headshot.png", "./assets/pfp/wallbang.png"]],
  //  ["GB0-7", ["./assets/pfp/deagle.png", "./assets/pfp/awp.png", "./assets/pfp/g3sg1.png", "./assets/pfp/r8.png", "./assets/pfp/ak47.png", "./assets/pfp/ssg08.png"], "Gabe Newell", ["./assets/pfp/headshot.png", "./assets/pfp/wallbang.png"]],
  //  ["GB0-7", ["./assets/pfp/deagle.png", "./assets/pfp/awp.png", "./assets/pfp/g3sg1.png", "./assets/pfp/r8.png", "./assets/pfp/ak47.png", "./assets/pfp/ssg08.png"], "Bot T", ["./assets/pfp/headshot.png", "./assets/pfp/wallbang.png"]],
  //  ["GB0-7", ["./assets/pfp/deagle.png", "./assets/pfp/awp.png", "./assets/pfp/g3sg1.png", "./assets/pfp/r8.png", "./assets/pfp/ak47.png", "./assets/pfp/ssg08.png"], "VACNET 3.0", ["./assets/pfp/headshot.png", "./assets/pfp/wallbang.png"]]
  //];

  // function addKillFeed(tPlayer, weaponSrc, ctPlayer, extras = []) {
  //  const killFeed = document.getElementById("kill-feed");
  //  const div = document.createElement("div");
  //  div.className = "kill-item";
  //  div.innerHTML = `
  //    <span class="player t kill-section">
  //      <img src="./assets/pfp/faceit.png" alt="faceit" width="28" style="margin-right: 4px; vertical-align: middle;">
  //      ${tPlayer}
  //    </span>
  //  `;
  // killFeed.appendChild(div);
  // setTimeout(() => div.remove(), 3000);
  //}

  // 🎯 Khi skip hoặc terminal kết thúc
  window.mainUILoaded = false;

  function handleInput() {
    if (window.mainUILoaded) return;
    window.mainUILoaded = true;

    if (skipButton) {
      skipButton.style.transition = 'opacity 0.4s ease';
      skipButton.style.opacity = '0';
      setTimeout(() => skipButton.style.display = 'none', 400);
    }

    const particlesBg = document.getElementById('particles-js');
    if (particlesBg) {
      particlesBg.style.transition = 'opacity 0.5s ease';
      particlesBg.style.opacity = '0';
      setTimeout(() => particlesBg.style.display = 'none', 500);
    }

    hideTerminal();
    removeEventListeners();
    showMainUI();
  }

  function hideTerminal() {
    terminalContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    terminalContainer.style.opacity = '0';
    terminalContainer.style.transform = 'scale(0.9)';
    setTimeout(() => terminalContainer.style.display = 'none', 400);
  }

  function stopTerminalAndHide() {
    skipTriggered = true;
    if (typingTimeout) clearTimeout(typingTimeout);
    hideTerminal();
    handleInput();
  }

  function showMainUI() {
    if (window.startMusicWithRandom) window.startMusicWithRandom();
    if (window.showMediaToggle) window.showMediaToggle();

    document.body.classList.add(localStorage.getItem('site-theme') || 'dark-glass');
    document.body.classList.add('allow-scroll');

    // Fade in mượt mà cho blurredBox
    blurredBox.style.opacity = '0';
    blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(0.95)';
    blurredBox.style.display = 'block';
    
    // Force reflow
    void blurredBox.offsetWidth;

    blurredBox.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    blurredBox.style.opacity = '1';
    blurredBox.style.transform = 'translate(-50%, -50%) perspective(1000px) scale(1)';
    blurredBox.classList.add('theme-ready');

    // Remove inline transform and transition after animation completes
    // so it doesn't conflict with tilt-effect.js
    setTimeout(() => {
      blurredBox.style.transition = '';
      blurredBox.style.transform = '';
    }, 800);

    const githubLinkButton = document.getElementById('github-link-button');
    if (githubLinkButton) {
      githubLinkButton.style.opacity = '0';
      githubLinkButton.style.display = 'block';
      setTimeout(() => {
        githubLinkButton.style.transition = 'opacity 1s ease';
        githubLinkButton.style.opacity = '1';
      }, 200);
    }

    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.style.opacity = '0';
      scrollContainer.style.display = 'inline-block';
      setTimeout(() => {
        scrollContainer.style.transition = 'opacity 1s ease';
        scrollContainer.style.opacity = '1';
        const marquee = scrollContainer.querySelector('marquee');
        if (marquee && typeof marquee.start === 'function') {
          marquee.stop();
          setTimeout(() => marquee.start(), 50);
        }
      }, 200);
    }

    if (links) {
      links.style.opacity = '0';
      links.classList.add('links--visible');
      setTimeout(() => {
        links.style.transition = 'opacity 1s ease';
        links.style.opacity = '1';
      }, 200);
    }

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
    if (event.key === 'Enter' && isTerminalDone) stopTerminalAndHide();
  }
  function handleClick(e) {
    // Chỉ click ra ngoài terminal mới ẩn, để chừa cho tương tác cửa sổ
    if (isTerminalDone && !terminalContainer.contains(e.target)) {
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

  // --- OS WINDOW LOGIC (DRAG & BUTTONS) ---
  const terminalHeader = document.getElementById('terminal-header');
  let isDragging = false;
  let offsetX, offsetY;

  if (terminalHeader) {
    terminalHeader.style.cursor = 'grab';
    terminalHeader.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = terminalContainer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      terminalHeader.style.cursor = 'grabbing';
      
      // Hủy center bằng transform để drag mượt
      if (!terminalContainer.style.transform || terminalContainer.style.transform !== 'none') {
        terminalContainer.style.left = rect.left + 'px';
        terminalContainer.style.top = rect.top + 'px';
        terminalContainer.style.transform = 'none';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      terminalContainer.style.left = (e.clientX - offsetX) + 'px';
      terminalContainer.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        terminalHeader.style.cursor = 'grab';
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

  // 🧩 Lấy IP
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      terminalTextContent[1] = "IP: " + data.ip;
      typeWriter();
    })
    .catch(() => {
      terminalTextContent[1] = "IP: Unable to fetch IP address";
      typeWriter();
    });

  // 🖥️ Hệ điều hành
  async function detectOS() {
    let osName = "Unknown OS";
    
    // Sử dụng Client Hints API (giúp phân biệt Win 10 và Win 11 chính xác)
    if (navigator.userAgentData) {
      try {
        const ua = await navigator.userAgentData.getHighEntropyValues(["platform", "platformVersion"]);
        if (ua.platform === "Windows") {
          const majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0], 10);
          if (majorPlatformVersion >= 13) {
            return "Windows 11";
          } else if (majorPlatformVersion > 0) {
            return "Windows 10";
          }
          return "Windows";
        } else if (ua.platform === "macOS") {
          return "macOS";
        } else if (ua.platform) {
          return ua.platform;
        }
      } catch (e) {
        console.error("userAgentData error:", e);
      }
    }
    
    // Fallback cho trình duyệt không hỗ trợ userAgentData (Safari, Firefox)
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Mac") !== -1) {
      const version = userAgent.match(/Mac OS X ([\d_]+)/);
      return version ? "macOS " + version[1].replace(/_/g, '.') : "macOS";
    } else if (userAgent.indexOf("Win") !== -1) {
      const version = userAgent.match(/Windows NT ([\d.]+)/);
      if (version) {
        if (version[1] === "10.0") return "Windows 10/11"; 
        if (version[1] === "6.3") return "Windows 8.1";
        if (version[1] === "6.2") return "Windows 8";
        if (version[1] === "6.1") return "Windows 7";
      }
      return "Windows";
    } else if (userAgent.indexOf("Linux") !== -1) {
      if (userAgent.indexOf("Android") !== -1) {
        const version = userAgent.match(/Android ([\d.]+)/);
        return version ? "Android " + version[1] : "Android";
      }
      return "Linux";
    } else if (userAgent.indexOf("iPhone") !== -1 || userAgent.indexOf("iPad") !== -1) {
      const version = userAgent.match(/OS ([\d_]+)/);
      return version ? "iOS " + version[1].replace(/_/g, '.') : "iOS";
    }
    
    return osName;
  }

  terminalTextContent[2] = "System: Detecting...";
  detectOS().then(os => {
    terminalTextContent[2] = "System: " + os;
  });

  // 📐 Căn giữa terminal ban đầu
  function centerTerminal() {
    if (isDragging || isMaximized) return; // Không can thiệp nếu user đã kéo hoặc phóng to
    terminalContainer.style.position = 'absolute';
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
          LOADING...      
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

  // ✨ particles
  function initParticles() {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 1000 } },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.7, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.3, sync: false } },
        size: { value: 4, random: true, anim: { enable: true, speed: 1, size_min: 1.5, sync: false } },
        line_linked: { enable: true, distance: 140, color: "#ffffff", opacity: 0.35, width: 1.5 },
        move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } }, push: { particles_nb: 3 } }
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
    const elements = document.querySelectorAll('.faceit, .valorant, .csgo, #scroll-container, #media-toggle-buttons');
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