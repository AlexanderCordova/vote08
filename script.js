// VA-08 Voting Tool - Main JavaScript
// =====================================

// Configuration
const CONFIG = {
    electionDate: new Date('2026-08-04T20:00:00'), // 8 PM ET on Election Day
    mapCenter: [-77.1, 38.87], // Center of VA-08
    mapZoom: 10.5,
    locationsDataUrl: './locations.json'
};

// State
let map;
let markers = [];
let locationsData = [];
let activeLocationId = null;

// =====================================
// Initialize on page load
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initMap();
    initPathCards();
    initShareFeatures();
    loadLocations();
});

// =====================================
// Countdown Timer
// =====================================

function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    function updateCountdown() {
        const now = new Date();
        const timeLeft = CONFIG.electionDate - now;

        if (timeLeft <= 0) {
            countdownEl.textContent = 'Election Day is here!';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            countdownEl.textContent = `${days} day${days !== 1 ? 's' : ''} until Election Day`;
        } else if (hours > 0) {
            countdownEl.textContent = `${hours} hour${hours !== 1 ? 's' : ''} until polls close`;
        } else {
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            countdownEl.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} until polls close`;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// =====================================
// Map Initialization
// =====================================

function initMap() {
    try {
        map = new maplibregl.Map({
            container: 'map',
            style: {
                version: 8,
                sources: {
                    'openmaptiles': {
                        type: 'raster',
                        tiles: [
                            'https://tiles.openfreemap.org/styles/liberty/{z}/{x}/{y}.png'
                        ],
                        tileSize: 256,
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                },
                layers: [
                    {
                        id: 'background',
                        type: 'background',
                        paint: {
                            'background-color': '#faf9f6'
                        }
                    },
                    {
                        id: 'openmaptiles',
                        type: 'raster',
                        source: 'openmaptiles'
                    }
                ]
            },
            center: CONFIG.mapCenter,
            zoom: CONFIG.mapZoom
        });

        // Add navigation controls
        map.addControl(new maplibregl.NavigationControl(), 'top-right');

    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('map').innerHTML =
            '<div style="padding: 2rem; text-align: center;">Map could not be loaded. Please check your internet connection.</div>';
    }
}

// =====================================
// Load & Display Locations
// =====================================

async function loadLocations() {
    try {
        const response = await fetch(CONFIG.locationsDataUrl);
        const data = await response.json();
        locationsData = data.locations;

        // Wait for map to load before adding markers
        if (map) {
            map.on('load', () => {
                addMarkersToMap();
            });
        }

        // Populate location list
        populateLocationsList();

    } catch (error) {
        console.error('Error loading locations:', error);
        document.getElementById('locationsItems').innerHTML =
            '<p style="color: #9B9B9B; padding: 1rem;">Could not load locations. Please refresh the page.</p>';
    }
}

function addMarkersToMap() {
    locationsData.forEach(location => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = 'url(assets/ballot-marker.svg)';
        el.style.width = '40px';
        el.style.height = '48px';
        el.style.backgroundSize = 'contain';
        el.style.cursor = 'pointer';
        el.setAttribute('data-location-id', location.id);

        // Create popup content
        const popupContent = `
            <div class="location-popup">
                <h4>${location.name}</h4>
                <p class="popup-address">${location.address}</p>
                <div class="popup-hours">
                    <strong>Hours:</strong><br>
                    ${location.hours.join('<br>')}
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="popup-directions"
                   data-umami-event="get-directions">
                    Get Directions
                </a>
            </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(popupContent);

        // Create marker
        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([location.lng, location.lat])
            .setPopup(popup)
            .addTo(map);

        // Store marker reference
        markers.push({ id: location.id, marker, element: el });

        // Click handler for marker
        el.addEventListener('click', () => {
            setActiveLocation(location.id);
        });
    });
}

