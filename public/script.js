// ============================================================
// DATA - All offline assets
// ============================================================

const USERS = [
    // Main user for Reels (4 videos)
    { id: 1, username: 'ab_comedy_182', name: 'AB Comedy', avatar: 'home/profiles/ab_comedy_182.jpg' },
    // Users for Stories (10 stories)
    { id: 2, username: 'nikhil_entertainment_', name: 'Nikhil Entertainment', avatar: 'stories/profiles/iimage1.jpg' },
    { id: 3, username: 'funny_kid_24', name: 'Funny Kid', avatar: 'stories/profiles/vimage2.jpg' },
    { id: 4, username: 'comedy_star', name: 'Comedy Star', avatar: 'stories/profiles/vimage3.jpg' },
    { id: 5, username: 'laughing_boy', name: 'Laughing Boy', avatar: 'stories/profiles/vimage4.jpg' },
    { id: 6, username: 'entertainment_king', name: 'Entertainment King', avatar: 'stories/profiles/vimage5.jpg' },
    { id: 7, username: 'comedy_queen', name: 'Comedy Queen', avatar: 'stories/profiles/vimage6.jpg' },
    { id: 8, username: 'funny_buddy', name: 'Funny Buddy', avatar: 'stories/profiles/vimage7.jpg' },
    { id: 9, username: 'smile_wala', name: 'Smile Wala', avatar: 'stories/profiles/vimage8.jpg' },
    { id: 10, username: 'comedy_addict', name: 'Comedy Addict', avatar: 'stories/profiles/vimage9.jpg' }
];

// ============================================================
// STORIES (10 offline stories)
// ============================================================
const STORIES = [
    {
        id: 1,
        username: 'ab_comedy_182',
        avatar: 'stories/profiles/vimage1.jpg',
        seen: false,
        storyImg: 'stories/story_media/vvideo1.mp4'
    },
    {
        id: 2,
        username: 'nikhil_entertainment_',
        avatar: 'stories/profiles/iimage1.jpg',
        seen: false,
        storyImg: 'stories/story_media/smimage1.jpg'
    },
    {
        id: 3,
        username: 'nikhil_entertainment_',
        avatar: 'stories/profiles/vimage2.jpg',
        seen: false,
        storyImg: 'stories/story_media/vvideo2.mp4'
    },
    {
        id: 4,
        username: 'funny_kid_24',
        avatar: 'stories/profiles/vimage3.jpg',
        seen: false,
        storyImg: 'stories/story_media/smimage2.jpg'
    },
    {
        id: 5,
        username: 'comedy_star',
        avatar: 'stories/profiles/vimage4.jpg',
        seen: false,
        storyImg: 'stories/story_media/vvideo3.mp4'
    },
    {
        id: 6,
        username: 'laughing_boy',
        avatar: 'stories/profiles/vimage5.jpg',
        seen: false,
        storyImg: 'stories/story_media/smimage3.jpg'
    },
    {
        id: 7,
        username: 'entertainment_king',
        avatar: 'stories/profiles/vimage6.jpg',
        seen: false,
        storyImg: 'stories/story_media/vvideo4.mp4'
    },
    {
        id: 8,
        username: 'comedy_queen',
        avatar: 'stories/profiles/vimage7.jpg',
        seen: false,
        storyImg: 'stories/story_media/smimage4.jpg'
    },
    {
        id: 9,
        username: 'funny_buddy',
        avatar: 'stories/profiles/vimage8.jpg',
        seen: false,
        storyImg: 'stories/story_media/vvideo5.mp4'
    },
    {
        id: 10,
        username: 'smile_wala',
        avatar: 'stories/profiles/vimage9.jpg',
        seen: false,
        storyImg: 'stories/story_media/smimage5.jpg'
    }
];

// ============================================================
// REEL VIDEOS (4 videos)
// ============================================================
const REEL_VIDEOS = [
    'home/reels/Shiva_ball_hit.mp4',
    'home/reels/Shiva_shiva_part_1.mp4',
    'home/reels/Shiva_shop_throw.mp4',
    'home/reels/Thief.mp4'
];

// English captions - comedy, kids attitude, fun
const REEL_CAPTIONS = [
    'When you hit the perfect shot 🏏 #funny #kids',
    'Shiva attitude at its best 😎 #attitude #comedy',
    'Shop throw gone wrong 😂 #fun #viral',
    'Thief meets his match! 😂 #comedy #kids'
];

