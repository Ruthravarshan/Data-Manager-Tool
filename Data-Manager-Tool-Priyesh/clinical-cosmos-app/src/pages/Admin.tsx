import {
    Search, UserPlus, KeyRound, Settings, Users, Lock, ChartNoAxesGantt, Network, FileText, ChevronDown
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('users');

    const users = [
        { username: 'nivaasgd', name: 'Nivaas Damotharan', email: 'nivaasg@hexaware.com', role: 'Medical Monitor', status: 'Active', login: '22/04/2025, 16:00:00', studies: 'ABC-123 +1' },
        { username: 'madhu', name: 'Madhu', email: 'orugantir@hexaware.com', role: 'System Administrator', status: 'Active', login: '22/04/2025, 15:30:00', studies: 'All Studies' },
        { username: 'johndoe', name: 'John Doe', email: 'john.doe@example.com', role: 'System Administrator', status: 'Active', login: '08/04/2025, 15:00:00', studies: 'All Studies' },
        { username: 'janedoe', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Clinical Operations Manager', status: 'Active', login: '07/04/2025, 20:15:00', studies: 'ABC-123 +2' },
        { username: 'mikesmith', name: 'Mike Smith', email: 'mike.smith@example.com', role: 'Data Manager', status: 'Active', login: '08/04/2025, 13:45:00', studies: 'ABC-123 +1' },
        { username: 'sarahjones', name: 'Sarah Jones', email: 'sarah.jones@example.com', role: 'Clinical Research Associate', status: 'Active', login: '07/04/2025, 21:50:00', studies: 'ABC-123' },
        { username: 'robertchen', name: 'Robert Chen', email: 'robert.chen@example.com', role: 'Medical Monitor', status: 'Active', login: '06/04/2025, 16:40:00', studies: 'ABC-123 +1' },
        { username: 'emilyparker', name: 'Emily Parker', email: 'emily.parker@example.com', role: 'Biostatistician', status: 'Inactive', login: '15/03/2025, 16:15:00', studies: 'XYZ-789' },
        { username: 'davidwilson', name: 'David Wilson', email: 'david.wilson@example.com', role: 'Safety Specialist', status: 'Active', login: '08/04/2025, 13:00:00', studies: 'ABC-123 +2' },
    ];

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Administration</h1>
                        <p className="text-neutral-500 mt-1">Manage system settings, user accounts, and security policies</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="relative w-64">
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-8"
                                placeholder="Search..."
                            />
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <KeyRound className="mr-2 h-4 w-4" />
                            Change Password
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                            <Settings className="mr-2 h-4 w-4" />
                            System Settings
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600 grid grid-cols-5 w-full md:w-[750px]">
                        {[
                            { id: 'users', label: 'Users', icon: Users },
                            { id: 'roles', label: 'Roles & Permissions', icon: Lock },
                            { id: 'menu', label: 'Menu Configuration', icon: ChartNoAxesGantt },
                            { id: 'technical', label: 'Technical Details', icon: Network },
                            { id: 'audit', label: 'Audit Logs', icon: FileText }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex items-center",
                                    activeTab === tab.id ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-100 hover:text-blue-800"
                                )}
                            >
                                <tab.icon className="mr-2 h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'users' && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-blue-600" />
                                    User Management
                                </h3>
                                <p className="text-sm text-muted-foreground">Create, edit, and manage user accounts and study access</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Full Name</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Login</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Study Access</th>
                                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {users.map((user, i) => (
                                                <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium">{user.username}</td>
                                                    <td className="p-4 align-middle">{user.name}</td>
                                                    <td className="p-4 align-middle">{user.email}</td>
                                                    <td className="p-4 align-middle">{user.role}</td>
                                                    <td className="p-4 align-middle">
                                                        <div className={clsx("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground", user.status === 'Active' ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600")}>
                                                            {user.status}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">{user.login}</td>
                                                    <td className="p-4 align-middle">
                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                                            {user.studies}
                                                            <ChevronDown className="ml-1 h-4 w-4" />
                                                        </button>
                                                    </td>
                                                    <td className="p-4 align-middle text-right">
                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                                            <Settings className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Lock className="mr-2 h-5 w-5 text-blue-600" />
                                    Roles & Permissions
                                </h3>
                                <p className="text-sm text-muted-foreground">Configure user roles and access permissions</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-4">
                                    {[
                                        { role: 'System Administrator', users: 2, permissions: ['Full Access', 'User Management', 'System Config'] },
                                        { role: 'Medical Monitor', users: 5, permissions: ['View Data', 'Safety Reporting', 'Query Management'] },
                                        { role: 'Data Manager', users: 8, permissions: ['Data Entry', 'Query Resolution', 'Reports'] },
                                        { role: 'Clinical Research Associate', users: 12, permissions: ['Site Monitoring', 'Data Review'] },
                                    ].map((role, i) => (
                                        <div key={i} className="p-4 border rounded-lg hover:bg-blue-50/50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-blue-800">{role.role}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{role.users} users assigned</div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {role.permissions.map((perm, j) => (
                                                            <span key={j} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                                {perm}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-100">Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'menu' && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <ChartNoAxesGantt className="mr-2 h-5 w-5 text-blue-600" />
                                    Menu Configuration
                                </h3>
                                <p className="text-sm text-muted-foreground">Customize navigation menu and layout</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-3">
                                    {[
                                        { name: 'Dashboard', icon: 'Home', visible: true, order: 1 },
                                        { name: 'Study Management', icon: 'Folder', visible: true, order: 2 },
                                        { name: 'Data Integration', icon: 'Database', visible: true, order: 3 },
                                        { name: 'AI Agents', icon: 'Bot', visible: false, order: 4 },
                                        { name: 'Analytics', icon: 'Chart', visible: true, order: 5 },
                                    ].map((item, i) => (
                                        <div key={i} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">::</span>
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-gray-500">Order: {item.order}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${item.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {item.visible ? 'Visible' : 'Hidden'}
                                                </span>
                                                <button className="text-sm px-2 py-1 hover:bg-gray-100 rounded">⚙️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'technical' && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Network className="mr-2 h-5 w-5 text-blue-600" />
                                    Technical Details
                                </h3>
                                <p className="text-sm text-muted-foreground">System configuration and technical settings</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Application Version', value: 'v2.5.1' },
                                        { label: 'Database Version', value: 'PostgreSQL 14.2' },
                                        { label: 'Server Environment', value: 'Production' },
                                        { label: 'Last Backup', value: '2025-04-04 02:00 AM' },
                                        { label: 'System Uptime', value: '45 days, 12 hours' },
                                        { label: 'Active Sessions', value: '23 users' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="text-sm text-gray-500">{item.label}</div>
                                            <div className="font-medium mt-1">{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                    Audit Logs
                                </h3>
                                <p className="text-sm text-muted-foreground">View system activity and audit trail</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-2">
                                    {[
                                        { action: 'User Login', user: 'madhu', time: '2025-04-04 16:30:00', status: 'success' },
                                        { action: 'Data Export', user: 'nivaasgd', time: '2025-04-04 15:45:00', status: 'success' },
                                        { action: 'Permission Change', user: 'madhu', time: '2025-04-04 14:20:00', status: 'success' },
                                        { action: 'Failed Login Attempt', user: 'unknown', time: '2025-04-04 13:10:00', status: 'failed' },
                                        { action: 'System Settings Updated', user: 'madhu', time: '2025-04-04 12:00:00', status: 'success' },
                                    ].map((log, i) => (
                                        <div key={i} className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <div>
                                                    <div className="font-medium text-sm">{log.action}</div>
                                                    <div className="text-xs text-gray-500">by {log.user}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">{log.time}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
