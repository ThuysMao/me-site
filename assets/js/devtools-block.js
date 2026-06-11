(function () {
  let devtoolsOpen = false;

  function handleDevtoolsDetected() {
    if (!devtoolsOpen) {
      devtoolsOpen = true;

      // Xóa toàn bộ nội dung trang web và hiển thị giao diện cảnh báo phong cách hiện đại (như Cloudflare/Vercel)
      document.body.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #0f111a; font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; overflow: hidden; }
          .bg-shapes { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; }
          .shape-1 { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(0,0,0,0) 70%); top: -150px; left: -150px; }
          .shape-2 { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 70%); bottom: -250px; right: -150px; }
          .security-card { position: relative; z-index: 1; background: rgba(20, 22, 31, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.06); padding: 40px; border-radius: 20px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5); animation: float-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
          @keyframes float-up { to { opacity: 1; transform: translateY(0); } }
          .icon-wrapper { width: 72px; height: 72px; background: rgba(239, 68, 68, 0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 24px auto; border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 0 20px rgba(239, 68, 68, 0.2) inset; }
          .icon-wrapper svg { width: 32px; height: 32px; color: #ef4444; }
          .title { color: #f8fafc; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.5px; }
          .desc { color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0; }
          .btn-reload { background: #ef4444; color: white; border: none; padding: 14px 24px; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; width: 100%; font-family: inherit; }
          .btn-reload:hover { background: #dc2626; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3); }
          .btn-reload:active { transform: translateY(0); box-shadow: none; }
        </style>
        <div class="bg-shapes">
          <div class="shape-1"></div>
          <div class="shape-2"></div>
        </div>
        <div class="security-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 class="title">Access Restricted</h1>
          <p class="desc">Developer tools and inspection shortcuts are strictly prohibited on this website for security reasons. Please close them to continue.</p>
          <button class="btn-reload" onclick="window.location.reload()">Return to Site</button>
        </div>
      `;

      // Dừng âm thanh và video nếu đang phát
      const audio = document.getElementById('myAudio');
      const video = document.getElementById('myVideo');
      if (audio) audio.pause();
      if (video) video.pause();

      // Dừng thực thi các script khác
      throw new Error("Security violation detected: Developer Tools opened.");
    }
  }

  // Phương pháp 1: Phát hiện dựa trên kích thước cửa sổ bị thu hẹp bởi DevTools
  function checkDevtoolsSize() {
    const threshold = 160;
    // Kiểm tra sự chênh lệch giữa kích thước thực của trình duyệt và kích thước hiển thị web
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;

    // Nếu có sự chênh lệch lớn, khả năng cao là DevTools đang mở (ở dạng dock)
    if (widthThreshold || heightThreshold) {
      handleDevtoolsDetected();
    }
  }

  // Phương pháp 2: Phát hiện dựa trên độ trễ của trình gỡ lỗi (debugger)
  function checkTiming() {
    const start = performance.now();

    // Khi DevTools mở, câu lệnh debugger sẽ làm script tạm dừng (nếu DevTools đang ở tab Console hoặc Sources)
    debugger;

    const end = performance.now();
    const timeTaken = end - start;

    // Nếu thời gian chạy lâu hơn bình thường (do bị debugger chặn), coi như DevTools đang mở
    if (timeTaken > 100) {
      handleDevtoolsDetected();
    }
  }

  // Chạy kiểm tra liên tục
  setInterval(checkDevtoolsSize, 1000);
  setInterval(checkTiming, 1000);
  
  // Phương pháp bổ sung: CrackStation / Advanced Anti-Debug (Infinite Debugger Loop)
  // Kỹ thuật này tự động sinh ra một breakpoint liên tục mỗi 50ms thông qua constructor.
  // Nếu kẻ tấn công cố tình vượt qua lớp bảo vệ ban đầu và mở được DevTools,
  // trình duyệt của họ sẽ liên tục bị kẹt (paused), khiến DevTools gần như bị liệt.
  function antiDebugLoop() {
    setInterval(function() {
      try {
        (function() { return false; })['constructor']('debugger')();
      } catch (err) {}
    }, 50);
  }
  antiDebugLoop();

  // Phương pháp 3: Chặn các phím tắt phổ biến để mở DevTools
  document.addEventListener('contextmenu', e => e.preventDefault()); // Chặn chuột phải (Inspect Element)
  document.addEventListener('keydown', e => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+Shift+I / Cmd+Option+I (Mở DevTools)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+Shift+J / Cmd+Option+J (Mở Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+S / Cmd+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
    // Ctrl+P / Cmd+P (Print Page)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
      e.preventDefault();
      handleDevtoolsDetected();
    }
  });

  // Tích hợp thư viện disable-devtool từ Github
  if (typeof DisableDevtool !== 'undefined') {
    DisableDevtool({
      ondevtoolopen: (type, next) => {
        handleDevtoolsDetected();
        next();
      }
    });
  }

})();
