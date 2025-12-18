import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dashboardService = {
    getMetrics: async () => {
        const response = await api.get('/dashboard/metrics');
        return response.data;
    },
};

export const studyService = {
    getStudies: async () => {
        const response = await api.get('/studies/');
        return response.data;
    },
    createStudy: async (studyData: any) => {
        const response = await api.post('/studies/', studyData);
        return response.data;
    },
    uploadProtocol: async (studyId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/studies/${studyId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteStudy: async (studyId: string) => {
        const response = await api.delete(`/studies/${studyId}`);
        return response.data;
    }
};

export const documentService = {
    getDocuments: async (studyId: string) => {
        const response = await api.get(`/studies/${studyId}/documents`);
        return response.data;
    },

    uploadDocument: async (studyId: string, file: File, source: string = 'Manual upload') => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/studies/${studyId}/documents?source=${encodeURIComponent(source)}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateDocument: async (documentId: number, name: string) => {
        const response = await api.put(`/studies/documents/${documentId}?name=${encodeURIComponent(name)}`);
        return response.data;
    },

    deleteDocument: async (documentId: number) => {
        const response = await api.delete(`/studies/documents/${documentId}`);
        return response.data;
    }
};

export const integrationService = {
    getIntegrations: async () => {
        const response = await api.get('/integrations/');
        return response.data;
    }
};

export default api;
