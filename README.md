<div align="center">
  <img src="./assets/favico/icon.png" alt="Logo" width="100" height="100">

  # ThuysMao Portfolio ✨
  
  *A deeply interactive, personalized web portfolio bringing together modern aesthetics, Discord rich presence, and an immersive media experience.*

  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

  <br />
  <a href="https://profolio.blog/"><strong>➥ View Live Demo</strong></a>
</div>

<br />

## 🌟 About the Project

**ThuysMao Portfolio** is a uniquely crafted personal website combining terminal-style booting sequences with an elegant glassmorphism UI. It serves as a central hub for my online identity—showcasing everything from gaming ranks (Faceit/Valorant) to real-time Discord activity, seamlessly wrapped in a dynamic video and audio experience.

## ✨ Key Features

- 🖥️ **Terminal Boot Sequence**: A simulated command-line interface that dynamically fetches user IP and OS details before revealing the site.
- 🎵 **Integrated Media Player**: Custom audio and video background controls featuring volume adjustments, mute, play/pause, and a mode-switching system (Image/Video vs. Music).
- 🎮 **Live Discord Presence**: Utilizes the **Lanyard API** to display real-time Discord status, custom status bubbles, and current activities (like Spotify playback or active games).
- 🏆 **Gaming Statistics**: Beautiful UI elements displaying current Faceit ELO/Stats and historical Valorant ranks.
- 🎨 **Immersive UI/UX**:
  - Glassmorphism design patterns.
  - Smooth scrolling powered by **Lenis**.
  - Interactive **Particles.js** background.
  - 3D Tilt effects on profile cards.
  - Custom scrollbar and pointers.
- 🕒 **Live Timezones**: Real-time clocks keeping track of active timezones (Asia/Ho_Chi_Minh).

## 🛠️ Built With

This project avoids heavy frameworks, relying instead on clean, vanilla technologies to maximize performance and customizability:

* **Frontend**: HTML5, CSS3, Vanilla JavaScript
* **Libraries & APIs**:
  * [Particles.js](https://vincentgarreau.com/particles.js/) - For the interactive background particles.
  * [Lenis](https://lenis.studiofreight.com/) - For silky smooth page scrolling.
  * [Lanyard API](https://github.com/Phineas/lanyard) - For fetching live Discord presence data.
  * [FontAwesome](https://fontawesome.com/) - For vector icons.

## 🚀 Local Setup & Installation

To run this project locally, you don't need any complex build tools. Just serve the files using a local web server.

1. **Clone the repository**
   ```sh
   git clone https://github.com/ThuysMao/me-site.git
   ```
2. **Navigate to the directory**
   ```sh
   cd me-site
   ```
3. **Serve the project**
   - Using Python: `python -m http.server 8000`
   - Using Node.js (http-server): `npx http-server`
   - Or simply use **Live Server** extension in VS Code.
4. **Open in browser**
   Navigate to `http://localhost:8000` (or the port provided by your server).

## 📁 File Structure Overview

```text
├── index.html             # Main HTML structure
├── styles.css             # Core CSS styling and animations
├── assets/
│   ├── css/               # Additional stylesheets (tilt-effect, etc.)
│   ├── js/                # JavaScript modules
│   │   ├── script.js      # Main logic (Terminal, Initialization)
│   │   ├── discord.js     # Lanyard API integration
│   │   ├── music-control.js # Media player logic
│   │   └── ...            # Other scripts (Tilt, Errors, etc.)
│   ├── pfp/               # Profile pictures and gaming icons
│   ├── badge/             # Discord badges
│   ├── back/              # Background videos
│   ├── music/             # Audio tracks
│   └── favico/            # Site icons
```

## 📫 Connect with Me

- **Discord**: [@thuysmao](https://discord.com/users/985537688159522847)
- **Steam**: [Main Account](https://steamcommunity.com/profiles/76561199881574505)
- **Email**: [nguyenduy0123123@gmail.com](mailto:nguyenduy0123123@gmail.com)

---

<div align="center">
  <p>Built from the ground up with passion and curiosity. 🐈‍⬛</p>
  <p>&copy; 2026 THUYSMAO. All rights reserved.</p>
</div>
