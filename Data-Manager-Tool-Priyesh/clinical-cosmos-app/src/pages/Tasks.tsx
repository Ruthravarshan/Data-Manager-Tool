import {
    User, ClipboardList, Plus, Search, ChevronDown, ArrowUpDown, FileText, Clock
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function Tasks() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Query & Task Workflow Management</h1>
                        <p className="text-neutral-500 mt-1">Manage and track queries and tasks across clinical trials and stakeholders</p>
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-md">
                            <User className="mr-2 h-4 w-4" />
                            <span className="text-sm font-medium">System Administrator</span>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Export
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3">
                            <Plus className="mr-2 h-4 w-4" />
                            New Query
                        </button>
                    </div>
                </div>

                <div className="flex items-center mb-6">
                    <div className="flex-1">
                        <div className="inline-flex h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600">
                            {['All Queries & Tasks', 'Assigned to Me', 'Created by Me', 'Responded'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={clsx(
                                        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                        activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-100 hover:text-blue-800"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6 pb-0">
                        <div className="flex flex-col lg:flex-row justify-between gap-4 pb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 w-full" placeholder="Search by ID, title, or description..." />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['All Priorities', 'All Statuses', 'All Studies', 'All Types'].map((filter) => (
                                    <button key={filter} className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[140px]">
                                        <span className="line-clamp-1">{filter}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0">
                        <div className="border rounded-lg overflow-hidden">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            </th>
                                            {['Task ID', 'Query ID', 'Title', 'Priority', 'Status', 'Created Date', 'Due Date', 'Due in', 'Created by', 'Assigned by', 'Study', 'Actions'].map((header) => (
                                                <th key={header} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                                                    <div className="flex items-center cursor-pointer">
                                                        {header}
                                                        {header !== 'Actions' && <ArrowUpDown className="ml-1 h-3 w-3" />}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {[
                                            {
                                                task: 'TASK-CM-006', query: 'SIG-045', title: 'Site enrollment rate below threshold', desc: 'Site 6 enrollment rate is 65% below target for the last 3 months',
                                                priority: 'High', status: 'Completed', role: 'CRA', created: 'Nov 30, 2025', due: 'Dec 9, 2025', dueIn: '-',
                                                createdBy: 'Manual', assignedBy: 'Data Manager', study: 'PRO002 - Rheumatoid Arthritis'
                                            },
                                            {
                                                task: 'TASK-DM-003', query: 'SIG-012', title: 'Reconcile discrepant adverse event dates', desc: 'AE dates in EDC do not match dates in safety database for patient 3021',
                                                priority: 'Critical', status: 'Responded', role: 'DM', created: 'Dec 5, 2025', due: 'Dec 11, 2025', dueIn: '1 days',
                                                createdBy: 'Manual', assignedBy: 'Data Manager', study: 'PRO003 - Advanced Breast Cancer'
                                            }
                                        ].map((item, i) => (
                                            <tr key={i} className="border-b transition-colors hover:bg-blue-50 cursor-pointer">
                                                <td className="p-4 align-middle w-[50px]">
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                </td>
                                                <td className="p-4 align-middle font-medium">{item.task}</td>
                                                <td className="p-4 align-middle text-blue-600 hover:underline">{item.query}</td>
                                                <td className="p-4 align-middle max-w-xs">
                                                    <div className="font-medium">{item.title}</div>
                                                    <div className="text-sm text-gray-500 truncate">{item.desc}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {item.priority}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                        {item.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1 h-3 w-3 text-gray-500" />
                                                        {item.created}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1 h-3 w-3 text-gray-500" />
                                                        {item.due}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">{item.dueIn}</td>
                                                <td className="p-4 align-middle whitespace-nowrap">{item.createdBy}</td>
                                                <td className="p-4 align-middle whitespace-nowrap">{item.assignedBy}</td>
                                                <td className="p-4 align-middle whitepsace-nowrap">{item.study}</td>
                                                <td className="p-4 align-middle">
                                                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
