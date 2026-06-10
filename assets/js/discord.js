document.addEventListener('DOMContentLoaded', () => {
    const userId = "985537688159522847";
    const apiUrl = `https://dcdn.dstn.to/profile/985537688159522847`;

    const avatarFrame = document.getElementById('avatar-frame');

    const renderClan = (clanData) => {
        const nameWrapper = document.querySelector('.discord-name-wrapper');
        if (!nameWrapper) return;
        
        let clanContainer = document.getElementById('discord-clan-container');
        if (!clanContainer) {
            clanContainer = document.createElement('div');
            clanContainer.id = 'discord-clan-container';
            clanContainer.setAttribute('title', 'Tham gia Discord Clan!');
            nameWrapper.appendChild(clanContainer);
        }

        // Clan Badge Image
        if (clanData.badge && !document.getElementById('discord-clan-badge')) {
            const badgeImg = document.createElement('img');
            badgeImg.id = 'discord-clan-badge';
            badgeImg.className = 'badge';
            badgeImg.src = `https://cdn.discordapp.com/clan-badges/${clanData.identity_guild_id}/${clanData.badge}.png`;
            badgeImg.alt = "Clan Badge";
            clanContainer.appendChild(badgeImg);
        }

        // Clan Tag Text
        if (clanData.tag && !document.getElementById('discord-clan-tag')) {
            const tagSpan = document.createElement('span');
            tagSpan.id = 'discord-clan-tag';
            tagSpan.className = 'tagText';
            tagSpan.textContent = clanData.tag;
            tagSpan.style.color = '#fff';
            tagSpan.style.fontSize = '12px';
            tagSpan.style.fontWeight = 'bold';
            tagSpan.style.fontFamily = "'Inter', sans-serif";
            clanContainer.appendChild(tagSpan);
        }
    };

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);

            // Avatar Decoration
            if (data.user && data.user.avatar_decoration_data && data.user.avatar_decoration_data.asset) {
                const asset = data.user.avatar_decoration_data.asset;
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
                if (avatarFrame) {
                    avatarFrame.src = frameUrl;
                    avatarFrame.style.display = 'block';
                }
            } else {
                console.warn("No avatar frame asset found.");
                if (avatarFrame) avatarFrame.style.display = 'none';
            }

            // Banner
            const profileBanner = document.getElementById('profile-banner');
            if (profileBanner && data.user) {
                if (data.user.banner) {
                    const ext = data.user.banner.startsWith('a_') ? 'gif' : 'png';
                    profileBanner.style.backgroundImage = `url('https://cdn.discordapp.com/banners/${data.user.id}/${data.user.banner}.${ext}?size=480')`;
                } else if (data.user.banner_color) {
                    profileBanner.style.backgroundColor = data.user.banner_color;
                }
            }

            // Theme Colors for blurred-box
            const blurredBox = document.getElementById('blurred-box');
            if (blurredBox && data.user) {
                let color1 = null;
                let color2 = null;

                if (data.user_profile && data.user_profile.theme_colors) {
                    color1 = '#' + data.user_profile.theme_colors[0].toString(16).padStart(6, '0');
                    color2 = '#' + data.user_profile.theme_colors[1].toString(16).padStart(6, '0');
                } else if (data.user.banner_color) {
                    color1 = data.user.banner_color;
                    color2 = data.user.banner_color;
                } else if (data.user.accent_color) {
                    color1 = '#' + data.user.accent_color.toString(16).padStart(6, '0');
                    color2 = color1;
                }

                if (color1 && color2) {
                    const hexToRgb = hex => {
                        const cleanHex = hex.replace('#', '');
                        if (cleanHex.length !== 6) return '0, 0, 0';
                        const r = parseInt(cleanHex.slice(0, 2), 16);
                        const g = parseInt(cleanHex.slice(2, 4), 16);
                        const b = parseInt(cleanHex.slice(4, 6), 16);
                        return `${r}, ${g}, ${b}`;
                    };

                    try {
                        const rgb1 = hexToRgb(color1);
                        const rgb2 = hexToRgb(color2);

                        if (color1 === color2) {
                            blurredBox.style.setProperty('--theme-panel-bg', `rgba(${rgb1}, 0.25)`);
                            blurredBox.style.setProperty('--theme-border', `rgba(${rgb1}, 0.4)`);
                            blurredBox.style.setProperty('--theme-hover-border', `rgba(${rgb1}, 0.6)`);
                            blurredBox.style.setProperty('--theme-shadow', `0 10px 30px rgba(${rgb1}, 0.2)`);
                        } else {
                            blurredBox.style.setProperty('--theme-panel-bg', `linear-gradient(135deg, rgba(${rgb1}, 0.25) 0%, rgba(${rgb2}, 0.25) 100%)`);
                            blurredBox.style.setProperty('--theme-border', `rgba(${rgb1}, 0.4)`);
                            blurredBox.style.setProperty('--theme-hover-border', `rgba(${rgb2}, 0.6)`);
                            blurredBox.style.setProperty('--theme-shadow', `0 10px 30px rgba(${rgb1}, 0.2)`);
                        }
                    } catch (e) {
                        console.error('Error applying theme colors', e);
                    }
                }
            }

            // Clan Tag & Badge
            let clanObj = null;
            if (data.user && data.user.clan && data.user.clan.identity_enabled) {
                clanObj = data.user.clan;
            } else if (data.user && data.user.primary_guild && data.user.primary_guild.identity_enabled) {
                clanObj = data.user.primary_guild;
            }

            if (clanObj) {
                renderClan(clanObj);
            } else {
                // Fallback if clan is missing from response
                renderClan({
                    tag: "NTMG",
                    badge: "8a5c2be906d98f1b64f87d1f30051bb9",
                    identity_guild_id: "1264970685214883950"
                });
            }
        })
        .catch(error => {
            console.error("Error fetching user data, using fallback:", error);
            // Fallback banner color or generic error handling
            const profileBanner = document.getElementById('profile-banner');
            if (profileBanner && !profileBanner.style.backgroundImage) {
                profileBanner.style.backgroundColor = "#f08c55"; // Default banner color from JSON
            }

            // Render clan tag anyway
            renderClan({
                tag: "NTMG",
                badge: "8a5c2be906d98f1b64f87d1f30051bb9",
                identity_guild_id: "1264970685214883950"
            });
        });
});