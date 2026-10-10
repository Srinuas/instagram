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