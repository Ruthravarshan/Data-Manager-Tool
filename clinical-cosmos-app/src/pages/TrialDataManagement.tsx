import { useState, useEffect } from 'react';
import {
    FileText, Download, Database,
    Activity, Users, FileSpreadsheet, ClipboardList,
    AlertTriangle, Stethoscope, Syringe,
    Microscope, Image, Server, RefreshCw, Eye, Trash2
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { dataFileService, studyService } from '../services/api';

// New interface for metadata
interface SectionMetadata {
    domain: string;
    dataset_name: string;
    vendor: string;
    data_source: string;
    last_updated: string | null;
    description: string;
    record_count: number;
    variable_count: number;
    sample_data: any[];
}

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

    const [selectedProtocol, setSelectedProtocol] = useState<string>('');
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any | null>(null);
    const [previewData, setPreviewData] = useState<{ columns: string[]; rows: any[] } | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // New State for Metadata
    const [viewMode, setViewMode] = useState<'metadata' | 'data'>('data');
    const [metadata, setMetadata] = useState<SectionMetadata | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(false);

    // New State for Study Validation
    const [studyDetails, setStudyDetails] = useState<any | null>(null);

    // Handle Protocol Change
    const handleProtocolChange = (protocolId: string) => {
        setSelectedProtocol(protocolId);
        const study = studies.find(s => s.protocol_id === protocolId);
        setStudyDetails(study || null);
    };

    // Fetch studies on mount
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const studiesData = await studyService.getStudies();
                setStudies(studiesData || []);
                // Auto-select first study if available
                /*
                if (studiesData && studiesData.length > 0) {
                     // logic if we want to auto-select
                }
                */
            } catch (error) {
                console.error("Failed to fetch studies:", error);
            }
        };

        const fetchSections = async () => {
            try {
                const data = await dataFileService.getSections();
                setSections(data);
                if (data.length > 0) setActiveSubTab(data[0]);
            } catch (error) {
                console.error("Failed to fetch sections:", error);
            }
        };

        fetchStudies();
        fetchSections();
    }, []);

    // Fetch data files and sections when protocol changes
    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching files for Protocol:", selectedProtocol);
            try {
                setLoading(true);
                const [filesData, sectionsData] = await Promise.all([
                    dataFileService.getDataFiles(undefined, undefined, selectedProtocol),
                    dataFileService.getSections()
                ]);
                setDataFiles(filesData || []);
                setSections(sectionsData || []);

                // Auto-select first section if current selection is invalid or empty
                if (sectionsData && sectionsData.length > 0) {
                    // Check if activeSubTab is in the new list, if not, switch to first
                    if (!sectionsData.includes(activeSubTab)) {
                        setActiveSubTab(sectionsData[0]);
                    }
                } else if (!sectionsData || sectionsData.length === 0) {
                    // No sections available
                    setActiveSubTab('');
                }
            } catch (error) {
                console.error('Failed to fetch data files:', error);
                setDataFiles([]);
                setSections([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedProtocol]);

    // Fetch metadata when subtab or protocol changes
    useEffect(() => {
        const fetchMetadata = async () => {
            if (!activeSubTab || !selectedProtocol) return;
            setMetadataLoading(true);
            try {
                const data = await dataFileService.getSectionMetadata(activeSubTab, selectedProtocol);
                setMetadata(data);
            } catch (error) {
                console.error("Failed to fetch metadata:", error);
                setMetadata(null);
            } finally {
                setMetadataLoading(false);
            }
        };

        if (viewMode === 'metadata') {
            fetchMetadata();
        }
    }, [activeSubTab, selectedProtocol, viewMode]);

    // Effect to ensure active tab is valid when sections change (e.g. after delete)
    useEffect(() => {
        if (sections.length > 0 && !sections.includes(activeSubTab)) {
            setActiveSubTab(sections[0]);
        }
    }, [sections, activeSubTab]);

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
            return date.toLocaleDateString();
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
    const handlePreview = async (file: any) => {
        setSelectedFile(file);
        try {
            const data = await dataFileService.getFilePreview(file.file_path);
            setPreviewData(data);
        } catch (err) {
            setPreviewData({ columns: [], rows: [{ error: 'Failed to load file preview.' }] });
        }
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
        // Use full backend URL for download
        const url = `http://localhost:8000/data_source/${encodeURIComponent(file.filename)}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <select
                            value={selectedProtocol}
                            onChange={(e) => handleProtocolChange(e.target.value)}
                            className="flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm w-full sm:w-[180px] text-gray-700 hover:bg-gray-50"
                        >
                            <option value="">Select Protocol</option>
                            {studies.map(study => (
                                <option key={study.id} value={study.protocol_id}>{study.protocol_id}</option>
                            ))}
                        </select>
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


                {studyDetails && (
                    <div className="rounded-lg border bg-white shadow-sm mb-6 overflow-hidden">
                        <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">{studyDetails.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-3">
                                        <span>Protocol: <span className="font-mono font-medium text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{studyDetails.protocol_id}</span></span>
                                        <span className="text-gray-300">|</span>
                                        <span>Phase: <span className="font-medium text-gray-700">{studyDetails.phase}</span></span>
                                        <span className="text-gray-300">|</span>
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                                            studyDetails.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        )}>
                                            <span className={cn("h-1.5 w-1.5 rounded-full", studyDetails.status === 'Active' ? 'bg-green-600' : 'bg-gray-500')} />
                                            {studyDetails.status}
                                        </span>
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    {/* Optional: Add study-level actions here if needed */}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Indication</h4>
                                    <p className="font-medium text-gray-900">{studyDetails.indication || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</h4>
                                    <p className="font-medium text-gray-900">{studyDetails.start_date ? formatDate(studyDetails.start_date) : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</h4>
                                    <p className="font-medium text-gray-900">{studyDetails.end_date ? formatDate(studyDetails.end_date) : 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Patients</h4>
                                    <p className="font-medium text-gray-900">{studyDetails.subjects_count ? studyDetails.subjects_count.toLocaleString() : 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                    {sections.map((section) => {
                                        // Lookup metadata or provide default
                                        const meta = sectionMetadata[section] || {
                                            name: section.split(' ')[0], // Try to grab "TU" from "TU (Tumor)" or just use full name if no space
                                            icon: Database, // Default icon
                                            description: 'Clinical trial data section'
                                        };
                                        const count = dataFiles.filter(f => f.section === section).length;

                                        return (
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
                                                {count > 0 && activeSubTab === section && (
                                                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                    {sections.length === 0 && (
                                        <div className="text-sm text-gray-500 italic px-2 py-1">
                                            No sections found. Import data to see categories.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Domain Content */}
                            {activeSubTab ? (
                                <div>
                                    {/* Control Bar */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div className="text-sm font-medium text-gray-700">
                                            Data Source: <span className="text-gray-900 font-bold">EDC</span> <span className="text-gray-900 font-bold mx-1">{activeSubTab?.split(' ')[0]} Domain</span> <span className="text-gray-900 font-bold">{metadata?.record_count || currentSectionFiles.reduce((acc, f) => acc + (f.file_path?.endsWith('csv') ? 1 : 0), 0) /* Fallback approximation if no metadata */} Records</span>
                                        </div>
                                        <div className="flex bg-gray-100 p-1 rounded-md">
                                            <button
                                                onClick={() => setViewMode('metadata')}
                                                className={cn(
                                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                                    viewMode === 'metadata' ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                                                )}
                                            >
                                                <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">i</div>
                                                Metadata
                                            </button>
                                            <button
                                                onClick={() => setViewMode('data')}
                                                className={cn(
                                                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                                                    viewMode === 'data' ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                                                )}
                                            >
                                                <Database className="w-4 h-4" />
                                                Data
                                            </button>
                                        </div>
                                    </div>

                                    {viewMode === 'metadata' ? (
                                        metadataLoading ? (
                                            <div className="py-12 text-center">
                                                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                                                <p className="text-gray-500">Loading metadata...</p>
                                            </div>
                                        ) : metadata ? (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                {/* Left Card: Dataset Overview */}
                                                <div className="border border-blue-100 rounded-lg p-6 bg-white shadow-sm">
                                                    <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2 mb-6">
                                                        <Database className="h-5 w-5" />
                                                        Dataset Overview
                                                    </h3>

                                                    <div className="space-y-4">
                                                        <div className="flex">
                                                            <div className="w-32 flex items-center gap-2 text-gray-500 text-sm">
                                                                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px]">i</div>
                                                                Domain:
                                                            </div>
                                                            <div className="font-medium text-gray-900">{metadata.domain}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-32 flex items-center gap-2 text-gray-500 text-sm">
                                                                <FileSpreadsheet className="h-4 w-4" />
                                                                Dataset Name:
                                                            </div>
                                                            <div className="font-medium text-gray-900">{metadata.dataset_name}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-32 flex items-center gap-2 text-gray-500 text-sm">
                                                                <Users className="h-4 w-4" />
                                                                Vendor:
                                                            </div>
                                                            <div className="font-medium text-gray-900">{metadata.vendor}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-32 flex items-center gap-2 text-gray-500 text-sm">
                                                                <Server className="h-4 w-4" />
                                                                Data Source:
                                                            </div>
                                                            <div className="font-medium text-gray-900">{metadata.data_source}</div>
                                                        </div>
                                                        <div className="flex">
                                                            <div className="w-32 flex items-center gap-2 text-gray-500 text-sm">
                                                                <Activity className="h-4 w-4" />
                                                                Last Updated:
                                                            </div>
                                                            <div className="font-medium text-gray-900">{metadata.last_updated ? formatDate(metadata.last_updated) : 'N/A'}</div>
                                                        </div>
                                                    </div>

                                                    <hr className="my-6 border-gray-100" />

                                                    <div className="space-y-2">
                                                        <h4 className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                                            <div className="w-4 h-4 rounded-md border border-gray-300" />
                                                            Description
                                                        </h4>
                                                        <p className="text-sm text-gray-600 leading-relaxed">
                                                            {metadata.description}
                                                        </p>
                                                    </div>

                                                    <div className="mt-6">
                                                        <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                                                            SDTM Standard Domain
                                                        </div>
                                                        <div className="mt-2 flex gap-2">
                                                            <span className="px-2 py-0.5 border border-gray-200 rounded text-xs text-gray-500">SDTM 1.4</span>
                                                            <span className="px-2 py-0.5 border border-gray-200 rounded text-xs text-gray-500">SDTM 1.5</span>
                                                            <span className="px-2 py-0.5 border border-gray-200 rounded text-xs text-gray-500">SDTM 1.7</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Card: Data Overview */}
                                                <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                                    <h3 className="text-lg font-semibold text-blue-600 mb-6">
                                                        {metadata.domain} Domain - Data Overview
                                                    </h3>

                                                    <div className="flex justify-between mb-8">
                                                        <div>
                                                            <p className="text-gray-500 text-sm mb-1">Record Count</p>
                                                            <p className="text-3xl font-bold text-gray-900">{metadata.record_count}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-gray-500 text-sm mb-1">Variable Count</p>
                                                            <p className="text-3xl font-bold text-gray-900">{metadata.variable_count}</p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-gray-500 text-sm mb-3">Sample Data</p>
                                                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                                                    <thead className="bg-gray-50">
                                                                        <tr>
                                                                            {/* Use keys from first row but prioritize specific ones */}
                                                                            {(() => {
                                                                                if (!metadata.sample_data || metadata.sample_data.length === 0) return <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No Data</th>;

                                                                                const priority = ['recordId', 'importedAt', 'STUDYID', 'DOMAIN', 'USUBJID'];
                                                                                const keys = Object.keys(metadata.sample_data[0]);
                                                                                const sortedKeys = [
                                                                                    ...priority.filter(k => keys.includes(k)),
                                                                                    ...keys.filter(k => !priority.includes(k))
                                                                                ];

                                                                                return sortedKeys.slice(0, 6).map(key => (
                                                                                    <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                                        {key}
                                                                                    </th>
                                                                                ));
                                                                            })()}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                                        {metadata.sample_data.slice(0, 5).map((row, idx) => {
                                                                            const priority = ['recordId', 'importedAt', 'STUDYID', 'DOMAIN', 'USUBJID'];
                                                                            const keys = Object.keys(row);
                                                                            const sortedKeys = [
                                                                                ...priority.filter(k => keys.includes(k)),
                                                                                ...keys.filter(k => !priority.includes(k))
                                                                            ];

                                                                            return (
                                                                                <tr key={idx}>
                                                                                    {sortedKeys.slice(0, 6).map((key, i) => (
                                                                                        <td key={i} className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                                                            {row[key]}
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                        {metadata.sample_data.length === 0 && (
                                                                            <tr>
                                                                                <td colSpan={6} className="px-4 py-3 text-center text-gray-500 text-xs">No sample data available</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                                <Database className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                                <p className="text-gray-500">No metadata available for this section.</p>
                                            </div>
                                        )
                                    ) : (
                                        /* Existing Data View */
                                        loading ? (
                                            <div className="py-12 text-center">
                                                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-3" />
                                                <p className="text-gray-500">Loading data files...</p>
                                            </div>
                                        ) : currentSectionFiles.length > 0 ? (
                                            <div className="space-y-4">
                                                {/* Files List Header/Description if needed, but we have the control bar now */}
                                                {/* Note: In Data View we might want to keep the "Files" approach or the "Records" approach. 
                                                The screenshot shows "Records" view. But we only have files. 
                                                The user said "features missing example meta data". 
                                                The screenshot SHOWS a "Data" tab selected which shows a record list.
                                                However, our current backend is file-based not record-based database.
                                                Constructing a full record database is a huge task.
                                                I will keep the "Files" list as the "Data" view for now, as it's the closest equivalent we have.
                                            */}
                                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                                                    <div className="relative w-full max-w-sm">
                                                        <input
                                                            type="text"
                                                            placeholder="Search records..."
                                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <Eye className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <span className="w-4 h-4">▼</span> Filter
                                                        </button>
                                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <Download className="w-4 h-4" /> Export
                                                        </button>
                                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <ClipboardList className="w-4 h-4" /> Copy
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <button className="text-sm font-medium text-gray-600 flex items-center gap-1 hover:text-gray-900">
                                                        › Show All Columns
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                                            <RefreshCw className="w-4 h-4" /> Refresh
                                                        </button>
                                                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                                            + Add Record
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Files List */}
                                                <div className="space-y-2">
                                                    {currentSectionFiles.map((file) => (
                                                        <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors bg-white">
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
                                                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                                        <div>
                                                                            <span className="text-gray-500">File Size:</span>
                                                                            <p className="font-medium">{formatFileSize(file.file_size)}</p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-gray-500">Imported:</span>
                                                                            <p className="font-mono text-xs">{formatDate(file.created_at)}</p>
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
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                                        <Database className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Data Files Found</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto text-sm mb-6">
                                        There are no uploaded files for the selected protocol. Go to Data Integration to scan and import your trial data.
                                    </p>
                                </div>
                            )}
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
                                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-xs overflow-auto">
                                        {previewData && previewData.rows && previewData.rows.length > 0 && !previewData.rows[0].error ? (
                                            <>
                                                <div className="mb-2 text-blue-700 font-semibold">Columns: {previewData.columns.join(', ')}</div>
                                                <table className="min-w-full text-xs">
                                                    <thead>
                                                        <tr>
                                                            {previewData.columns.map((col) => (
                                                                <th key={col} className="px-2 py-1 border-b text-left">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {previewData.rows.slice(0, 10).map((row, idx) => (
                                                            <tr key={idx}>
                                                                {previewData.columns.map((col, i) => (
                                                                    <td key={i} className="px-2 py-1 border-b">{row[col]}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </>
                                        ) : previewData && previewData.rows && previewData.rows[0]?.error ? (
                                            <p className="text-red-500">{previewData.rows[0].error || 'No preview available.'}</p>
                                        ) : (
                                            <p className="text-gray-500">No preview available.</p>
                                        )}
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
                                <a
                                    href={selectedFile ? `http://localhost:8000/data_source/${encodeURIComponent(selectedFile.filename)}` : '#'}
                                    download={selectedFile ? selectedFile.filename : undefined}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                                    style={{ textDecoration: 'none' }}
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
