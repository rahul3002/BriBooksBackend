import axios from 'axios';

const API_URL = '/api/auth';

export const authService = {
    async login(email: string, password: string) {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    },

    async register(name: string, email: string, password: string) {
        const [firstName, ...lastNameParts] = name.trim().split(' ');
        const lastName = lastNameParts.join(' ') || 'User'; // Default last name if missing
        // Generate a random username since it's required but not in the form
        const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 10000);

        const response = await axios.post(`${API_URL}/register`, {
            email,
            password,
            firstName,
            lastName,
            username
        });
        return response.data;
    },

    async logout() {
        // Optional: Call backend logout if needed
        // await axios.post(`${API_URL}/logout`);
    },

    async getCurrentUser() {
        const response = await axios.get(`${API_URL}/me`);
        return response.data;
    }
};
