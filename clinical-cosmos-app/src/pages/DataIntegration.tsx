
import {
    Database, CalendarClock, Activity, PlusCircle,
    ServerCog, History, SlidersVertical, Mail,
    TriangleAlert, ChevronDown, Download, RefreshCw,
    PauseCircle, PlayCircle, MoreHorizontal
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useEffect, useState, useRef } from 'react';
import { integrationService } from '../services/api';

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
        frequency: 'Daily at 2:00 AM',
        folderPath: '',
        launchImmediately: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [scanningId, setScanningId] = useState<number | null>(null);
    const [scanSuccess, setScanSuccess] = useState<{ [key: number]: boolean }>({});

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
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            const date = new Date(dateString);
            return date.toLocaleString();
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
            const newIntegration = await integrationService.createIntegration({
                name: formData.name,
                type: formData.type,
                vendor: formData.vendor,
                frequency: formData.frequency,
                status: 'Active',
                folder_path: formData.folderPath || null
            });

            // Refresh the list
            await fetchData(typeFilter, statusFilter);
            
            // Reset form
            setFormData({
                name: '',
                type: 'API',
                vendor: '',
                frequency: 'Daily at 2:00 AM',
                folderPath: '',
                launchImmediately: false
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

    // Handle scanning folder
    const handleScanFolder = async (integrationId: number) => {
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

    return (
        <div className="p-6">
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Data Integration</h1>
                        <p className="text-gray-500">Manage data integrations and connections across your clinical trials</p>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex space-x-1 bg-blue-50 p-1 rounded-md mb-6 w-full max-w-md">
                    {[
                        { id: 'data-sources', label: 'Data Sources', icon: Database },
                        { id: 'scheduler', label: 'Scheduler', icon: CalendarClock },
                        { id: 'monitoring', label: 'Real-Time Monitoring', icon: Activity },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-sm transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                            )}
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'data-sources' && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Loading integrations...</div>
                        ) : (
                            <div className="p-6 flex flex-col space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Database className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <h3 className="text-2xl font-semibold leading-none tracking-tight">Data Source Manager</h3>
                                            <p className="text-sm text-gray-500 mt-1">Configure and manage data integrations from external sources</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3 gap-1">
                                        <PlusCircle className="h-4 w-4" />
                                        <span>Add Integration</span>
                                    </button>
                                </div>

                                {/* Sub Tabs */}
                                <div className="bg-blue-50 p-1 rounded-md grid grid-cols-4 w-full max-w-lg mx-auto">
                                    {[
                                        { id: 'integration-sources', label: 'Integration Sources', icon: ServerCog },
                                        { id: 'integration-logs', label: 'Integration Logs', icon: History },
                                        { id: 'monitor-ai', label: 'Monitor.AI', icon: SlidersVertical },
                                        { id: 'notifications', label: 'Notifications', icon: Mail },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveSubTab(tab.id)}
                                            className={cn(
                                                "flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-sm transition-all gap-1",
                                                activeSubTab === tab.id
                                                    ? "bg-white text-blue-700 shadow-sm"
                                                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                                            )}
                                        >
                                            <tab.icon className="h-4 w-4" />
                                            <span className="truncate">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {activeSubTab === 'integration-sources' && (
                                    <div className="space-y-4">
                                        {/* Alert */}
                                        {integrations.some(i => i.status === 'Error') && (
                                            <div className="relative w-full rounded-lg border p-4 bg-red-50 border-red-200 text-red-800 flex items-start gap-4">
                                                <TriangleAlert className="h-4 w-4 mt-1" />
                                                <div className="text-sm">
                                                    One or more integrations have errors. Please check the integration details.
                                                </div>
                                            </div>
                                        )}

                                        {/* Filters and Actions */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex gap-2">
                                                {/* Type Filter Dropdown */}
                                                <div ref={typeDropdownRef} className="relative">
                                                    <button 
                                                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                                                        className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-[160px] text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <span>{typeFilter}</span>
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </button>
                                                    {showTypeDropdown && (
                                                        <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                            <button
                                                                onClick={() => handleTypeChange('All Types')}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-sm hover:bg-blue-50",
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
                                                                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50",
                                                                        typeFilter === type ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                                    )}
                                                                >
                                                                    {type}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Status Filter Dropdown */}
                                                <div ref={statusDropdownRef} className="relative">
                                                    <button 
                                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                                        className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-[160px] text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <span>{statusFilter}</span>
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </button>
                                                    {showStatusDropdown && (
                                                        <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                                            <button
                                                                onClick={() => handleStatusChange('All Statuses')}
                                                                className={cn(
                                                                    "w-full text-left px-3 py-2 text-sm hover:bg-blue-50",
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
                                                                        "w-full text-left px-3 py-2 text-sm hover:bg-blue-50",
                                                                        statusFilter === status ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                                                                    )}
                                                                >
                                                                    {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 h-9 rounded-md px-3 text-gray-700">
                                                <Download className="h-4 w-4" />
                                                Export Configuration
                                            </button>
                                        </div>

                                        {/* Table */}
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-blue-50 text-blue-900 font-semibold border-b border-blue-100">
                                                    <tr>
                                                        <th className="h-12 px-4 align-middle">Name</th>
                                                        <th className="h-12 px-4 align-middle">Vendor</th>
                                                        <th className="h-12 px-4 align-middle">Type</th>
                                                        <th className="h-12 px-4 align-middle">Frequency</th>
                                                        <th className="h-12 px-4 align-middle">Last Sync</th>
                                                        <th className="h-12 px-4 align-middle">Status</th>
                                                        <th className="h-12 px-4 align-middle text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {integrations.map((item) => (
                                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                            <td className="p-4 font-medium text-blue-800">{item.name}</td>
                                                            <td className="p-4 font-medium">{item.vendor}</td>
                                                            <td className="p-4">
                                                                <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", getItemColor(item.type, typeColors))}>
                                                                    {item.type}
                                                                </span>
                                                            </td>
                                                            <td className="p-4">{item.frequency}</td>
                                                            <td className="p-4 font-mono text-xs">{formatDateTime(item.last_sync)}</td>
                                                            <td className="p-4">
                                                                <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", getItemColor(item.status, statusColors))}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 text-right">
                                                                <div className="flex justify-end items-center space-x-2">
                                                                    <button 
                                                                        onClick={() => handleScanFolder(item.id)}
                                                                        disabled={scanningId === item.id}
                                                                        className="p-2 border border-green-200 rounded-md hover:bg-green-50 text-green-600 disabled:opacity-50"
                                                                        title="Scan folder for files"
                                                                    >
                                                                        <RefreshCw className={`h-4 w-4 ${scanningId === item.id ? 'animate-spin' : ''}`} />
                                                                    </button>
                                                                    {scanSuccess[item.id] && (
                                                                        <span className="text-xs text-green-600 font-medium">✓ Scanned</span>
                                                                    )}
                                                                    <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500" title="Pause/Activate">
                                                                        {item.status === 'Inactive' ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                                                                    </button>
                                                                    <button className="p-2 hover:bg-gray-100 rounded-md text-gray-500">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {integrations.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    No integrations found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}


                {activeTab === 'scheduler' && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <CalendarClock className="h-5 w-5 text-blue-600" />
                                <div>
                                    <h3 className="text-2xl font-semibold">Integration Scheduler</h3>
                                    <p className="text-sm text-gray-500 mt-1">Manage scheduled data integration jobs</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                                    <div className="text-sm font-medium text-gray-500">Active Jobs</div>
                                    <div className="text-2xl font-bold text-blue-700 mt-1">{integrations.filter(i => i.status === 'Active').length}</div>
                                </div>
                                <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                                    <div className="text-sm font-medium text-gray-500">Completed Today</div>
                                    <div className="text-2xl font-bold text-green-700 mt-1">12</div>
                                </div>
                                <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                                    <div className="text-sm font-medium text-gray-500">Next Scheduled</div>
                                    <div className="text-sm font-bold text-amber-700 mt-1">In 2 hours</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {integrations.filter(i => i.status === 'Active').map((item) => (
                                    <div key={item.id} className="p-4 border rounded-lg hover:bg-blue-50/50 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-blue-800">{item.name}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    <CalendarClock className="h-3 w-3 inline mr-1" />
                                                    {item.frequency}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Last run: {formatDateTime(item.last_sync)}</span>
                                                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100">
                                                    Edit Schedule
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'monitoring' && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="h-5 w-5 text-blue-600" />
                                <div>
                                    <h3 className="text-2xl font-semibold">Real-Time Monitoring</h3>
                                    <p className="text-sm text-gray-500 mt-1">Monitor data integration health and performance</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">System Health</div>
                                    <div className="text-2xl font-bold text-green-600 mt-1">98.5%</div>
                                    <div className="text-xs text-gray-500 mt-1">All systems operational</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Avg Response Time</div>
                                    <div className="text-2xl font-bold text-blue-600 mt-1">245ms</div>
                                    <div className="text-xs text-gray-500 mt-1">Within normal range</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Data Throughput</div>
                                    <div className="text-2xl font-bold text-purple-600 mt-1">1.2GB</div>
                                    <div className="text-xs text-gray-500 mt-1">Last 24 hours</div>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <div className="text-sm font-medium text-gray-500">Error Rate</div>
                                    <div className="text-2xl font-bold text-red-600 mt-1">0.3%</div>
                                    <div className="text-xs text-gray-500 mt-1">1 error in last hour</div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-3">Active Connections</h4>
                                <div className="space-y-2">
                                    {integrations.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : item.status === 'Error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-xs text-gray-500">{item.vendor}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs text-gray-500">Last sync: {formatDateTime(item.last_sync)}</span>
                                                <span className={cn("text-xs px-2 py-1 rounded-full", getItemColor(item.status, statusColors))}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Integration Modal */}
            {showAddModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
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

                            {/* Data Source Folder Path */}
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
        </div>
    );
}