// Telugu comments
const REEL_COMMENTS = [
    ['super bro 😂', 'funny ga undhi', 'chala seepu navvukunna'],
    ['mastu undi 😂', 'naaku chaala navvu vachindi', 'full comedy'],
    ['kids ki em cheppadam ledu 😂', 'asalu super', 'repeat choodali'],
    ['thief ni chusi navvochindi 😂', 'bavundi', 'inka kavali ilantivi']
];

// ============================================================
// BUILD POSTS (only reels)
// ============================================================
const POSTS = [];
for (let i = 0; i < REEL_VIDEOS.length; i++) {
    const user = USERS[0];   // All 4 videos use ab_comedy_182
    const likes = Math.floor(Math.random() * 900) + 200;
    const comments = REEL_COMMENTS[i % REEL_COMMENTS.length].map((text, idx) => ({
        id: idx,
        user: USERS[(i + idx + 2) % USERS.length],
        text: text
    }));
    POSTS.push({
        id: i + 1,
        type: 'reel',
        user: user,
        media: REEL_VIDEOS[i],
        caption: REEL_CAPTIONS[i % REEL_CAPTIONS.length],
        likes: likes,
        liked: false,
        comments: comments,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
}

// ============================================================
// OTHER DATA (Search, Profile, Messages)
// ============================================================
const SEARCH_IMAGES = [
    'https://picsum.photos/id/1040/400/400',
    'https://picsum.photos/id/1044/400/400',
    'https://picsum.photos/id/1049/400/400',
    'https://picsum.photos/id/1055/400/400',
    'https://picsum.photos/id/1060/400/400',
    'https://picsum.photos/id/1062/400/400',
    'https://picsum.photos/id/1067/400/400',
    'https://picsum.photos/id/1070/400/400',
    'https://picsum.photos/id/1074/400/400'
];

const PROFILE_GRID_IMAGES = [
    'https://picsum.photos/id/1015/300/300',
    'https://picsum.photos/id/1016/300/300',
    'https://picsum.photos/id/1018/300/300',
    'https://picsum.photos/id/1020/300/300',
    'https://picsum.photos/id/1024/300/300',
    'https://picsum.photos/id/1027/300/300',
    'https://picsum.photos/id/1035/300/300',
    'https://picsum.photos/id/1039/300/300',
    'https://picsum.photos/id/1040/300/300'
];

const MESSAGES = USERS.slice(0, 8).map((u, i) => ({
    user: u,
    preview: ['Hey! How are you?', 'Check this out!', 'See you tomorrow?', '👍', 'Loved your post!', 'When are you free?', 'Thanks! 🙏', 'Great work!'][i % 8],
    time: ['2m', '15m', '1h', '3h', '8h', '1d', '2d', '3d'][i % 8]
}));

// ============================================================
// RENDER FUNCTIONS
// ============================================================

function renderStories() {
    const wrapper = document.getElementById('storiesWrapper');
    wrapper.innerHTML = STORIES.map(s => `
        <div class="story-item" data-story="${s.id}">
            <div class="story-avatar ${s.seen ? 'seen' : ''}">
                <img src="${s.avatar}" alt="${s.username}" />
            </div>
            <span class="story-name">${s.username}</span>
        </div>
    `).join('');
    wrapper.querySelectorAll('.story-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.story);
            const story = STORIES.find(s => s.id === id);
            if (story) openStory(story);
        });
    });
}

