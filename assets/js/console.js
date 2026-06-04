document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();

  const css = getComputedStyle(document.documentElement);

  const theme = {
    cyan: css.getPropertyValue("--mc-cyan").trim() || "#00ffe1",
    green: css.getPropertyValue("--mc-green").trim() || "#00ff88",
    red: css.getPropertyValue("--mc-red").trim() || "#ff3b3b",
    orange: css.getPropertyValue("--mc-orange").trim() || "#ff9900",
    pink: css.getPropertyValue("--mc-pink").trim() || "#ff66cc",
    blue: css.getPropertyValue("--mc-blue").trim() || "#00bfff",
    white: css.getPropertyValue("--mc-white").trim() || "#ffffff",
    gray: css.getPropertyValue("--mc-gray").trim() || "#444444",
    discord: css.getPropertyValue("--mc-discord").trim() || "#7289da"
  };

  const line = "════════════════════════════════════════════════════════════";
  const thin = "────────────────────────────────────────────────────────────";

  console.clear();

  console.log(
    "%c████ THUYSMAO ████",
    `
    color:${theme.cyan};
    font-size:30px;
    font-weight:bold;
    letter-spacing:2px;
    text-shadow:0 0 12px ${theme.cyan};
    `
  );

  console.log(`%c${line}`, `color:${theme.gray};`);
  console.log(
    `%c⏰ LOADED AT %c${now.toLocaleString()}`,
    `color:${theme.orange};font-weight:bold;font-size:14px;`,
    `color:${theme.white};font-size:14px;`
  );
  console.log(`%c${thin}`, `color:${theme.gray};`);

  console.log(
    "%c🚨 SECURITY WARNING",
    `
      background:${theme.red};
      color:#fff;
      font-size:18px;
      font-weight:bold;
      padding:6px 12px;
    `
  );
  console.log("%cDevTools này dành cho developer.", `color:${theme.red};font-size:14px;`);
  console.log("%cKhông dán code lạ vào đây.", `color:${theme.orange};font-size:14px;font-weight:bold;`);

  console.log(`%c${thin}`, `color:${theme.gray};`);

  console.log(
    "%c⚡ AVAILABLE COMMANDS",
    `color:${theme.blue};font-size:18px;font-weight:bold;`
  );
  console.log("%chelp()      %c- Show commands", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%cabout()     %c- About this site", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%cwhoami()    %c- Show who I am", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%csocials()   %c- Social links", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%cstatus()    %c- Current profile status", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%ctheme()     %c- Show active theme", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log("%cclear()     %c- Clear console", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);
  console.log(
    "%c⚡ FUNNY COMMANDS",
    `color:${theme.blue};font-size:18px;font-weight:bold;`
  );
  console.log("%cmatrix()    %c- Matrix mode", `color:${theme.cyan};font-weight:bold;`, `color:${theme.white};`);

  console.log(`%c${line}`, `color:${theme.gray};`);
  console.log(
    "%c🐱 Powered by ThuysMão",
    `
      color:${theme.pink};
      font-size:16px;
      font-style:italic;
      text-shadow:0 0 6px ${theme.pink};
    `
  );

  window.help = () => {
    console.log(
      "%c📘 COMMAND LIST",
      `color:${theme.cyan};font-size:20px;font-weight:bold;`
    );

    console.table([
      { command: "help()", description: "Show all commands" },
      { command: "about()", description: "About this site" },
      { command: "socials()", description: "Show socials" },
      { command: "status()", description: "System status" },
      { command: "theme()", description: "Show active theme" },
      { command: "discord()", description: "Live Discord status" },
      { command: "stats()", description: "Website live stats" },
      { command: "matrix()", description: "Matrix effect" },
      { command: "clear()", description: "Clear console" }
    ]);
  };

  window.about = () => {
    console.log("%c🌐 THUYSMÃO PROFILE WEBSITE", `color:${theme.green};font-size:18px;font-weight:bold;`);
    console.log("%cFrontend • Effects • Discord Presence • Interactive UI", `color:${theme.white};font-size:14px;`);
  };

  window.socials = () => {
    console.log("%c💬 Discord: niang1_", `color:${theme.discord};font-size:18px;`);
    console.log("%c💬 DISCORD STATUS", "color:#7289da;font-size:14px;font-weight:bold;");
    console.log("%cUser: niang1_", "color:white;");
    console.log("%cPresence: online", "color:#00ff88;");
    console.log("%c🐙 GitHub: github.com/diy2kar4", `color:${theme.white};font-size:14px;`);
  };

  window.status = () => {
    const video = document.getElementById("myVideo");
    const audio = document.getElementById("myAudio");

    const videoStatus =
      video && !video.paused ? "Playing" : "Paused";

    const audioStatus =
      audio && !audio.paused ? "Playing" : "Paused";

    const terminalOpen =
      !document
        .getElementById("terminal-overlay")
        ?.classList.contains("hidden");

    console.log(
      "%c🟢 SYSTEM STATUS",
      `color:${theme.green};font-size:18px;font-weight:bold;`
    );

    console.table([
      { item: "Console", value: "Online" },
      { item: "Video", value: videoStatus },
      { item: "Audio", value: audioStatus },
      { item: "Terminal", value: terminalOpen ? "Open" : "Closed" },
      { item: "Username Animation", value: "Running" }
    ]);
  };

  window.theme = () => {
    const activeTheme =
      localStorage.getItem("site-theme") ||
      [...document.body.classList].find(cls =>
        ["cyber-neon", "pink-anime", "dark-glass", "red-alert"].includes(cls)
      ) ||
      "cyber-neon";

    console.log(
      "%c🎨 ACTIVE THEME",
      `color:${theme.pink};font-size:18px;font-weight:bold;`
    );

    console.log(`%cTheme: ${activeTheme}`, "color:white;");

    console.table(theme);
  };

  window.clear = () => {
    console.clear();
    console.log("%cConsole was cleared", `color:${theme.green};font-size:16px;font-weight:bold;`);
  };
});

