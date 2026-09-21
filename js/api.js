const API_URL = 'https://zenvolt-qh50.onrender.com/api';

async function request(url, options = {}) {
    try {
        const res = await fetch(url, options);
        return await res.json();
    } catch (err) {
        return { message: 'Network error. Please check your connection.' };
    }
}

const api = {
    register: (data) => request(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    login: (data) => request(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),

    getStations: () => request(`${API_URL}/stations`),

    createBooking: (data) => request(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` },
        body: JSON.stringify(data)
    }),

    getMyBookings: () => request(`${API_URL}/bookings/my`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }),

    cancelBooking: (id) => request(`${API_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }),

    getProfile: () => request(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` }
    }),

    addWalletMoney: (amount) => request(`${API_URL}/profile/wallet/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('zenvo_token')}` },
        body: JSON.stringify({ amount })
    }),
};
