import axios from 'axios';

const API_URL = '/api/books';

export const booksService = {
    async getAllBooks() {
        const response = await axios.get(API_URL);
        return response.data;
    },

    async getBookById(id: string) {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    async createBook(title: string, description: string) {
        const response = await axios.post(API_URL, { title, description });
        return response.data;
    },

    async updateBook(id: string, data: any) {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    async deleteBook(id: string) {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};
