import { useState, useEffect } from 'react';
import {
    FileText, Download, ChevronDown, Database,
    Activity, Users, FileSpreadsheet, ClipboardList,
    AlertTriangle, Stethoscope, Syringe,
    Microscope, Image, Server, RefreshCw, Eye, Trash2
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { dataFileService } from '../services/api';

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

const sectionMetadata: { [key: string]: { name: string; icon: any; description: string } } = {
    'DM (Demographics)': { name: 'DM', icon: Users, description: 'Subject demographics and baseline characteristics' },
    'SV (Subject Visits)': { name: 'SV', icon: ClipboardList, description: 'Subject visit records and timelines' },
    'DS (Disposition)': { name: 'DS', icon: FileSpreadsheet, description: 'Subject disposition and enrollment status' },
    'AE (Adverse Events)': { name: 'AE', icon: AlertTriangle, description: 'Adverse events recorded during trial' },
    'SAE (Serious Adverse Events)': { name: 'SAE', icon: AlertTriangle, description: 'Serious adverse events' },
    'MH (Medical History)': { name: 'MH', icon: Stethoscope, description: 'Subject medical history' },
    'CM (Concomitant Medications)': { name: 'CM', icon: Stethoscope, description: 'Concomitant medications' },
    'PD (Protocol Deviations)': { name: 'PD', icon: AlertTriangle, description: 'Protocol deviations' },
    'VS (Vitals)': { name: 'VS', icon: Activity, description: 'Vital signs measurements' },
    'LB (Laboratory)': { name: 'LB', icon: Microscope, description: 'Laboratory test results' },
    'EX (Exposure)': { name: 'EX', icon: Syringe, description: 'Drug exposure data' },
};

export default function TrialDataManagement() {
    const [activeTab, setActiveTab] = useState('edc-data');
    const [activeSubTab, setActiveSubTab] = useState('DM (Demographics)');
    const [dataFiles, setDataFiles] = useState<any[]>([]);
    const [sections, setSections] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Fetch data files and sections
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [filesData, sectionsData] = await Promise.all([
                    dataFileService.getDataFiles(),
                    dataFileService.getSections()
                ]);
                setDataFiles(filesData || []);
                setSections(sectionsData || []);
            } catch (error) {
                console.error('Failed to fetch data files:', error);
                setDataFiles([]);
                setSections([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get files for current section
    const currentSectionFiles = dataFiles.filter(f => f.section === activeSubTab);

    // Format file size
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch {
            return dateString;
        }
    };

    // Extract readable timestamp from filename timestamp
    const formatTimestamp = (timestamp: string | null) => {
        if (!timestamp) return 'N/A';
        try {
            // Format: YYYYMMDD_HHMMSS -> YYYY-MM-DD HH:MM:SS
            const date = timestamp.substring(0, 8);
            const time = timestamp.substring(9, 15);
            return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)} ${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
        } catch {
            return timestamp;
        }
    };

    // Handle preview
    const handlePreview = (file: any) => {
        setSelectedFile(file);
        // Mock preview data - in production would parse Excel file
        setPreviewData([
            { row: 1, data: 'Sample data would load from file' },
            { row: 2, data: 'First 10 rows displayed' },
            { row: 3, data: 'Actual file preview coming soon' },
        ]);
        setShowPreview(true);
    };

    // Handle delete
    const handleDelete = async (fileId: number) => {
        if (window.confirm('Are you sure you want to delete this file record?')) {
            try {
                await dataFileService.deleteDataFile(fileId);
                setDataFiles(dataFiles.filter(f => f.id !== fileId));
            } catch (error) {
                console.error('Failed to delete file:', error);
            }
        }
    };

    // Handle download
    const handleDownload = (file: any) => {
        // In production, this would download the actual file
        console.log('Downloading:', file.filename);
        alert(`Download functionality for ${file.filename} would be implemented with backend file serving`);
    };

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
                                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">Imported Files</span>
                                    </p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setRefreshing(true);
                                        setTimeout(() => setRefreshing(false), 1000);
                                    }}
                                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                                >
                                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>

                            {/* Domains Sub-Tabs */}
                            <div className="border-b border-gray-200">
                                <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
                                    {Object.entries(sectionMetadata).map(([section, meta]) => (
                                        <button
                                            key={section}
                                            onClick={() => setActiveSubTab(section)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                                                activeSubTab === section
                                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                            )}
                                            title={meta.description}
                                        >
                                            <meta.icon className="h-3.5 w-3.5" />
                                            {meta.name}
                                            {currentSectionFiles.length > 0 && activeSubTab === section && (
                                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                    {currentSectionFiles.length}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Domain Content */}
                            <div>
                                {loading ? (
                                    <div className="py-12 text-center">
                                        <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-3" />
                                        <p className="text-gray-500">Loading data files...</p>
                                    </div>
                                ) : currentSectionFiles.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900">{activeSubTab}</h3>
                                                <p className="text-sm text-gray-500">{sectionMetadata[activeSubTab]?.description}</p>
                                            </div>
                                            <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                                                {currentSectionFiles.length} file(s)
                                            </div>
                                        </div>

                                        {/* Files List */}
                                        <div className="space-y-2">
                                            {currentSectionFiles.map((file) => (
                                                <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                                <h4 className="font-medium text-gray-900">{file.filename}</h4>
                                                                <span className={cn(
                                                                    "text-xs px-2 py-1 rounded-full font-medium",
                                                                    file.status === 'Imported' ? 'bg-green-50 text-green-700' :
                                                                    file.status === 'Duplicate' ? 'bg-yellow-50 text-yellow-700' :
                                                                    'bg-gray-50 text-gray-700'
                                                                )}>
                                                                    {file.status}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                                <div>
                                                                    <span className="text-gray-500">Timestamp:</span>
                                                                    <p className="font-mono text-xs">{formatTimestamp(file.timestamp)}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500">File Size:</span>
                                                                    <p className="font-medium">{formatFileSize(file.file_size)}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500">Imported:</span>
                                                                    <p className="font-mono text-xs">{formatDate(file.created_at)}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500">Prefix:</span>
                                                                    <p className="font-mono text-xs font-bold">{file.prefix}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
                                                            <button
                                                                onClick={() => handlePreview(file)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                                title="Preview"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(file)}
                                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(file.id)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                        <div className="flex justify-center mb-3">
                                            <div className="p-3 bg-gray-50 rounded-full">
                                                <Database className="h-6 w-6 text-gray-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No Files in {activeSubTab}</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto mt-1">
                                            Connect a data source folder in the Data Integration tab to import files. Files will be automatically classified by section.
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

                {/* Preview Modal */}
                {showPreview && selectedFile && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold">Preview - {selectedFile.filename}</h3>
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 overflow-auto flex-1 bg-gray-50">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p className="font-medium text-gray-900">File Details:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li><span className="text-gray-500">Size:</span> {formatFileSize(selectedFile.file_size)}</li>
                                        <li><span className="text-gray-500">Timestamp:</span> {formatTimestamp(selectedFile.timestamp)}</li>
                                        <li><span className="text-gray-500">Status:</span> {selectedFile.status}</li>
                                        <li><span className="text-gray-500">Section:</span> {selectedFile.section}</li>
                                    </ul>
                                    <p className="font-medium text-gray-900 mt-4">Preview Data (First 10 rows):</p>
                                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-xs">
                                        <p className="text-gray-500">Preview functionality for Excel files would display data here in production</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                <button 
                                    onClick={() => setShowPreview(false)}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