window.whoami = () => {
  console.log("%c👤 WHOAMI", "color:#00ffe1;font-size:18px;font-weight:bold;");
  console.log("%cThuysMão / Maomao / Niang1_", "color:white;font-size:14px;");
  console.log("%cFrontend lover • Effects • Presence system", "color:#00ff88;");
};

window.matrix = () => {
  const chars =
    "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@";

  const rows = 14;          // số dòng mỗi frame
  const cols = 48;          // độ dài mỗi dòng
  const duration = 30000;   // 30 giây
  const speed = 140;        // ms / frame

  console.clear();

  console.log(
    "%c🟢 MATRIX MODE STARTED",
    `
    color:#00ff88;
    font-size:20px;
    font-weight:bold;
    text-shadow:0 0 8px #00ff88;
    `
  );

  const start = Date.now();

  const interval = setInterval(() => {
    // tạo nhiều dòng matrix
    for (let i = 0; i < rows; i++) {
      let line = "";

      for (let j = 0; j < cols; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }

      console.log(
        "%c" + line,
        `
        color:#00ff00;
        font-family:monospace;
        font-size:12px;
        text-shadow:0 0 4px #00ff00;
        `
      );
    }

    console.log(
      "%c────────────────────────────────────────────",
      "color:#111;"
    );

    // hết 30 giây thì dừng
    if (Date.now() - start >= duration) {
      clearInterval(interval);

      console.log(
        "%c🟢 MATRIX MODE ENDED",
        `
        color:#00ff88;
        font-size:18px;
        font-weight:bold;
        text-shadow:0 0 8px #00ff88;
        `
      );
    }
  }, speed);
};

window.discord = () => {
  const username =
    document.getElementById("discord-username")?.textContent?.trim() ||
    "niang1_";

  let status = "offline";

  const dot = document.getElementById("discord-status-dot");

  if (dot?.classList.contains("status-online")) status = "online";
  else if (dot?.classList.contains("status-idle")) status = "idle";
  else if (dot?.classList.contains("status-dnd")) status = "dnd";

  const name =
    document.getElementById("discord-activity-name")?.textContent?.trim() ||
    "No current activity";

  const details =
    document.getElementById("discord-activity-details")?.textContent?.trim() ||
    "";

  const stateText =
    document.getElementById("discord-activity-state")?.textContent?.trim() ||
    "";

  console.log(
    "%c💬 DISCORD STATUS",
    `color:${theme.discord};font-size:18px;font-weight:bold;`
  );

  console.log(`%cUser: ${username}`, "color:white;");
  console.log(`%cPresence: ${status}`, "color:#00ff88;");
  console.log(
    `%cActivity: ${[name, details, stateText].filter(Boolean).join(" — ")}`,
    "color:white;"
  );
};

window.stats = () => {
  const uptime =
    document.getElementById("stat-uptime")?.textContent || "0s";

  const themeName =
    document.getElementById("stat-theme")?.textContent || "cyber-neon";

  const media =
    document.getElementById("stat-media")?.textContent || "Unknown";

  const discord =
    document.getElementById("stat-discord")?.textContent || "offline";

  const song =
    document.getElementById("stat-song")?.textContent || "None";

  console.log(
    "%c📊 LIVE SITE STATS",
    `color:${theme.green};font-size:18px;font-weight:bold;`
  );

  console.table([
    { item: "Uptime", value: uptime },
    { item: "Theme", value: themeName },
    { item: "Current Media", value: media },
    { item: "Discord", value: discord },
    { item: "Current Song", value: song }
  ]);
};