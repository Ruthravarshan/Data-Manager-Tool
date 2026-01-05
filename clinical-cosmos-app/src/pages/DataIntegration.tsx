import {
    Activity, AlertTriangle, BarChart3, Bell, Bot, Calendar,
    CalendarClock, Check, CheckCircle2, ChevronDown, Clock, Database, Download, Edit2,
    FileText, Key, Mail, MessageSquare, MoreHorizontal, Pause, Play, PlusCircle,
    RefreshCw, Search, Settings2, TestTube, Trash2, X, Cpu, AlertCircle, XCircle, Brain
} from 'lucide-react';

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, useRef } from 'react';


function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function DataIntegration() {
    const [activeTab, setActiveTab] = useState('data-sources');
    const [activeSubTab, setActiveSubTab] = useState('integration-sources');
    // Using simple mock data directly in useState for this example to allow mutation
    const [integrations, setIntegrations] = useState<any[]>([
        {
            id: 1,
            name: "EDC Data Feed",
            vendor: "Medidata Rave",
            type: "API",
            schedule: "Daily at 02:00",
            lastRun: "2025-04-07 02:00",
            nextRun: "2025-04-08 02:00",
            status: "Paused",
            statusColor: "bg-gray-100 text-gray-700",
        },
        {
            id: 2,
            name: "Central Lab Results",
            vendor: "Labcorp",
            type: "SFTP",
            schedule: "Every 12 hours",
            lastRun: "2025-12-23 10:45",
            nextRun: "2025-12-23 22:45",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: 3,
            name: "Imaging Data",
            vendor: "Calyx",
            type: "S3",
            schedule: "Weekly on Monday at 08:30",
            lastRun: "2025-04-07 08:30",
            nextRun: "2025-04-14 08:30",
            status: "Paused",
            statusColor: "bg-gray-100 text-gray-700",
        },
        {
            id: 4,
            name: "ECG Data",
            vendor: "Clario",
            type: "API",
            schedule: "Daily at 04:00",
            lastRun: "2025-04-07 04:12",
            nextRun: "2025-04-08 04:00",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: 5,
            name: "CTMS Data",
            vendor: "Veeva",
            type: "API",
            schedule: "Daily at 06:00",
            lastRun: "2025-12-23 10:45",
            nextRun: "2025-12-24 06:00",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        }
    ]);

    // Monitor.AI State
    const [monitorSettings, setMonitorSettings] = useState({
        selfHealing: true,
        realTimeAlerts: true,
        frequency: 'Every 15 minutes'
    });
    const [chatMessage, setChatMessage] = useState('');

    // Notifications State
    const [notificationChannels, setNotificationChannels] = useState({
        email: true,
        inApp: true,
        recipients: 'admin@example.com'
    });

    const [eventSettings, setEventSettings] = useState([
        { id: 1, event: 'Data Load Complete', email: true, inApp: true },
        { id: 2, event: 'Data Load Error', email: true, inApp: true },
        { id: 3, event: 'Data Validation Error', email: true, inApp: true },
        { id: 4, event: 'AI-Detected Issue', email: true, inApp: true },
        { id: 5, event: 'Auto-Fix Applied', email: true, inApp: true },
    ]);



    const handleEventToggle = (id: number, channel: 'email' | 'inApp') => {
        setEventSettings(prev => prev.map(event =>
            event.id === id ? { ...event, [channel]: !event[channel] } : event
        ));
    };

    // UI Enhancements State
    const [showTypeFilter, setShowTypeFilter] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // Logs UI State
    const [showLogStatusFilter, setShowLogStatusFilter] = useState(false);
    const [showLogSourceFilter, setShowLogSourceFilter] = useState(false);
    const [selectedLogStatus, setSelectedLogStatus] = useState('');
    const [selectedLogSource, setSelectedLogSource] = useState('');
    const [activeLogDetails, setActiveLogDetails] = useState<number | null>(null);

    // Create Modal UI State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '',
        type: 'API',
        vendor: '',
        frequency: 'Daily at 2:00 AM',
        launchImmediately: false
    });
    const [showCreateTypeFilter, setShowCreateTypeFilter] = useState(false);
    const [showCreateVendorFilter, setShowCreateVendorFilter] = useState(false);
    const [showCreateFreqFilter, setShowCreateFreqFilter] = useState(false);

    // Monitoring Tab State
    // monitorActiveSubTab is used instead of monitorSubTab

    const [isMonitorRefreshing, setIsMonitorRefreshing] = useState(false);

    const [monitoringLogs] = useState([
        { id: 1, time: '11:52 am', source: 'Calyx', event: 'Connection timeout', type: 'error', details: 'Failed to establish secure connection to API endpoint', badge: 'error' },
        { id: 2, time: '11:22 am', source: 'Veeva Vault CTMS', event: 'New data imported', type: 'success', details: 'Added 42 new site records', badge: 'success' },
        { id: 3, time: '10:22 am', source: 'Calyx', event: 'Authentication failed', type: 'error', details: 'API key expired, please renew credentials', badge: 'error' },
        { id: 4, time: '10:19 am', source: 'Medidata Rave', event: 'Sync completed successfully', type: 'info', details: 'Processed 127 new records', badge: 'info' },
        { id: 5, time: '10:09 am', source: 'Labcorp', event: 'Data format mismatch detected', type: 'warning', details: 'LB domain format inconsistency in 3 records', badge: 'warning' },
        { id: 6, time: '09:32 am', source: 'Veeva Vault CTMS', event: 'New data imported', type: 'success', details: 'Added 15 new site records', badge: 'success' },
        { id: 7, time: '07:35 am', source: 'Medidata Rave', event: 'Schema validation passed', type: 'success', details: 'All 1500 records validated against schema v2.1', badge: 'success' },
        { id: 8, time: '06:00 am', source: 'AliveCor', event: 'Data packet received', type: 'info', details: 'Received 50MB ECG data packet', badge: 'info' },
        { id: 9, time: '05:45 am', source: 'ClinicalInk', event: 'Partial sync warning', type: 'warning', details: '2 records skipped due to missing patient ID', badge: 'warning' },
        { id: 10, time: '04:00 am', source: 'Labcorp', event: 'Connection retry (1/3)', type: 'warning', details: 'Network latency detected, retrying...', badge: 'warning' },
        { id: 11, time: '04:01 am', source: 'Labcorp', event: 'Connection established', type: 'success', details: 'Secure SFTP channel opened', badge: 'success' }
    ]);
    const [monitoringAnomalies] = useState([
        {
            id: 1,
            title: 'Labcorp',
            severity: 'medium severity',
            severityColor: 'bg-yellow-100 text-yellow-800',
            borderColor: 'border-t-yellow-400',
            date: '27/12/2025, 10:07:51 am',
            description: 'Unusual spike in lab data volume'
        },
        {
            id: 2,
            title: 'Medidata Rave',
            severity: 'high severity',
            severityColor: 'bg-red-100 text-red-800',
            borderColor: 'border-t-red-500',
            date: '26/12/2025, 10:37:51 am',
            description: 'Duplicate subject records detected'
        },
        {
            id: 3,
            title: 'Veeva Vault CTMS',
            severity: 'low severity',
            severityColor: 'bg-blue-100 text-blue-800',
            borderColor: 'border-t-blue-500',
            date: '25/12/2025, 10:37:51 am',
            description: 'Minor data inconsistency in site information',
            badge: 'auto-resolved',
            badgeColor: 'bg-green-100 text-green-800'
        }
    ]);


    // Integration Details and Credentials State
    const [showDetailsPopup, setShowDetailsPopup] = useState(false);
    const [selectedDetailsIntegration, setSelectedDetailsIntegration] = useState<any>(null);

    const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
    const [credentialsTab, setCredentialsTab] = useState('auth');
    const [credentialsForm, setCredentialsForm] = useState({
        authType: 'OAuth 2.0',
        clientId: '••••••••••••',
        clientSecret: '••••••••••••',
        authUrl: 'https://auth.vendor.com/oauth/token',
        showSecret: false,
        auditLogging: true,
        accessAdmin: true,
        accessDataManager: true,
        accessStudyManager: false
    });

    // Real-Time Monitoring State
    const [monitorActiveSubTab, setMonitorActiveSubTab] = useState<'dashboard' | 'logs' | 'anomalies' | 'ai-analysis'>('dashboard');

    const [monitoringStatusData] = useState([
        {
            id: 1,
            name: 'Medidata Rave',
            tag: 'EDC',
            lastSync: '24/12/2025, 2:29:59 pm',
            nextSync: '24/12/2025, 4:29:59 pm',
            recordsProcessed: '1,248',
            successRate: 99.7,
            status: 'Active',
            statusColor: 'text-green-700 bg-green-100',
            barColor: 'bg-blue-600',
            borderColor: 'border-t-4 border-t-green-500'
        },
        {
            id: 2,
            name: 'Labcorp',
            tag: 'Lab',
            lastSync: '24/12/2025, 1:35:01 pm',
            nextSync: '24/12/2025, 4:05:01 pm',
            recordsProcessed: '562',
            successRate: 94.2,
            status: 'Warning',
            statusColor: 'text-amber-700 bg-amber-100',
            barColor: 'bg-blue-600',
            borderColor: 'border-t-4 border-t-amber-400'
        },
        {
            id: 3,
            name: 'Veeva Vault CTMS',
            tag: 'CTMS',
            lastSync: '24/12/2025, 2:05:01 pm',
            nextSync: '24/12/2025, 5:35:01 pm',
            recordsProcessed: '324',
            successRate: 100,
            status: 'Active',
            statusColor: 'text-green-700 bg-green-100',
            barColor: 'bg-blue-600',
            borderColor: 'border-t-4 border-t-green-500'
        },
        {
            id: 4,
            name: 'Calyx',
            tag: 'Imaging',
            lastSync: '23/12/2025, 3:35:01 pm',
            nextSync: '24/12/2025, 4:05:01 pm',
            recordsProcessed: '0',
            successRate: 0,
            status: 'Error',
            statusColor: 'text-red-700 bg-red-100',
            barColor: 'bg-gray-100',
            borderColor: 'border-t-4 border-t-red-500'
        }
    ]);

    // Data Source Manager - Integration Sources State
    const [integrationSources, setIntegrationSources] = useState([
        {
            id: 1,
            name: "EDC Data Feed",
            vendor: "Medidata Rave",
            type: "API",
            typeColor: "bg-purple-100 text-purple-700",
            frequency: "Daily at 2:00 AM",
            lastSync: "2025-12-23 09:52:37",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: 2,
            name: "Central Lab Results",
            vendor: "Labcorp",
            type: "SFTP",
            typeColor: "bg-orange-100 text-orange-700",
            frequency: "Every 12 hours",
            lastSync: "2023-04-04 14:00:03",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: 3,
            name: "Imaging Data",
            vendor: "Calyx",
            type: "S3",
            typeColor: "bg-green-100 text-green-700",
            frequency: "Weekly on Monday",
            lastSync: "2023-04-01 08:30:22",
            status: "Inactive",
            statusColor: "bg-gray-100 text-gray-700",
        },
        {
            id: 4,
            name: "ECG Data",
            vendor: "AliveCor",
            type: "API",
            typeColor: "bg-purple-100 text-purple-700",
            frequency: "Daily at 4:00 AM",
            lastSync: "2023-04-04 04:12:55",
            status: "Active",
            statusColor: "bg-green-100 text-green-700",
        },
        {
            id: 5,
            name: "CTMS Data",
            vendor: "Veeva Vault CTMS",
            type: "API",
            typeColor: "bg-purple-100 text-purple-700",
            frequency: "Daily at 6:00 AM",
            lastSync: "2023-04-04 06:00:05",
            status: "Error",
            statusColor: "bg-red-100 text-red-700",
            errorMessage: "API authentication failed. Check credentials."
        },
        {
            id: 6,
            name: "eCOA Data",
            vendor: "ClinicalInk",
            type: "API",
            typeColor: "bg-purple-100 text-purple-700",
            frequency: "Every 6 hours",
            lastSync: "2023-04-04 18:00:22",
            status: "Configuring...",
            statusColor: "bg-blue-100 text-blue-700",
        }
    ]);

    // Mock Data for Data Source Manager - Integration Logs
    const integrationLogs = [
        {
            id: 1,
            dateTime: "2025-04-07 15:32:45",
            source: "EDC Data Feed",
            operation: "Data Load",
            operationColor: "bg-blue-100 text-blue-700",
            recordsProcessed: "3,450",
            recordsDifference: "+156",
            recordsDiffColor: "text-green-600",
            duration: "78s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Successfully loaded 156 records",
            details: "Loaded DM, VS, AE domains. 156 new records processed."
        },
        {
            id: 2,
            dateTime: "2025-04-07 14:05:12",
            source: "Central Lab Results",
            operation: "Sync",
            operationColor: "bg-green-100 text-green-700",
            recordsProcessed: "1,275",
            recordsDifference: "+37",
            recordsDiffColor: "text-green-600",
            duration: "45s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Synchronized 37 lab results",
            details: "Synchronized 37 records from LB domain. All data valid."
        },
        {
            id: 3,
            dateTime: "2025-04-07 12:30:01",
            source: "CTMS Data",
            operation: "Error",
            operationColor: "bg-red-100 text-red-700",
            recordsProcessed: "-",
            recordsDifference: "-",
            recordsDiffColor: "text-gray-400",
            duration: "12s",
            status: "Error",
            statusColor: "bg-red-50 border border-red-200 text-red-600",
            message: "Connection timeout",
            details: "Failed to connect to CTMS API endpoint after 3 retries. Check network settings."
        },
        {
            id: 4,
            dateTime: "2025-04-07 10:15:22",
            source: "Imaging Data",
            operation: "Config",
            operationColor: "bg-purple-100 text-purple-700",
            recordsProcessed: "-",
            recordsDifference: "-",
            recordsDiffColor: "text-gray-400",
            duration: "3s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Configuration updated",
            details: "S3 bucket path updated to 'clinical-trials-imaging-2025/prod'."
        },
        {
            id: 5,
            dateTime: "2025-04-07 09:45:18",
            source: "Central Lab Results",
            operation: "Data Load",
            operationColor: "bg-blue-100 text-blue-700",
            recordsProcessed: "1,238",
            recordsDifference: "+51",
            recordsDiffColor: "text-green-600",
            duration: "62s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Partial data load",
            details: "Loaded 51 records. 2 records skipped due to validation errors."
        },
        {
            id: 6,
            dateTime: "2025-04-07 08:30:55",
            source: "ECG Data",
            operation: "Data Load",
            operationColor: "bg-blue-100 text-blue-700",
            recordsProcessed: "1,032",
            recordsDifference: "+42",
            recordsDiffColor: "text-green-600",
            duration: "28s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Routine data ingestion",
            details: "Ingested 42 ECG waveform files successfully."
        },
        {
            id: 7,
            dateTime: "2025-04-07 07:15:33",
            source: "eCOA Data",
            operation: "Config",
            operationColor: "bg-purple-100 text-purple-700",
            recordsProcessed: "-",
            recordsDifference: "-",
            recordsDiffColor: "text-gray-400",
            duration: "5s",
            status: "Unknown",
            statusColor: "bg-gray-50 border border-gray-200 text-gray-600",
            message: "Schedule updated",
            details: "Frequency changed from Daily to Every 6 hours."
        }
    ];


    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentIntegration, setCurrentIntegration] = useState<any>(null);

    // Toast State
    const [toast, setToast] = useState<{ visible: boolean, title: string, message: string }>({
        visible: false,
        title: '',
        message: ''
    });

    // Form States
    const [editForm, setEditForm] = useState({
        scheduleType: 'Daily',
        time: '02:00',
        enabled: true
    });

    // Time Picker State
    const [showTimePicker, setShowTimePicker] = useState(false);
    const timePickerRef = useRef<HTMLDivElement>(null);

    // Click outside handler for time picker
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setShowTimePicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => {
                setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    const showToast = (title: string, message: string) => {
        setToast({ visible: true, title, message });
    };

    const handleEditClick = (item: any) => {
        setCurrentIntegration(item);
        setEditForm({
            scheduleType: item.schedule.split(' ')[0] || 'Daily', // Simple parsing logic
            time: item.schedule.match(/\d{2}:\d{2}/)?.[0] || '02:00',
            enabled: item.status === 'Active'
        });
        setIsEditModalOpen(true);
        setShowTimePicker(false);
    };

    const handleCreateClick = () => {
        setCreateForm({
            name: '',
            type: 'API',
            vendor: '',
            frequency: 'Daily at 2:00 AM',
            launchImmediately: false
        });
        setIsCreateModalOpen(true);
    };

    const handleTimeSelect = (hour: string, minute: string, isEdit: boolean) => {
        const newTime = `${hour}:${minute}`;
        if (isEdit) {
            setEditForm({ ...editForm, time: newTime });
        }
    };

    // Action Handlers
    const handleRunIntegration = (item: any) => {
        showToast("Integration started", `Manually running ${item.name} integration now.`);
    };

    const handleToggleStatus = (item: any) => {
        const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
        const newStatusColor = newStatus === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";

        const updatedIntegrations = integrations.map(i =>
            i.id === item.id ? { ...i, status: newStatus, statusColor: newStatusColor } : i
        );
        setIntegrations(updatedIntegrations);

        if (newStatus === 'Active') {
            showToast("Schedule activated", `${item.name} integration is now active.`);
        } else {
            showToast("Schedule paused", `${item.name} integration is now paused.`);
        }
    };

    const handleDelete = (item: any) => {
        const updatedIntegrations = integrations.filter(i => i.id !== item.id);
        setIntegrations(updatedIntegrations);
        showToast("Schedule deleted", "The integration schedule has been removed.");
    };



    const handleManualSync = (id: number) => {
        const now = new Date();
        const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

        setIntegrationSources(prev => prev.map(source =>
            source.id === id ? { ...source, lastSync: timestamp } : source
        ));

        showToast("Sync Completed", "Data integration synchronized successfully.");
    };

    const handleToggleSourceStatus = (id: number) => {
        setIntegrationSources(prev => prev.map(source => {
            if (source.id === id) {
                const newStatus = source.status === 'Active' ? 'Inactive' : 'Active';
                const newStatusColor = newStatus === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";

                if (newStatus === 'Active') {
                    showToast("Integration Activated", `${source.name} is now active.`);
                } else {
                    showToast("Integration Paused", `${source.name} is now paused.`);
                }

                return { ...source, status: newStatus, statusColor: newStatusColor };
            }
            return source;
        }));
    };

    const handleMonitorRefresh = () => {
        setIsMonitorRefreshing(true);
        setTimeout(() => {
            setIsMonitorRefreshing(false);
            showToast("Monitoring Updated", "Real-time monitoring data has been refreshed.");
        }, 1500);
    };


    const TimePicker = ({ value, onChange }: { value: string, onChange: (h: string, m: string) => void }) => {
        const [selectedHour, selectedMinute] = value.split(':');
        const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
        const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

        return (
            <div ref={timePickerRef} className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg flex h-64 overflow-hidden">
                <div className="flex-1 overflow-y-auto border-r border-gray-100 no-scrollbar">
                    {hours.map(h => (
                        <div
                            key={h}
                            onClick={(e) => { e.stopPropagation(); onChange(h, selectedMinute); }}
                            className={cn(
                                "px-4 py-2 text-sm cursor-center hover:bg-blue-50 text-center",
                                h === selectedHour ? "bg-gray-200 font-bold" : "text-gray-700"
                            )}
                        >
                            {h}
                        </div>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-50 no-scrollbar">
                    {minutes.map(m => (
                        <div
                            key={m}
                            onClick={(e) => { e.stopPropagation(); onChange(selectedHour, m); }}
                            className={cn(
                                "px-4 py-2 text-sm cursor-center hover:bg-blue-50 text-center",
                                m === selectedMinute ? "bg-gray-200 font-bold" : "text-gray-700"
                            )}
                        >
                            {m}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen relative">
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Integration</h1>
                        <p className="text-gray-500 mt-1">Manage data integrations and connections across your clinical trials</p>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 mb-6 w-fit shadow-sm">
                    {[
                        { id: 'data-sources', label: 'Data Sources', icon: Database },
                        { id: 'scheduler', label: 'Scheduler', icon: CalendarClock },
                        { id: 'monitoring', label: 'Real-Time Monitoring', icon: Activity },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all",
                                activeTab === tab.id
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <tab.icon className="h-4 w-4 mr-2" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'scheduler' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-blue-600" />
                                <h3 className="text-xl font-semibold text-gray-900">Integration Scheduler</h3>
                            </div>
                            <button
                                onClick={handleCreateClick}
                                className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors gap-2"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Create Schedule
                            </button>
                        </div>

                        <div className="p-6">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-500 border-b border-gray-100">
                                        <th className="py-4 font-medium w-1/4">Data Source</th>
                                        <th className="py-4 font-medium w-1/6">Schedule</th>
                                        <th className="py-4 font-medium w-1/6">Last Run</th>
                                        <th className="py-4 font-medium w-1/6">Next Run</th>
                                        <th className="py-4 font-medium w-1/6">Status</th>
                                        <th className="py-4 font-medium w-1/6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {integrations.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50/50">
                                            <td className="py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="py-4 text-gray-600">{item.schedule}</td>
                                            <td className="py-4">
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-gray-900 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        {item.lastRun.split(' ')[0]}
                                                    </span>
                                                    <span className="text-gray-500 pl-4">{item.lastRun.split(' ')[1]}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-gray-900 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3 text-blue-400" />
                                                        {item.nextRun.split(' ')[0]}
                                                    </span>
                                                    <span className="text-gray-500 pl-4">{item.nextRun.split(' ')[1]}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", item.status === 'Active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleRunIntegration(item)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Run Integration"
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={cn("hover:text-amber-700", item.status === 'Active' ? "text-amber-600" : "text-green-600")}
                                                        title={item.status === 'Active' ? "Pause" : "Resume"}
                                                    >
                                                        {item.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item)}
                                                        className="text-red-400 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between p-6 pb-0">
                                <h2 className="text-lg font-semibold text-gray-900">Edit Integration Schedule</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="px-6 pb-6 pt-2 text-sm text-gray-500">
                                Update schedule settings for {currentIntegration?.name}.
                            </div>

                            <div className="p-6 pt-0 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Schedule Type</label>
                                    <div className="relative">
                                        <select
                                            value={editForm.scheduleType}
                                            onChange={(e) => setEditForm({ ...editForm, scheduleType: e.target.value })}
                                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option>Hourly</option>
                                            <option>Daily</option>
                                            <option>Weekly</option>
                                            <option>Monthly</option>
                                            <option>Custom</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Time</label>
                                    <div className="relative">
                                        <div
                                            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 cursor-pointer hover:border-gray-400"
                                            onClick={(e) => { e.stopPropagation(); setShowTimePicker(!showTimePicker); }}
                                        >
                                            <span className="flex-1 text-gray-900">{editForm.time}</span>
                                            <Clock className="h-5 w-5 text-gray-500" />
                                        </div>
                                        {showTimePicker && (
                                            <TimePicker
                                                value={editForm.time}
                                                onChange={(h, m) => handleTimeSelect(h, m, true)}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center items-start gap-3">
                                    <button
                                        onClick={() => setEditForm({ ...editForm, enabled: !editForm.enabled })}
                                        className={cn(
                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                            editForm.enabled ? "bg-blue-600" : "bg-gray-200"
                                        )}
                                    >
                                        <span className={cn(
                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                            editForm.enabled ? "translate-x-6" : "translate-x-1"
                                        )} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-900 pt-0.5">Schedule Enabled</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 bg-gray-50 p-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Update Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Toast Notification */}
                {toast.visible && (
                    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg border border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900">{toast.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => setToast({ ...toast, visible: false })}
                                    className="ml-4 inline-flex flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {activeTab === 'data-sources' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Database className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 leading-none">Data Source Manager</h2>
                                    <p className="text-gray-500 mt-1">Configure and manage data integrations from external sources</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCreateClick}
                                className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors gap-2"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Add Integration
                            </button>
                        </div>

                        {/* Sub-tabs */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-50/50 p-1 rounded-lg inline-flex">
                                {[
                                    { id: 'integration-sources', label: 'Integration Sources' },
                                    { id: 'integration-logs', label: 'Integration Logs' },
                                    { id: 'monitor-ai', label: 'Monitor.AI', icon: Activity },
                                    { id: 'notifications', label: 'Notifications', icon: Bell }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveSubTab(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                                            activeSubTab === tab.id
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-blue-600/70 hover:text-blue-600 hover:bg-white/50"
                                        )}
                                    >
                                        {tab.icon && <tab.icon className="h-4 w-4" />}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Banner */}
                        {activeSubTab === 'integration-sources' && (
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                <span className="text-red-700 text-sm font-medium">One or more integrations have errors. Please check the integration details.</span>
                            </div>
                        )}

                        {/* Content Area */}
                        {activeSubTab === 'integration-sources' && (
                            <div className="animate-in fade-in duration-300">
                                {/* Filters */}
                                <div className="flex gap-4 mb-6 relative z-10">
                                    <div className="relative">
                                        <button
                                            onClick={() => { setShowTypeFilter(!showTypeFilter); setShowStatusFilter(false); }}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm min-w-[140px] justify-between"
                                        >
                                            {selectedType || 'All Types'}
                                            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showTypeFilter ? "rotate-180" : "")} />
                                        </button>
                                        {showTypeFilter && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                {['All Types', 'API', 'SFTP', 'S3'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => {
                                                            setSelectedType(type === 'All Types' ? '' : type);
                                                            setShowTypeFilter(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                    >
                                                        {type}
                                                        {(selectedType === type || (type === 'All Types' && !selectedType)) && (
                                                            <Check className="h-3.5 w-3.5 text-blue-600" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => { setShowStatusFilter(!showStatusFilter); setShowTypeFilter(false); }}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm min-w-[140px] justify-between"
                                        >
                                            {selectedStatus || 'All Statuses'}
                                            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showStatusFilter ? "rotate-180" : "")} />
                                        </button>
                                        {showStatusFilter && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                {['All Statuses', 'Active', 'Inactive', 'Error'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => {
                                                            setSelectedStatus(status === 'All Statuses' ? '' : status);
                                                            setShowStatusFilter(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                                                    >
                                                        {status}
                                                        {(selectedStatus === status || (status === 'All Statuses' && !selectedStatus)) && (
                                                            <Check className="h-3.5 w-3.5 text-blue-600" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-auto">
                                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                                            <Download className="h-4 w-4" />
                                            Export Configuration
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-hidden rounded-lg border border-gray-100">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-blue-50/30 text-blue-800">
                                            <tr>
                                                <th className="py-3 px-4 font-semibold">Name</th>
                                                <th className="py-3 px-4 font-semibold">Vendor</th>
                                                <th className="py-3 px-4 font-semibold">Type</th>
                                                <th className="py-3 px-4 font-semibold">Frequency</th>
                                                <th className="py-3 px-4 font-semibold">Last Sync</th>
                                                <th className="py-3 px-4 font-semibold">Status</th>
                                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 bg-white">
                                            {integrationSources.map((source) => (
                                                <tr key={source.id} className="group hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-4 px-4 font-medium text-blue-700">{source.name}</td>
                                                    <td className="py-4 px-4 text-gray-900 font-medium">{source.vendor}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide", source.typeColor)}>
                                                            {source.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-600">{source.frequency}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-gray-600 text-xs font-mono">{source.lastSync.split(' ')[0]}</div>
                                                        <div className="text-gray-600 text-xs font-mono">{source.lastSync.split(' ')[1]}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit", source.statusColor)}>
                                                                {source.status === 'Active' && <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>}
                                                                {source.status}
                                                            </span>
                                                            {source.errorMessage && (
                                                                <div className="text-[11px] text-red-500 leading-tight max-w-[180px]">
                                                                    {source.errorMessage}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleManualSync(source.id)}
                                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded border border-gray-200" title="Start Manual Data Load">
                                                                <RefreshCw className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleSourceStatus(source.id)}
                                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded border border-gray-200"
                                                                title={source.status === 'Active' ? "Pause Integration" : "Activate Integration"}
                                                            >
                                                                {source.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                            </button>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveActionMenu(activeActionMenu === source.id ? null : source.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded border-none"
                                                                    title="More Actions"
                                                                >
                                                                    <MoreHorizontal className="h-5 w-5" />
                                                                </button>
                                                                {activeActionMenu === source.id && (
                                                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedDetailsIntegration(source);
                                                                                setShowDetailsPopup(true);
                                                                                setActiveActionMenu(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                                        >
                                                                            <FileText className="h-4 w-4 text-gray-400" />
                                                                            View Integration Details
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedDetailsIntegration(source);
                                                                                setIsCredentialsModalOpen(true);
                                                                                setActiveActionMenu(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                                                        >
                                                                            <Key className="h-4 w-4 text-gray-400" />
                                                                            Manage Credentials
                                                                        </button>
                                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                                            <TestTube className="h-4 w-4 text-gray-400" />
                                                                            Test Integration
                                                                        </button>
                                                                        <div className="border-t border-gray-100 my-1"></div>
                                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                                            <Settings2 className="h-4 w-4 text-gray-400" />
                                                                            Edit Configuration
                                                                        </button>
                                                                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                                            Edit Schedule
                                                                        </button>
                                                                        <div className="border-t border-gray-100 my-1"></div>
                                                                        <button
                                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                                                            onClick={() => {
                                                                                handleDelete(source);
                                                                                setActiveActionMenu(null);
                                                                            }}
                                                                        >
                                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                                            Delete Integration
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
                                </div>
                            </div>

                        )}

                        {/* Integration Details Pop-up */}
                        {showDetailsPopup && selectedDetailsIntegration && (
                            <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Integration Details</h3>
                                        <button
                                            onClick={() => setShowDetailsPopup(false)}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p className="leading-relaxed">
                                            Details for <span className="font-semibold text-gray-900">{selectedDetailsIntegration.name}</span> - Connected to <span className="font-semibold text-gray-900">{selectedDetailsIntegration.vendor}</span> via {selectedDetailsIntegration.type}. Last synced at {selectedDetailsIntegration.lastSync}.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Manage Credentials Modal */}
                        {isCredentialsModalOpen && selectedDetailsIntegration && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Key className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">Credentials Configuration</h2>
                                                <p className="text-sm text-gray-500 mt-1">Configure secure connection credentials for Integration #{selectedDetailsIntegration.id}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsCredentialsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Tabs */}
                                    <div className="border-b border-gray-200 bg-gray-50/50 px-6 pt-4">
                                        <div className="flex space-x-6">
                                            {[
                                                { id: 'auth', label: 'API Authentication', icon: CheckCircle2 },
                                                { id: 'connection', label: 'Connection Details', icon: Database },
                                                { id: 'security', label: 'Security Options', icon: Key }
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setCredentialsTab(tab.id)}
                                                    className={cn(
                                                        "pb-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors",
                                                        credentialsTab === tab.id
                                                            ? "border-blue-600 text-blue-600"
                                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                    )}
                                                >
                                                    {tab.id === 'auth' && <div className="h-4 w-4 border-2 border-current rounded-sm" />}
                                                    {tab.id !== 'auth' && <tab.icon className="h-4 w-4" />}
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 min-h-[400px]">
                                        {credentialsTab === 'auth' && (
                                            <div className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <label className="block text-sm font-medium text-gray-900">Authentication Type</label>
                                                        <select
                                                            value={credentialsForm.authType}
                                                            onChange={(e) => setCredentialsForm({ ...credentialsForm, authType: e.target.value })}
                                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option>OAuth 2.0</option>
                                                            <option>API Key</option>
                                                            <option>Basic Auth</option>
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-900">Client ID</label>
                                                        <input
                                                            type="text"
                                                            value={credentialsForm.clientId}
                                                            readOnly
                                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-900">Client Secret</label>
                                                        <input
                                                            type="password"
                                                            value={credentialsForm.clientSecret}
                                                            readOnly
                                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="block text-sm font-medium text-gray-900">OAuth URL</label>
                                                        <input
                                                            type="text"
                                                            value={credentialsForm.authUrl}
                                                            readOnly
                                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-gray-500 focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setCredentialsForm({ ...credentialsForm, showSecret: !credentialsForm.showSecret })}
                                                            className={cn(
                                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                                credentialsForm.showSecret ? "bg-blue-600" : "bg-gray-200"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                                credentialsForm.showSecret ? "translate-x-6" : "translate-x-1"
                                                            )} />
                                                        </button>
                                                        <span className="text-sm font-medium text-gray-900">Show secret values</span>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                            Test Connection
                                                        </button>
                                                        <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">
                                                            Save Credentials
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {credentialsTab === 'connection' && (
                                            <div className="flex items-center justify-center p-12 border border-gray-200 rounded-xl bg-gray-50/50 dashed">
                                                <div className="flex items-center gap-3 text-gray-500">
                                                    <Database className="h-5 w-5" />
                                                    <span>Please configure API authentication details in the Authentication tab.</span>
                                                </div>
                                            </div>
                                        )}

                                        {credentialsTab === 'security' && (
                                            <div className="space-y-8">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Credential Storage</h3>
                                                    <p className="text-gray-500 text-sm mb-6">Configure how credentials are stored and managed</p>

                                                    <div className="bg-white border boundary border-gray-200 rounded-xl p-6 space-y-8">
                                                        {/* Encryption */}
                                                        <div className="flex gap-4">
                                                            <div className="mt-1">
                                                                <div className="p-1.5 border-2 border-blue-500 rounded text-blue-500">
                                                                    <Key className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 space-y-4">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">Encryption at Rest</h4>
                                                                    <p className="text-sm text-gray-500">All credentials are encrypted using AES-256 before storing in the database.</p>
                                                                </div>
                                                                <div className="flex items-center justify-between py-2">
                                                                    <span className="text-sm font-medium text-gray-900">Key Rotation Period</span>
                                                                    <select className="border border-gray-300 rounded-lg text-sm p-2 bg-white min-w-[140px]">
                                                                        <option>90 days</option>
                                                                        <option>180 days</option>
                                                                        <option>365 days</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Access Controls */}
                                                        <div className="flex gap-4">
                                                            <div className="mt-1">
                                                                <div className="p-1.5 border-2 border-green-500 rounded text-green-500">
                                                                    <CheckCircle2 className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">Access Controls</h4>
                                                                    <p className="text-sm text-gray-500">Control which users and roles can access these credentials.</p>
                                                                </div>
                                                                <div className="space-y-2 pt-1">
                                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={credentialsForm.accessAdmin}
                                                                            onChange={(e) => setCredentialsForm({ ...credentialsForm, accessAdmin: e.target.checked })}
                                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-sm font-medium text-gray-900">Allow Admin Access</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={credentialsForm.accessDataManager}
                                                                            onChange={(e) => setCredentialsForm({ ...credentialsForm, accessDataManager: e.target.checked })}
                                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-sm font-medium text-gray-900">Allow Data Manager Access</span>
                                                                    </label>
                                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={credentialsForm.accessStudyManager}
                                                                            onChange={(e) => setCredentialsForm({ ...credentialsForm, accessStudyManager: e.target.checked })}
                                                                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-sm font-medium text-gray-900">Allow Study Manager Access</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Audit Logging */}
                                                        <div className="flex gap-4">
                                                            <div className="mt-1">
                                                                <div className="p-1.5 border-2 border-amber-500 rounded text-amber-500">
                                                                    <FileText className="h-5 w-5" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">Credential Usage Audit</h4>
                                                                    <p className="text-sm text-gray-500 mb-3">Track all access and usage of these credentials.</p>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => setCredentialsForm({ ...credentialsForm, auditLogging: !credentialsForm.auditLogging })}
                                                                        className={cn(
                                                                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                                            credentialsForm.auditLogging ? "bg-blue-600" : "bg-gray-200"
                                                                        )}
                                                                    >
                                                                        <span className={cn(
                                                                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                                            credentialsForm.auditLogging ? "translate-x-6" : "translate-x-1"
                                                                        )} />
                                                                    </button>
                                                                    <span className="text-sm font-medium text-gray-900">Enable Audit Logging</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">
                                                        Save Security Settings
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSubTab === 'integration-logs' && (
                            <div className="animate-in fade-in duration-300">
                                {/* Filters */}
                                {/* Filters */}
                                <div className="flex justify-between items-center mb-4 relative z-20">
                                    <div className="flex gap-3 flex-1">
                                        <div className="relative w-64">
                                            <input
                                                type="text"
                                                placeholder="Search logs..."
                                                className="w-full bg-white border border-gray-200 rounded-lg pl-3 pr-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 shadow-sm"
                                            />
                                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>

                                        {/* Custom Status Filter */}
                                        <div className="relative">
                                            <button
                                                onClick={() => { setShowLogStatusFilter(!showLogStatusFilter); setShowLogSourceFilter(false); }}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm min-w-[140px] justify-between"
                                            >
                                                {selectedLogStatus || 'All Statuses'}
                                                <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showLogStatusFilter ? "rotate-180" : "")} />
                                            </button>
                                            {showLogStatusFilter && (
                                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-200 min-w-[160px]">
                                                    {['All Statuses', 'Success', 'Warning', 'Error', 'Info'].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => {
                                                                setSelectedLogStatus(status === 'All Statuses' ? '' : status);
                                                                setShowLogStatusFilter(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                        >
                                                            {status}
                                                            {(selectedLogStatus === status || (status === 'All Statuses' && !selectedLogStatus)) && (
                                                                <Check className="h-3.5 w-3.5 text-blue-600" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Custom Source Filter */}
                                        <div className="relative">
                                            <button
                                                onClick={() => { setShowLogSourceFilter(!showLogSourceFilter); setShowLogStatusFilter(false); }}
                                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm min-w-[140px] justify-between"
                                            >
                                                {selectedLogSource || 'All Sources'}
                                                <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showLogSourceFilter ? "rotate-180" : "")} />
                                            </button>
                                            {showLogSourceFilter && (
                                                <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-200 min-w-[180px]">
                                                    {['All Sources', 'EDC Data Feed', 'Central Lab Results', 'Imaging Data', 'ECG Data', 'CTMS Data', 'eCOA Data'].map((source) => (
                                                        <button
                                                            key={source}
                                                            onClick={() => {
                                                                setSelectedLogSource(source === 'All Sources' ? '' : source);
                                                                setShowLogSourceFilter(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                        >
                                                            {source}
                                                            {(selectedLogSource === source || (source === 'All Sources' && !selectedLogSource)) && (
                                                                <Check className="h-3.5 w-3.5 text-blue-600" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">
                                        <Download className="h-4 w-4" />
                                        Export Logs
                                    </button>
                                </div>

                                {/* Logs Table */}
                                <div className="overflow-visible rounded-lg border border-gray-100 mb-6 relative">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-blue-50/30 text-blue-800">
                                            <tr>
                                                <th className="py-3 px-4 font-semibold">Date & Time</th>
                                                <th className="py-3 px-4 font-semibold">Integration Source</th>
                                                <th className="py-3 px-4 font-semibold">Operation</th>
                                                <th className="py-3 px-4 font-semibold text-center">Records Processed</th>
                                                <th className="py-3 px-4 font-semibold text-center">Records Difference</th>
                                                <th className="py-3 px-4 font-semibold text-center">Duration</th>
                                                <th className="py-3 px-4 font-semibold">Status</th>
                                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 bg-white">
                                            {integrationLogs.map((log) => (
                                                <tr key={log.id} className="group hover:bg-gray-50/60 transition-colors">
                                                    <td className="py-4 px-4 text-gray-600 font-mono text-xs">{log.dateTime}</td>
                                                    <td className="py-4 px-4 font-medium text-gray-900">{log.source}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", log.operationColor)}>
                                                            {log.operation}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center font-medium text-gray-900">{log.recordsProcessed}</td>
                                                    <td className={cn("py-4 px-4 text-center font-bold text-xs", log.recordsDiffColor)}>
                                                        {log.recordsDifference}
                                                    </td>
                                                    <td className="py-4 px-4 text-center text-gray-600 text-xs">{log.duration}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={cn("inline-flex items-center px-3 py-1 rounded-3xl text-xs font-semibold border", log.statusColor)}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setActiveLogDetails(activeLogDetails === log.id ? null : log.id)}
                                                                className={cn(
                                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors",
                                                                    activeLogDetails === log.id
                                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                        : "text-gray-700 bg-white border-gray-200 hover:bg-gray-50"
                                                                )}
                                                            >
                                                                <FileText className="h-3.5 w-3.5 text-gray-500" />
                                                                Details
                                                            </button>
                                                            {activeLogDetails === log.id && (
                                                                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-40 animate-in fade-in zoom-in-95 duration-200 text-left">
                                                                    <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                                                                        <h4 className="font-semibold text-gray-900">Log Details</h4>
                                                                        <button
                                                                            onClick={() => setActiveLogDetails(null)}
                                                                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="space-y-2.5 text-sm">
                                                                        <div>
                                                                            <span className="font-semibold text-gray-900">Integration: </span>
                                                                            <span className="text-gray-600">{log.source}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold text-gray-900">Operation: </span>
                                                                            <span className="text-gray-600 lowercase">{log.operation}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold text-gray-900">Status: </span>
                                                                            <span className="text-gray-600 lowercase">{log.status}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-semibold text-gray-900">Message: </span>
                                                                            <span className="text-gray-600">{log.message}</span>
                                                                        </div>
                                                                        <div className="pt-1">
                                                                            <span className="font-semibold text-gray-900 block mb-1">Details: </span>
                                                                            <p className="text-gray-600 leading-relaxed text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                                                                {log.details}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        )}

                        {activeSubTab === 'monitor-ai' && (
                            <div className="animate-in fade-in duration-300 space-y-6">
                                {/* Status Banner */}
                                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-green-100 rounded-full mt-1">
                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-green-800">All Integrations Operational</h3>
                                            <p className="text-green-700 mt-1">Monitor.AI is actively scanning integrations and no issues have been detected.</p>
                                            <p className="text-green-600 text-sm mt-3 font-medium">Last checked: 3:58:04 pm</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* AI Monitoring Status Card */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Brain className="h-5 w-5 text-purple-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">AI Monitoring Status</h3>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Self-Healing Capability</h4>
                                                    <p className="text-sm text-gray-500 mt-1 max-w-[250px]">Allow Monitor.AI to automatically fix common integration issues</p>
                                                </div>
                                                <button
                                                    onClick={() => setMonitorSettings({ ...monitorSettings, selfHealing: !monitorSettings.selfHealing })}
                                                    className={cn(
                                                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                        monitorSettings.selfHealing ? "bg-blue-600" : "bg-gray-200"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                                                        monitorSettings.selfHealing ? "translate-x-6" : "translate-x-1"
                                                    )} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Real-time Alerts</h4>
                                                    <p className="text-sm text-gray-500 mt-1 max-w-[250px]">Send immediate alerts when critical issues are detected</p>
                                                </div>
                                                <button
                                                    onClick={() => setMonitorSettings({ ...monitorSettings, realTimeAlerts: !monitorSettings.realTimeAlerts })}
                                                    className={cn(
                                                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                        monitorSettings.realTimeAlerts ? "bg-blue-600" : "bg-gray-200"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                                                        monitorSettings.realTimeAlerts ? "translate-x-6" : "translate-x-1"
                                                    )} />
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block font-medium text-gray-900 mb-2">Monitoring Frequency</label>
                                                <div className="relative">
                                                    <select
                                                        value={monitorSettings.frequency}
                                                        onChange={(e) => setMonitorSettings({ ...monitorSettings, frequency: e.target.value })}
                                                        className="w-full appearance-none bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option>Every 5 minutes</option>
                                                        <option>Every 15 minutes</option>
                                                        <option>Every 30 minutes</option>
                                                        <option>Every hour</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Assistant Card */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-full">
                                        <div className="flex flex-col mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
                                            <p className="text-sm text-gray-500 mt-1">Ask questions about your integrations and troubleshooting</p>
                                        </div>

                                        <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                    <Bot className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900 mb-1">Monitor.AI</div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        I can help you troubleshoot integration issues or answer questions about your data connections. What would you like to know?
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <textarea
                                                value={chatMessage}
                                                onChange={(e) => setChatMessage(e.target.value)}
                                                placeholder="Ask about your integrations..."
                                                className="w-full h-24 p-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
                                            />
                                            <div className="flex justify-end">
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    Send Question
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Integration Health Summary */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Integration Health Summary</h3>
                                        <p className="text-sm text-gray-500 mt-1">AI-powered monitoring status for all your integrations</p>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-8">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 mb-1">Total Integrations</div>
                                            <div className="text-3xl font-bold text-gray-900">6</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 mb-1">Actively Monitored</div>
                                            <div className="text-3xl font-bold text-gray-900">6 <span className="text-base font-normal text-gray-400">/ 6</span></div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 mb-1">Issues Detected (30 days)</div>
                                            <div className="text-3xl font-bold text-gray-900">3</div>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 mb-1">Issues Auto-Fixed</div>
                                            <div className="text-3xl font-bold text-gray-900">2 <span className="text-base font-normal text-gray-400">/ 3</span></div>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Monitoring Status by Integration</h4>
                                    <div className="space-y-4 mb-6">
                                        {[
                                            { name: 'EDC Data Feed', icon: Database, color: 'text-blue-600', status: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
                                            { name: 'Central Lab Results', icon: FileText, color: 'text-green-600', status: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
                                            { name: 'Imaging Data', icon: Activity, color: 'text-purple-600', status: 'Inactive', bg: 'bg-gray-100', text: 'text-gray-700' },
                                            { name: 'ECG Data', icon: Database, color: 'text-blue-600', status: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
                                            { name: 'CTMS Data', icon: Database, color: 'text-blue-600', status: 'Error', bg: 'bg-red-100', text: 'text-red-700' },
                                            { name: 'eCOA Data', icon: Database, color: 'text-blue-600', status: 'Configuring...', bg: 'bg-blue-100', text: 'text-blue-700' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-1">
                                                <div className="flex items-center gap-3">
                                                    <item.icon className={cn("h-4 w-4", item.color)} />
                                                    <span className="text-gray-700">{item.name}</span>
                                                </div>
                                                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", item.bg, item.text)}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                                        <RefreshCw className="h-4 w-4" />
                                        Run Manual Health Check
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSubTab === 'notifications' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* Notification Channels */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Mail className="h-5 w-5 text-gray-700" />
                                        <h3 className="text-lg font-semibold text-gray-900">Notification Channels</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 -mt-4">Configure how you want to receive integration notifications</p>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 text-gray-500" />
                                                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                            </div>
                                            <button
                                                onClick={() => setNotificationChannels({ ...notificationChannels, email: !notificationChannels.email })}
                                                className={cn(
                                                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                    notificationChannels.email ? "bg-blue-600" : "bg-gray-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                                                    notificationChannels.email ? "translate-x-6" : "translate-x-1"
                                                )} />
                                            </button>
                                        </div>

                                        <div className="pl-8">
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Notification Recipients</label>
                                            <input
                                                type="text"
                                                value={notificationChannels.recipients}
                                                onChange={(e) => setNotificationChannels({ ...notificationChannels, recipients: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter email addresses separated by commas"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Separate multiple email addresses with commas</p>
                                        </div>

                                        <hr className="border-gray-100" />

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MessageSquare className="h-5 w-5 text-gray-500" />
                                                <h4 className="font-medium text-gray-900">In-App Notifications</h4>
                                            </div>
                                            <button
                                                onClick={() => setNotificationChannels({ ...notificationChannels, inApp: !notificationChannels.inApp })}
                                                className={cn(
                                                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                                    notificationChannels.inApp ? "bg-blue-600" : "bg-gray-200"
                                                )}
                                            >
                                                <span className={cn(
                                                    "inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm",
                                                    notificationChannels.inApp ? "translate-x-6" : "translate-x-1"
                                                )} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                            Reset to Defaults
                                        </button>
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>

                                {/* Event-Specific Settings */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Event-Specific Settings</h3>
                                        <p className="text-sm text-gray-500 mt-1">Customize notifications for specific integration events</p>
                                    </div>

                                    <div className="space-y-6">
                                        {eventSettings.map((setting) => (
                                            <div key={setting.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                                <h4 className="font-medium text-gray-900">{setting.event}</h4>
                                                <div className="flex items-center gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                            setting.email ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                                                        )}
                                                            onClick={() => handleEventToggle(setting.id, 'email')}
                                                        >
                                                            {setting.email && <Check className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <span className="text-sm text-gray-700 select-none">Email</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                            setting.inApp ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                                                        )}
                                                            onClick={() => handleEventToggle(setting.id, 'inApp')}
                                                        >
                                                            {setting.inApp && <Check className="h-3 w-3 text-white" />}
                                                        </div>
                                                        <span className="text-sm text-gray-700 select-none">In-App</span>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'monitoring' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        {/* Header */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-900">Integration Monitor.AI</h2>
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                                        <Brain className="h-3 w-3" />
                                        AI-Powered
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">Real-time monitoring and intelligent analysis of data integration processes</p>
                            </div>
                            <button
                                onClick={handleMonitorRefresh}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
                            >
                                <RefreshCw className={cn("h-4 w-4", isMonitorRefreshing && "animate-spin text-blue-600")} />
                                {isMonitorRefreshing ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>

                        {/* Sub Navigation */}
                        <div className="flex p-1 bg-blue-50/50 rounded-lg border border-blue-100">
                            {['Dashboard', 'Logs', 'Anomalies', 'AI Analysis'].map((tab) => {
                                const tabId = tab.toLowerCase().replace(' ', '-') as any;
                                const icons = {
                                    'dashboard': Activity,
                                    'logs': FileText,
                                    'anomalies': AlertTriangle,
                                    'ai-analysis': BarChart3
                                };
                                const Icon = icons[tabId as keyof typeof icons] || Activity;

                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setMonitorActiveSubTab(tabId)}
                                        className={cn(
                                            "flex-1 py-2.5 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-all",
                                            monitorActiveSubTab === tabId
                                                ? "bg-white text-blue-700 shadow-sm ring-1 ring-gray-200"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        {monitorActiveSubTab === 'dashboard' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* KPI Cards */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-500">Integrations</div>
                                            <Settings2 className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">4</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-500">Records Processed</div>
                                            <Activity className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">2,134</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-500">Success Rate</div>
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">73.5%</div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-gray-500">Active Issues</div>
                                            <AlertTriangle className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900">2</div>
                                    </div>
                                </div>

                                {/* Integration Status List */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Status</h3>
                                    <div className="space-y-4">
                                        {monitoringStatusData.map((item) => (
                                            <div key={item.id} className={cn("bg-white rounded-lg shadow-sm overflow-hidden", item.borderColor)}>
                                                <div className="p-6 border-x border-b border-gray-200 rounded-b-lg">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                                                {item.tag}
                                                            </span>
                                                        </div>
                                                        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5", item.statusColor)}>
                                                            {item.status === 'Active' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                            {item.status === 'Warning' && <AlertTriangle className="h-3.5 w-3.5" />}
                                                            {item.status === 'Error' && <XCircle className="h-3.5 w-3.5" />}
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-4 gap-8">
                                                        <div>
                                                            <div className="text-xs text-gray-400 mb-1">Last Sync</div>
                                                            <div className="text-sm font-medium text-gray-900">{item.lastSync}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400 mb-1">Next Sync</div>
                                                            <div className="text-sm font-medium text-gray-900">{item.nextSync}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400 mb-1">Records Processed</div>
                                                            <div className="text-sm font-bold text-gray-900">{item.recordsProcessed}</div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between items-end mb-1">
                                                                <div className="text-xs text-gray-400">Success Rate</div>
                                                                <div className="text-sm font-bold text-gray-900">{item.successRate}%</div>
                                                            </div>
                                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                                <div
                                                                    className={cn("h-2 rounded-full transition-all duration-500", item.barColor)}
                                                                    style={{ width: `${item.successRate}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {monitorActiveSubTab === 'logs' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Activity Logs</h3>

                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="divide-y divide-gray-100">
                                            {monitoringLogs.map((log) => (
                                                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                                                    <div className="flex items-start gap-4">
                                                        <div className="mt-1">
                                                            {log.type === 'info' && <AlertCircle className="h-5 w-5 text-gray-400" />}
                                                            {log.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                                            {log.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                                            {log.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-gray-900 text-base">{log.source}</span>
                                                                    <span className={cn(
                                                                        "px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                                        log.badge === 'info' && "bg-blue-50 text-blue-700",
                                                                        log.badge === 'success' && "bg-green-50 text-green-700",
                                                                        log.badge === 'warning' && "bg-amber-50 text-amber-700",
                                                                        log.badge === 'error' && "bg-red-50 text-red-700"
                                                                    )}>
                                                                        {log.badge}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm text-gray-500">{log.time}</span>
                                                            </div>
                                                            <p className="text-gray-900 font-medium mb-1">{log.event}</p>
                                                            <p className="text-sm text-gray-500">{log.details}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-end">
                                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                                            <Download className="h-4 w-4" />
                                            Export Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {monitorActiveSubTab === 'anomalies' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">Detected Anomalies</h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                        {monitoringAnomalies.length} detected
                                    </span>
                                </div>

                                {monitoringAnomalies.length > 0 ? (
                                    <div className="space-y-4">
                                        {monitoringAnomalies.map((anomaly) => (
                                            <div key={anomaly.id} className={cn("bg-white rounded-xl shadow-sm border-x border-b border-gray-200 p-6 border-t-[4px]", anomaly.borderColor)}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-bold text-gray-900">{anomaly.title}</h4>
                                                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", anomaly.severityColor)}>
                                                            {anomaly.severity}
                                                        </span>
                                                        {anomaly.badge && (
                                                            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", anomaly.badgeColor)}>
                                                                {anomaly.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-medium">{anomaly.date}</span>
                                                </div>

                                                <p className="text-gray-700 mb-4">{anomaly.description}</p>

                                                <div className="flex gap-3">
                                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                                                        Investigate
                                                    </button>
                                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                                                        Mark as Resolved
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-3" />
                                        <h3 className="text-gray-900 font-medium">No anomalies detected</h3>
                                        <p className="text-gray-500 text-sm">Your data integrations are running normally.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {monitorActiveSubTab === 'ai-analysis' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* AI Analysis Banner */}
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Cpu className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">AI-Generated Analysis</h3>
                                        <p className="text-sm text-blue-700 leading-relaxed">
                                            The following analysis is generated by the Integration Monitor.AI agent based on real-time integration data, historical patterns, and detected anomalies.
                                        </p>
                                    </div>
                                </div>

                                {/* Health Summary Card */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6">Integration Health Summary</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-bold text-gray-900">**Overall System Status**:</span> Moderate Risk (3 active issues)
                                            </p>
                                        </div>

                                        <div>
                                            <p className="font-bold text-gray-900 mb-2">**Key Findings**:</p>
                                            <ul className="list-none space-y-1.5 text-gray-700 pl-1">
                                                <li>- Calyx integration has been down for over 24 hours - requires immediate attention</li>
                                                <li>- Labcorp connection showing intermittent issues with data format consistency</li>
                                                <li>- Medidata Rave performing well with 99.7% success rate</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <p className="font-bold text-gray-900 mb-2">**Recommended Actions**:</p>
                                            <ol className="list-decimal list-inside space-y-1.5 text-gray-700">
                                                <li>Verify Calyx API credentials and renew if expired</li>
                                                <li>Investigate Labcorp data format inconsistencies in LB domain</li>
                                                <li>Schedule maintenance window for system-wide optimization</li>
                                            </ol>
                                        </div>

                                        <div>
                                            <p className="font-bold text-gray-900 mb-2">**Data Quality Impact Assessment**:</p>
                                            <p className="text-gray-700 mb-1.5">The current integration issues may affect approximately 2.4% of incoming trial data.</p>
                                            <p className="text-gray-700">The priority should be restoring the Calyx connection as it impacts all imaging data processing.</p>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                            <Download className="h-4 w-4" />
                                            Export Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}




                {/* Add New Integration Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Add New Data Integration</h2>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="px-6 pt-2 pb-6">
                                <p className="text-gray-500 mb-6">Connect to external data sources to import clinical trial data.</p>

                                <div className="space-y-5">
                                    {/* Integration Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-900">Integration Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Primary EDC Data Feed"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                            value={createForm.name}
                                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                        />
                                    </div>

                                    {/* Integration Type */}
                                    <div className="space-y-1.5 relative">
                                        <label className="text-sm font-semibold text-gray-900">Integration Type</label>
                                        <button
                                            type="button"
                                            onClick={() => { setShowCreateTypeFilter(!showCreateTypeFilter); setShowCreateVendorFilter(false); setShowCreateFreqFilter(false); }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-left text-gray-700 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {createForm.type || 'Select type'}
                                            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showCreateTypeFilter ? "rotate-180" : "")} />
                                        </button>
                                        {showCreateTypeFilter && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                                                {['API', 'SFTP', 'S3 Bucket'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setCreateForm({ ...createForm, type });
                                                            setShowCreateTypeFilter(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                    >
                                                        {type}
                                                        {createForm.type === type && <Check className="h-4 w-4 text-blue-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Vendor */}
                                    <div className="space-y-1.5 relative">
                                        <label className="text-sm font-semibold text-gray-900">Vendor</label>
                                        <button
                                            type="button"
                                            onClick={() => { setShowCreateVendorFilter(!showCreateVendorFilter); setShowCreateTypeFilter(false); setShowCreateFreqFilter(false); }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-left text-gray-700 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {createForm.vendor || 'Select vendor'}
                                            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showCreateVendorFilter ? "rotate-180" : "")} />
                                        </button>
                                        {showCreateVendorFilter && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto">
                                                {['Medidata Rave', 'IQVIA', 'Veeva', 'Labcorp', 'Quest Diagnostics', 'Calyx', 'AliveCor', 'ClinicalInk'].map((vendor) => (
                                                    <button
                                                        key={vendor}
                                                        type="button"
                                                        onClick={() => {
                                                            setCreateForm({ ...createForm, vendor });
                                                            setShowCreateVendorFilter(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                    >
                                                        {vendor}
                                                        {createForm.vendor === vendor && <Check className="h-4 w-4 text-blue-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Update Frequency */}
                                    <div className="space-y-1.5 relative">
                                        <label className="text-sm font-semibold text-gray-900">Update Frequency</label>
                                        <button
                                            type="button"
                                            onClick={() => { setShowCreateFreqFilter(!showCreateFreqFilter); setShowCreateTypeFilter(false); setShowCreateVendorFilter(false); }}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-left text-gray-700 flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {createForm.frequency || 'Select frequency'}
                                            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", showCreateFreqFilter ? "rotate-180" : "")} />
                                        </button>
                                        {showCreateFreqFilter && (
                                            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                                                {['Every hour', 'Daily at 2:00 AM', 'Weekly on Monday', 'Custom schedule'].map((freq) => (
                                                    <button
                                                        key={freq}
                                                        type="button"
                                                        onClick={() => {
                                                            setCreateForm({ ...createForm, frequency: freq });
                                                            setShowCreateFreqFilter(false);
                                                        }}
                                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group"
                                                    >
                                                        {freq}
                                                        {createForm.frequency === freq && <Check className="h-4 w-4 text-blue-600" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Launch Immediately Checkbox */}
                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => setCreateForm({ ...createForm, launchImmediately: !createForm.launchImmediately })}
                                                className={cn(
                                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                    createForm.launchImmediately ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300 group-hover:border-blue-400"
                                                )}
                                            >
                                                {createForm.launchImmediately && <Check className="h-3.5 w-3.5 text-white" />}
                                            </div>
                                            <span className="text-gray-900 font-medium select-none">Launch integration immediately after setup</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        showToast("Integration Added", `${createForm.name} has been successfully configured.`);
                                    }}
                                    className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                                >
                                    Add Integration
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
