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
    "Press Enter or click to continue..."
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
          addEventListeners();
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
  function handleInput() {
    const particlesBg = document.getElementById('particles-js');

    if (particlesBg) particlesBg.style.display = 'none';
    terminalContainer.style.display = 'none';

    if (window.startMusicWithRandom) window.startMusicWithRandom();
    if (window.showMediaToggle) window.showMediaToggle();

    blurredBox.style.display = 'block';
    document.body.classList.add(localStorage.getItem('site-theme') || 'dark-glass');
    document.body.classList.add('allow-scroll');
    blurredBox.classList.add('theme-ready');

    removeEventListeners();

    if (skipButton) skipButton.style.display = 'none';

    const githubLinkButton = document.getElementById('github-link-button');
    if (githubLinkButton) {
      githubLinkButton.style.display = 'block';
      setTimeout(() => {
        githubLinkButton.style.opacity = '1';
      }, 50);
    }

    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.style.display = 'inline-block';
      const marquee = scrollContainer.querySelector('marquee');
      if (marquee && typeof marquee.start === 'function') {
        marquee.stop();
        setTimeout(() => marquee.start(), 50);
      }
    }

    if (links) links.classList.add('links--visible');

    // Initialize the clocks for footer
    initFooterClocks();

    // Initialize Lenis smooth scroll after page is scrollable
    initLenis();

    // 🔔 Thông báo terminal đã xong để các module khác lắng nghe
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

  // 🎬 Khi ấn Skip
  function stopTerminal() {
    skipTriggered = true;
    if (typingTimeout) clearTimeout(typingTimeout);

    terminalContainer.style.transition = 'opacity 0.5s ease';
    terminalContainer.style.opacity = '0';
    setTimeout(() => {
      terminalContainer.style.display = 'none';
    }, 500);

    skipButton.style.transition = 'opacity 0.4s ease';
    skipButton.style.opacity = '0';
    setTimeout(() => {
      skipButton.style.display = 'none';
    }, 400);

    handleInput();
  }

  // 🎯 Gán sự kiện Skip
  if (skipButton) skipButton.addEventListener('click', stopTerminal);

  // ⌨️ Khi nhấn Enter hoặc click sau khi terminal xong
  function handleKeyPress(event) {
    if (event.key === 'Enter' && isTerminalDone) handleInput();
  }
  function handleClick() {
    if (isTerminalDone) handleInput();
  }
  function addEventListeners() {
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
  }
  function removeEventListeners() {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeyPress);
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
  const userAgent = navigator.userAgent;
  function getOperatingSystem() {
    if (userAgent.match(/Windows/)) return getWindowsVersion();
    if (userAgent.match(/Macintosh/)) return getMacOSVersion();
    if (userAgent.match(/Linux/)) return "Linux";
    if (userAgent.match(/Android/)) return getAndroidVersion();
    if (userAgent.match(/iPhone|iPad|iPod/)) return getiOSVersion();
    return "Unknown";
  }

  function getWindowsVersion() {
    const version = userAgent.match(/Windows NT ([\d.]+)/);
    if (!version) return "Windows";
    switch (version[1]) {
      case "5.1": return "Windows XP";
      case "6.0": return "Windows Vista";
      case "6.1": return "Windows 7";
      case "6.2": return "Windows 8";
      case "6.3": return "Windows 8.1";
      case "10.0": return "Windows 10";
      default: return "Windows";
    }
  }
  function getMacOSVersion() {
    const version = userAgent.match(/Mac OS X ([\d_]+)/);
    return version ? "macOS " + version[1].replace(/_/g, '.') : "macOS";
  }
  function getAndroidVersion() {
    const version = userAgent.match(/Android ([\d.]+)/);
    return version ? "Android " + version[1] : "Android";
  }
  function getiOSVersion() {
    const version = userAgent.match(/OS ([\d_]+)/);
    return version ? "iOS " + version[1].replace(/_/g, '.') : "iOS";
  }


  terminalTextContent[2] = "System: " + getOperatingSystem();

  // 📐 Căn giữa terminal
  function centerTerminal() {
    const w = terminalContainer.offsetWidth;
    const h = terminalContainer.offsetHeight;
    terminalContainer.style.position = 'absolute';
    terminalContainer.style.left = ((window.innerWidth - w) / 2) + 'px';
    terminalContainer.style.top = ((window.innerHeight - h) / 2) + 'px';
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
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } },
        modes: { repulse: { distance: 100 }, push: { particles_nb: 4 } }
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
      smoothWheel: true
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