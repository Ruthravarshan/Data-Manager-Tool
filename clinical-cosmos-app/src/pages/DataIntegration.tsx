import {
    Database, CalendarClock, Activity, PlusCircle,
    ServerCog, History, SlidersVertical, Mail,
    TriangleAlert, ChevronDown, Download, RefreshCw,
    PauseCircle, PlayCircle, MoreHorizontal, FileText,
    Key, Settings, Trash2, StopCircle, Bell
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useEffect, useState, useRef } from 'react';
import { integrationService } from '../services/api';
import CredentialsModal from '../components/CredentialsModal';

export default function DataIntegration() {
    const [activeTab, setActiveTab] = useState('data-sources');
    const [activeSubTab, setActiveSubTab] = useState('integration-sources');
    const [activeMonitorTab, setActiveMonitorTab] = useState('dashboard');
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [availableTypes, setAvailableTypes] = useState<string[]>([]);
    const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const typeDropdownRef = useRef<HTMLDivElement>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'API',
        vendor: '',
        protocolId: '',
        frequency: 'Daily at 2:00 AM',
        folderPath: '',
        launchImmediately: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [scanningId, setScanningId] = useState<number | null>(null);
    const [scanSuccess, setScanSuccess] = useState<{ [key: number]: boolean }>({});

    // New State for Source Selection & Protocols
    const [sourceType, setSourceType] = useState<'Local' | 'Database'>('Local');
    const [availableProtocols, setAvailableProtocols] = useState<string[]>([]);

    // DB Credentials State
    const [dbCredentials, setDbCredentials] = useState({
        db_type: 'postgresql',
        host: '',
        port: 5432,
        database_name: '',
        username: '',
        password: ''
    });

    // Credentials Modal state
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [selectedIntegrationForCredentials, setSelectedIntegrationForCredentials] = useState<any>(null);
    const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);

    // Predefined options
    const integrationTypes = ['API', 'SFTP', 'S3', 'EDC', 'CTMS', 'Lab'];
    const vendors = ['Medidata Rave', 'Labcorp', 'Calyx', 'Veeva Vault CTMS', 'Parexel Informatics', 'SAE Central', 'Other'];
    const frequencies = ['Daily at 2:00 AM', 'Every 12 hours', 'Hourly', 'Weekly on Monday', 'Real-time', 'Custom'];

    // Color mapping for types and statuses
    const typeColors: { [key: string]: string } = {
        "API": "bg-purple-50 text-purple-700 border-purple-200",
        "SFTP": "bg-amber-50 text-amber-700 border-amber-200",
        "S3": "bg-green-50 text-green-700 border-green-200",
        "EDC": "bg-blue-50 text-blue-700 border-blue-200",
        "CTMS": "bg-indigo-50 text-indigo-700 border-indigo-200",
        "Lab": "bg-pink-50 text-pink-700 border-pink-200"
    };

    const statusColors: { [key: string]: string } = {
        "Active": "bg-green-50 text-green-700 border-green-200",
        "Inactive": "bg-gray-50 text-gray-700 border-gray-200",
        "Error": "bg-red-50 text-red-700 border-red-200",
        "Warning": "bg-yellow-50 text-yellow-700 border-yellow-200",
        "Paused": "bg-orange-50 text-orange-700 border-orange-200"
    };

    // Fetch integrations and filter options
    const fetchData = async (type: string = 'All Types', status: string = 'All Statuses') => {
        try {
            setLoading(true);
            const [integrationData, typesData, statusesData] = await Promise.all([
                integrationService.getIntegrations(type, status),
                integrationService.getIntegrationTypes(),
                integrationService.getIntegrationStatuses()
            ]);

            setIntegrations(integrationData);
            setAvailableTypes(typesData || []);
            setAvailableStatuses(statusesData || []);

            // Fetch protocols
            try {
                const protocols = await integrationService.getProtocols();
                setAvailableProtocols(protocols || []);
            } catch (pError) {
                console.warn("Failed to fetch protocols", pError);
            }
        } catch (error) {
            console.error("Failed to fetch integrations", error);
            // Fallback mock data
            setIntegrations([
                {
                    id: 1,
                    name: "EDC Data Feed",
                    vendor: "Medidata Rave",
                    type: "API",
                    frequency: "Daily at 2:00 AM",
                    last_sync: new Date().toISOString(),
                    status: "Active"
                },
                {
                    id: 2,
                    name: "Central Lab Results",
                    vendor: "Labcorp",
                    type: "SFTP",
                    frequency: "Every 12 hours",
                    last_sync: new Date().toISOString(),
                    status: "Active"
                },
                {
                    id: 3,
                    name: "Imaging Data",
                    vendor: "Calyx",
                    type: "S3",
                    frequency: "Weekly on Monday",
                    last_sync: new Date().toISOString(),
                    status: "Inactive"
                },
                {
                    id: 4,
                    name: "CTMS Data",
                    vendor: "Veeva Vault CTMS",
                    type: "API",
                    frequency: "Daily at 6:00 AM",
                    last_sync: new Date().toISOString(),
                    status: "Error"
                },
                {
                    id: 5,
                    name: "ECG Data",
                    vendor: "AliveCor",
                    type: "API",
                    frequency: "Daily at 4:00 AM",
                    last_sync: new Date().toISOString(),
                    status: "Active"
                }

            ]);
            setAvailableTypes(['API', 'SFTP', 'S3', 'EDC', 'CTMS']);
            setAvailableStatuses(['Active', 'Inactive', 'Error', 'Warning']);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
                setShowTypeDropdown(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setShowStatusDropdown(false);
            }
            // Close action menu if clicking outside
            if (activeActionMenuId !== null && !(event.target as Element).closest('.action-menu-container')) {
                setActiveActionMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeActionMenuId]);

    // Handle filter changes
    const handleTypeChange = (type: string) => {
        setTypeFilter(type);
        setShowTypeDropdown(false);
        fetchData(type, statusFilter);
    };

    const handleStatusChange = (status: string) => {
        setStatusFilter(status);
        setShowStatusDropdown(false);
        fetchData(typeFilter, status);
    };

    const getItemColor = (type: string | null, colorMap: { [key: string]: string }) => {
        if (!type) return "bg-gray-50 text-gray-700 border-gray-200";
        return colorMap[type] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const formatDateTime = (dateString: string | undefined) => {
        if (!dateString) return "Never";
        try {
            // Check if it's just a time string
            if (dateString.includes('T')) {
                const date = new Date(dateString);
                return (
                    <div className="flex flex-col">
                        <span>{date.toISOString().split('T')[0]}</span>
                        <span className="text-gray-400">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                    </div>
                );
            }
            return dateString;
        } catch (e) {
            return dateString;
        }
    };

    // Handle form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        setSubmitError('');
    };

    const handleDbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDbCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleAddIntegration = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError('');
        setIsSubmitting(true);

        try {
            if (!formData.name.trim()) {
                setSubmitError('Integration Name is required');
                setIsSubmitting(false);
                return;
            }
            if (!formData.vendor.trim()) {
                setSubmitError('Vendor is required');
                setIsSubmitting(false);
                return;
            }

            // Call API to create integration
            // Call integration service
            const payload: any = {
                name: formData.name,
                type: formData.type,
                vendor: formData.vendor,
                frequency: formData.frequency,
                status: 'Active',
                protocol_id: formData.protocolId || null,
            };

            if (sourceType === 'Local') {
                payload.folder_path = formData.folderPath || null;
            } else {
                // Validate DB creds
                if (!dbCredentials.host || !dbCredentials.username || !dbCredentials.password) {
                    setSubmitError('Please fill in all database credentials');
                    setIsSubmitting(false);
                    return;
                }
                payload.database_credentials = {
                    ...dbCredentials,
                    integration_id: 0
                };
            }

            const newIntegration = await integrationService.createIntegration(payload);

            // Refresh the list
            await fetchData(typeFilter, statusFilter);

            // Reset form
            setFormData({
                name: '',
                type: 'API',
                vendor: '',
                protocolId: '',
                frequency: 'Daily at 2:00 AM',
                folderPath: '',
                launchImmediately: false
            });
            setSourceType('Local');
            setDbCredentials({
                db_type: 'postgresql',
                host: '',
                port: 5432,
                database_name: '',
                username: '',
                password: ''
            });

            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to create integration:', error);
            setSubmitError('Failed to create integration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close modal when clicking outside
    const handleModalBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setShowAddModal(false);
        }
    };

    // Handle scanning folder or database sync
    const handleScanFolder = async (integrationId: number) => {
        const integration = integrations.find(i => i.id === integrationId);
        if (!integration) return;

        // If it's a database integration (no folder path), open the credentials/import modal
        if (!integration.folder_path) {
            setSelectedIntegrationForCredentials(integration);
            setShowCredentialsModal(true);
            return;
        }

        setScanningId(integrationId);
        try {
            const result = await integrationService.scanFolder(integrationId);
            setScanSuccess(prev => ({ ...prev, [integrationId]: true }));
            console.log('Folder scan result:', result);

            // Show success message for 3 seconds
            setTimeout(() => {
                setScanSuccess(prev => ({ ...prev, [integrationId]: false }));
            }, 3000);

            // Optionally refresh the integrations list
            await fetchData(typeFilter, statusFilter);
        } catch (error) {
            console.error('Failed to scan folder:', error);
            alert(`Failed to scan folder: ${(error as any).message || 'Unknown error'}`);
        } finally {
            setScanningId(null);
        }
    };

    // Handle delete integration
    const handleDeleteIntegration = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this integration? This action cannot be undone.')) {
            try {
                await integrationService.deleteIntegration(id);
                // Close the menu if it's open for the deleted item (though rerender will handle this)
                setActiveActionMenuId(null);
                // Refresh list
                await fetchData(typeFilter, statusFilter);
            } catch (error) {
                console.error("Failed to delete integration", error);
                alert("Failed to delete integration. Please try again.");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="container mx-auto py-2">
                <div className="flex justify-between items-center mb-6">
                    {/* Replaced Header with something cleaner if desired, or keep generic */}
                </div>

                {/* Top Tabs */}
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('data-sources')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'data-sources'
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        <Database className="h-4 w-4" />
                        Data Sources
                    </button>
                    <button
                        onClick={() => setActiveTab('scheduler')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'scheduler'
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        <CalendarClock className="h-4 w-4" />
                        Scheduler
                    </button>
                    <button
                        onClick={() => setActiveTab('monitor-ai')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            activeTab === 'monitor-ai'
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        <Activity className="h-4 w-4" />
                        Real-Time Monitoring
                    </button>
                </div>

                {/* Data Sources View */}
                {activeTab === 'data-sources' && (
                    <div className="bg-white border rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Database className="h-5 w-5 text-blue-600" />
                                    Data Source Manager
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Configure and manage data integrations from external sources</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-4 shadow-sm transition-colors"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Integration
                            </button>
                        </div>

                        {/* Inner Tabs */}
                        <div className="flex items-center space-x-6 border-b border-gray-100 mb-6">
                            {[
                                { id: 'integration-sources', label: 'Integration Sources' },
                                { id: 'integration-logs', label: 'Integration Logs' },
                                { id: 'monitor-ai-inner', label: 'Monitor.AI' },
                                { id: 'notifications', label: 'Notifications' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveSubTab(tab.id)}
                                    className={cn(
                                        "pb-2 text-sm font-medium transition-colors border-b-2",
                                        activeSubTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeSubTab === 'integration-sources' && (
                            <>
                                {/* Alert */}
                                {integrations.some(i => i.status === 'Error') && (
                                    <div className="mb-6 relative w-full rounded-md border p-3 bg-red-50 border-red-100 text-red-600 flex items-center gap-3">
                                        <TriangleAlert className="h-4 w-4" />
                                        <div className="text-sm font-medium">
                                            One or more integrations have errors. Please check the integration details.
                                        </div>
                                    </div>
                                )}

                                {/* Filter Bar */}
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        {/* Type Filter */}
                                        <div ref={typeDropdownRef} className="relative w-full sm:w-auto">
                                            <button
                                                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                                className="flex h-9 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm w-full sm:w-[140px] text-gray-700 hover:bg-gray-50 shadow-sm"
                                            >
                                                <span>{typeFilter}</span>
                                                <ChevronDown className="h-3 w-3 opacity-50" />
                                            </button>
                                            {showTypeDropdown && (
                                                <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleTypeChange('All Types')}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                                                                typeFilter === 'All Types' ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                            )}
                                                        >
                                                            All Types
                                                        </button>
                                                        {availableTypes.map(type => (
                                                            <button
                                                                key={type}
                                                                onClick={() => handleTypeChange(type)}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                                                                    typeFilter === type ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                                )}
                                                            >
                                                                {type}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Filter */}
                                        <div ref={statusDropdownRef} className="relative w-full sm:w-auto">
                                            <button
                                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                                className="flex h-9 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm w-full sm:w-[140px] text-gray-700 hover:bg-gray-50 shadow-sm"
                                            >
                                                <span>{statusFilter}</span>
                                                <ChevronDown className="h-3 w-3 opacity-50" />
                                            </button>
                                            {showStatusDropdown && (
                                                <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={() => handleStatusChange('All Statuses')}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                                                                statusFilter === 'All Statuses' ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                            )}
                                                        >
                                                            All Statuses
                                                        </button>
                                                        {availableStatuses.map(status => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(status)}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-sm hover:bg-gray-50",
                                                                    statusFilter === status ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                                )}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 shadow-sm">
                                        <Download className="h-4 w-4 text-gray-500" />
                                        Export Configuration
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                            <tr>
                                                <th className="py-3 px-4 font-semibold text-blue-600">Name</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600">Vendor</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600 text-center">Type</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600">Frequency</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600">Last Sync</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600 text-center">Status</th>
                                                <th className="py-3 px-4 font-semibold text-blue-600 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {integrations.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-blue-600 cursor-pointer hover:underline">{item.name}</td>
                                                    <td className="py-4 px-4 text-gray-900 font-medium">{item.vendor}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getItemColor(item.type, typeColors).replace('border', 'ring-1 ring-inset'))}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-500">{item.frequency}</td>
                                                    <td className="py-4 px-4 font-mono text-xs text-gray-500">{formatDateTime(item.last_sync)}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getItemColor(item.status, statusColors).replace('border', 'ring-1 ring-inset'))}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex justify-end items-center gap-2">
                                                            <button
                                                                onClick={() => handleScanFolder(item.id)}
                                                                disabled={scanningId === item.id}
                                                                className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50 transition-colors"
                                                                title="Sync Now"
                                                            >
                                                                <RefreshCw className={`h-4 w-4 ${scanningId === item.id ? 'animate-spin' : ''}`} />
                                                            </button>
                                                            <button className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500 transition-colors" title="Info">
                                                                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">i</div>
                                                            </button>
                                                            <div className="relative action-menu-container">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setActiveActionMenuId(activeActionMenuId === item.id ? null : item.id);
                                                                    }}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </button>
                                                                {/* Dropdown Menu (Same as before) */}
                                                                {activeActionMenuId === item.id && (
                                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedIntegrationForCredentials(item);
                                                                                setShowCredentialsModal(true);
                                                                                setActiveActionMenuId(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                                        >
                                                                            <Key className="h-4 w-4 text-gray-400" /> Manage Credentials
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteIntegration(item.id);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" /> Delete Integration
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {integrations.length === 0 && !loading && (
                                        <div className="text-center py-12 text-gray-500">
                                            No integrations found
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeSubTab === 'integration-logs' && (
                            <div className="bg-white border rounded-lg p-6 text-center">
                                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Integration Logs</h3>
                                <p className="text-gray-500 mt-2">Comprehensive logs of all data integration activities will be displayed here.</p>
                            </div>
                        )}

                        {activeSubTab === 'monitor-ai-inner' && (
                            <div className="bg-white border rounded-lg p-6 text-center">
                                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Monitor.AI Configuration</h3>
                                <p className="text-gray-500 mt-2">Configure AI-driven monitoring rules and anomaly detection settings.</p>
                            </div>
                        )}

                        {activeSubTab === 'notifications' && (
                            <div className="bg-white border rounded-lg p-6 text-center">
                                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                                <p className="text-gray-500 mt-2">Manage alerts and notifications for integration events.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'scheduler' && (
                    <div className="space-y-4">
                        <div className="bg-white border rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CalendarClock className="h-5 w-5 text-blue-600" />
                                    Integration Scheduler
                                </h3>
                                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-4 shadow-sm transition-colors">
                                    <PlusCircle className="h-4 w-4" />
                                    Create Schedule
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-3">Data Source</th>
                                            <th className="px-6 py-3">Schedule</th>
                                            <th className="px-6 py-3">Last Run</th>
                                            <th className="px-6 py-3">Next Run</th>
                                            <th className="px-6 py-3 text-center">Status</th>
                                            <th className="px-6 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {integrations.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{item.frequency}</td>
                                                <td className="px-6 py-4 text-gray-500 flex items-center gap-1">
                                                    <History className="h-3 w-3" /> {formatDateTime(item.last_sync)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <CalendarClock className="h-3 w-3" />
                                                        {(() => {
                                                            if (!item.last_sync) return "Pending";
                                                            const last = new Date(item.last_sync);
                                                            const next = new Date(last.getTime() + 24 * 60 * 60 * 1000); // Default +24h
                                                            return next.toLocaleString();
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getItemColor(item.status, statusColors).replace('border', ''))}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Sync Now">
                                                            <RefreshCw className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Pause">
                                                            <PauseCircle className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Edit">
                                                            <FileText className="h-4 w-4" />
                                                        </button>
                                                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {integrations.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No scheduled jobs found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'monitor-ai' && (
                    <div className="space-y-6">
                        {/* Monitor AI Header */}
                        <div className="bg-white border rounded-lg p-6 pb-0 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                        Integration Monitor.AI
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                            AI-Powered
                                        </span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Real-time monitoring and intelligent analysis of data integration processes</p>
                                </div>
                                <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-all">
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh
                                </button>
                            </div>

                            {/* Monitor Navigation */}
                            <div className="flex items-center space-x-8 border-b border-gray-100">
                                {[
                                    { id: 'dashboard', label: 'Dashboard', icon: Activity },
                                    { id: 'logs', label: 'Logs', icon: FileText },
                                    { id: 'anomalies', label: 'Anomalies', icon: TriangleAlert },
                                    { id: 'analysis', label: 'AI Analysis', icon: ServerCog },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveMonitorTab(tab.id)}
                                            className={cn(
                                                "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2",
                                                activeMonitorTab === tab.id
                                                    ? "border-blue-600 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Monitor Views */}
                        <div className="min-h-[400px]">
                            {activeMonitorTab === 'dashboard' && (
                                <div className="space-y-6">
                                    {/* Dashboard Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-5 rounded-lg border shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-medium text-gray-500 uppercase">Integrations</h4>
                                                <Settings className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">4</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg border shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-medium text-gray-500 uppercase">Records Processed</h4>
                                                <Activity className="h-4 w-4 text-green-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">2,134</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg border shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-medium text-gray-500 uppercase">Success Rate</h4>
                                                <div className="h-4 w-4 rounded-full border border-green-500 text-green-500 flex items-center justify-center text-[10px]">✓</div>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">73.5%</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-lg border shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-medium text-gray-500 uppercase">Active Issues</h4>
                                                <TriangleAlert className="h-4 w-4 text-red-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">2</div>
                                        </div>
                                    </div>

                                    {/* Integration Status List */}
                                    <div className="bg-white border rounded-lg shadow-sm p-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Integration Status</h3>
                                        <div className="space-y-4">
                                            {/* Mock Status Items based on screenshot */}
                                            {[
                                                { name: 'Medidata Rave', type: 'EDC', status: 'Active', lastSync: '6/1/2026, 10:06:15 am', nextSync: '6/1/2026, 12:06:15 pm', records: '1,248', rate: 93.7, color: 'green' },
                                                { name: 'Labcorp', type: 'Lab', status: 'Warning', lastSync: '6/1/2026, 9:06:15 am', nextSync: '6/1/2026, 11:36:15 am', records: '562', rate: 94.2, color: 'amber' },
                                                { name: 'Veeva Vault CTMS', type: 'CTMS', status: 'Active', lastSync: '6/1/2026, 9:36:15 am', nextSync: '6/1/2026, 1:06:15 pm', records: '324', rate: 100, color: 'green' },
                                                { name: 'Calyx', type: 'Imaging', status: 'Error', lastSync: '5/1/2026, 11:06:15 am', nextSync: '6/1/2026, 11:36:15 am', records: '0', rate: 0, color: 'red' },
                                            ].map((item, i) => (
                                                <div key={i} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-gray-900">{item.name}</span>
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">{item.type}</span>
                                                        </div>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-medium border",
                                                            item.color === 'green' ? "bg-green-50 text-green-700 border-green-200" :
                                                                item.color === 'amber' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                    "bg-red-50 text-red-700 border-red-200"
                                                        )}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-4 text-xs">
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Last Sync</div>
                                                            <div className="font-medium">{item.lastSync}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Next Sync</div>
                                                            <div className="font-medium">{item.nextSync}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Records Processed</div>
                                                            <div className="font-medium">{item.records}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-500 mb-1">Success Rate</div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn("h-full rounded-full", item.color === 'green' ? "bg-blue-600" : item.color === 'amber' ? "bg-blue-600" : "bg-red-500")}
                                                                        style={{ width: `${item.rate}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="font-medium">{item.rate}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeMonitorTab === 'logs' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                                        <h3 className="font-semibold text-gray-900">Integration Activity Logs</h3>
                                        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                            <Download className="h-4 w-4" /> Export Logs
                                        </button>
                                    </div>
                                    <div className="bg-white border rounded-lg shadow-sm p-6">
                                        <div className="space-y-4">
                                            {[
                                                { icon: Activity, color: 'text-blue-600 bg-blue-50', name: 'Medidata Rave', badge: 'info', msg: 'Sync completed successfully', sub: 'Processed 127 new records', time: '11:01 am' },
                                                { icon: TriangleAlert, color: 'text-amber-600 bg-amber-50', name: 'Labcorp', badge: 'warning', msg: 'Data format mismatch detected', sub: 'LB domain format inconsistency in 3 records', time: '10:51 am' },
                                                { icon: StopCircle, color: 'text-red-600 bg-red-50', name: 'Calyx', badge: 'error', msg: 'Connection timeout', sub: 'Failed to establish secure connection to API endpoint', time: '10:36 am' },
                                                { icon: Activity, color: 'text-green-600 bg-green-50', name: 'Veeva Vault CTMS', badge: 'success', msg: 'New data imported', sub: 'New data imported', time: '10:05 am' },
                                            ].map((log, i) => (
                                                <div key={i} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className={cn("p-2 rounded-lg h-fit", log.color)}>
                                                        <log.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-gray-900">{log.name}</span>
                                                                <span className={cn(
                                                                    "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase",
                                                                    log.badge === 'info' ? "bg-blue-100 text-blue-700" :
                                                                        log.badge === 'warning' ? "bg-amber-100 text-amber-700" :
                                                                            log.badge === 'error' ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                                )}>{log.badge}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-500">{log.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-900 font-medium">{log.msg}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{log.sub}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeMonitorTab === 'anomalies' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-900">Detected Anomalies</h3>
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">3 detected</span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Labcorp', severity: 'medium', badgeColor: 'bg-amber-100 text-amber-800', msg: 'Unusual spike in lab data volume', time: '6/1/2026, 10:36:15 am' },
                                            { name: 'Medidata Rave', severity: 'high', badgeColor: 'bg-red-100 text-red-800', msg: 'Duplicate subject records detected', time: '5/1/2026, 11:06:15 am' },
                                            { name: 'Veeva Vault CTMS', severity: 'low', badgeColor: 'bg-blue-100 text-blue-800', msg: 'Minor data inconsistency in site information', autoResolved: true, time: '4/1/2026, 11:06:15 am' },
                                        ].map((item, i) => (
                                            <div key={i} className={cn("bg-white border-l-4 rounded-r-lg shadow-sm p-6",
                                                item.severity === 'medium' ? "border-l-amber-500" :
                                                    item.severity === 'high' ? "border-l-red-500" : "border-l-blue-500"
                                            )}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium uppercase", item.badgeColor)}>
                                                            {item.severity} severity
                                                        </span>
                                                        {item.autoResolved && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-green-100 text-green-800">
                                                                auto resolved
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{item.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4">{item.msg}</p>
                                                <div className="flex gap-2">
                                                    {!item.autoResolved && (
                                                        <>
                                                            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">Investigate</button>
                                                            <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">Mark as Resolved</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeMonitorTab === 'analysis' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <ServerCog className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-blue-900 mb-1">AI-Generated Analysis</h3>
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    The following analysis is generated by the Integration Monitor.AI agent based on real-time integration data, historical patterns, and detected anomalies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border rounded-lg shadow-sm p-8">
                                        <div className="prose prose-sm max-w-none text-gray-600 space-y-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">*** Integration Health Summary</h4>
                                                <p className="text-sm pl-4 border-l-2 border-gray-200">
                                                    <span className="font-medium text-gray-900">**Overall System Status**:</span> Moderate Risk (3 active issues)
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">*** Key Findings</h4>
                                                <ul className="list-disc pl-5 space-y-1 text-sm">
                                                    <li>Calyx integration has been down for over 24 hours - requires immediate attention</li>
                                                    <li>Labcorp connection showing intermittent issues with data format consistency</li>
                                                    <li>Medidata Rave performing well with 93.7% success rate</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">*** Recommended Actions</h4>
                                                <ol className="list-decimal pl-5 space-y-1 text-sm">
                                                    <li>Verify Calyx API credentials and renew if expired</li>
                                                    <li>Investigate Labcorp data format inconsistencies in LB domain</li>
                                                    <li>Schedule maintenance window for system-wide optimization</li>
                                                </ol>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">*** Data Quality Impact Assessment</h4>
                                                <p className="text-sm">
                                                    The current integration issues may affect approximately 2.4% of incoming trial data.
                                                    The priority should be restoring the Calyx connection as it impacts all imaging data processing.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm">
                                                <Download className="h-4 w-4" /> Export Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Add Integration Modal */}
                {showAddModal && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
                        onClick={handleModalBackdropClick}
                    >
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Add New Data Integration</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-gray-600 text-sm mb-6">
                                Connect to external data sources to import clinical trial data.
                            </p>

                            <form onSubmit={handleAddIntegration} className="space-y-4">
                                {/* Integration Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Integration Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="e.g., Primary EDC Data Feed"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Protocol ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Protocol ID
                                    </label>
                                    <select
                                        name="protocolId"
                                        value={formData.protocolId}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Protocol</option>
                                        {availableProtocols.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Source Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Source Type
                                    </label>
                                    <div className="flex bg-gray-100 p-1 rounded-md">
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('Local')}
                                            className={cn(
                                                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                                sourceType === 'Local'
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-900"
                                            )}
                                        >
                                            Local Folder
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSourceType('Database')}
                                            className={cn(
                                                "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                                                sourceType === 'Database'
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-gray-500 hover:text-gray-900"
                                            )}
                                        >
                                            Database
                                        </button>
                                    </div>
                                </div>

                                {/* Integration Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Integration Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {integrationTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Vendor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vendor
                                    </label>
                                    <select
                                        name="vendor"
                                        value={formData.vendor}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select vendor</option>
                                        {vendors.map(vendor => (
                                            <option key={vendor} value={vendor}>{vendor}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Update Frequency */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Frequency
                                    </label>
                                    <select
                                        name="frequency"
                                        value={formData.frequency}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {frequencies.map(freq => (
                                            <option key={freq} value={freq}>{freq}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Data Source Folder Path (Conditional) */}
                                {sourceType === 'Local' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data Source Folder Path
                                        </label>
                                        <input
                                            type="text"
                                            name="folderPath"
                                            value={formData.folderPath}
                                            onChange={handleFormChange}
                                            placeholder="e.g., C:\\data_source or /home/data_source"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Path to folder containing Excel files (.xlsx, .xls)
                                        </p>
                                    </div>
                                )}

                                {/* Database Credentials Form (Conditional) */}
                                {sourceType === 'Database' && (
                                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Database Connection</h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">DB Type</label>
                                                <select
                                                    name="db_type"
                                                    value={dbCredentials.db_type}
                                                    onChange={handleDbChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                >
                                                    <option value="postgresql">PostgreSQL</option>
                                                    <option value="sqlserver">SQL Server</option>
                                                    <option value="mysql">MySQL</option>
                                                    <option value="oracle">Oracle</option>
                                                </select>
                                            </div>

                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Host</label>
                                                <input
                                                    type="text"
                                                    name="host"
                                                    value={dbCredentials.host}
                                                    onChange={handleDbChange}
                                                    placeholder="e.g. localhost or 192.168.1.1"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Port</label>
                                                <input
                                                    type="number"
                                                    name="port"
                                                    value={dbCredentials.port}
                                                    onChange={handleDbChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Database Name</label>
                                                <input
                                                    type="text"
                                                    name="database_name"
                                                    value={dbCredentials.database_name}
                                                    onChange={handleDbChange}
                                                    placeholder="DB Name"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={dbCredentials.username}
                                                    onChange={handleDbChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={dbCredentials.password}
                                                    onChange={handleDbChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="launchImmediately"
                                        checked={formData.launchImmediately}
                                        onChange={handleFormChange}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Launch integration immediately after setup
                                    </label>
                                </div>

                                {/* Error message */}
                                {submitError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                        {submitError}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                                    >
                                        {isSubmitting ? 'Adding...' : 'Add Integration'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Credentials Modal */}
                <CredentialsModal
                    isOpen={showCredentialsModal}
                    onClose={() => setShowCredentialsModal(false)}
                    integrationName={selectedIntegrationForCredentials?.name}
                    integrationId={selectedIntegrationForCredentials?.id}
                />
            </div>
        </div>
    );
}
