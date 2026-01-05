import {
    FileChartColumn, Plus, BadgeAlert, ClipboardCheck, Shield, FileCheck, ChartColumn,
    Clock, ChartNoAxesColumnIncreasing, Users, CircleDollarSign, Filter, ChevronDown, X, Check, AlertCircle,
    Building2
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

export default function RiskProfiles() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [activeProfileTab, setActiveProfileTab] = useState('Risk');
    const [selectedEntity, setSelectedEntity] = useState('All Entity Types');
    const [isEntityDropdownOpen, setIsEntityDropdownOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(null), 3000);
    };

    const entityTypes = ['All Entity Types', 'Trial', 'Site', 'Resource', 'Vendor'];

    const riskProfilesData = [
        { name: 'Site Enrollment Risk', entity: 'Site', type: 'Risk', score: 85, date: '4/23/2025' },
        { name: 'Trial Budget Compliance', entity: 'Trial', type: 'Compliance', score: 72, date: '5/12/2025' },
        { name: 'Resource Availability Risk', entity: 'Resource', type: 'Risk', score: 65, date: '4/30/2025' },
        { name: 'Vendor Quality Audit', entity: 'Vendor', type: 'Quality', score: 88, date: '6/05/2025' },
        { name: 'Site Safety Monitoring', entity: 'Site', type: 'Safety', score: 45, date: '4/15/2025' },
        { name: 'Trial Recruitment Pace', entity: 'Trial', type: 'Risk', score: 92, date: '5/20/2025' },
        { name: 'Vendor Performance Risk', entity: 'Vendor', type: 'Risk', score: 78, date: '5/25/2025' },
        { name: 'Data Quality Profile', entity: 'Trial', type: 'Quality', score: 52, date: '7/30/2025' },
        { name: 'Data Quality Profile', entity: 'Site', type: 'Quality', score: 65, date: '8/02/2025' },
        { name: 'Data Quality Profile', entity: 'Resource', type: 'Quality', score: 48, date: '7/25/2025' },
        { name: 'Data Quality Profile', entity: 'Vendor', type: 'Quality', score: 72, date: '8/10/2025' },
        { name: 'CRO Performance Profile', entity: 'Vendor', type: 'Vendor', score: 38, date: '4/23/2025' },
        { name: 'Parexel Performance Profile', entity: 'Vendor', type: 'Vendor', score: 79, date: '4/23/2025' },
        { name: 'CRA Performance Profile', entity: 'Resource', type: 'Resource', score: 32, date: '12/09/2025' },
        { name: 'Clinical Operations Manager Profile', entity: 'Resource', type: 'Resource', score: 35, date: '12/09/2025' },
        { name: 'Site Monitor Quality Profile', entity: 'Resource', type: 'Resource', score: 42, date: '11/15/2025' },
        { name: 'Data Manager Performance', entity: 'Resource', type: 'Resource', score: 28, date: '10/20/2025' },
        { name: 'IBA Performance Profile', entity: 'Vendor', type: 'Vendor', score: 45, date: '9/15/2025' },
        { name: 'Medidata Solutions Profile', entity: 'Vendor', type: 'Vendor', score: 62, date: '8/30/2025' },
    ];

    const riskProfiles = riskProfilesData.filter(p => {
        const matchesTab = activeProfileTab === 'All' || p.type === activeProfileTab;
        const matchesEntity = selectedEntity === 'All Entity Types' || p.entity === selectedEntity;
        return matchesTab && matchesEntity;
    });


    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Profile Management</h1>
                        <p className="text-neutral-500 mt-1">Manage risk, quality, compliance, safety, vendor, financial, and resource profiles</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => showToast('Report exported successfully')}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                        >
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
                        <div className="flex items-center space-x-6 border-b pb-4">
                            {['Risk', 'Quality', 'Compliance', 'Safety', 'Vendor', 'Financial', 'Resource'].map((pTab) => (
                                <button
                                    key={pTab}
                                    onClick={() => setActiveProfileTab(pTab)}
                                    className={clsx(
                                        "text-sm font-medium transition-colors relative pb-4 -mb-4",
                                        activeProfileTab === pTab ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-500 hover:text-neutral-800"
                                    )}
                                >
                                    {pTab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsEntityDropdownOpen(!isEntityDropdownOpen)}
                                        className="flex items-center justify-between w-[320px] px-4 py-2 bg-white border rounded-md text-sm text-neutral-700"
                                    >
                                        {selectedEntity}
                                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                                    </button>
                                    {isEntityDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg py-1">
                                            {entityTypes.map((type) => (
                                                <button
                                                    key={type}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-50"
                                                    onClick={() => {
                                                        setSelectedEntity(type);
                                                        setIsEntityDropdownOpen(false);
                                                    }}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button className="p-2 border rounded-md hover:bg-neutral-50">
                                    <Filter className="h-4 w-4 text-neutral-600" />
                                </button>
                            </div>

                            {(riskProfiles.length > 0 && activeProfileTab !== 'Compliance' && activeProfileTab !== 'Safety') ? (
                                <div className="border rounded-lg overflow-hidden bg-white">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-neutral-50/50">
                                                <th className="px-6 py-4 text-left font-medium text-neutral-500">Profile</th>
                                                <th className="px-6 py-4 text-left font-medium text-neutral-500">Entity</th>
                                                <th className="px-6 py-4 text-left font-medium text-neutral-500">Type</th>
                                                <th className="px-6 py-4 text-left font-medium text-neutral-500">Risk Score</th>
                                                <th className="px-6 py-4 text-left font-medium text-neutral-500">Assessment Date</th>
                                                <th className="px-6 py-4 text-right font-medium text-neutral-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {riskProfiles.map((p, i) => (
                                                <tr key={i} className="border-b last:border-0 hover:bg-neutral-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={clsx(
                                                                "p-1.5 rounded-full",
                                                                p.type === 'Quality' ? "bg-green-50" :
                                                                    p.type === 'Vendor' ? "bg-purple-50" :
                                                                        p.type === 'Resource' ? "bg-blue-50" : "bg-red-50"
                                                            )}>
                                                                {p.type === 'Quality' ? (
                                                                    <ClipboardCheck className="h-4 w-4 text-green-500" />
                                                                ) : p.type === 'Vendor' ? (
                                                                    <Building2 className="h-4 w-4 text-purple-500" />
                                                                ) : p.type === 'Resource' ? (
                                                                    <Users className="h-4 w-4 text-blue-500" />
                                                                ) : (
                                                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                                                )}
                                                            </div>
                                                            <span className="font-medium text-neutral-800">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={clsx(
                                                            "px-2.5 py-0.5 text-xs font-semibold rounded-full border",
                                                            p.entity === 'Vendor' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                                p.entity === 'Resource' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                                        )}>
                                                            {p.entity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-600">{p.type}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-24 bg-neutral-100 h-2 rounded-full overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        "h-full rounded-full",
                                                                        p.type === 'Quality' ? "bg-orange-400" :
                                                                            p.type === 'Vendor' ? "bg-amber-400" :
                                                                                p.type === 'Resource' ? "bg-amber-400" : "bg-red-500"
                                                                    )}
                                                                    style={{ width: `${p.score}%` }}
                                                                />
                                                            </div>
                                                            <span className={clsx(
                                                                "font-bold text-sm",
                                                                p.type === 'Quality' ? "text-neutral-800" :
                                                                    p.type === 'Vendor' ? "text-amber-700" :
                                                                        p.type === 'Resource' ? "text-amber-700" : "text-red-600"
                                                            )}>{p.score}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-neutral-600">{p.date}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedProfile(p);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="text-neutral-900 font-bold hover:text-blue-600 transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                                    <div className="p-4 bg-neutral-50 rounded-full">
                                        <ChartColumn className="h-12 w-12 text-neutral-400" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-2xl font-bold text-neutral-900">No Profiles Found</h3>
                                        <p className="text-neutral-500">No {activeProfileTab.toLowerCase()} profiles found.</p>
                                    </div>
                                    <button className="flex items-center space-x-2 px-6 py-2.5 bg-[#0080ff] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                                        <Plus className="h-5 w-5" />
                                        <span>Create Profile</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'dimensions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {[
                            {
                                title: 'Portfolio Dimension',
                                description: 'Manage portfolio level profiles',
                                items: [
                                    { name: 'Risk', description: 'Portfolio risk assessment', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { name: 'Financial', description: 'Portfolio financial health', icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-50' }
                                ]
                            },
                            {
                                title: 'Program Dimension',
                                description: 'Manage program level profiles',
                                items: [
                                    { name: 'Quality', description: 'Program quality metrics', icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50' },
                                    { name: 'Compliance', description: 'Program compliance status', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' }
                                ]
                            },
                            {
                                title: 'Site Dimension',
                                description: 'Manage site level profiles',
                                items: [
                                    { name: 'Risk', description: 'Site risk assessment', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
                                    { name: 'Safety', description: 'Site safety status', icon: FileCheck, color: 'text-amber-500', bg: 'bg-amber-50' }
                                ]
                            },
                            {
                                title: 'Resource Dimension',
                                description: 'Manage resource level profiles',
                                items: [
                                    { name: 'Resource', description: 'Resource performance', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                                    { name: 'Financial', description: 'Resource allocation', icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-50' }
                                ]
                            }
                        ].map((category, i) => (
                            <div key={i} className="rounded-xl border bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-neutral-900">{category.title}</h3>
                                    <p className="text-neutral-500 mt-1">{category.description}</p>
                                </div>
                                <div className="space-y-4">
                                    {category.items.map((item, j) => (
                                        <div key={j} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:border-blue-100 hover:bg-neutral-50/50 transition-all group">
                                            <div className="flex items-center space-x-4">
                                                <div className={clsx("p-2 rounded-lg", item.bg)}>
                                                    <item.icon className={clsx("h-6 w-6", item.color)} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-neutral-900">{item.name}</h4>
                                                    <p className="text-sm text-neutral-500">{item.description}</p>
                                                </div>
                                            </div>
                                            <button className="text-sm font-bold text-neutral-900 px-4 py-2 hover:bg-neutral-100 rounded-md transition-colors">
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'benchmarks' && (
                    <div className="space-y-6 mt-6">
                        <div className="rounded-xl border bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-neutral-900">Benchmark Metrics</h3>
                                <p className="text-neutral-500 mt-1">Compare performance against industry benchmarks</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-neutral-100">
                                            <th className="pb-4 font-medium text-neutral-400 text-sm">Metric</th>
                                            <th className="pb-4 font-medium text-neutral-400 text-sm text-center">Current</th>
                                            <th className="pb-4 font-medium text-neutral-400 text-sm text-center">Target</th>
                                            <th className="pb-4 font-medium text-neutral-400 text-sm text-center">Industry Avg</th>
                                            <th className="pb-4 font-medium text-neutral-400 text-sm text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-50">
                                        {[
                                            { name: 'Cycle Times (days)', current: '142', target: '120', industry: '135', status: 'At Risk', color: 'amber' },
                                            { name: 'Risk Score Avg', current: '42', target: '30', industry: '45', status: 'Good', color: 'emerald' },
                                            { name: 'Quality Score', current: '78', target: '85', industry: '75', status: 'Attention', color: 'amber' },
                                            { name: 'Clinical Services Rating', current: '8.2/10', target: '8.5/10', industry: '7.9/10', status: 'Good', color: 'emerald' },
                                            { name: 'Recruitment Rate (%)', current: '62%', target: '80%', industry: '65%', status: 'Critical', color: 'red' },
                                        ].map((m, i) => (
                                            <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="py-5 font-normal text-neutral-900">{m.name}</td>
                                                <td className="py-5 text-center text-neutral-700 font-normal">{m.current}</td>
                                                <td className="py-5 text-center text-neutral-700 font-normal">{m.target}</td>
                                                <td className="py-5 text-center text-neutral-700 font-normal">{m.industry}</td>
                                                <td className="py-5 text-right">
                                                    <span className={clsx(
                                                        "px-4 py-1.5 rounded-full text-xs font-bold border",
                                                        m.color === 'red' ? "bg-red-50 text-red-600 border-red-100" :
                                                            m.color === 'amber' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    )}>
                                                        {m.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Performance Trends', sub: 'Performance metrics over time', placeholder: 'Performance trend visualization would appear here' },
                                { title: 'Benchmark Comparison', sub: 'Compare to industry standards', placeholder: 'Benchmark comparison visualization would appear here' }
                            ].map((card, i) => (
                                <div key={i} className="rounded-xl border bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-[400px] flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-neutral-900">{card.title}</h3>
                                        <p className="text-neutral-500 mt-1">{card.sub}</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-40">
                                        <svg className="w-16 h-16 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 3v18h18" />
                                            <path d="M18 17l-4-4-4 4-4-4" />
                                        </svg>
                                        <p className="text-neutral-500 text-center max-w-[280px] leading-relaxed">
                                            {card.placeholder}
                                        </p>
                                    </div>
                                </div>
                            ))}
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

            {/* Modal */}
            {isModalOpen && selectedProfile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto relative scrollbar-hide">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute right-5 top-5 p-2 text-neutral-400 hover:text-neutral-600 transition-colors z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>


                        <div className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className={clsx(
                                        "p-1 border rounded-full",
                                        selectedProfile.type === 'Quality' ? "border-green-200" :
                                            selectedProfile.type === 'Vendor' ? "border-purple-200" :
                                                selectedProfile.type === 'Resource' ? "border-blue-200" : "border-red-200"
                                    )}>
                                        {selectedProfile.type === 'Quality' ? (
                                            <ClipboardCheck className="h-5 w-5 text-green-500" />
                                        ) : selectedProfile.type === 'Vendor' ? (
                                            <Building2 className="h-5 w-5 text-purple-500" />
                                        ) : selectedProfile.type === 'Resource' ? (
                                            <Users className="h-5 w-5 text-blue-500" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <h2 className="text-xl font-bold text-neutral-900 leading-none">{selectedProfile.name}</h2>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <span className={clsx(
                                        "px-3 py-1 text-xs font-medium rounded-full border uppercase tracking-wide",
                                        selectedProfile.entity === 'Vendor' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                            selectedProfile.entity === 'Resource' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                "bg-[#f0fdf4] text-[#166534] border-green-100"
                                    )}>
                                        {selectedProfile.entity}
                                    </span>
                                    <span className="px-4 py-1.5 bg-neutral-50 text-neutral-600 text-xs font-normal rounded-full border border-neutral-100 italic">
                                        ID: 1
                                    </span>
                                    <span className="px-4 py-1.5 bg-neutral-50 text-neutral-600 text-xs font-normal rounded-full border border-neutral-100 italic">
                                        12/9/2025
                                    </span>
                                </div>
                                <p className="text-base text-neutral-500 font-normal opacity-80">
                                    Comprehensive analysis of {selectedProfile.type.toLowerCase()} metrics and recommendations
                                </p>
                            </div>

                            {selectedProfile.type !== 'Quality' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-xl font-bold text-neutral-800">Risk Score: {selectedProfile.score}</h3>
                                        <span className={clsx(
                                            "text-lg font-medium leading-none",
                                            (selectedProfile.type === 'Vendor' || selectedProfile.type === 'Resource') ? "text-amber-600" : "text-red-600"
                                        )}>{selectedProfile.score}</span>
                                    </div>
                                    <div className="w-full bg-neutral-100 h-4 rounded-full overflow-hidden">
                                        <div className={clsx(
                                            "h-full rounded-full",
                                            (selectedProfile.type === 'Vendor' || selectedProfile.type === 'Resource') ? "bg-amber-400" : "bg-red-500"
                                        )} style={{ width: `${selectedProfile.score}%` }} />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                <h4 className="text-xl font-bold text-neutral-900">Metrics</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {(selectedProfile.type === 'Quality' ? [
                                        { label: 'Dimensions', value: 'Data AccuracyCompletenessConsistency', pct: 85, isDim: true },
                                        { label: 'Severity Score', value: '3', pct: 75 },
                                        { label: 'Likelihood Score', value: '2', pct: 50 },
                                        { label: 'Detection Difficulty', value: '3', pct: 75 }
                                    ] : selectedProfile.type === 'Resource' ? [
                                        { label: 'Dimensions', value: 'Site Visit QualityQuery ManagementProtocol Knowledge', pct: 60, isDim: true },
                                        { label: 'Severity Score', value: '2', pct: 40 },
                                        { label: 'Likelihood Score', value: '2', pct: 40 },
                                        { label: 'Detection Difficulty', value: '2', pct: 40 }
                                    ] : [
                                        { label: 'Dimensions', value: 'Quality of DeliverablesTimeline AdherenceCommunication', pct: 60, isDim: true },
                                        { label: 'Severity Score', value: '2', pct: 40 },
                                        { label: 'Likelihood Score', value: '2', pct: 40 },
                                        { label: 'Detection Difficulty', value: '3', pct: 60 }
                                    ])
                                        .map((m, i) => (
                                            <div key={i} className="p-6 bg-white border border-neutral-100 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-5">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-neutral-400 font-normal text-base">{m.label}</span>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-1 bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-[#22c55e] h-full rounded-full" style={{ width: `${m.pct}%` }} />
                                                    </div>
                                                    <span className={clsx(
                                                        "font-normal text-neutral-500",
                                                        m.isDim ? "text-[10px] leading-tight max-w-[120px]" : "text-sm"
                                                    )}>
                                                        {m.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xl font-bold text-neutral-900">Recommendations</h4>
                                <ul className="space-y-3 pl-2 pb-4">
                                    {(selectedProfile.type === 'Quality' ? [
                                        'Improve data validation process',
                                        'Conduct data quality review',
                                        'Update data management plan'
                                    ] : selectedProfile.type === 'Resource' ? [
                                        'Provide additional training',
                                        'Implement performance improvement plan',
                                        'Schedule coaching sessions'
                                    ] : [
                                        'Review vendor KPIs',
                                        'Schedule performance review meeting',
                                        'Update vendor management plan'
                                    ]).map((rec, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-neutral-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 mt-2.5 flex-shrink-0" />
                                            <span className="text-base leading-relaxed font-normal">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        showToast('Report exported successfully');
                                    }}
                                    className="px-8 py-2.5 bg-white border border-neutral-200 text-neutral-800 font-bold text-base rounded-lg hover:bg-neutral-50 transition-colors shadow-sm"
                                >
                                    Export Report
                                </button>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        showToast('Profile updated successfully');
                                    }}
                                    className="px-8 py-2.5 bg-[#0080ff] text-white font-bold text-base rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast?.visible && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white text-neutral-800 px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center space-x-4 border border-neutral-100 min-w-[320px]">
                        <div className="bg-emerald-500 rounded-full p-1.5 flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />
                        </div>
                        <span className="text-[17px] font-bold flex-1">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