function renderFeed() {
    const container = document.getElementById('feedContainer');
    container.innerHTML = POSTS.map((post) => {
        const isReel = post.type === 'reel';
        const mediaHtml = isReel ? `
            <video src="${post.media}" muted playsinline preload="metadata" poster="${post.media}"></video>
            <div class="play-overlay"><i class="fas fa-play-circle"></i></div>
            <div class="reel-badge"><i class="fas fa-play"></i> Reel</div>
        ` : `<img src="${post.media}" alt="post" loading="lazy" />`;
        return `
            <div class="post" data-postid="${post.id}">
                <div class="post-header">
                    <div class="avatar"><img src="${post.user.avatar}" alt="${post.user.username}" /></div>
                    <span class="username">${post.user.username} <span>• ${post.timestamp}</span></span>
                    <span class="more-btn"><i class="fas fa-ellipsis-h"></i></span>
                </div>
                <div class="post-media" data-postid="${post.id}" data-type="${post.type}">
                    ${mediaHtml}
                    <div class="heart-burst" id="burst-${post.id}">❤️</div>
                </div>
                <div class="post-actions">
                    <div class="left-actions">
                        <i class="far fa-heart like-btn" data-postid="${post.id}" id="likeIcon-${post.id}"></i>
                        <i class="far fa-comment comment-btn" data-postid="${post.id}"></i>
                        <i class="far fa-paper-plane"></i>
                    </div>
                    <i class="far fa-bookmark bookmark-btn" data-postid="${post.id}"></i>
                </div>
                <div class="post-likes" id="likesDisplay-${post.id}">
                    <i class="fas fa-heart" style="color:#ed4956;font-size:13px;"></i>
                    <span id="likeCount-${post.id}">${post.likes}</span> likes
                </div>
                <div class="post-caption">
                    <span class="username">${post.user.username}</span> ${post.caption}
                </div>
                <div class="post-comments" data-postid="${post.id}">
                    View all ${post.comments.length} comments
                </div>
                <div class="post-timestamp">${post.timestamp}</div>
            </div>
        `;
    }).join('');

    // Double-click like
    document.querySelectorAll('.post-media').forEach(el => {
        const postId = parseInt(el.dataset.postid);
        el.addEventListener('dblclick', (e) => {
            toggleLike(postId, true);
            const burst = document.getElementById(`burst-${postId}`);
            if (burst) {
                burst.classList.remove('animate');
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                burst.style.left = x + 'px';
                burst.style.top = y + 'px';
                burst.style.transform = 'translate(-50%, -50%) scale(0)';
                requestAnimationFrame(() => burst.classList.add('animate'));
            }
        });
        // Click: open reel player or modal
        el.addEventListener('click', (e) => {
            if (e.detail === 1) {
                const type = el.dataset.type;
                const id = parseInt(el.dataset.postid);
                if (type === 'reel') {
                    openReelPlayer(id);
                } else {
                    openModal(id);
                }
            }
        });
    });

    // Like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.postid);
            toggleLike(id, false);
        });
    });

    // Comment buttons -> open modal
    document.querySelectorAll('.comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.postid);
            openModal(id);
        });
    });

    // Comments link -> open modal
    document.querySelectorAll('.post-comments').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.postid);
            openModal(id);
        });
    });

    // Bookmark toggle
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('fas');
            btn.classList.toggle('far');
        });
    });
}

function toggleLike(postId, isDouble) {
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const icon = document.getElementById(`likeIcon-${postId}`);
    const count = document.getElementById(`likeCount-${postId}`);
    if (icon) {
        icon.className = post.liked ? 'fas fa-heart liked like-btn' : 'far fa-heart like-btn';
        icon.style.color = post.liked ? '#ed4956' : '#262626';
        if (!isDouble) {
            icon.classList.add('like-heart-pulse');
            setTimeout(() => icon.classList.remove('like-heart-pulse'), 300);
        }
    }
    if (count) count.textContent = post.likes;
    updateModal(postId);
    updateReelPlayer(postId);
}

// ============================================================
// POST MODAL
// ============================================================
let currentModalPostId = null;

function openModal(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post || post.type === 'reel') return;
    currentModalPostId = postId;
    const modal = document.getElementById('postModal');
    document.getElementById('modalImg').src = post.media;
    document.getElementById('modalImg').alt = 'post';
    const details = document.getElementById('modalDetails');
    const isLiked = post.liked ? 'liked' : '';
    const likeIcon = post.liked ? 'fas' : 'far';
    details.innerHTML = `
        <div class="modal-user">
            <img src="${post.user.avatar}" alt="${post.user.username}" />
            <span class="name">${post.user.username}</span>
        </div>
        <div class="modal-actions">
            <div style="display:flex;gap:16px;">
                <i class="${likeIcon} fa-heart modal-like-btn ${isLiked}" data-postid="${post.id}" style="${post.liked ? 'color:#ed4956;' : ''}"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <i class="far fa-bookmark"></i>
        </div>
        <div class="modal-likes"><i class="fas fa-heart" style="color:#ed4956;font-size:13px;"></i> <span id="modalLikeCount">${post.likes}</span> likes</div>
        <div class="modal-caption"><span class="username">${post.user.username}</span> ${post.caption}</div>
        <div class="modal-comments">
            ${post.comments.slice(0, 3).map(c => `<div><span class="username">${c.user.username}</span> ${c.text}</div>`).join('')}
            ${post.comments.length > 3 ? `<div style="color:#8e8e8e;">+ ${post.comments.length - 3} more comments</div>` : ''}
        </div>
        <div class="modal-time">${post.timestamp}</div>
    `;
    details.querySelector('.modal-like-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(e.target.dataset.postid);
        toggleLike(id, false);
    });
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateModal(postId) {
    if (currentModalPostId !== postId) return;
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    const count = document.getElementById('modalLikeCount');
    if (count) count.textContent = post.likes;
    const btn = document.querySelector('.modal-like-btn');
    if (btn) {
        btn.className = post.liked ? 'fas fa-heart modal-like-btn liked' : 'far fa-heart modal-like-btn';
        btn.style.color = post.liked ? '#ed4956' : '#262626';
    }
}

