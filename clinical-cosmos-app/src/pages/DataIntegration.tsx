import {
    Database, CalendarClock, Activity, PlusCircle,
    ServerCog, History, SlidersVertical, Mail,
    TriangleAlert, ChevronDown, Download, RefreshCw,
    PauseCircle, PlayCircle, MoreHorizontal, FileText,
    Key, Settings, Trash2, StopCircle
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
    // const [sourceType, setSourceType] = useState<'Local' | 'Database'>('Local'); // Removed in favor of Integration Type
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

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

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

            if (formData.type === 'Database') {
                // Validate DB creds
                if (!dbCredentials.host || (!dbCredentials.username && dbCredentials.db_type !== 'sqlite') || (!dbCredentials.password && dbCredentials.db_type !== 'sqlite')) {
                    if (dbCredentials.db_type !== 'sqlite') {
                        if (!dbCredentials.host || !dbCredentials.username || !dbCredentials.password) {
                            setSubmitError('Please fill in all database credentials');
                            setIsSubmitting(false);
                            return;
                        }
                    }
                }
                payload.database_credentials = {
                    ...dbCredentials,
                    integration_id: 0
                };
            } else if (formData.type === 'Local') {
                // If files are selected, use their names as metadata
                const fileMetadata = selectedFiles.length > 0
                    ? `[Files: ${selectedFiles.map(f => f.name).join(', ')}]`
                    : 'Manual Upload';
                payload.folder_path = formData.folderPath || fileMetadata;
            } else {
                // API, SFTP etc
                payload.folder_path = null;
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
            setSelectedFiles([]);
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Integration</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage data integrations and connections across your clinical trials</p>
                </div>

                {/* Top Level Tabs */}
                <div className="flex items-center space-x-4 mb-8">
                    {['Data Sources', 'Scheduler', 'Real-Time Monitoring'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                            className={cn(
                                "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors border",
                                activeTab === tab.toLowerCase().replace(' ', '-')
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            {tab === 'Data Sources' && <Database className="h-4 w-4" />}
                            {tab === 'Scheduler' && <CalendarClock className="h-4 w-4" />}
                            {tab === 'Real-Time Monitoring' && <Activity className="h-4 w-4" />}
                            <span>{tab}</span>
                        </button>
                    ))}
                </div>

                {/* Data Source Manager Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-gray-500" />
                            <h2 className="text-xl font-semibold text-gray-900">Data Source Manager</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 ml-7">Configure and manage data integrations from external sources</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 rounded-md px-3">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Integration
                    </button>
                </div>

                {/* Sub Tabs */}
                <div className="bg-white p-1 rounded-lg border border-gray-100 inline-flex items-center space-x-1 mb-6">
                    {[
                        { id: 'integration-sources', label: 'Integration Sources' },
                        { id: 'integration-logs', label: 'Integration Logs' },
                        { id: 'monitor-ai', label: 'Monitor.AI' },
                        { id: 'notifications', label: 'Notifications' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                activeSubTab === tab.id
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>


                {activeSubTab === 'integration-sources' && (
                    <div className="space-y-4">
                        {/* Alert */}
                        {integrations.some(i => i.status === 'Error') && (
                            <div className="relative w-full rounded-md border p-3 bg-red-50 border-red-100 text-red-600 flex items-center gap-3">
                                <TriangleAlert className="h-4 w-4" />
                                <div className="text-sm font-medium">
                                    One or more integrations have errors. Please check the integration details.
                                </div>
                            </div>
                        )}

                        {/* Card Container */}
                        <div className="bg-white border rounded-lg shadow-sm">

                            {/* Toolbar */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <div className="flex gap-2">
                                    {/* Type Filter Dropdown */}
                                    <div ref={typeDropdownRef} className="relative">
                                        <button
                                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                            className="flex h-9 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm w-[140px] text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
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

                                    {/* Status Filter Dropdown */}
                                    <div ref={statusDropdownRef} className="relative">
                                        <button
                                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                            className="flex h-9 items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm w-[140px] text-gray-700 hover:bg-gray-50 shadow-sm"
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

                                <button className="hidden sm:inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 h-9 rounded-md px-3 text-gray-700 shadow-sm transition-colors">
                                    <Download className="h-4 w-4 text-gray-500" />
                                    Export Configuration
                                </button>

                            </div>

                            {/* Table */}
                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-blue-50/50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="h-12 px-6 align-middle">Name</th>
                                            <th className="h-12 px-6 align-middle">Protocol ID</th>
                                            <th className="h-12 px-6 align-middle">Vendor</th>
                                            <th className="h-12 px-6 align-middle text-center">Type</th>
                                            <th className="h-12 px-6 align-middle">Frequency</th>
                                            <th className="h-12 px-6 align-middle">Last Sync</th>
                                            <th className="h-12 px-6 align-middle text-center">Status</th>
                                            <th className="h-12 px-6 align-middle text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {integrations.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="p-6 font-medium text-blue-600 cursor-pointer hover:underline">{item.name}</td>
                                                <td className="p-6 text-gray-700">{item.protocol_id || '-'}</td>
                                                <td className="p-6 text-gray-900 font-medium">{item.vendor}</td>
                                                <td className="p-6 text-center">
                                                    <span className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold", getItemColor(item.type, typeColors))}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-gray-500">{item.frequency}</td>
                                                <td className="p-6 font-mono text-xs text-gray-500">{formatDateTime(item.last_sync)}</td>
                                                <td className="p-6 text-center">
                                                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", getItemColor(item.status, statusColors).replace('border', ''))}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end items-center gap-1">
                                                        <button
                                                            onClick={() => handleScanFolder(item.id)}
                                                            disabled={scanningId === item.id}
                                                            className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500 disabled:opacity-50 transition-colors"
                                                            title="Sync Now"
                                                        >
                                                            <RefreshCw className={`h-4 w-4 ${scanningId === item.id ? 'animate-spin' : ''}`} />
                                                        </button>
                                                        <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500 transition-colors" title="Pause/Resume">
                                                            {item.status === 'Inactive' ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                                                        </button>

                                                        {/* Action Menu */}
                                                        <div className="relative action-menu-container">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveActionMenuId(activeActionMenuId === item.id ? null : item.id);
                                                                }}
                                                                className={cn(
                                                                    "p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors",
                                                                    activeActionMenuId === item.id ? "bg-gray-100 text-gray-900" : ""
                                                                )}
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </button>

                                                            {activeActionMenuId === item.id && (
                                                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5">
                                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                                        <FileText className="h-4 w-4 text-gray-400" /> View Integration Details
                                                                    </button>
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
                                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                                        <Activity className="h-4 w-4 text-gray-400" /> Test Integration
                                                                    </button>
                                                                    <div className="h-px bg-gray-100 my-1"></div>
                                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                                        <Settings className="h-4 w-4 text-gray-400" /> Edit Configuration
                                                                    </button>
                                                                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                                                        <CalendarClock className="h-4 w-4 text-gray-400" /> Edit Schedule
                                                                    </button>
                                                                    <div className="h-px bg-gray-100 my-1"></div>
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
                                {loading && (
                                    <div className="text-center py-12 text-gray-500">
                                        Loading...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Integration Modal */}
            {
                showAddModal && (
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

                                {/* Integration Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Integration Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    >
                                        <option value="Database">Database</option>
                                        <option value="API">API</option>
                                        <option value="SFTP">SFTP</option>
                                        <option value="S3">S3</option>
                                        <option value="Local">Local</option>
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
                                        className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                        className="w-full px-3 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {frequencies.map(freq => (
                                            <option key={freq} value={freq}>{freq}</option>
                                        ))}
                                    </select>
                                </div>

                                {formData.type === 'Local' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Files</label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                                        >
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                accept=".xlsx,.xls,.csv"
                                            />
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                    <Download className="h-6 w-6 text-blue-500 rotate-180" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {selectedFiles.length > 0
                                                        ? `${selectedFiles.length} file(s) selected`
                                                        : "Click to select files"}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {selectedFiles.length > 0
                                                        ? selectedFiles.map(f => f.name).join(', ')
                                                        : "Excel or CSV files"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {formData.type === 'Database' && (
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
                                )
                                }

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
                                {
                                    submitError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                            {submitError}
                                        </div>
                                    )
                                }

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
                            </form >
                        </div >
                    </div >
                )
            }

            {/* Credentials Modal */}
            <CredentialsModal
                isOpen={showCredentialsModal}
                onClose={() => setShowCredentialsModal(false)}
                integrationName={selectedIntegrationForCredentials?.name}
                integrationId={selectedIntegrationForCredentials?.id}
            />
        </div >
    );
}
