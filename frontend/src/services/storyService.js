import api from './api';

export default {
    async getAll() {
        const response = await api.get('/stories');
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/stories/${id}`);
        return response.data;
    },

    async create(story) {
        const response = await api.post('/stories', story);
        return response.data;
    },

    async update(id, story) {
        const response = await api.put(`/stories/${id}`, story);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/stories/${id}`);
        return response.data;
    }
}; 