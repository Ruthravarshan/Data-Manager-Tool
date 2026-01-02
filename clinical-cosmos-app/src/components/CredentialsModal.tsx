import React, { useState, useEffect } from 'react';
import {
    Shield, Key, Lock, Folder,
    Eye, EyeOff, Save, CheckCircle,
    AlertCircle, FileText, Server,
    X, Database, ChevronDown, ChevronRight,
    Loader2, Download
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { integrationService, databaseConnectionService } from '../services/api';

interface CredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    integrationName?: string;
    integrationId?: number;
}

export default function CredentialsModal({ isOpen, onClose, integrationName = "Integration #1", integrationId }: CredentialsModalProps) {
    const [activeTab, setActiveTab] = useState('api');
    const [showSecret, setShowSecret] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Form states
    const [authType, setAuthType] = useState('OAuth 2.0');
    const [clientId, setClientId] = useState('client_id_123456');
    const [clientSecret, setClientSecret] = useState('****************');
    const [oauthUrl, setOauthUrl] = useState('https://auth.vendor.com/oauth/token');
    const [localPath, setLocalPath] = useState('C:\\ClinicalTrials\\Data\\Source');

    // Security states
    const [auditLogging, setAuditLogging] = useState(true);
    const [accessControls, setAccessControls] = useState({
        admin: true,
        dataManager: true,
        studyManager: false
    });

    // Database connection states
    const [dbType, setDbType] = useState('sqlserver');
    const [dbHost, setDbHost] = useState('');
    const [dbPort, setDbPort] = useState(1433);
    const [dbName, setDbName] = useState('');
    const [dbUsername, setDbUsername] = useState('');
    const [dbPassword, setDbPassword] = useState('');
    const [showDbPassword, setShowDbPassword] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isFetchingTables, setIsFetchingTables] = useState(false);
    const [fetchedTables, setFetchedTables] = useState<any[]>([]);
    const [tableStats, setTableStats] = useState({ total: 0, classified: 0, unclassified: 0 });
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Trial Data Management']));
    const [isSavingDbCredentials, setIsSavingDbCredentials] = useState(false);
    const [dbSaveStatus, setDbSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isImportingData, setIsImportingData] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);
    const [selectedTablesToImport, setSelectedTablesToImport] = useState<Set<string>>(new Set());

    // Load saved database credentials when modal opens
    useEffect(() => {
        if (isOpen && integrationId && activeTab === 'database') {
            loadDatabaseCredentials();
        }
    }, [isOpen, integrationId, activeTab]);

    // Handler functions for database tab
    const loadDatabaseCredentials = async () => {
        if (!integrationId) return;
        try {
            const credentials = await databaseConnectionService.getCredentials(integrationId);
            setDbType(credentials.db_type);
            setDbHost(credentials.host);
            setDbPort(credentials.port);
            setDbName(credentials.database_name);
            setDbUsername(credentials.username);
            // Don't load password for security
        } catch (error) {
            console.log('No saved credentials found');
        }
    };

    const handleTestConnection = async () => {
        setIsTestingConnection(true);
        setConnectionTestResult(null);
        try {
            const result = await databaseConnectionService.testConnection({
                db_type: dbType,
                host: dbHost,
                port: dbPort,
                database_name: dbName,
                username: dbUsername,
                password: dbPassword
            });
            setConnectionTestResult(result);
        } catch (error: any) {
            setConnectionTestResult({
                success: false,
                message: error.response?.data?.detail || 'Connection failed'
            });
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleFetchTables = async () => {
        setIsFetchingTables(true);
        try {
            const result = await databaseConnectionService.fetchTables({
                db_type: dbType,
                host: dbHost,
                port: dbPort,
                database_name: dbName,
                username: dbUsername,
                password: dbPassword
            });
            setFetchedTables(result.tables);
            setTableStats({
                total: result.total_count,
                classified: result.classified_count,
                unclassified: result.unclassified_count
            });
        } catch (error: any) {
            alert(`Failed to fetch tables: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsFetchingTables(false);
        }
    };

    const handleSaveDbCredentials = async () => {
        if (!integrationId) return;
        setIsSavingDbCredentials(true);
        setDbSaveStatus('idle');
        try {
            await databaseConnectionService.saveCredentials({
                integration_id: integrationId,
                db_type: dbType,
                host: dbHost,
                port: dbPort,
                database_name: dbName,
                username: dbUsername,
                password: dbPassword
            });
            setDbSaveStatus('success');
            setTimeout(() => setDbSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to save credentials:', error);
            setDbSaveStatus('error');
        } finally {
            setIsSavingDbCredentials(false);
        }
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const getDbPortPlaceholder = () => {
        switch (dbType) {
            case 'sqlserver': return '1433';
            case 'postgresql': return '5432';
            case 'mysql': return '3306';
            case 'oracle': return '1521';
            default: return '1433';
        }
    };

    const handleImportData = async () => {
        if (!integrationId || selectedTablesToImport.size === 0) return;

        setIsImportingData(true);
        setImportResult(null);

        try {
            const tableNames = Array.from(selectedTablesToImport);
            const result = await databaseConnectionService.importDatabaseTables(integrationId, tableNames);
            setImportResult(result);

            // Show success message
            if (result.success) {
                alert(`Successfully imported ${result.imported_count} tables!\n\nYou can now view the data in the Trial Data Management tab.`);
            }
        } catch (error: any) {
            setImportResult({
                success: false,
                error: error.response?.data?.detail || error.message
            });
            alert(`Failed to import data: ${error.response?.data?.detail || error.message}`);
        } finally {
            setIsImportingData(false);
        }
    };

    const toggleTableSelection = (tableName: string) => {
        const newSelection = new Set(selectedTablesToImport);
        if (newSelection.has(tableName)) {
            newSelection.delete(tableName);
        } else {
            newSelection.add(tableName);
        }
        setSelectedTablesToImport(newSelection);
    };

    const selectAllTables = () => {
        const allTableNames = fetchedTables.map(t => t.table_name);
        setSelectedTablesToImport(new Set(allTableNames));
    };

    const deselectAllTables = () => {
        setSelectedTablesToImport(new Set());
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'api', label: 'API Authentication', icon: Shield },
        { id: 'database', label: 'Database', icon: Database },
        { id: 'connection', label: 'Connection Details', icon: Server },
        { id: 'security', label: 'Security Options', icon: Lock },
        { id: 'local', label: 'Local', icon: Folder }, // Requested "Local" section
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Key className="h-5 w-5 text-gray-700" />
                            <h2 className="text-xl font-bold text-gray-900">Credentials Configuration</h2>
                        </div>
                        <p className="text-sm text-gray-500">Configure secure connection credentials for {integrationName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b px-6 pt-4">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors gap-2",
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 h-[500px] overflow-y-auto">
                    {/* API Authentication */}
                    {activeTab === 'api' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Authentication Type</label>
                                    <select
                                        value={authType}
                                        onChange={(e) => setAuthType(e.target.value)}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                    >
                                        <option>OAuth 2.0</option>
                                        <option>Basic Auth</option>
                                        <option>API Key</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Client ID</label>
                                    <input
                                        type="text"
                                        value={clientId}
                                        onChange={(e) => setClientId(e.target.value)}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Client Secret</label>
                                    <div className="relative">
                                        <input
                                            type={showSecret ? "text" : "password"}
                                            value={clientSecret}
                                            onChange={(e) => setClientSecret(e.target.value)}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">OAuth URL</label>
                                    <input
                                        type="url"
                                        value={oauthUrl}
                                        onChange={(e) => setOauthUrl(e.target.value)}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowSecret(!showSecret)}
                                            className={`w-10 h-5 rounded-full relative transition-colors ${showSecret ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${showSecret ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-sm text-gray-600">Show secret values</span>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                            Test Connection
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all">
                                            Save Credentials
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 mt-6">
                                    <Shield className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-500">
                                        Credentials are securely stored and encrypted. They will be used only for this integration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Connection Details */}
                    {activeTab === 'connection' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                <Server className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Configure Connection</h3>
                            <p className="text-gray-500 max-w-sm">
                                Please configure API authentication details in the Authentication tab to establish a base connection.
                            </p>
                        </div>
                    )}

                    {/* Security Options */}
                    {activeTab === 'security' && (
                        <div className="space-y-8 max-w-2xl mx-auto">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Credential Storage</h3>
                                <p className="text-sm text-gray-500 mb-6">Configure how credentials are stored and managed</p>

                                <div className="space-y-6">
                                    {/* Encryption */}
                                    <div className="p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-200 transition-colors">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Key className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Encryption at Rest</h4>
                                                <p className="text-sm text-gray-500">All credentials are encrypted using AES-256 before storing in the database.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                                            <span className="text-sm font-medium text-gray-700">Key Rotation Period</span>
                                            <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50 hover:bg-white transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20">
                                                <option>90 days</option>
                                                <option>60 days</option>
                                                <option>30 days</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Access Controls */}
                                    <div className="p-5 border border-gray-200 rounded-xl bg-white hover:border-green-200 transition-colors">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Access Controls</h4>
                                                <p className="text-sm text-gray-500">Control which users and roles can access these credentials.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3 pl-11">
                                            {[
                                                { id: 'admin', label: 'Allow Admin Access' },
                                                { id: 'dataManager', label: 'Allow Data Manager Access' },
                                                { id: 'studyManager', label: 'Allow Study Manager Access' }
                                            ].map((role) => (
                                                <label key={role.id} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={accessControls[role.id as keyof typeof accessControls]}
                                                            onChange={(e) => setAccessControls(p => ({ ...p, [role.id]: e.target.checked }))}
                                                            className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{role.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Audit */}
                                    <div className="p-5 border border-gray-200 rounded-xl bg-white hover:border-amber-200 transition-colors">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">Credential Usage Audit</h4>
                                                <p className="text-sm text-gray-500">Track all access and usage of these credentials.</p>
                                            </div>
                                        </div>
                                        <div className="pl-11">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setAuditLogging(!auditLogging)}
                                                    className={`w-12 h-6 rounded-full relative transition-colors ${auditLogging ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${auditLogging ? 'translate-x-6' : ''}`} />
                                                </button>
                                                <span className="text-sm font-medium text-gray-700">Enable Audit Logging</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all">
                                    Save Security Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Database */}
                    {activeTab === 'database' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="grid grid-cols-2 gap-6">
                                {/* Database Type */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Database Type</label>
                                    <select
                                        value={dbType}
                                        onChange={(e) => {
                                            setDbType(e.target.value);
                                            // Update port based on database type
                                            const portMap: any = {
                                                'sqlserver': 1433,
                                                'postgresql': 5432,
                                                'mysql': 3306,
                                                'oracle': 1521
                                            };
                                            setDbPort(portMap[e.target.value] || 1433);
                                        }}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
                                    >
                                        <option value="sqlserver">SQL Server</option>
                                        <option value="postgresql">PostgreSQL</option>
                                        <option value="mysql">MySQL</option>
                                        <option value="oracle">Oracle</option>
                                    </select>
                                </div>

                                {/* Host */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Host</label>
                                    <input
                                        type="text"
                                        value={dbHost}
                                        onChange={(e) => setDbHost(e.target.value)}
                                        placeholder="localhost or IP address"
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Port */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Port</label>
                                    <input
                                        type="number"
                                        value={dbPort}
                                        onChange={(e) => setDbPort(parseInt(e.target.value) || 0)}
                                        placeholder={getDbPortPlaceholder()}
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Database Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Database Name</label>
                                    <input
                                        type="text"
                                        value={dbName}
                                        onChange={(e) => setDbName(e.target.value)}
                                        placeholder="Enter database name"
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={dbUsername}
                                        onChange={(e) => setDbUsername(e.target.value)}
                                        placeholder="Database username"
                                        className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                                    <div className="relative isolate">
                                        <input
                                            type={showDbPassword ? "text" : "password"}
                                            value={dbPassword}
                                            onChange={(e) => setDbPassword(e.target.value)}
                                            placeholder="Database password"
                                            autoComplete="new-password"
                                            disabled={false}
                                            className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10 bg-white relative z-0"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowDbPassword(!showDbPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10 cursor-pointer p-1"
                                            tabIndex={-1}
                                        >
                                            {showDbPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTestingConnection || !dbHost || !dbName || !dbUsername || !dbPassword}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isTestingConnection ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Testing...
                                        </>
                                    ) : (
                                        <>
                                            <Database className="h-4 w-4" />
                                            Test Connection
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleFetchTables}
                                    disabled={isFetchingTables || !connectionTestResult?.success}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isFetchingTables ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Fetching...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-4 w-4" />
                                            Fetch Tables
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleSaveDbCredentials}
                                    disabled={isSavingDbCredentials || !integrationId}
                                    className={cn(
                                        "px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2 ml-auto",
                                        isSavingDbCredentials ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                    )}
                                >
                                    {isSavingDbCredentials ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : dbSaveStatus === 'success' ? (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Saved!
                                        </>
                                    ) : dbSaveStatus === 'error' ? (
                                        <>
                                            <AlertCircle className="h-4 w-4" />
                                            Failed
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Credentials
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Connection Test Result */}
                            {connectionTestResult && (
                                <div className={cn(
                                    "p-4 rounded-lg border flex gap-3 items-start",
                                    connectionTestResult.success
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                )}>
                                    {connectionTestResult.success ? (
                                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="text-sm">
                                        <p className="font-semibold mb-1">{connectionTestResult.message}</p>
                                        {connectionTestResult.success && (
                                            <p className="opacity-90">Click "Fetch Tables" to retrieve table names from the database.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Fetched Tables */}
                            {fetchedTables.length > 0 && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Database Tables ({tableStats.total} total, {tableStats.classified} classified)
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={selectAllTables}
                                                className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={deselectAllTables}
                                                className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 max-h-96 overflow-y-auto">
                                        {/* Group tables by category */}
                                        {['Trial Data Management', 'Unclassified'].map(category => {
                                            const tablesInCategory = fetchedTables.filter(t => t.category === category);
                                            if (tablesInCategory.length === 0) return null;

                                            return (
                                                <div key={category} className="mb-4 last:mb-0">
                                                    <button
                                                        onClick={() => toggleCategory(category)}
                                                        className="flex items-center gap-2 w-full text-left py-2 hover:bg-gray-50 rounded transition-colors"
                                                    >
                                                        {expandedCategories.has(category) ? (
                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                                        )}
                                                        <span className="font-medium text-gray-900">{category}</span>
                                                        <span className="text-sm text-gray-500">({tablesInCategory.length})</span>
                                                    </button>

                                                    {expandedCategories.has(category) && (
                                                        <div className="ml-6 mt-2 space-y-1">
                                                            {tablesInCategory.map((table, idx) => (
                                                                <div key={idx} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded text-sm">
                                                                    <div className="flex items-center gap-3">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedTablesToImport.has(table.table_name)}
                                                                            onChange={() => toggleTableSelection(table.table_name)}
                                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                        />
                                                                        <Database className="h-4 w-4 text-gray-400" />
                                                                        <span className="font-mono text-gray-900">{table.table_name}</span>
                                                                        {table.domain && (
                                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                                                {table.domain}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {table.description && (
                                                                        <span className="text-xs text-gray-500">{table.description}</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Import Data Button */}
                                    {selectedTablesToImport.size > 0 && (
                                        <div className="bg-blue-50 px-4 py-3 border-t border-blue-100 flex justify-between items-center">
                                            <span className="text-sm text-blue-700 font-medium">
                                                {selectedTablesToImport.size} table{selectedTablesToImport.size > 1 ? 's' : ''} selected
                                            </span>
                                            <button
                                                onClick={handleImportData}
                                                disabled={isImportingData}
                                                className={cn(
                                                    "px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2",
                                                    isImportingData ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                                )}
                                            >
                                                {isImportingData ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Importing Data...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="h-4 w-4" />
                                                        Import Data to System
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <Shield className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-500">
                                    Database credentials are securely encrypted before storage. They will be used only for this integration.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Local */}
                    {activeTab === 'local' && (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Local Data Source Path</label>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Specify the local folder path where the data source files are located. The system will monitor this folder for new files.
                                    </p>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Folder className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={localPath}
                                            onChange={(e) => setLocalPath(e.target.value)}
                                            placeholder="e.g. C:\Data\Clinical"
                                            className="w-full h-11 pl-10 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 ml-1">
                                        Ensure the application has read/write permissions to this directory.
                                    </p>
                                </div>

                                <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex gap-3 items-start">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-semibold mb-1">Local Agent Required</p>
                                        <p className="opacity-90">To access local files, ensure the Data Manager Local Agent is installed and running on the host machine.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        if (!integrationId) return;
                                        setIsSaving(true);
                                        setSaveStatus('idle');
                                        try {
                                            await integrationService.updateIntegration(integrationId, {
                                                folder_path: localPath
                                            });
                                            setSaveStatus('success');
                                            setTimeout(() => setSaveStatus('idle'), 3000);
                                        } catch (error) {
                                            console.error("Failed to save path:", error);
                                            setSaveStatus('error');
                                        } finally {
                                            setIsSaving(false);
                                        }
                                    }}
                                    disabled={isSaving || !integrationId}
                                    className={cn(
                                        "px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2",
                                        isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                    )}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Saving...
                                        </>
                                    ) : saveStatus === 'success' ? (
                                        <>
                                            <CheckCircle className="h-4 w-4" />
                                            Saved!
                                        </>
                                    ) : saveStatus === 'error' ? (
                                        <>
                                            <AlertCircle className="h-4 w-4" />
                                            Failed to Save
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Path Configuration
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
