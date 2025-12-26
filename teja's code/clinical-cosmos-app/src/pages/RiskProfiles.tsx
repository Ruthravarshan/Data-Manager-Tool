import {
    FileChartColumn, Plus, BadgeAlert, ClipboardCheck, Shield, FileCheck, ChartColumn,
    Clock, ChartNoAxesColumnIncreasing, Users, CircleDollarSign
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function RiskProfiles() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Profile Management</h1>
                        <p className="text-neutral-500 mt-1">Manage risk, quality, compliance, safety, vendor, financial, and resource profiles</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <FileChartColumn className="mr-2 h-4 w-4" />
                            Export Reports
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Profile
                        </button>
                    </div>
                </div>

                <div className="w-[600px]">
                    <div className="grid grid-cols-5 h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600">
                        {['dashboard', 'profiles', 'dimensions', 'benchmarks', 'trends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 capitalize",
                                    activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-100 hover:text-blue-800"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'dashboard' && (
                    <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Risk Profiles', count: 24, icon: BadgeAlert, color: 'text-red-600', bg: 'bg-red-50', change: '↑ 12%', changeColor: 'text-green-600' },
                                { title: 'Quality Profiles', count: 18, icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50', change: '↑ 5%', changeColor: 'text-green-600' },
                                { title: 'Compliance Profiles', count: 16, icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50', change: '↓ 3%', changeColor: 'text-red-600' },
                                { title: 'Safety Profiles', count: 22, icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50', change: '↑ 8%', changeColor: 'text-green-600' }
                            ].map((item, i) => (
                                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{item.title}</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold">{item.count}</div>
                                            <div className={`p-2 rounded-full ${item.bg} bg-opacity-10`}>
                                                <item.icon className={`h-5 w-5 ${item.color}`} />
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs flex items-center">
                                            <span className={item.changeColor}>{item.change}</span>
                                            <span className="text-muted-foreground ml-1">from previous period</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm md:col-span-2">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                        <ChartColumn className="mr-2 h-5 w-5 text-blue-600" />
                                        Profile Distribution by Entity Type
                                    </h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="h-80 flex items-center justify-center">
                                        <div className="grid grid-cols-2 gap-6 w-full">
                                            <div className="space-y-4">
                                                {[
                                                    { label: 'Trial', val: '25%', color: 'bg-blue-500' },
                                                    { label: 'Site', val: '40%', color: 'bg-green-500' },
                                                    { label: 'Resource', val: '20%', color: 'bg-purple-500' },
                                                    { label: 'Vendor', val: '15%', color: 'bg-amber-500' }
                                                ].map((d, i) => (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className={`w-3 h-3 rounded-full ${d.color} mr-2`} />
                                                            <span>{d.label}</span>
                                                        </div>
                                                        <span className="font-medium">{d.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <div className="relative w-40 h-40">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-sm font-medium">80 Profiles</div>
                                                    </div>
                                                    <svg className="rotate-[-90deg]" height="160" viewBox="0 0 42 42" width="160">
                                                        <circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#e9ecef" strokeWidth="3" />
                                                        <circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#3b82f6" strokeDasharray="25 75" strokeDashoffset="0" strokeWidth="3" />
                                                        <circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#22c55e" strokeDasharray="40 60" strokeDashoffset="-25" strokeWidth="3" />
                                                        <circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#a855f7" strokeDasharray="20 80" strokeDashoffset="-65" strokeWidth="3" />
                                                        <circle cx="21" cy="21" fill="transparent" r="15.91549430918954" stroke="#f59e0b" strokeDasharray="15 85" strokeDashoffset="-85" strokeWidth="3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                        <BadgeAlert className="mr-2 h-5 w-5 text-red-600" />
                                        High Risk Entities
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Entities with risk score &gt;75</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Site 123', sub: 'New York', score: 86 },
                                            { name: 'PRO002 Trial', sub: 'Phase II', score: 82 },
                                            { name: 'J. Thompson', sub: 'CRA', score: 79 },
                                            { name: 'Site 305', sub: 'Houston', score: 77 },
                                            { name: 'LabCorp', sub: 'Vendor', score: 76 }
                                        ].map((entity, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium">{entity.name}</div>
                                                    <div className="text-sm text-muted-foreground">{entity.sub}</div>
                                                </div>
                                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-red-100 text-red-800">
                                                    {entity.score}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Avg. Cycle Time (days)', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', val: 142, target: 120, pct: 118, barColor: 'bg-blue-50' },
                                { title: 'Risk Score Reduction', icon: ChartNoAxesColumnIncreasing, color: 'text-green-600', bg: 'bg-green-50', val: 18, target: 25, pct: 72, barColor: 'bg-green-50' },
                                { title: 'Recruitment Rate (%)', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', val: 62, target: 80, pct: 78, barColor: 'bg-indigo-50' },
                                { title: 'Budget Utilization (%)', icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', val: 85, target: 90, pct: 94, barColor: 'bg-emerald-50' }
                            ].map((m, i) => (
                                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="space-y-1.5 p-6 pb-2 flex flex-row items-center justify-between">
                                        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{m.title}</h3>
                                        <div className={`p-2 rounded-full ${m.bg} bg-opacity-10`}>
                                            <m.icon className={`h-5 w-5 ${m.color}`} />
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0 pb-2">
                                        <div className="flex items-end justify-between mb-2">
                                            <div className="text-2xl font-bold">{m.val}</div>
                                            <div className="text-sm text-muted-foreground">Target: {m.target}</div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className={`h-2.5 rounded-full ${m.barColor}`} style={{ width: `${m.pct}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex items-center p-6 pt-0">
                                        <div className="text-xs text-muted-foreground">{m.pct}% of target achieved</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profiles' && (
                    <div className="space-y-6 mt-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg">All Profiles</h3>
                                <p className="text-sm text-muted-foreground">View and manage all entity profiles</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-3">
                                    {[
                                        { name: 'Site 123 - New York', type: 'Site', score: 86, status: 'High Risk', color: 'bg-red-100 text-red-800' },
                                        { name: 'PRO002 Trial', type: 'Trial', score: 82, status: 'High Risk', color: 'bg-red-100 text-red-800' },
                                        { name: 'J. Thompson (CRA)', type: 'Resource', score: 79, status: 'Medium Risk', color: 'bg-amber-100 text-amber-800' },
                                        { name: 'Site 305 - Houston', type: 'Site', score: 77, status: 'Medium Risk', color: 'bg-amber-100 text-amber-800' },
                                        { name: 'LabCorp Vendor', type: 'Vendor', score: 76, status: 'Medium Risk', color: 'bg-amber-100 text-amber-800' },
                                        { name: 'Site 201 - Boston', type: 'Site', score: 45, status: 'Low Risk', color: 'bg-green-100 text-green-800' },
                                    ].map((profile, i) => (
                                        <div key={i} className="p-4 border rounded-lg hover:bg-blue-50/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium text-blue-800">{profile.name}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{profile.type}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{profile.score}</div>
                                                        <div className="text-xs text-gray-500">Risk Score</div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.color}`}>
                                                        {profile.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'dimensions' && (
                    <div className="space-y-6 mt-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg">Profile Dimensions</h3>
                                <p className="text-sm text-muted-foreground">Configure risk dimensions and criteria</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Data Quality', weight: 25, description: 'Quality of data collection and entry' },
                                        { name: 'Protocol Compliance', weight: 20, description: 'Adherence to protocol requirements' },
                                        { name: 'Enrollment Rate', weight: 15, description: 'Subject recruitment performance' },
                                        { name: 'Query Resolution', weight: 15, description: 'Speed and quality of query responses' },
                                        { name: 'Safety Reporting', weight: 15, description: 'Timeliness of adverse event reporting' },
                                        { name: 'Site Performance', weight: 10, description: 'Overall site operational metrics' },
                                    ].map((dim, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium">{dim.name}</div>
                                                <span className="text-sm font-bold text-blue-600">{dim.weight}%</span>
                                            </div>
                                            <p className="text-sm text-gray-500">{dim.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'benchmarks' && (
                    <div className="space-y-6 mt-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg">Benchmarks</h3>
                                <p className="text-sm text-muted-foreground">Industry benchmarks and comparisons</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-4">
                                    {[
                                        { metric: 'Data Quality Score', internal: 94.5, industry: 92.0, status: 'Above' },
                                        { metric: 'Query Resolution Time', internal: 3.2, industry: 4.5, status: 'Above', unit: 'days' },
                                        { metric: 'Protocol Deviations', internal: 2.1, industry: 3.8, status: 'Above', unit: '%' },
                                        { metric: 'Enrollment Rate', internal: 85, industry: 78, status: 'Above', unit: '%' },
                                    ].map((bench, i) => (
                                        <div key={i} className="p-4 border rounded-lg">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="font-medium">{bench.metric}</div>
                                                <span className={`text-xs px-2 py-1 rounded-full ${bench.status === 'Above' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {bench.status} Industry Avg
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-xs text-gray-500">Your Performance</div>
                                                    <div className="text-xl font-bold text-blue-600">{bench.internal}{bench.unit || ''}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Industry Average</div>
                                                    <div className="text-xl font-bold text-gray-600">{bench.industry}{bench.unit || ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'trends' && (
                    <div className="space-y-6 mt-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="font-semibold tracking-tight text-lg">Trends Analysis</h3>
                                <p className="text-sm text-muted-foreground">Historical trends and predictions</p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-6">
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-4">Risk Score Trend (Last 6 Months)</h4>
                                        <div className="h-48 flex items-end justify-around gap-2">
                                            {[75, 72, 68, 65, 62, 58].map((height, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center">
                                                    <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t" style={{ height: `${height}%` }} />
                                                    <span className="text-xs text-gray-500 mt-2">M{i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-green-600 mt-4">↓ 22% improvement over 6 months</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Improving Metrics</h4>
                                            <div className="space-y-2">
                                                {['Data Quality', 'Query Response', 'Enrollment'].map((m, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span>{m}</span>
                                                        <span className="text-green-600">↑ {12 + i * 3}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <h4 className="font-medium mb-2">Declining Metrics</h4>
                                            <div className="space-y-2">
                                                {['Protocol Deviations', 'Safety Issues'].map((m, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span>{m}</span>
                                                        <span className="text-red-600">↓ {8 + i * 2}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
