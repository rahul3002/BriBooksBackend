import axios from 'axios';

const API_URL = '/api/payments';

export const paymentService = {
    async createPaymentIntent(amount: number, currency: string = 'usd') {
        const response = await axios.post(`${API_URL}/create-intent`, { amount, currency });
        return response.data;
    },

    async getPaymentHistory() {
        const response = await axios.get(`${API_URL}/history`);
        return response.data;
    },

    async verifyPayment(paymentId: string) {
        const response = await axios.post(`${API_URL}/verify`, { paymentId });
        return response.data;
    }
};
