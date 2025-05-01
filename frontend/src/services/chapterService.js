import api from './api';

export default {
    async getByStoryId(storyId) {
        const response = await api.get(`/stories/${storyId}/chapters`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/chapters/${id}`);
        return response.data;
    },

    async create(chapter) {
        const response = await api.post('/chapters', chapter);
        return response.data;
    },

    async update(id, chapter) {
        const response = await api.put(`/chapters/${id}`, chapter);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/chapters/${id}`);
        return response.data;
    }
}; 