document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('postModal').classList.remove('open');
    document.body.style.overflow = '';
});
document.getElementById('postModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('postModal').classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ============================================================
// REEL PLAYER (with Location Tracking)
// ============================================================
let currentReelPostId = null;
let reelVideoElement = null;

function openReelPlayer(postId) {
    const post = POSTS.find(p => p.id === postId);
    if (!post || post.type !== 'reel') return;
    currentReelPostId = postId;
    const overlay = document.getElementById('reelPlayer');
    const video = document.getElementById('reelVideo');
    reelVideoElement = video;
    video.src = post.media;
    video.load();
    video.play();

    // ---- NEW: Get location and send to backend ----
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Send to API (relative path for Render)
                fetch('/api/log-reel-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: post.user.username,
                        reelFilename: post.media.split('/').pop(),
                        latitude: latitude,
                        longitude: longitude
                    })
                })
                .then(response => response.json())
                .then(data => console.log('✅ Location logged:', data))
                .catch(err => console.error('❌ Error logging location:', err));
            },
            (error) => {
                console.warn('⚠️ Geolocation error:', error.message);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        console.warn('⚠️ Geolocation not supported by this browser.');
    }
    // ---- END NEW ----

    const info = document.getElementById('reelPlayerInfo');
    const isLiked = post.liked ? 'liked' : '';
    const likeIcon = post.liked ? 'fas' : 'far';
    info.innerHTML = `
        <div class="reel-user">
            <img src="${post.user.avatar}" alt="${post.user.username}" />
            <span class="name">${post.user.username}</span>
        </div>
        <div class="reel-caption">${post.caption}</div>
        <div class="reel-actions">
            <i class="${likeIcon} fa-heart reel-like-btn ${isLiked}" data-postid="${post.id}" style="${post.liked ? 'color:#ed4956;' : ''}"></i>
            <i class="far fa-comment"></i>
            <i class="far fa-paper-plane"></i>
            <i class="far fa-bookmark"></i>
        </div>
        <div style="margin-top:4px;font-size:13px;color:#aaa;"><i class="fas fa-heart" style="color:#ed4956;font-size:12px;"></i> <span id="reelLikeCount">${post.likes}</span> likes</div>
    `;
    info.querySelector('.reel-like-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(e.target.dataset.postid);
        toggleLike(id, false);
    });
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Progress bar
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        document.getElementById('reelProgressFill').style.width = progress + '%';
    });
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
}

function updateReelPlayer(postId) {
    if (currentReelPostId !== postId) return;
    const post = POSTS.find(p => p.id === postId);
    if (!post) return;
    const count = document.getElementById('reelLikeCount');
    if (count) count.textContent = post.likes;
    const btn = document.querySelector('.reel-like-btn');
    if (btn) {
        btn.className = post.liked ? 'fas fa-heart reel-like-btn liked' : 'far fa-heart reel-like-btn';
        btn.style.color = post.liked ? '#ed4956' : '#fff';
    }
}

