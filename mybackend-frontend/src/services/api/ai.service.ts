import axios from 'axios';

const API_URL = '/api/ai';

export const aiService = {
    async generateStory(prompt: string) {
        const response = await axios.post(`${API_URL}/generate-story`, { prompt });
        return response.data;
    },

    async generateIllustration(prompt: string) {
        const response = await axios.post(`${API_URL}/generate-image`, { prompt });
        return response.data;
    }
};
