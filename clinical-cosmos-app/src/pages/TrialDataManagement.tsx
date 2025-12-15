import { useState } from 'react';
import {
    FileText, Download, ChevronDown, Database,
    Activity, Users, FileSpreadsheet, ClipboardList,
    AlertTriangle, Stethoscope, Syringe,
    Microscope, Image, Server
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const demographicsData = [
    { subjectId: "100-001", age: 45, sex: "Male", race: "White", country: "USA", site: "Site 100" },
    { subjectId: "100-002", age: 52, sex: "Female", race: "Black/African American", country: "USA", site: "Site 100" },
    { subjectId: "100-003", age: 61, sex: "Male", race: "Asian", country: "USA", site: "Site 100" },
    { subjectId: "101-001", age: 39, sex: "Female", race: "White", country: "UK", site: "Site 101" },
    { subjectId: "101-002", age: 55, sex: "Male", race: "White", country: "UK", site: "Site 101" },
];

export default function TrialDataManagement() {
    const [activeTab, setActiveTab] = useState('edc-data');
    const [activeSubTab, setActiveSubTab] = useState('DM');

    return (
        <div className="p-6">
            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Trial Data Management</h1>
                        <p className="text-gray-500">View and analyze clinical trial data across multiple sources</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-full sm:w-[180px] text-gray-700 hover:bg-gray-50">
                            <span className="font-medium">PRO001</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                        </button>
                        <div className="flex gap-2">
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 h-9 rounded-md px-3 text-gray-700 shadow-sm transition-colors">
                                <FileText className="h-4 w-4" />
                                Reports
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100 h-9 rounded-md px-3 text-gray-700 shadow-sm transition-colors">
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                {/* Study Info Card */}
                <div className="rounded-lg border bg-white shadow-sm mb-6">
                    <div className="p-6 pb-3 border-b border-gray-100">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900">Diabetes Type 2 Study</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Protocol: <span className="font-mono text-gray-700">PRO001</span> |
                            Phase: <span className="font-medium text-gray-700">Phase 3</span> |
                            Status: <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-1">Active</span>
                        </p>
                    </div>
                    <div className="p-6 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Indication</h4>
                                <p className="font-medium text-gray-900">Type 2 Diabetes</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</h4>
                                <p className="font-medium text-gray-900">01/01/2023</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</h4>
                                <p className="font-medium text-gray-900">01/01/2025</p>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Patients</h4>
                                <p className="font-medium text-gray-900">1,245 / 1,500</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex space-x-1 bg-blue-50 p-1 rounded-md mb-6 overflow-x-auto">
                    {[
                        { id: 'edc-data', label: 'EDC Data' },
                        { id: 'edc-audit', label: 'EDC Audit Data' },
                        { id: 'lab-data', label: 'Lab Data' },
                        { id: 'imaging-data', label: 'Imaging Data' },
                        { id: 'ctms-data', label: 'CTMS Data' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                                activeTab === tab.id
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-blue-600 hover:bg-blue-100 hover:text-blue-800"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'edc-data' && (
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="p-6 flex flex-col space-y-6">

                            {/* Data Source Header */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                                        <Database className="h-6 w-6 text-blue-600" />
                                        Electronic Data Capture (EDC)
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                        Data Provider: <span className="font-medium text-gray-900">Medidata Rave</span>
                                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">ODM Adapter v1.2</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                                    <Activity className="h-4 w-4 text-green-500" />
                                    Last sync: 10/12/2025 04:30 PM
                                </div>
                            </div>

                            {/* Domains Sub-Tabs */}
                            <div className="border-b border-gray-200">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {[
                                        { id: 'DM', label: 'DM', name: 'Demographics', icon: Users },
                                        { id: 'SV', label: 'SV', name: 'Subject Visits', icon: ClipboardList },
                                        { id: 'DS', label: 'DS', name: 'Disposition', icon: FileSpreadsheet },
                                        { id: 'AE', label: 'AE', name: 'Adverse Events', icon: AlertTriangle },
                                        { id: 'SAE', label: 'SAE', name: 'Serious AE', icon: AlertTriangle },
                                        { id: 'MH', label: 'MH', name: 'Medical History', icon: Stethoscope },
                                        { id: 'CM', label: 'CM', name: 'Concomitant Meds', icon: Stethoscope },
                                        { id: 'PD', label: 'PD', name: 'Protocol Deviations', icon: AlertTriangle },
                                        { id: 'VS', label: 'VS', name: 'Vital Signs', icon: Activity },
                                        { id: 'LB', label: 'LB', name: 'Lab Test Results', icon: Microscope },
                                        { id: 'EX', label: 'EX', name: 'Exposure', icon: Syringe },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveSubTab(tab.id)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                                activeSubTab === tab.id
                                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                            title={tab.name}
                                        >
                                            <tab.icon className="h-3.5 w-3.5" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Domain Content */}
                            <div>
                                {activeSubTab === 'DM' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900">Demographics (DM)</h3>
                                                <p className="text-sm text-gray-500">Subject demographics and baseline characteristics</p>
                                            </div>
                                            <button className="text-sm text-blue-600 hover:underline font-medium">View Full Dataset</button>
                                        </div>

                                        <div className="rounded-md border border-gray-200 overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-gray-50 text-gray-700 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-3">Subject ID</th>
                                                        <th className="px-4 py-3">Age</th>
                                                        <th className="px-4 py-3">Sex</th>
                                                        <th className="px-4 py-3">Race</th>
                                                        <th className="px-4 py-3">Country</th>
                                                        <th className="px-4 py-3">Site</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {demographicsData.map((row) => (
                                                        <tr key={row.subjectId} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium text-blue-600">{row.subjectId}</td>
                                                            <td className="px-4 py-3">{row.age}</td>
                                                            <td className="px-4 py-3">{row.sex}</td>
                                                            <td className="px-4 py-3">{row.race}</td>
                                                            <td className="px-4 py-3">{row.country}</td>
                                                            <td className="px-4 py-3 text-gray-500">{row.site}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                        <div className="flex justify-center mb-3">
                                            <div className="p-3 bg-gray-50 rounded-full">
                                                <Database className="h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No Data Displayed</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto mt-1">
                                            The {activeSubTab} domain view is currently under construction. Please check back later or view the raw report.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'edc-data' && (
                    <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
                        <div className="flex justify-center mb-4">
                            {activeTab === 'edc-audit' && <ClipboardList className="h-12 w-12 text-gray-300" />}
                            {activeTab === 'lab-data' && <Microscope className="h-12 w-12 text-gray-300" />}
                            {activeTab === 'imaging-data' && <Image className="h-12 w-12 text-gray-300" />}
                            {activeTab === 'ctms-data' && <Server className="h-12 w-12 text-gray-300" />}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {activeTab === 'edc-audit' ? 'EDC Audit Trail' :
                                activeTab === 'lab-data' ? 'Central Lab Data' :
                                    activeTab === 'imaging-data' ? 'Medical Imaging Data' : 'Clinical Trial Management System'}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            This module is being integrated. Please configure the data source in the Data Integration settings before viewing data here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
