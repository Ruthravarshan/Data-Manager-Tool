
import {
    Database, CalendarClock, Activity, PlusCircle,
    ServerCog, History, SlidersVertical, Mail,
    TriangleAlert, ChevronDown, Download, RefreshCw,
    PauseCircle, PlayCircle, MoreHorizontal, CheckCircle2,
    Search, Filter, Settings, Trash2, Edit
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useEffect, useState } from 'react';
import { integrationService } from '../services/api';

export default function DataIntegration() {
    const [activeTab, setActiveTab] = useState('data-sources');
    const [activeSubTab, setActiveSubTab] = useState('integration-sources');
    const [integrations, setIntegrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanningId, setScanningId] = useState<number | null>(null);
    const [scanResults, setScanResults] = useState<any>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

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

    const handleScan = async (id: number) => {
        try {
            setScanningId(id);
            setToast(null);
            const results = await integrationService.scanFolder(id);
            setScanResults(results);
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
                                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3 gap-1">
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
                                                                    {item.last_sync ? new Date(item.last_sync).toLocaleString() : 'Never'}
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
            </div>
        </div>
    );
}
