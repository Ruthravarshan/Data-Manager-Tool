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
    getIntegrations: async (typeFilter?: string, statusFilter?: string) => {
        const params = new URLSearchParams();
        if (typeFilter && typeFilter !== 'All Types') {
            params.append('type_filter', typeFilter);
        }
        if (statusFilter && statusFilter !== 'All Statuses') {
            params.append('status_filter', statusFilter);
        }
        const response = await api.get(`/integrations/?${params.toString()}`);
        return response.data;
    },

    getIntegrationTypes: async () => {
        const response = await api.get('/integrations/filters/types');
        return response.data;
    },

    getIntegrationStatuses: async () => {
        const response = await api.get('/integrations/filters/statuses');
        return response.data;
    },

    getProtocols: async () => {
        const response = await api.get('/integrations/filters/protocols');
        return response.data;
    },

    createIntegration: async (integrationData: any) => {
        const response = await api.post('/integrations/', integrationData);
        return response.data;
    },

    updateIntegration: async (integrationId: number, integrationData: any) => {
        const response = await api.put(`/integrations/${integrationId}`, integrationData);
        return response.data;
    },

    deleteIntegration: async (integrationId: number) => {
        const response = await api.delete(`/integrations/${integrationId}`);
        return response.data;
    },

    scanFolder: async (integrationId: number) => {
        const response = await api.post(`/data-files/scan/${integrationId}`);
        return response.data;
    }
};

export const dataFileService = {
    getDataFiles: async (section?: string, status?: string, integrationId?: number, protocolId?: string) => {
        const params = new URLSearchParams();
        if (section) {
            params.append('section', section);
        }
        if (status) {
            params.append('status', status);
        }
        if (integrationId) {
            params.append('integration_id', integrationId.toString());
        }
        if (protocolId) {
            params.append('protocol_id', protocolId);
        }
        const response = await api.get(`/data-files/?${params.toString()}`);
        return response.data;
    },

    getSections: async (protocolId?: string) => {
        const params = new URLSearchParams();
        if (protocolId) {
            params.append('protocol_id', protocolId);
        }
        const response = await api.get(`/data-files/sections?${params.toString()}`);
        return response.data;
    },

    deleteDataFile: async (fileId: number) => {
        const response = await api.delete(`/data-files/${fileId}`);
        return response.data;
    }
};

export const databaseConnectionService = {
    testConnection: async (connectionData: {
        db_type: string;
        host: string;
        port: number;
        database_name: string;
        username: string;
        password: string;
    }) => {
        const response = await api.post('/database-connections/test', connectionData);
        return response.data;
    },

    fetchTables: async (connectionData: {
        db_type: string;
        host: string;
        port: number;
        database_name: string;
        username: string;
        password: string;
    }) => {
        const response = await api.post('/database-connections/fetch-tables', connectionData);
        return response.data;
    },

    saveCredentials: async (credentialsData: {
        integration_id: number;
        db_type: string;
        host: string;
        port: number;
        database_name: string;
        username: string;
        password: string;
    }) => {
        const response = await api.post('/database-connections/save', credentialsData);
        return response.data;
    },

    getCredentials: async (integrationId: number) => {
        const response = await api.get(`/database-connections/${integrationId}`);
        return response.data;
    },

    importDatabaseTables: async (integrationId: number, tableNames: string[]) => {
        const response = await api.post(`/database-connections/import-data/${integrationId}`, tableNames);
        return response.data;
    },

    deleteCredentials: async (integrationId: number) => {
        const response = await api.delete(`/database-connections/${integrationId}`);
        return response.data;
    }
};

export default api;
