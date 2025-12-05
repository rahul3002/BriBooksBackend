import axios from 'axios';

const API_URL = '/api/notifications';

export const notificationService = {
    async getNotifications() {
        const response = await axios.get(API_URL);
        return response.data;
    },

    async markAsRead(id: string) {
        const response = await axios.put(`${API_URL}/${id}/read`);
        return response.data;
    },

    async markAllAsRead() {
        const response = await axios.put(`${API_URL}/read-all`);
        return response.data;
    },

    async subscribeToTopic(topic: string) {
        const response = await axios.post(`${API_URL}/subscribe`, { topic });
        return response.data;
    }
};
