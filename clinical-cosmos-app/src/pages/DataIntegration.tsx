
import {
    Database, CalendarClock, Activity, PlusCircle,
    ServerCog, History, SlidersVertical, Mail,
    TriangleAlert, RefreshCw,
    PauseCircle, PlayCircle, CheckCircle2,
    Settings, Trash2, Edit, X
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useEffect, useState } from 'react';
import { integrationService, scheduleService } from '../services/api';

const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Never';
    // Append Z if missing to force UTC interpretation, as backend sends naive UTC
    const date = dateStr.endsWith('Z') ? new Date(dateStr) : new Date(dateStr + 'Z');
    return date.toLocaleString();
};
// Helper to convert Local "HH:MM" to UTC "HH:MM" for backend storage
const localTimeToUtcTime = (timeStr: string) => {
    if (!timeStr) return '00:00';
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date.toISOString().substr(11, 5);
};

// Helper to convert UTC "HH:MM" (from backend) back to Local "HH:MM" for form
const utcTimeToLocalTime = (timeStr: string) => {
    if (!timeStr) return '00:00';
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(h, m, 0, 0);
    // Returns HH:MM in local
    const localH = date.getHours().toString().padStart(2, '0');
    const localM = date.getMinutes().toString().padStart(2, '0');
    return `${localH}:${localM}`;
};