document.getElementById('reelPlayPause').addEventListener('click', () => {
    const video = document.getElementById('reelVideo');
    if (video.paused) {
        video.play();
        document.getElementById('reelPlayPause').innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        document.getElementById('reelPlayPause').innerHTML = '<i class="fas fa-play"></i>';
    }
});
document.getElementById('reelVideo').addEventListener('click', () => {
    document.getElementById('reelPlayPause').click();
});
document.getElementById('reelVideo').addEventListener('play', () => {
    document.getElementById('reelPlayPause').innerHTML = '<i class="fas fa-pause"></i>';
});
document.getElementById('reelVideo').addEventListener('pause', () => {
    document.getElementById('reelPlayPause').innerHTML = '<i class="fas fa-play"></i>';
});

document.getElementById('reelClose').addEventListener('click', closeReelPlayer);
document.getElementById('reelPlayer').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeReelPlayer();
});

function closeReelPlayer() {
    const overlay = document.getElementById('reelPlayer');
    const video = document.getElementById('reelVideo');
    video.pause();
    video.src = '';
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    currentReelPostId = null;
}

// ============================================================
// STORY VIEWER
// ============================================================
function openStory(story) {
    const viewer = document.getElementById('storyViewer');
    document.getElementById('storyImg').src = story.storyImg;
    document.getElementById('storyUser').textContent = story.username;
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
    story.seen = true;
    renderStories();
}
document.getElementById('storyClose').addEventListener('click', () => {
    document.getElementById('storyViewer').classList.remove('open');
    document.body.style.overflow = '';
});
document.getElementById('storyViewer').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('storyViewer').classList.remove('open');
        document.body.style.overflow = '';
    }
});

// ============================================================
// SEARCH, MESSAGES, PROFILE
// ============================================================
function renderSearch() {
    const grid = document.getElementById('searchGrid');
    grid.innerHTML = SEARCH_IMAGES.map(url => `
        <div class="grid-item"><img src="${url}" loading="lazy" alt="search" /></div>
    `).join('');
}

function renderMessages() {
    const list = document.getElementById('messagesList');
    list.innerHTML = MESSAGES.map(m => `
        <div class="msg-item">
            <img src="${m.user.avatar}" alt="${m.user.username}" />
            <div class="msg-info">
                <div class="msg-name">${m.user.username}</div>
                <div class="msg-preview">${m.preview}</div>
            </div>
            <div class="msg-time">${m.time}</div>
        </div>
    `).join('');
}

function renderProfile() {
    const user = USERS[0];
    const header = document.getElementById('profileHeader');
    header.innerHTML = `
        <div class="profile-avatar"><img src="${user.avatar}" alt="${user.username}" /></div>
        <div class="profile-stats">
            <div class="stat"><div class="num">12</div><div class="label">Posts</div></div>
            <div class="stat"><div class="num">384</div><div class="label">Followers</div></div>
            <div class="stat"><div class="num">192</div><div class="label">Following</div></div>
        </div>
    `;
    const bio = document.getElementById('profileBio');
    bio.innerHTML = `
        <div class="bio-name">${user.username}</div>
        <div class="bio-text">✨ Creative explorer • Coffee lover ☕ • Code & Art</div>
        <div class="bio-link">github.com/username</div>
    `;
    const grid = document.getElementById('profileGrid');
    grid.innerHTML = PROFILE_GRID_IMAGES.map(url => `
        <div class="grid-item"><img src="${url}" loading="lazy" alt="profile post" /></div>
    `).join('');
    document.querySelectorAll('.profile-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.profile-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
    document.getElementById('mainContent').scrollTop = 0;
}

document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.page);
    });
});

// ============================================================
// STATUS BAR TIME
// ============================================================
function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('statusTime').textContent = `${h}:${m}`;
}
updateTime();
setInterval(updateTime, 30000);

// ============================================================
// SEARCH INPUT
// ============================================================
document.getElementById('searchInput')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    const items = document.querySelectorAll('#searchGrid .grid-item');
    items.forEach(item => {
        item.style.display = 'block';
    });
});

// ============================================================
// INIT
// ============================================================
renderStories();
renderFeed();
renderSearch();
renderMessages();
renderProfile();
navigateTo('page-home');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('postModal').classList.remove('open');
        document.getElementById('storyViewer').classList.remove('open');
        closeReelPlayer();
        document.body.style.overflow = '';
    }
});

console.log('✅ Instagram Clone with custom videos loaded!');
console.log('📹 Videos: Shiva_ball_hit, Shiva_shiva_part_1, Shiva_shop_throw, Thief');
console.log('❤️ Double-tap any post to like.');
console.log('▶️ Click a Reel to open full-screen player.');