function populateLocationsList() {
    const listContainer = document.getElementById('locationsItems');
    const countEl = document.getElementById('locationsCount');

    if (!listContainer) return;

    countEl.textContent = `${locationsData.length} locations`;

    listContainer.innerHTML = locationsData.map(location => `
        <div class="location-item" data-location-id="${location.id}">
            <h4>${location.name}</h4>
            <div class="county-badge">${location.county}</div>
            <p class="address">${location.address}</p>
            <div class="hours">
                <strong>Hours:</strong><br>
                ${location.hours.join('<br>')}
            </div>
        </div>
    `).join('');

    // Add click handlers to location items
    document.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', () => {
            const locationId = item.getAttribute('data-location-id');
            setActiveLocation(locationId);

            // Scroll to map on mobile
            if (window.innerWidth < 1024) {
                document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

function setActiveLocation(locationId) {
    activeLocationId = locationId;

    // Update active state in list
    document.querySelectorAll('.location-item').forEach(item => {
        if (item.getAttribute('data-location-id') === locationId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Find and trigger marker
    const markerData = markers.find(m => m.id === locationId);
    const location = locationsData.find(loc => loc.id === locationId);

    if (markerData && location) {
        // Pan to marker
        map.flyTo({
            center: [location.lng, location.lat],
            zoom: 13,
            duration: 1000
        });

        // Open popup
        markerData.marker.togglePopup();
    }
}

// =====================================
// Voter Path Cards
// =====================================

function initPathCards() {
    const pathAway = document.getElementById('path-away');
    const pathInPerson = document.getElementById('path-in-person');
    const modal = document.getElementById('pathModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');

    if (!pathAway || !pathInPerson || !modal) return;

    pathAway.addEventListener('click', () => {
        showPathModal('away');
    });

    pathInPerson.addEventListener('click', () => {
        showPathModal('in-person');
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function showPathModal(pathType) {
        if (pathType === 'away') {
            modalBody.innerHTML = `
                <h2>Voting by Absentee Ballot</h2>
                <p><strong>Perfect for:</strong> College students away for the summer, work travel, or anyone who can't vote in person.</p>

                <h3>Steps to Vote Absentee:</h3>
                <ol>
                    <li><strong>Request your ballot by July 24, 2026, 5:00 PM</strong>
                        <br><a href="https://www.vote.org/absentee-ballot/virginia/" target="_blank" rel="noopener" data-umami-event="modal-request-absentee" class="btn-primary" style="margin-top: 0.5rem; display: inline-block;">Request Absentee Ballot</a>
                    </li>
                    <li><strong>Receive your ballot by mail</strong> at the address you provided</li>
                    <li><strong>Fill out your ballot</strong> carefully, following all instructions</li>
                    <li><strong>Return your ballot</strong> by mail (must be postmarked by Aug 4) or drop it off at any early voting location by 7:00 PM on Aug 4</li>
                </ol>

                <p><strong>Important:</strong> No excuse is needed to vote absentee in Virginia. Any registered voter can request a mail ballot.</p>
            `;
        } else {
            modalBody.innerHTML = `
                <h2>Voting in Person</h2>
                <p><strong>Two ways to vote in person:</strong></p>

                <h3>Option 1: Early Voting (June 18 – August 1)</h3>
                <ul>
                    <li>Vote at any early voting location in your jurisdiction</li>
                    <li>No excuse needed</li>
                    <li>See locations below on the map</li>
                </ul>
                <a href="#locations" class="btn-primary" style="display: inline-block; margin-bottom: 1.5rem;">View Early Voting Locations</a>

                <h3>Option 2: Election Day (August 4, 2026)</h3>
                <ul>
                    <li>Vote at your assigned polling place</li>
                    <li>Polls open 6:00 AM – 7:00 PM</li>
                    <li>Find your polling place:
                        <a href="https://vote.elections.virginia.gov/VoterInformation/Lookup/polling" target="_blank" rel="noopener" data-umami-event="modal-find-polling">Find Your Polling Place</a>
                    </li>
                </ul>

                <p><strong>What to bring:</strong> Bring your voter registration card or a valid ID (driver's license, passport, student ID, etc.).</p>
            `;
        }

        modal.style.display = 'block';
    }
}

// =====================================
// Share Features
// =====================================

function initShareFeatures() {
    // Generate "I'm Voting" Card
    const generateBtn = document.getElementById('generateCardBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateShareCard);
    }

    // Copy link button
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            const link = window.location.href;
            navigator.clipboard.writeText(link).then(() => {
                copyLinkBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyLinkBtn.textContent = 'Copy Link';
                }, 2000);
            });
        });
    }

    // Copy toolkit message
    const copyToolkitBtn = document.getElementById('copyToolkitBtn');
    if (copyToolkitBtn) {
        copyToolkitBtn.addEventListener('click', () => {
            const message = document.getElementById('toolkitMessage').innerText;
            navigator.clipboard.writeText(message).then(() => {
                copyToolkitBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyToolkitBtn.textContent = 'Copy Message';
                }, 2000);
            });
        });
    }
}

