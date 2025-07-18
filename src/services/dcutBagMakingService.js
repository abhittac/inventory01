import api from './api';

const API_BASE_URL = '/dcut/bagmaking';

const OrderService = {
    // 1. List all orders
    listOrders: async(status) => {
        try {
            const response = await api.get(`${API_BASE_URL}?status=${status}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
    listMaterials: async(orderId) => {
        try {
            const response = await api.get(`${API_BASE_URL}/${orderId}/listMaterials`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
    // 2. Verification API
    verifyOrder: async(orderId, materialId, scanData) => {
        try {
            const response = await api.post(`${API_BASE_URL}/${orderId}/verify`, { materialId, scanData });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 3. Status update API
    updateOrderStatus: async(orderId, status, unitToUpdate, remarks) => {
        try {
            const response = await api.put(`${API_BASE_URL}/${orderId}`, {
                status,
                unitToUpdate,
                remarks
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },


    // 4. Direct billing API
    directBilling: async(orderId, scrapQuantity, bagType) => {
        console.log('data', bagType, scrapQuantity);
        try {
            const response = await api.put(`${API_BASE_URL}/${orderId}/billing`, {
                type: bagType,
                billingStatus: 'completed',
                scrapQuantity: scrapQuantity
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 5. Move to delivery API
    handleMoveToOpsert: async(orderId, scrapQuantity, bagType) => {
        try {
            const response = await api.put(`${API_BASE_URL}/${orderId}/Opsert`, {
                type: bagType,
                scrapQuantity: scrapQuantity
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    getRecords: async() => {
        const response = await api.get(`${API_BASE_URL}/production/records`);
        return response.data;
    },
};

export default OrderService;