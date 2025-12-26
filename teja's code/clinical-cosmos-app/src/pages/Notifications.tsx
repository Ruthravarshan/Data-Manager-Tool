import {
    Bell, Check, Info, CircleAlert, TriangleAlert, CalendarClock,
    MessageSquare, Database, FileText, Activity, Beaker, Settings, Search,
    ArrowDown, Filter
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function Notifications() {
    const [filter, setFilter] = useState('all');

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Notifications</h1>
                        <p className="text-neutral-500 mt-1">View and manage system notifications and alerts</p>
                        <div className="mt-1">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs font-normal">
                                Viewing all notifications (System Administrator)
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3" disabled>
                            <Check className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                            <Bell className="mr-2 h-4 w-4" />
                            Notification Settings
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Bell className="mr-2 h-5 w-5 text-blue-600" />
                                    Notification Filters
                                </h3>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium mb-3">Status</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setFilter('all')}
                                                    className={clsx("text-sm flex items-center font-medium", filter === 'all' ? "text-blue-600" : "text-gray-600")}
                                                >
                                                    <Bell className="h-4 w-4 mr-2" />
                                                    All Notifications
                                                </button>
                                            </div>
                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                                0
                                            </div>
                                        </div>
                                        {[{ label: 'Unread & Recent', value: 'unread' }, { label: 'Action Required', value: 'action' }].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => setFilter(item.value)}
                                                        className={clsx("text-sm flex items-center font-medium", filter === item.value ? "text-blue-600" : "text-gray-600")}
                                                    >
                                                        {i === 0 ? <Info className="h-4 w-4 mr-2" /> : <CircleAlert className="h-4 w-4 mr-2" />}
                                                        {item.label}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="shrink-0 bg-border h-[1px] w-full" />
                                <div>
                                    <h3 className="text-sm font-medium mb-3">By Category</h3>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Signals', icon: TriangleAlert, color: 'text-red-500' },
                                            { label: 'Tasks', icon: CalendarClock, color: 'text-blue-500' },
                                            { label: 'Queries', icon: MessageSquare, color: 'text-orange-500' },
                                            { label: 'Data', icon: Database, color: 'text-green-500' },
                                            { label: 'Protocol', icon: FileText, color: 'text-purple-500' },
                                            { label: 'Monitoring', icon: Activity, color: 'text-cyan-500' },
                                            { label: 'Safety', icon: Beaker, color: 'text-pink-500' },
                                            { label: 'System', icon: Settings, color: 'text-gray-500' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center">
                                                <button
                                                    onClick={() => setFilter(item.label.toLowerCase())}
                                                    className={clsx("text-sm flex items-center font-medium", filter === item.label.toLowerCase() ? "text-blue-600" : "text-gray-600")}
                                                >
                                                    <item.icon className={`h-4 w-4 mr-2 ${item.color}`} />
                                                    {item.label}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                        <Bell className="mr-2 h-5 w-5 text-blue-600" />
                                        All Notifications
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="relative w-64">
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8 pl-8"
                                                placeholder="Search notifications..."
                                            />
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                            <ArrowDown className="h-4 w-4" />
                                        </button>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                            <Filter className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 space-y-3">
                                {[
                                    { id: 1, type: 'signal', title: 'New Safety Signal Detected', message: 'Potential safety signal identified in ABC-123 study for adverse event "Headache"', time: '5 minutes ago', unread: true, priority: 'high', icon: TriangleAlert, color: 'text-red-500' },
                                    { id: 2, type: 'task', title: 'Task Assigned: Data Review', message: 'You have been assigned to review data quality checks for Site 105', time: '1 hour ago', unread: true, priority: 'medium', icon: CalendarClock, color: 'text-blue-500' },
                                    { id: 3, type: 'query', title: 'Query Response Required', message: 'Query Q-2024-0156 requires your response by end of day', time: '2 hours ago', unread: true, priority: 'high', icon: MessageSquare, color: 'text-orange-500' },
                                    { id: 4, type: 'data', title: 'Data Integration Complete', message: 'EDC data feed completed successfully with 1,247 records processed', time: '3 hours ago', unread: false, priority: 'low', icon: Database, color: 'text-green-500' },
                                    { id: 5, type: 'protocol', title: 'Protocol Amendment Approved', message: 'Protocol amendment v2.1 has been approved and is now active', time: '5 hours ago', unread: false, priority: 'medium', icon: FileText, color: 'text-purple-500' },
                                    { id: 6, type: 'monitoring', title: 'Site Visit Scheduled', message: 'Monitoring visit scheduled for Site 203 on April 15, 2025', time: '1 day ago', unread: false, priority: 'low', icon: Activity, color: 'text-cyan-500' },
                                ].filter(notif => {
                                    if (filter === 'all') return true;
                                    if (filter === 'unread') return notif.unread;
                                    if (filter === 'action') return notif.priority === 'high';
                                    return notif.type === filter;
                                }).map((notif) => (
                                    <div key={notif.id} className={`p-4 border rounded-lg hover:bg-blue-50/50 transition-colors ${notif.unread ? 'bg-blue-50/30 border-blue-200' : 'bg-white'}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-full ${notif.unread ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                <notif.icon className={`h-4 w-4 ${notif.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium text-gray-900">{notif.title}</h4>
                                                            {notif.unread && (
                                                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-xs text-gray-500">{notif.time}</span>
                                                            {notif.priority === 'high' && (
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">High Priority</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <Settings className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
