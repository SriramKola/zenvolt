class EVChargingApp {
    constructor() {
        this.map = null;
        this.userLocation = null;
        this.stations = [];
        this.init();
    }

    init() {
        this.loadStations();
        if (document.getElementById('map')) {
            this.initMap();
        }
        this.setupEventListeners();
        this.setMinDateTime();
    }

    async loadStations() {
        try {
            const stations = await api.getStations();
            this.stations = stations.map(s => ({ ...s, id: s._id }));
        } catch {
            this.stations = [];
        }
        this.populateStationsList();
        this.populateStationSelect();
        if (this.map) this.addStationMarkers();
    }

    initMap() {
        const mapElement = document.getElementById('map');
        if (!mapElement) return;
        
        const defaultLat = 17.4065;
        const defaultLng = 78.4772;

        this.map = L.map('map').setView([defaultLat, defaultLng], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        this.addStationMarkers();
        this.getUserLocation();
    }

    addStationMarkers() {
        if (!this.map) return;
        
        this.stations.forEach(station => {
            const icon = this.getStationIcon(station.status);
            const marker = L.marker([station.lat, station.lng], { icon })
                .addTo(this.map)
                .bindPopup(this.createPopupContent(station));
        });
    }

    getStationIcon(status) {
        const color = status === 'available' ? 'green' : 
                     status === 'busy' ? 'orange' : 'red';
        
        return L.divIcon({
            className: 'custom-marker',
            html: `<i class="fas fa-charging-station" style="color: ${color}; font-size: 20px;"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    createPopupContent(station) {
        return `
            <div class="station-popup">
                <h6>${station.name}</h6>
                <p><strong>Type:</strong> ${station.type}</p>
                <p><strong>Price:</strong> ${station.price}</p>
                <p><strong>Available:</strong> ${station.available}/${station.slots}</p>
                <span class="station-status status-${station.status}">${station.status.toUpperCase()}</span>
                <br><br>
                <button class="btn btn-sm btn-primary" onclick="window.location.href='booking.html'">
                    Book Now
                </button>
            </div>
        `;
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    if (this.map) {
                        L.marker([this.userLocation.lat, this.userLocation.lng])
                            .addTo(this.map)
                            .bindPopup("Your Location")
                            .openPopup();
                        
                        this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
                    }
                },
                (error) => {
                    console.log("Location access denied or unavailable");
                }
            );
        }
    }

    populateStationsList() {
        const stationsList = document.getElementById('stationsList');
        if (!stationsList) return;
        
        stationsList.innerHTML = '';

        this.stations.forEach(station => {
            const stationElement = document.createElement('div');
            stationElement.className = 'station-item';
            const distanceText = station.distance ? `${station.distance.toFixed(1)} km away` : '';
            stationElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="mb-1">${station.name}</h6>
                        <small class="text-muted">${station.type} • ${station.price}</small>
                        ${distanceText ? `<br><small class="text-info">${distanceText}</small>` : ''}
                        <br>
                        <small>Available: ${station.available}/${station.slots} slots</small>
                    </div>
                    <span class="station-status status-${station.status}">${station.status}</span>
                </div>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="app.viewStation(${station.id})">
                    View on Map
                </button>
            `;
            stationsList.appendChild(stationElement);
        });
    }

    populateStationSelect() {
        const select = document.getElementById('stationSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">Choose a station...</option>';
        
        this.stations.forEach(station => {
            if (station.status === 'available') {
                const option = document.createElement('option');
                option.value = station.id;
                option.textContent = `${station.name} (${station.available} slots available)`;
                select.appendChild(option);
            }
        });
    }

    setupEventListeners() {
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBooking();
            });
        }
    }

    setMinDateTime() {
        const bookingTimeInput = document.getElementById('bookingTime');
        if (!bookingTimeInput) return;
        
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        const minDateTime = now.toISOString().slice(0, 16);
        bookingTimeInput.min = minDateTime;
        bookingTimeInput.value = minDateTime;
    }

    findNearbyStations() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    if (this.map) {
                        L.marker([this.userLocation.lat, this.userLocation.lng])
                            .addTo(this.map)
                            .bindPopup("Your Location")
                            .openPopup();
                        
                        this.map.setView([this.userLocation.lat, this.userLocation.lng], 15);
                        this.sortStationsByDistance();
                    }
                },
                (error) => {
                    alert('Location access denied. Showing all stations.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    sortStationsByDistance() {
        if (!this.userLocation) return;
        
        this.stations.forEach(station => {
            station.distance = this.calculateDistance(
                this.userLocation.lat, this.userLocation.lng,
                station.lat, station.lng
            );
        });
        
        this.stations.sort((a, b) => a.distance - b.distance);
        this.populateStationsList();
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    viewStation(stationId) {
        const station = this.stations.find(s => s.id === stationId);
        if (station && this.map) {
            this.map.setView([station.lat, station.lng], 16);
        }
    }

    async handleBooking() {
        const data = {
            stationId: document.getElementById('stationSelect').value,
            stationName: document.getElementById('stationSelect').selectedOptions[0]?.text,
            serviceType: document.querySelector('input[name="serviceType"]:checked')?.value,
            chargingType: document.getElementById('chargingType').value,
            bookingTime: document.getElementById('bookingTime').value,
            duration: parseInt(document.getElementById('duration').value),
            vehicleModel: document.getElementById('vehicleModel').value,
            phone: document.getElementById('phoneNumber').value,
            pickupAddress: document.getElementById('pickupAddress')?.value || ''
        };

        const token = localStorage.getItem('zenvo_token');
        if (!token) return window.location.href = 'login.html';

        const res = await api.createBooking(data);
        if (res.booking) {
            alert(`Booking confirmed! ₹${res.booking.amount} deducted. Wallet balance: ₹${res.walletBalance}`);
            window.location.href = 'profile.html';
        } else {
            alert(res.message || 'Booking failed');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.app = new EVChargingApp();
});

function findNearbyStations() {
    if (window.app) {
        window.app.findNearbyStations();
    }
}