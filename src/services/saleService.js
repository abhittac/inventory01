import api from './api';

const createService = (endpoint) => ({
    getAll: async (params) => {
        try {
            const response = await api.get(`/admin/${endpoint}`, { params });
            return response.data;
        } catch (error) {
            console.error(`API Error [${endpoint} - getAll]:`, error);
            throw new Error(error.response?.data?.message || 'Failed to fetch data');
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/admin/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`API Error [${endpoint} - getById]:`, error);
            throw new Error(error.response?.data?.message || 'Failed to fetch data by ID');
        }
    },

    create: async (data) => {
        console.log('data', data);
        try {
            const response = await api.post(`/admin/${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error(`API Error [${endpoint} - create]:`, error);
            throw new Error(error.response?.data?.message || 'Failed to create data');
        }
    },

    update: async (id, data) => {
        try {
            const response = await api.put(`/admin/${endpoint}/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`API Error [${endpoint} - update]:`, error);
            throw new Error(error.response?.data?.message || 'Failed to update data');
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/admin/${endpoint}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`API Error [${endpoint} - delete]:`, error);
            throw new Error(error.response?.data?.message || 'Failed to delete data');
        }
    }
});

// Define services for each category
// Define services for each category
const salesService = {
    bagColor: createService('bagColor'),
    fabricColor: createService('fabricColor'),
    gsm: createService('gsm'),
    size: createService('size'),
    handleColor: createService('handleColor'),
    fabricQuality: createService('fabricQuality'),
    rollSize: createService('rollSize'), // fixed this line
};

export default salesService;