function generateShareCard() {
    const canvas = document.getElementById('shareCanvas');
    const ctx = canvas.getContext('2d');
    const preview = document.getElementById('cardPreview');
    const cardImage = document.getElementById('cardImage');
    const downloadBtn = document.getElementById('downloadCardBtn');

    // Set canvas size (social media friendly: 1200x630)
    canvas.width = 1200;
    canvas.height = 630;

    // Background
    ctx.fillStyle = '#1B2A4A'; // Navy
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Accent bar
    ctx.fillStyle = '#C9A227'; // Brass
    ctx.fillRect(0, 0, canvas.width, 20);

    // Text
    ctx.fillStyle = '#FAF9F6'; // Warm white
    ctx.textAlign = 'center';

    // Main text
    ctx.font = 'bold 72px "Roboto Slab", serif';
    ctx.fillText('I\'m Voting', canvas.width / 2, 200);

    ctx.font = '48px "Inter", sans-serif';
    ctx.fillText('VA-08 Democratic Primary', canvas.width / 2, 280);

    ctx.fillStyle = '#C9A227'; // Brass
    ctx.font = 'bold 64px "Roboto Slab", serif';
    ctx.fillText('August 4, 2026', canvas.width / 2, 370);

    // Bottom text
    ctx.fillStyle = '#FAF9F6';
    ctx.font = '32px "Inter", sans-serif';
    ctx.fillText('Find your voting location:', canvas.width / 2, 480);

    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText('vote08.vercel.app', canvas.width / 2, 540);

    // Convert to image
    const dataUrl = canvas.toDataURL('image/png');
    cardImage.src = dataUrl;
    downloadBtn.href = dataUrl;

    // Show preview
    preview.style.display = 'block';

    // Track event
    if (window.umami) {
        umami.track('generate-share-card');
    }
}

// =====================================
// Analytics Event Tracking
// =====================================

// Track action button clicks
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-umami-event]');
    if (target && window.umami) {
        const eventName = target.getAttribute('data-umami-event');
        umami.track(eventName);
    }
});

// =====================================
// Utility Functions
// =====================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update short link display after deployment
function updateShortLink(newLink) {
    const shortLinkEl = document.getElementById('shortLink');
    const linkPlaceholders = document.querySelectorAll('.link-placeholder');

    if (shortLinkEl) {
        shortLinkEl.textContent = newLink;
    }

    linkPlaceholders.forEach(el => {
        el.textContent = newLink;
    });
}

// Console message for developers
console.log('%cVA-08 Voting Tool', 'font-size: 24px; font-weight: bold; color: #1B2A4A;');
console.log('%cNonpartisan voter resource | Built with ❤️ by students & volunteers', 'font-size: 14px; color: #C9A227;');
console.log('%cView source: https://github.com/AlexanderCordova/vote08', 'font-size: 12px; color: #9B9B9B;');
