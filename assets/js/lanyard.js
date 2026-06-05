document.addEventListener('DOMContentLoaded', () => {
  const userId = '985537688159522847';
  const apiUrl = `https://api.lanyard.rest/v1/users/${userId}`;

  const avatar = document.getElementById('discord-avatar');
  const mainProfilePicture = document.getElementById('profile-picture');
  const username = document.getElementById('discord-username');
  const statusDot = document.getElementById('discord-status-dot');
  const statusText = document.getElementById('discord-status-text');

  const activityInfo = document.getElementById('discord-activity-info');
  const noActivity = document.getElementById('discord-no-activity');
  const activityName = document.getElementById('discord-activity-name');
  const activityDetails = document.getElementById('discord-activity-details');
  const activityState = document.getElementById('discord-activity-state');
  const albumArt = document.getElementById('discord-album-art');

  const syncIndicator = document.getElementById('discord-sync-indicator');

  function setText(el, value) {
    if (el) el.textContent = value || '';
  }

  function showSyncIndicator() {
    if (syncIndicator) syncIndicator.classList.add('active');
  }

  function hideSyncIndicator() {
    if (syncIndicator) syncIndicator.classList.remove('active');
  }

  function showActivity() {
    if (activityInfo) activityInfo.classList.remove('hidden');
    if (noActivity) noActivity.classList.add('hidden');
  }

  function showNoActivity() {
    if (activityInfo) activityInfo.classList.add('hidden');
    if (noActivity) noActivity.classList.remove('hidden');
  }

  function clearAlbumArt() {
    if (!albumArt) return;
    albumArt.style.backgroundImage = '';
    albumArt.removeAttribute('data-image-source');
  }

  function setAlbumArt(url, source = '') {
    if (!albumArt) return;

    if (!url) {
      clearAlbumArt();
      return;
    }

    const img = new Image();

    img.onload = () => {
      albumArt.style.backgroundImage = `url("${url}")`;
      if (source) {
        albumArt.dataset.imageSource = source;
      } else {
        albumArt.removeAttribute('data-image-source');
      }
    };

    img.onerror = () => {
      console.warn('Không load được ảnh activity:', url);
      clearAlbumArt();
    };

    img.src = url;
  }

  function setStatus(status) {
    const safeStatus = status || 'offline';

    if (statusDot) {
      statusDot.className = '';
      statusDot.classList.add(`status-${safeStatus}`);
    }

    if (statusText) {
      statusText.textContent =
        safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);
    }
  }

  function getDiscordAvatarUrl(discordUser) {
    if (!discordUser?.id || !discordUser?.avatar) return '';
    const ext = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}?size=256`;
  }

  function updateAvatar(discordUser) {
    const avatarUrl = getDiscordAvatarUrl(discordUser);
    if (!avatarUrl) return;

    showSyncIndicator();

    if (avatar) {
      avatar.src = avatarUrl;
    }

    if (mainProfilePicture) {
      mainProfilePicture.style.opacity = '0.5';
      mainProfilePicture.style.filter = 'blur(2px)';

      const img = new Image();

      img.onload = () => {
        mainProfilePicture.src = avatarUrl;
        mainProfilePicture.style.opacity = '1';
        mainProfilePicture.style.filter = 'none';
        mainProfilePicture.style.transform = 'scale(1.05)';

        setTimeout(() => {
          mainProfilePicture.style.transform = 'scale(1)';
          setTimeout(hideSyncIndicator, 800);
        }, 250);
      };

      img.onerror = () => {
        mainProfilePicture.style.opacity = '1';
        mainProfilePicture.style.filter = 'none';
        hideSyncIndicator();
      };

      img.src = avatarUrl;
    } else {
      hideSyncIndicator();
    }
  }

  function getAssetUrl(asset, applicationId) {
    if (!asset) return '';

    // Discord media proxy asset
    if (asset.startsWith('mp:')) {
      return `https://media.discordapp.net/${asset.slice(3)}`;
    }

    // Spotify asset
    if (asset.startsWith('spotify:')) {
      return `https://i.scdn.co/image/${asset.slice(8)}`;
    }

    // External asset
    if (asset.startsWith('external/')) {
      return `https://media.discordapp.net/${asset}`;
    }

    // Direct URL
    if (asset.startsWith('https://') || asset.startsWith('http://')) {
      return asset;
    }

    // Discord application asset
    if (applicationId) {
      return `https://cdn.discordapp.com/app-assets/${applicationId}/${asset}.png`;
    }

    return '';
  }

  function getAppIconUrl(activity) {
    if (!activity?.application_id) return '';
    // Fallback: dùng icon của app từ Discord CDN thông qua proxy dstn.to
    return `https://dcdn.dstn.to/app-icons/${activity.application_id}`;
  }

  function getBestDiscordImage(activity) {
    if (!activity) return '';

    // Thử lấy ảnh từ assets trước
    if (activity.assets) {
      if (activity.assets.large_image) {
        return getAssetUrl(activity.assets.large_image, activity.application_id);
      }

      if (activity.assets.small_image) {
        return getAssetUrl(activity.assets.small_image, activity.application_id);
      }
    }

    // Fallback: dùng icon của ứng dụng (e.g. CS2, Valorant không có assets)
    return getAppIconUrl(activity);
  }

  function getDisplayActivity(activities) {
    if (!Array.isArray(activities) || activities.length === 0) return null;

    return (
      activities.find((activity) => {
        if (!activity) return false;
        if (activity.type === 4) return false; // Custom Status
        if (activity.name === 'Custom Status') return false;
        return true;
      }) || null
    );
  }

  function renderSpotify(spotify) {
    if (!spotify?.track_id) return false;

    showActivity();
    setText(activityName, spotify.song || 'Spotify');
    setText(activityDetails, spotify.artist || '');
    setText(activityState, spotify.album || '');

    if (spotify.album_art_url) {
      setAlbumArt(spotify.album_art_url, 'spotify');
    } else {
      clearAlbumArt();
    }

    return true;
  }

  function renderActivity(activity) {
    if (!activity) return false;

    showActivity();

    setText(activityName, activity.name || 'Unknown Activity');
    setText(activityDetails, activity.details || '');
    setText(activityState, activity.state || '');

    const imageUrl = getBestDiscordImage(activity);

    console.log('Activity object:', activity);
    console.log('application_id:', activity.application_id || '');
    console.log('large_image:', activity.assets?.large_image || '');
    console.log('small_image:', activity.assets?.small_image || '');
    console.log('resolved imageUrl:', imageUrl);

    if (imageUrl) {
      setAlbumArt(imageUrl, 'discord');
    } else {
      clearAlbumArt();
    }

    return true;
  }

  async function updateDiscordStatus() {
    try {
      const response = await fetch(apiUrl, { cache: 'no-store' });
      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error('Dữ liệu Lanyard không hợp lệ');
      }

      const discord = result.data;

      console.log('Lanyard response:', discord);

      if (discord.discord_user) {
        updateAvatar(discord.discord_user);
        setText(username, discord.discord_user.username || 'Unknown User');
      }

      setStatus(discord.discord_status);

      let rendered = false;

      if (discord.listening_to_spotify && discord.spotify) {
        rendered = renderSpotify(discord.spotify);
        if (window.footerMusicState) {
          window.footerMusicState.spotifyActive = true;
          window.footerMusicState.spotifyTitle = discord.spotify.song;
          window.footerMusicState.spotifyArtist = discord.spotify.artist;
          window.footerMusicState.spotifyCover = discord.spotify.album_art_url;
          window.refreshFooterMusicDisplay();
        }
      } else {
        if (window.footerMusicState) {
          window.footerMusicState.spotifyActive = false;
          window.refreshFooterMusicDisplay();
        }
      }

      if (!rendered) {
        const activity = getDisplayActivity(discord.activities);
        rendered = renderActivity(activity);
      }

      if (!rendered) {
        clearAlbumArt();
        showNoActivity();
      }
    } catch (error) {
      console.error('Error fetching Discord status:', error);
      clearAlbumArt();
      showNoActivity();
      hideSyncIndicator();
      if (window.footerMusicState) {
        window.footerMusicState.spotifyActive = false;
        window.refreshFooterMusicDisplay();
      }
    }
  }

  updateDiscordStatus();
  setInterval(updateDiscordStatus, 30000);
});