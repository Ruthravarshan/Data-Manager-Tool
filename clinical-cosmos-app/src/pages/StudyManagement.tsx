import { Search, Filter, Plus, ChevronLeft, Calendar, Users, Activity, Building2, AlertCircle, FileText, FlaskConical, Upload, Eye, Edit2, Trash2, X, Download, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { studyService, documentService } from '../services/api';


function StudyDetail({ study, onBack }: { study: any, onBack: () => void }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Document Management State
    const [documents, setDocuments] = useState<any[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);
    const [editName, setEditName] = useState('');

    // Fetch documents when tab is 'documents'
    useEffect(() => {
        if (study && activeTab === 'documents') {
            loadDocuments();
        }
    }, [study, activeTab]);

    const loadDocuments = async () => {
        if (!study) return;
        try {
            const docs = await documentService.getDocuments(study.id);
            setDocuments(docs);
        } catch (error) {
            console.error("Failed to load documents", error);
        }
    };

    const getPreviewUrl = (url: string) => {
        if (!url) return '';
        return url;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && study) {
            const file = e.target.files[0];
            try {
                await documentService.uploadDocument(study.id, file, 'Manual upload');
                loadDocuments(); // Refresh list
            } catch (error) {
                console.error("Failed to upload", error);
                alert("Failed to upload document");
            }
        }
    };

    const handleEditDocument = async () => {
        if (editingDoc && editName) {
            try {
                await documentService.updateDocument(editingDoc.id, editName);
                setIsEditModalOpen(false);
                setEditingDoc(null);
                loadDocuments();
            } catch (error) {
                console.error("Update failed", error);
            }
        }
    };

    const handleDeleteDocument = async (docId: number) => {
        if (confirm("Are you sure you want to delete this document?")) {
            try {
                await documentService.deleteDocument(docId);
                loadDocuments();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-4">
                <button
                    onClick={onBack}
                    className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors self-start"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Studies
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                <FlaskConical className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">{study.title}</h1>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {study.protocol_id || study.protocol}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Started {study.start_date || study.startDate}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className={`px - 4 py - 1.5 rounded - full text - sm font - semibold border ${study.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                            study.status === 'Recruiting' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                            } `}>
                            {study.status}
                        </div>
                        <div className="px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            {study.phase}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Total Subjects</span>
                        <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{study.subjects_count || study.subjects}</div>
                    <div className="text-xs text-green-600 flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1" /> +12% this month
                    </div>
                </div>

                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Active Sites</span>
                        <Building2 className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{study.sites_count || study.sites}</div>
                    <div className="text-xs text-gray-500 mt-1">Across 3 regions</div>
                </div>

                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Study Progress</span>
                        <Activity className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{study.completion_percentage || study.completion}%</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${study.completion_percentage || study.completion}% ` }}></div>
                    </div>
                </div>

                <div className="p-4 bg-white border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-500">Pending Actions</span>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-xs text-amber-600 mt-1">3 Critical items</div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['Overview', 'Sites', 'Study Contacts', 'Vendors & Services', 'Documents'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`
whitespace - nowrap py - 4 px - 1 border - b - 2 font - medium text - sm
                                ${activeTab === tab.toLowerCase() || (tab === 'Vendors & Services' && activeTab === 'vendors & services')
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] py-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Study Details Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Study Details</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Protocol ID</p>
                                    <p className="font-medium text-gray-900">{study.protocol_id || study.protocol}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Title</p>
                                    <p className="font-medium text-gray-900">{study.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Therapeutic Area</p>
                                    <p className="font-medium text-gray-900">{study.therapeutic_area || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Indication</p>
                                    <p className="font-medium text-gray-900">{study.indication || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Phase</p>
                                    <p className="font-medium text-gray-900">{study.phase}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <p className="font-medium text-gray-900">{study.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                                    <p className="font-medium text-gray-900">{study.start_date || study.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                                    <p className="font-medium text-gray-900">{study.end_date || '1/1/2025'}</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                <p className="text-gray-900">{study.description || "A phase 3 study for evaluating the efficacy of a new diabetes treatment."}</p>
                            </div>
                        </div>

                        {/* Study Progress Card */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Study Progress</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>Enrollment</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>Timeline</span>
                                        <span>50%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm font-medium mb-1">
                                        <span>Budget</span>
                                        <span>42%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'study contacts' && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Study Contacts</h3>
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                                Add Contact
                            </button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Organization</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Phone</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { name: 'Maria Rodriguez', role: 'Clinical Operations Manager', org: 'Internal', email: 'maria@cboat.example.com', phone: '555-123-4567' },
                                    { name: 'David Park', role: 'Clinical Monitor', org: 'Internal', email: 'david@cboat.example.com', phone: '555-123-4567' },
                                    { name: 'Lisa Wong', role: 'Medical Advisor', org: 'Internal', email: 'lisa@cboat.example.com', phone: '555-123-4567' },
                                    { name: 'Mark Johnson', role: 'Project Manager', org: 'Internal', email: 'mark@cboat.example.com', phone: '555-123-4567' },
                                ].map((contact, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{contact.role}</td>
                                        <td className="px-6 py-4 text-gray-600">{contact.org}</td>
                                        <td className="px-6 py-4 text-blue-600">{contact.email}</td>
                                        <td className="px-6 py-4 text-blue-600">{contact.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {(activeTab === 'vendors & services' || activeTab === 'vendors & services') && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Vendors & Services</h3>
                            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">
                                Add Vendor
                            </button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Trial Role</th>
                                    <th className="px-6 py-3">Contact Person</th>
                                    <th className="px-6 py-3">Contract Status</th>
                                    <th className="px-6 py-3">Timeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { name: 'Parexel', type: 'CRO', role: 'CRO', contact: 'David Miller', status: 'Active', start: '10/1/2023', end: '10/1/2025' },
                                    { name: 'Covance', type: 'Lab', role: 'Central Lab', contact: 'Jennifer Adams', status: 'Active', start: '11/1/2023', end: '11/1/2025' },
                                    { name: 'LabCorp', type: 'Imaging', role: 'Imaging Core', contact: 'Thomas Wilson', status: 'Active', start: '12/1/2023', end: '12/1/2025' },
                                ].map((vendor, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{vendor.type}</td>
                                        <td className="px-6 py-4 text-gray-600">{vendor.role}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{vendor.contact}</div>
                                            <div className="text-xs text-blue-600">contact@example.com</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            <div>Start: {vendor.start}</div>
                                            <div>End: {vendor.end}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Study Documents</h3>
                                <p className="text-sm text-green-600 flex items-center mt-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
                                    eTMF Real-time Sync Active
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-sm text-gray-500 self-center mr-2">Refresh Sync</span>
                                <label className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 flex items-center gap-1">
                                    <Upload className="h-4 w-4" /> Upload Document
                                    <input type="file" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Document Name</th>
                                    <th className="px-6 py-3">Source</th>
                                    <th className="px-6 py-3">Upload Date</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {documents.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                            No documents found. Upload a new document to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <FileText className={`h-5 w-5 ${doc.type === 'pdf' ? 'text-red-500' : 'text-blue-500'}`} />
                                                    <button
                                                        onClick={() => {
                                                            setPreviewDoc(doc);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                        className="font-medium text-blue-600 hover:underline cursor-pointer text-left"
                                                    >
                                                        {doc.name}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`${doc.source === 'eTMF Sync' ? 'text-blue-400' : 'text-gray-600'} font-medium`}>
                                                    {doc.source || 'Manual upload'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(doc.upload_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setPreviewDoc(doc);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                        className="text-gray-500 hover:text-blue-600"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingDoc(doc);
                                                            setEditName(doc.name);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="text-gray-500 hover:text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <a
                                                        href={getPreviewUrl(doc.file_url)}
                                                        download={doc.name}
                                                        className="text-gray-500 hover:text-blue-600"
                                                        title="Download"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteDocument(doc.id)}
                                                        className="text-gray-500 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Document Preview Modal */}
            {isPreviewOpen && previewDoc && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{previewDoc.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Version {previewDoc.version || '1.0'} • Added on {new Date(previewDoc.upload_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={getPreviewUrl(previewDoc.file_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    Open in New Tab
                                </a>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4 overflow-hidden relative">
                            {previewDoc.type === 'pdf' || previewDoc.name.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={getPreviewUrl(previewDoc.file_url)}
                                    className="w-full h-full rounded border bg-white"
                                    title="PDF Preview"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">Preview not available for this file type.</p>
                                        <a
                                            href={getPreviewUrl(previewDoc.file_url)}
                                            download
                                            className="mt-4 inline-block text-blue-600 hover:underline"
                                        >
                                            Download to view
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Document Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit Document</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditDocument}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StudyManagement() {
    const [selectedStudy, setSelectedStudy] = useState<any>(null);
    const [studies, setStudies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>({
        title: '',
        protocol_id: '',
        phase: '',
        status: 'Planned',
        description: '',
        start_date: '',
        end_date: '',
        therapeutic_area: '',
        indication: '',
        sites_count: 0,
        subjects_count: 0,
        completion_percentage: 0
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchStudies();
    }, []);

    const fetchStudies = async () => {
        try {
            const data = await studyService.getStudies();
            setStudies(data);
        } catch (error) {
            console.error("Failed to fetch studies", error);
            // If backend fails, we show empty or alert, don't revert to static mock data 
            // as it confuses the user thinking the create failed.
            alert("Failed to load studies from backend. Please ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStudy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create the study
            const newStudy = await studyService.createStudy({
                ...formData,
                start_date: new Date().toISOString().split('T')[0] // today's date
            });

            // 2. Upload file if selected
            if (selectedFile && newStudy.id) {
                // In a real app, you'd likely link this upload to the study ID
                // For now, we just upload it as per the service we built
                try {
                    await studyService.uploadProtocol(newStudy.id, selectedFile);
                } catch (uploadError) {
                    console.error("File upload failed but study created", uploadError);
                    alert("Study created but file upload failed.");
                }
            }

            // 3. Refresh and close
            await fetchStudies(); // Ensure fetch completes before closing
            setIsModalOpen(false);
            // Reset form
            setFormData({
                title: '',
                protocol_id: '',
                phase: '',
                status: 'Planned',
                description: '',
                start_date: '',
                sites_count: 0,
                subjects_count: 0,
                completion_percentage: 0
            });
            setSelectedFile(null);
        } catch (error: any) {
            console.error("Failed to create study", error);
            const errorMessage = error.response?.data?.detail || error.message || "Failed to create study. Please try again.";
            alert(errorMessage);
        }
    };

    return (
        <div className="p-6 relative">
            <div className="container mx-auto p-6">
                {!selectedStudy ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Study Management</h1>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                New Study
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Toolbar */}
                            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full sm:w-96">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <input
                                        placeholder="Search studies..."
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading studies...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4">Protocol ID</th>
                                                <th className="px-6 py-4">Title</th>
                                                <th className="px-6 py-4">Therapeutic Area</th>
                                                <th className="px-6 py-4">Indication</th>
                                                <th className="px-6 py-4">Phase</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {studies.map((study) => (
                                                <tr key={study.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {study.protocol_id || study.protocol}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-900">
                                                        {study.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {study.therapeutic_area || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {study.indication || '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-gray-900">
                                                            {study.phase}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium ${study.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                            study.status === 'Recruiting' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-amber-100 text-amber-800'
                                                            } `}>
                                                            {study.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedStudy(study)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors mr-2"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Are you sure you want to delete this study? This action cannot be undone and will delete all associated files.')) {
                                                                    try {
                                                                        await studyService.deleteStudy(study.id);
                                                                        fetchStudies();
                                                                    } catch (error) {
                                                                        console.error("Delete failed", error);
                                                                        alert("Failed to delete study");
                                                                    }
                                                                }
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete Study"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                                <span>Showing {studies.length} entries</span>
                                <div className="flex gap-1">
                                    <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                    <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <StudyDetail study={selectedStudy} onBack={() => setSelectedStudy(null)} />
                )}
            </div>

            {/* Create Study Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="text-xl font-bold text-gray-900">Create New Study</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">Fill in the details to add a new clinical trial study to your management system.</p>

                        <form onSubmit={handleCreateStudy} className="space-y-6">

                            {/* Row 1: Protocol ID & Phase */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Protocol ID</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="PRO-123"
                                        value={formData.protocol_id}
                                        onChange={(e) => setFormData({ ...formData, protocol_id: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Unique identifier for the study (e.g., PRO-123, CLIN-2023-01)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Phase</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.phase}
                                        onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                                    >
                                        <option value="" disabled>Select phase</option>
                                        <option>Phase I</option>
                                        <option>Phase II</option>
                                        <option>Phase III</option>
                                        <option>Phase IV</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Clinical trial phase indicating the stage of drug development</p>
                                </div>
                            </div>

                            {/* Row 2: Study Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Study Title</label>
                                <input
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Enter the full study title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">The full official title of the study as it appears in the protocol</p>
                            </div>

                            {/* Row 3: Therapeutic Area & Indication */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Therapeutic Area</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.therapeutic_area || ''}
                                        onChange={(e) => setFormData({ ...formData, therapeutic_area: e.target.value })}
                                    >
                                        <option value="">Select Area</option>
                                        <option>Oncology</option>
                                        <option>Cardiology</option>
                                        <option>Endocrinology</option>
                                        <option>Neurology</option>
                                        <option>Immunology</option>
                                        <option>Infectious Diseases</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Indication</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="e.g. Type 2 Diabetes"
                                        value={formData.indication || ''}
                                        onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Row 4: Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">End Date (Estimated)</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.end_date || ''}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Row 5: Metrics (Sites & Subjects) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Planned Sites</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="0"
                                        value={formData.sites_count}
                                        onChange={(e) => setFormData({ ...formData, sites_count: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">Planned Subjects</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="0"
                                        value={formData.subjects_count}
                                        onChange={(e) => setFormData({ ...formData, subjects_count: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    placeholder="Brief description of the study objectives..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-1">Study Protocol (PDF)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        id="protocol-upload"
                                        onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                                    />
                                    <label htmlFor="protocol-upload" className="cursor-pointer">
                                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-600 font-medium">Click to upload protocol document</p>
                                        <p className="text-xs text-gray-400 mt-1">PDF files only (max 10MB)</p>
                                    </label>
                                    {selectedFile && (
                                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 py-1 px-3 rounded-full inline-flex">
                                            <FileText className="h-4 w-4" />
                                            {selectedFile.name}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                }}
                                                className="ml-2 hover:text-blue-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors"
                                >
                                    Create Study
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

