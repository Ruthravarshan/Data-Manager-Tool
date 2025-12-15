import { useState } from 'react';
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

const integrations = [
    {
        id: 1,
        name: "EDC Data Feed",
        vendor: "Medidata Rave",
        type: "API",
        frequency: "Daily at 2:00 AM",
        lastSync: "2023-04-04 02:00:15",
        status: "Active",
        statusColor: "bg-green-50 text-green-700 border-green-200",
        typeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
        id: 2,
        name: "Central Lab Results",
        vendor: "Labcorp",
        type: "SFTP",
        frequency: "Every 12 hours",
        lastSync: "2023-04-04 14:00:03",
        status: "Active",
        statusColor: "bg-green-50 text-green-700 border-green-200",
        typeColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
        id: 3,
        name: "Imaging Data",
        vendor: "Calyx",
        type: "S3",
        frequency: "Weekly on Monday",
        lastSync: "2023-04-01 08:30:22",
        status: "Inactive",
        statusColor: "bg-gray-50 text-gray-700 border-gray-200",
        typeColor: "bg-green-50 text-green-700 border-green-200"
    },
    {
        id: 4,
        name: "CTMS Data",
        vendor: "Veeva Vault CTMS",
        type: "API",
        frequency: "Daily at 6:00 AM",
        lastSync: "2023-04-04 06:00:05",
        status: "Error",
        statusColor: "bg-red-50 text-red-700 border-red-200",
        typeColor: "bg-purple-50 text-purple-700 border-purple-200",
        error: "API authentication failed. Check credentials."
    }
];

export default function DataIntegration() {
    const [activeTab, setActiveTab] = useState('data-sources');
    const [activeSubTab, setActiveSubTab] = useState('integration-sources');

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
                                    {/* Alert */}
                                    <div className="relative w-full rounded-lg border p-4 bg-red-50 border-red-200 text-red-800 flex items-start gap-4">
                                        <TriangleAlert className="h-4 w-4 mt-1" />
                                        <div className="text-sm">
                                            One or more integrations have errors. Please check the integration details.
                                        </div>
                                    </div>

                                    {/* Filters and Actions */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            <button className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-[160px] text-gray-500">
                                                <span>All Types</span>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </button>
                                            <button className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-[160px] text-gray-500">
                                                <span>All Statuses</span>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </button>
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
                                                            <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", item.typeColor)}>
                                                                {item.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">{item.frequency}</td>
                                                        <td className="p-4 font-mono text-xs">{item.lastSync}</td>
                                                        <td className="p-4">
                                                            <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", item.statusColor)}>
                                                                {item.status}
                                                            </span>
                                                            {item.error && (
                                                                <p className="text-xs text-red-600 mt-1">{item.error}</p>
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <div className="flex justify-end items-center space-x-2">
                                                                <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-500" title="Start manual data load">
                                                                    <RefreshCw className="h-4 w-4" />
                                                                </button>
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
                                    </div>
                                </div>
                            )}
                        </div>
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
                                    <div className="text-2xl font-bold text-blue-700 mt-1">3</div>
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
                                                <span className="text-xs text-gray-500">Last run: {item.lastSync}</span>
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
                                                <span className="text-xs text-gray-500">Last sync: {item.lastSync}</span>
                                                <span className={cn("text-xs px-2 py-1 rounded-full", item.statusColor)}>
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
        </div>
    );
}