export default function DataIntegration() {
    const [activeTab, setActiveTab] = useState('data-sources');
    const [activeSubTab, setActiveSubTab] = useState('integration-sources');
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanningId, setScanningId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newIntegration, setNewIntegration] = useState({
        name: '',
        vendor: '',
        type: 'EDC',
        protocol_id: '',
        folder_path: '',
        frequency: 'Manual',
        status: 'Active'
    });
    const [schedules, setSchedules] = useState<any[]>([]);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        integration_id: '',
        schedule_type: 'Daily',
        schedule_config: '{}'
    });
    // Schedule config state
    const [scheduleTime, setScheduleTime] = useState('00:00');
    const [scheduleDays, setScheduleDays] = useState<string[]>([]);
    const [scheduleDayOfMonth, setScheduleDayOfMonth] = useState<number>(1);
    const [scheduleRepeat, setScheduleRepeat] = useState<number>(1);
    const [scheduleUnit, setScheduleUnit] = useState('hours');
    const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);

    const fetchIntegrations = async () => {
        try {
            const data = await integrationService.getIntegrations();
            setIntegrations(data);
        } catch (error) {
            console.error("Failed to fetch integrations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchSchedules = async () => {
        try {
            const data = await scheduleService.getSchedules();
            setSchedules(data);
        } catch (error) {
            console.error("Failed to fetch schedules", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'scheduler') {
            fetchSchedules();
            fetchIntegrations(); // Ensure we have integrations for dropdown
        }
    }, [activeTab]);

    const handleScan = async (id: number) => {
        try {
            setScanningId(id);
            setToast(null);
            await integrationService.scanFolder(id);
            setToast({
                message: `Scan complete`,
                type: 'success'
            });
            fetchIntegrations(); // Refresh last sync time
        } catch (error: any) {
            console.error("Scan failed", error);
            setToast({
                message: error.response?.data?.detail || "Scan failed. Check folder path.",
                type: 'error'
            });
        } finally {
            setScanningId(null);
        }
    };

    const handleAddIntegration = async () => {
        try {
            if (!newIntegration.name || !newIntegration.folder_path) {
                setToast({ message: "Name and Folder Path are required", type: 'error' });
                return;
            }

            await integrationService.createIntegration(newIntegration);
            setIsAddModalOpen(false);
            setToast({ message: "Integration created successfully", type: 'success' });
            fetchIntegrations();
            // Reset form
            setNewIntegration({
                name: '',
                vendor: '',
                type: 'EDC',
                protocol_id: '',
                folder_path: '',
                frequency: 'Manual',
                status: 'Active'
            });
        } catch (error: any) {
            console.error("Create failed", error);
            setToast({ message: error.response?.data?.detail || "Failed to create integration", type: 'error' });
        }
    };

    const handleSaveSchedule = async () => {
        try {
            if (!newSchedule.integration_id) {
                setToast({ message: "Data Source is required", type: 'error' });
                return;
            }

            // Build config based on type
            let config = {};
            if (newSchedule.schedule_type === 'Daily') {
                config = { time: localTimeToUtcTime(scheduleTime) };
            } else if (newSchedule.schedule_type === 'Weekly') {
                config = { days: scheduleDays, time: localTimeToUtcTime(scheduleTime) };
            } else if (newSchedule.schedule_type === 'Monthly') {
                config = { day: scheduleDayOfMonth, time: localTimeToUtcTime(scheduleTime) };
            } else if (newSchedule.schedule_type === 'Custom') {
                config = { repeat_every: scheduleRepeat, unit: scheduleUnit };
            }

            const payload = {
                ...newSchedule,
                integration_id: parseInt(newSchedule.integration_id),
                schedule_config: JSON.stringify(config)
            };

            if (editingScheduleId) {
                await scheduleService.updateSchedule(editingScheduleId, payload);
                setToast({ message: "Schedule updated successfully", type: 'success' });
            } else {
                await scheduleService.createSchedule(payload);
                setToast({ message: "Schedule created successfully", type: 'success' });
            }

            setIsScheduleModalOpen(false);
            fetchSchedules();
            // Reset
            resetScheduleForm();
        } catch (error: any) {
            setToast({ message: error.response?.data?.detail || "Failed to save schedule", type: 'error' });
        }
    };

    const resetScheduleForm = () => {
        setNewSchedule({ integration_id: '', schedule_type: 'Daily', schedule_config: '{}' });
        setScheduleTime('00:00');
        setScheduleDays([]);
        setScheduleDayOfMonth(1);
        setScheduleRepeat(1);
        setScheduleUnit('hours');
        setEditingScheduleId(null);
    };

    const handleEditSchedule = (schedule: any) => {
        setEditingScheduleId(schedule.id);
        const config = JSON.parse(schedule.schedule_config || '{}');

        setNewSchedule({
            integration_id: String(schedule.integration_id),
            schedule_type: schedule.schedule_type,
            schedule_config: schedule.schedule_config
        });

        // Populate config states
        if (schedule.schedule_type === 'Daily') {
            setScheduleTime(utcTimeToLocalTime(config.time) || '00:00');
        } else if (schedule.schedule_type === 'Weekly') {
            setScheduleDays(config.days || []);
            setScheduleTime(utcTimeToLocalTime(config.time) || '00:00');
        } else if (schedule.schedule_type === 'Monthly') {
            setScheduleDayOfMonth(config.day || 1);
            setScheduleTime(utcTimeToLocalTime(config.time) || '00:00');
        } else if (schedule.schedule_type === 'Custom') {
            setScheduleRepeat(config.repeat_every || 1);
            setScheduleUnit(config.unit || 'hours');
        }

        setIsScheduleModalOpen(true);
    };

    const handleScheduleAction = async (action: 'pause' | 'refresh' | 'delete', id: number) => {
        try {
            if (action === 'pause') await scheduleService.togglePause(id);
            if (action === 'refresh') await scheduleService.refreshSchedule(id);
            if (action === 'delete') await scheduleService.deleteSchedule(id);

            fetchSchedules();
            const actionPast = action === 'refresh' ? 'refreshed' : action + 'd';
            setToast({ message: `Schedule ${actionPast} successfully`, type: 'success' });
        } catch (error) {
            setToast({ message: `Failed to ${action} schedule`, type: 'error' });
        }
    };

    const hasErrors = integrations.some(i => i.status === 'Error' || i.status === 'Failed');

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return "bg-green-50 text-green-700 border-green-200";
            case 'error':
            case 'failed': return "bg-red-50 text-red-700 border-red-200";
            case 'inactive': return "bg-gray-50 text-gray-700 border-gray-200";
            default: return "bg-blue-50 text-blue-700 border-blue-200";
        }
    };

    return (
        <div className="p-6">
            {toast && (
                <div className={cn(
                    "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border animate-in fade-in slide-in-from-top-4",
                    toast.type === 'success' ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                )}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <TriangleAlert className="h-5 w-5" />}
                        <span className="font-medium">{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-4 text-xs underline">Dismiss</button>
                    </div>
                </div>
            )}

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
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3 gap-1">
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
                                        {/* Dynamic Alert */}
                                        {hasErrors && (
                                            <div className="relative w-full rounded-lg border p-4 bg-red-50 border-red-200 text-red-800 flex items-start gap-4">
                                                <TriangleAlert className="h-4 w-4 mt-1" />
                                                <div className="text-sm">
                                                    One or more integrations have errors. Please check the integration details below.
                                                </div>
                                            </div>
                                        )}

                                        {/* Table */}
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-blue-50 text-blue-900 font-semibold border-b border-blue-100">
                                                    <tr>
                                                        <th className="h-12 px-4 align-middle">Name</th>
                                                        <th className="h-12 px-4 align-middle">Vendor</th>
                                                        <th className="h-12 px-4 align-middle">Type</th>
                                                        <th className="h-12 px-4 align-middle text-center">Protocol ID</th>
                                                        <th className="h-12 px-4 align-middle">Last Sync</th>
                                                        <th className="h-12 px-4 align-middle">Status</th>
                                                        <th className="h-12 px-4 align-middle text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {integrations.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={7} className="p-8 text-center text-gray-500 italic">No integrations configured. Create one to start importing data.</td>
                                                        </tr>
                                                    ) : (
                                                        integrations.map((item) => (
                                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                                <td className="p-4 font-medium text-blue-800">
                                                                    <div>{item.name}</div>
                                                                </td>
                                                                <td className="p-4 font-medium">{item.vendor}</td>
                                                                <td className="p-4">
                                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200">
                                                                        {item.type}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-center font-mono text-xs">{item.protocol_id || 'All Protocols'}</td>
                                                                <td className="p-4 font-mono text-xs">
                                                                    {formatDateTime(item.last_sync)}
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", getStatusColor(item.status))}>
                                                                        {item.status}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <div className="flex justify-end items-center space-x-2">
                                                                        <button
                                                                            onClick={() => handleScan(item.id)}
                                                                            disabled={scanningId === item.id}
                                                                            className={cn(
                                                                                "p-2 border border-blue-200 rounded-md transition-colors",
                                                                                scanningId === item.id
                                                                                    ? "bg-blue-100 text-blue-400"
                                                                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                                            )}
                                                                            title="Scan Folder"
                                                                        >
                                                                            <RefreshCw className={cn("h-4 w-4", scanningId === item.id && "animate-spin")} />
                                                                        </button>
                                                                        <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500" title="Edit">
                                                                            <Settings className="h-4 w-4" />
                                                                        </button>
                                                                        <button className="p-2 border border-red-100 rounded-md hover:bg-red-50 text-red-500" title="Delete">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'scheduler' && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="p-6 flex flex-col space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h3 className="text-2xl font-semibold leading-none tracking-tight">Integration Scheduler</h3>
                                        <p className="text-sm text-gray-500 mt-1">Automate data synchronization tasks</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { resetScheduleForm(); setIsScheduleModalOpen(true); }}
                                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3 gap-1">
                                    <PlusCircle className="h-4 w-4" />
                                    <span>Add Schedule</span>
                                </button>
                            </div>

                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-blue-50 text-blue-900 font-semibold border-b border-blue-100">
                                        <tr>
                                            <th className="h-12 px-4 align-middle">Data Source</th>
                                            <th className="h-12 px-4 align-middle">Schedule</th>
                                            <th className="h-12 px-4 align-middle">Last Run</th>
                                            <th className="h-12 px-4 align-middle">Next Run</th>
                                            <th className="h-12 px-4 align-middle">Status</th>
                                            <th className="h-12 px-4 align-middle text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-500 italic">No schedules configured.</td>
                                            </tr>
                                        ) : (
                                            schedules.map((item) => {
                                                const integration = integrations.find(i => i.id === item.integration_id);
                                                return (
                                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                        <td className="p-4 font-medium text-blue-800">
                                                            {integration ? integration.name : `ID: ${item.integration_id}`}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{item.schedule_type}</span>
                                                                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                                                    {(() => {
                                                                        try {
                                                                            const config = JSON.parse(item.schedule_config || '{}');
                                                                            if (item.schedule_type === 'Daily') return `At ${utcTimeToLocalTime(config.time)}`;
                                                                            if (item.schedule_type === 'Weekly') return `${config.days?.join(', ')} at ${utcTimeToLocalTime(config.time)}`;
                                                                            if (item.schedule_type === 'Monthly') return `Day ${config.day} at ${utcTimeToLocalTime(config.time)}`;
                                                                            if (item.schedule_type === 'Custom') return `Every ${config.repeat_every} ${config.unit}`;
                                                                            return item.schedule_config;
                                                                        } catch (e) {
                                                                            return item.schedule_config;
                                                                        }
                                                                    })()}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 font-mono text-xs">
                                                            {formatDateTime(item.last_run)}
                                                        </td>
                                                        <td className="p-4 font-mono text-xs">
                                                            {item.next_run ? formatDateTime(item.next_run) : '-'}
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                                                item.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" :
                                                                    item.status === 'Paused' ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                                        "bg-red-50 text-red-700 border-red-200")}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end items-center space-x-2">
                                                                <button onClick={() => handleScheduleAction('refresh', item.id)} className="p-2 border border-blue-200 rounded-md hover:bg-blue-50 text-blue-600" title="Refresh">
                                                                    <RefreshCw className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => handleScheduleAction('pause', item.id)} className="p-2 border border-orange-200 rounded-md hover:bg-orange-50 text-orange-600" title={item.status === 'Paused' ? "Resume" : "Pause"}>
                                                                    {item.status === 'Paused' ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                                                                </button>
                                                                <button onClick={() => handleEditSchedule(item)} className="p-2 border border-blue-200 rounded-md hover:bg-blue-50 text-blue-600" title="Edit">
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button onClick={() => handleScheduleAction('delete', item.id)} className="p-2 border border-red-100 rounded-md hover:bg-red-50 text-red-500" title="Delete">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Add Integration Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">Add Data Integration</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={newIntegration.name}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, name: e.target.value })}
                                        placeholder="e.g. DM Data Feed"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Vendor</label>
                                    <input
                                        type="text"
                                        value={newIntegration.vendor}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, vendor: e.target.value })}
                                        placeholder="e.g. Medidata"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Type</label>
                                        <select
                                            value={newIntegration.type}
                                            onChange={(e) => setNewIntegration({ ...newIntegration, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            <option>EDC</option>
                                            <option>eTMF</option>
                                            <option>CTMS</option>
                                            <option>Lab</option>
                                            <option>Imaging</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Protocol ID</label>
                                        <input
                                            type="text"
                                            value={newIntegration.protocol_id}
                                            onChange={(e) => setNewIntegration({ ...newIntegration, protocol_id: e.target.value })}
                                            placeholder="e.g. PRO-001"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Folder Path <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={newIntegration.folder_path}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, folder_path: e.target.value })}
                                        placeholder="Absolute path e.g. C:/Data/Study001"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                                    />
                                    <p className="text-xs text-gray-500">Provide the absolute path to the local directory containing data files.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Sync Frequency</label>
                                    <select
                                        value={newIntegration.frequency}
                                        onChange={(e) => setNewIntegration({ ...newIntegration, frequency: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option>Manual</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Real-time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 pt-0 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddIntegration}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                    Create Integration
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Schedule Modal */}
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">{editingScheduleId ? 'Edit' : 'Create'} Integration Schedule</h3>
                                <button
                                    onClick={() => { setIsScheduleModalOpen(false); resetScheduleForm(); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Data Source</label>
                                    <select
                                        value={newSchedule.integration_id}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, integration_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="">Select Data Source...</option>
                                        {integrations.map(i => (
                                            <option key={i.id} value={i.id}>{i.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Schedule Type</label>
                                    <select
                                        value={newSchedule.schedule_type}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, schedule_type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    >
                                        <option>Hourly</option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Custom</option>
                                    </select>
                                </div>

                                {/* Dynamic Fields */}
                                {(newSchedule.schedule_type === 'Daily' || newSchedule.schedule_type === 'Weekly' || newSchedule.schedule_type === 'Monthly') && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Time</label>
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                )}

                                {newSchedule.schedule_type === 'Weekly' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Days of Week</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => setScheduleDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                                                    className={cn("px-2 py-1 text-xs border rounded-sm", scheduleDays.includes(day) ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-200")}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {newSchedule.schedule_type === 'Monthly' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Day of Month</label>
                                        <input
                                            type="number"
                                            min="1" max="31"
                                            value={scheduleDayOfMonth}
                                            onChange={(e) => setScheduleDayOfMonth(parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                )}

                                {newSchedule.schedule_type === 'Custom' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Repeat Every</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={scheduleRepeat}
                                                onChange={(e) => setScheduleRepeat(parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Unit</label>
                                            <select
                                                value={scheduleUnit}
                                                onChange={(e) => setScheduleUnit(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="minutes">Minutes</option>
                                                <option value="hours">Hours</option>
                                                <option value="days">Days</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                            </div>
                            <div className="p-6 pt-0 flex justify-end gap-3">
                                <button
                                    onClick={() => { setIsScheduleModalOpen(false); resetScheduleForm(); }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSchedule}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                    {editingScheduleId ? 'Update' : 'Create'} Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
