document.addEventListener('DOMContentLoaded', () => {
    const userId = "985537688159522847";
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/985537688159522847`;

    const avatarFrame = document.getElementById('avatar-frame');

    const renderClan = (clanData) => {
        const blurredBox = document.getElementById('blurred-box');
        if (!blurredBox) return;
        
        let clanContainer = document.getElementById('discord-clan-container');
        if (!clanContainer) {
            clanContainer = document.createElement('div');
            clanContainer.id = 'discord-clan-container';
            blurredBox.appendChild(clanContainer);
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

            if (data.avatar_decoration && data.avatar_decoration.asset) {
                const asset = data.avatar_decoration.asset;
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
                if (avatarFrame) {
                    avatarFrame.src = frameUrl;
                    avatarFrame.style.display = 'block';
                }
            } else {
                console.warn("No avatar frame asset found.");
                if (avatarFrame) avatarFrame.style.display = 'none';
            }

            const profileBanner = document.getElementById('profile-banner');
            if (profileBanner) {
                if (data.banner && data.banner.link) {
                    profileBanner.style.backgroundImage = `url('${data.banner.link}')`;
                } else if (data.raw && data.raw.banner_color) {
                    profileBanner.style.backgroundColor = data.raw.banner_color;
                }
            }

            // Clan Tag & Badge
            if (data.clan && data.clan.identity_enabled) {
                renderClan(data.clan);
            } else {
                // Fallback if data.clan is missing from response
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