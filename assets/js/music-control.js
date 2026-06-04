document.addEventListener('DOMContentLoaded', function () {
    let isTerminalDone = false;
    let isPlaying = false;
    let isMuted = false;
    let previousVolume = 0.1;
    const defaultVolume = 0.4;
    let currentMediaIndex = -1;
    let currentMode = 'music';

    const audio = document.getElementById('myAudio');
    let video = document.getElementById('myVideo');

    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const randomBtn = document.getElementById('randomBtn');
    const toggleIcon = document.getElementById('toggleIcon');

    const mediaPairs = [
        {
            video: "./assets/back/domain.mp4",
            audio: "./assets/back/domain.mp4",
            title: "Domain Expansion",
            artist: "Jujutsu Kaisen",
            cover: "./assets/favico/icon.png",
            weight: 50
        }
    ];

    const imageMedia = [
        {
            src: "./assets/pfp/H.png",
            audio: "./assets/music/Ariana Grande - bye [Altare Remix, slow].mp3",
            title: "bye [Altare Remix, slow]",
            artist: "Ariana Grande",
            cover: "./assets/pfp/H.png",
            weight: 100
        }
    ];

    function getWeightedRandomItem(items) {
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
        const rand = Math.random() * totalWeight;
        let cumulative = 0;

        for (const item of items) {
            cumulative += item.weight || 1;
            if (rand <= cumulative) return item;
        }

        return items[items.length - 1];
    }

    function updatePlayButton() {
        const icon = playPauseBtn.querySelector('i');
        icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    function updateMuteButton() {
        const icon = muteBtn.querySelector('i');

        if (isMuted || audio.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (audio.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    function playRandomSong(forcePlay = false) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * mediaPairs.length);
        } while (
            randomIndex === currentMediaIndex &&
            mediaPairs.length > 1
        );

        currentMediaIndex = randomIndex;

        const selected = mediaPairs[randomIndex];
        const wasPlaying = !audio.paused;
        const currentVolume = audio.volume;

        if (video.tagName.toLowerCase() === 'img') {
            const parent = video.parentElement;

            const newVideo = document.createElement('video');
            newVideo.id = 'myVideo';
            newVideo.autoplay = true;
            newVideo.loop = true;
            newVideo.muted = true;
            newVideo.playsInline = true;

            newVideo.style =
                'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:-1;';

            parent.replaceChild(newVideo, video);
            video = newVideo;
        }

        video.innerHTML =
            `<source src="${selected.video}" type="video/mp4">`;

        video.load();
        video.loop = true;

        if (selected.audio) {
            audio.innerHTML =
                `<source src="${selected.audio}" type="audio/mpeg">`;

            audio.load();
            audio.volume = currentVolume;
            audio.loop = true;
        } else {
            audio.pause();
            audio.innerHTML = "";
        }

        if (wasPlaying || forcePlay) {
            video.play().catch(err =>
                console.error("Video play error:", err)
            );

            if (selected.audio) {
                audio.play().catch(err =>
                    console.error("Audio play error:", err)
                );
            }
        }

        if (randomBtn) {
            randomBtn.style.transform = 'scale(0.9)';

            setTimeout(() => {
                randomBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    playPauseBtn.addEventListener('click', function () {
        if (isPlaying) {
            audio.pause();

            if (video.tagName.toLowerCase() === 'video') {
                video.pause();
            }
        } else {
            audio.play().catch(err =>
                console.error("Audio play failed:", err)
            );

            if (video.tagName.toLowerCase() === 'video') {
                video.play().catch(err =>
                    console.error("Video play failed:", err)
                );
            }
        }
    });

    muteBtn.addEventListener('click', function () {
        if (isMuted) {
            audio.volume = previousVolume;
            volumeSlider.value = previousVolume * 100;
            isMuted = false;
        } else {
            previousVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
            isMuted = true;
        }

        updateMuteButton();
    });

    volumeSlider.addEventListener('input', function () {
        const volume = this.value / 100;

        audio.volume = volume;
        isMuted = volume === 0;

        if (!isMuted) {
            previousVolume = volume;
        }

        updateMuteButton();
    });

    audio.addEventListener('volumechange', function () {
        volumeSlider.value = audio.volume * 100;
        updateMuteButton();
    });

    randomBtn.addEventListener('click', function (e) {
        e.preventDefault();
        return;
    });

    function updateLocalMusicState(title, artist, cover, isPlaying) {
        if (window.footerMusicState) {
            window.footerMusicState.localActive = true;
            window.footerMusicState.localTitle = title;
            window.footerMusicState.localArtist = artist;
            window.footerMusicState.localCover = cover;
            window.footerMusicState.localPlaying = isPlaying;
            window.refreshFooterMusicDisplay();
        }
    }

    audio.addEventListener('play', function () {
        isPlaying = true;
        updatePlayButton();
        const selected = currentMode === 'music' ? mediaPairs[currentMediaIndex] : imageMedia[0];
        if (selected) {
            updateLocalMusicState(selected.title, selected.artist, selected.cover, true);
        }
    });

    audio.addEventListener('pause', function () {
        isPlaying = false;
        updatePlayButton();
        const selected = currentMode === 'music' ? mediaPairs[currentMediaIndex] : imageMedia[0];
        if (selected) {
            updateLocalMusicState(selected.title, selected.artist, selected.cover, false);
        }
    });

    audio.addEventListener('ended', function () {
        playRandomSong(true);
    });

    window.startMusicWithRandom = function () {
        switchToImageMode();

        setTimeout(() => {
            if (audio.paused) {
                audio.play().catch(err =>
                    console.error("Audio play error:", err)
                );
            }
        }, 100);
    };

    setTimeout(() => {
        isPlaying = !audio.paused;

        volumeSlider.value = 10;
        audio.volume = defaultVolume;
        previousVolume = defaultVolume;

        updatePlayButton();
        updateMuteButton();

        // Initialize state on page load
        const initialSong = currentMode === 'music' ? mediaPairs[currentMediaIndex] : imageMedia[0];
        if (initialSong) {
            updateLocalMusicState(initialSong.title, initialSong.artist, initialSong.cover, isPlaying);
        }
    }, 500);

    function switchToImageMode() {
        currentMode = 'image';

        const randomItem = getWeightedRandomItem(imageMedia);

        audio.pause();
        audio.innerHTML = "";

        if (randomItem.type === 'video') {

            if (video.tagName.toLowerCase() === 'img') {
                const parent = video.parentElement;

                const newVideo = document.createElement('video');
                newVideo.id = 'myVideo';
                newVideo.autoplay = true;
                newVideo.loop = true;
                newVideo.muted = true;
                newVideo.playsInline = true;

                newVideo.style =
                    'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:-1;';

                parent.replaceChild(newVideo, video);
                video = newVideo;
            }

            video.innerHTML =
                `<source src="${randomItem.src}" type="video/mp4">`;

            video.load();
            video.loop = true;

            video.play().catch(err =>
                console.error("Video play error:", err)
            );

        } else {

            if (video.tagName.toLowerCase() === 'video') {
                const parent = video.parentElement;

                const img = document.createElement('img');
                img.id = 'myVideo';
                img.src = randomItem.src;

                img.style =
                    'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:-1;';

                parent.replaceChild(img, video);
                video = img;
            } else {
                video.src = randomItem.src;
            }
        }

        if (randomItem.audio) {
            audio.innerHTML =
                `<source src="${randomItem.audio}" type="audio/mpeg">`;

            audio.load();
            audio.volume = volumeSlider.value / 100;
            audio.loop = true;

            audio.play()
                .then(() => {
                    isPlaying = true;
                    updatePlayButton();
                })
                .catch(err =>
                    console.error("Audio play error:", err)
                );
        }

        toggleIcon.className = "fa-solid fa-video";
    }

    function switchToMusicMode() {
        currentMode = 'music';

        if (video.tagName.toLowerCase() === 'img') {
            const parent = video.parentElement;

            const newVideo = document.createElement('video');
            newVideo.id = 'myVideo';
            newVideo.autoplay = true;
            newVideo.loop = true;
            newVideo.muted = true;
            newVideo.playsInline = true;

            newVideo.style =
                'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:-1;';

            parent.replaceChild(newVideo, video);
            video = newVideo;
        }

        playRandomSong(true);

        toggleIcon.className = "fa-solid fa-image";
    }

    toggleIcon.addEventListener('click', function () {
        if (currentMode === 'music') {
            switchToImageMode();
        } else {
            switchToMusicMode();
        }
    });

    window.showMediaToggle = function () {
        const toggleBtn =
            document.getElementById('media-toggle-buttons');

        if (toggleBtn) {
            toggleBtn.style.display = 'block';
        }
    };

});
