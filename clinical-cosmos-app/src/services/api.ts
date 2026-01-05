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
    getActiveStudiesCount: async () => {
        const response = await api.get('/studies/count/active');
        return response.data.count;
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
    getIntegrations: async (type?: string, status?: string) => {
        const params = new URLSearchParams();
        if (type && type !== 'All Types') params.append('type_filter', type);
        if (status && status !== 'All Statuses') params.append('status_filter', status);

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
    createIntegration: async (data: any) => {
        const response = await api.post('/integrations/', data);
        return response.data;
    },
    updateIntegration: async (id: number, data: any) => {
        const response = await api.put(`/integrations/${id}`, data);
        return response.data;
    },
    deleteIntegration: async (id: number) => {
        const response = await api.delete(`/integrations/${id}`);
        return response.data;
    },
    scanFolder: async (integrationId: number | string) => {
        // This actually maps to the data_files router scan endpoint
        const response = await api.post(`/data-files/scan/${integrationId}`);
        return response.data;
    }
};

export const dataFileService = {
    getDataFiles: async (section?: string, status?: string, protocol_id?: string, integration_id?: string) => {
        const params = new URLSearchParams();
        if (section) params.append('section', section);
        if (status) params.append('status', status);
        if (protocol_id) params.append('protocol_id', protocol_id);
        if (integration_id && !isNaN(Number(integration_id))) params.append('integration_id', integration_id);

        const queryString = params.toString();
        const response = await api.get(`/data-files/${queryString ? '?' + queryString : ''}`);
        return response.data;
    },

    getSections: async () => {
        const response = await api.get('/data-files/sections');
        return response.data;
    },

    scanFolder: async (integration_id: string) => {
        const response = await api.post(`/data-files/scan/${integration_id}`);
        return response.data;
    },

    deleteDataFile: async (file_id: string | number) => {
        const response = await api.delete(`/data-files/${file_id}`);
        return response.data;
    },

    getFilePreview: async (filePath: string) => {
        const response = await api.get(`/preview?file_path=${encodeURIComponent(filePath)}&nrows=10`);
        return response.data;
    },

    getFileData: async (fileId: number, limit: number = 100, offset: number = 0) => {
        const response = await api.get(`/data-files/${fileId}/data?limit=${limit}&offset=${offset}`);
        return response.data;
    },

    getSectionMetadata: async (section: string, protocolId?: string) => {
        const params = new URLSearchParams();
        params.append('section', section);
        if (protocolId) params.append('protocol_id', protocolId);
        const response = await api.get(`/data-files/metadata?${params.toString()}`);
        return response.data;
    }
};

export const activityService = {
    logActivity: async (activity: {
        action_type: string;
        description: string;
        user_name?: string;
        related_entity_id?: string;
        related_entity_type?: string;
    }) => {
        const response = await api.post('/activities/', activity);
        return response.data;
    },

    getRecentActivities: async (limit: number = 10) => {
        const response = await api.get(`/activities/recent?limit=${limit}`);
        return response.data;
    },

    getAllActivities: async (skip: number = 0, limit: number = 100) => {
        const response = await api.get(`/activities/?skip=${skip}&limit=${limit}`);
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
