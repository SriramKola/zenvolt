const API_URL = 'https://zenvolt-qh50.onrender.com/api';

const api = {
    // Auth
    register: (data) => fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),

    login: (data) => fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(r => r.json()),

    // Stations
    getStations: () => fetch(`${API_URL}/stations`).then(r => r.json()),

    // Bookings
    createBooking: (data) => fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` },
        body: JSON.stringify(data)
    }).then(r => r.json()),

    getMyBookings: () => fetch(`${API_URL}/bookings/my`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }).then(r => r.json()),

    cancelBooking: (id) => fetch(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }).then(r => r.json()),

    // Profile
    getProfile: () => fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }).then(r => r.json()),

    addWalletMoney: (amount) => fetch(`${API_URL}/profile/wallet/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` },
        body: JSON.stringify({ amount })
    }).then(r => r.json()),
};
