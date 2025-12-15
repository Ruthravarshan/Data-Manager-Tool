import {
    FlaskConical, Search, Filter, MoreHorizontal, Plus,
    Users, Building2, FileText
} from 'lucide-react';

const studies = [
    {
        id: "ST-001",
        title: "Diabetes Type 2 Study",
        protocol: "DT2-2024-PH3",
        phase: "Phase III",
        status: "Active",
        sites: 28,
        subjects: 342,
        startDate: "Jan 15, 2024",
        description: "Investigating efficacy of GLP-1 receptor agonists in glycemic control for T2DM patients"
    },
    {
        id: "ST-002",
        title: "Rheumatoid Arthritis Study",
        protocol: "RA-2024-PH2",
        phase: "Phase II",
        status: "Recruiting",
        sites: 15,
        subjects: 187,
        startDate: "Feb 01, 2024",
        description: "Evaluation of JAK inhibitor in moderate to severe rheumatoid arthritis"
    },
    {
        id: "ST-003",
        title: "Advanced Breast Cancer",
        protocol: "ABC-2023-PH3",
        phase: "Phase III",
        status: "Active",
        sites: 32,
        subjects: 274,
        startDate: "Nov 10, 2023",
        description: "CDK4/6 inhibitor combination therapy in HR+/HER2- advanced breast cancer"
    },
    {
        id: "ST-004",
        title: "Alzheimer's Disease",
        protocol: "AD-2024-PH2",
        phase: "Phase II",
        status: "Startup",
        sites: 12,
        subjects: 156,
        startDate: "Mar 20, 2024",
        description: "Beta-amyloid monoclonal antibody for early-stage Alzheimer's disease"
    }
];

export default function StudyManagement() {
    return (
        <div className="p-6">
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Study Management</h1>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Study Name</th>
                                    <th className="px-6 py-4">Protocol ID</th>
                                    <th className="px-6 py-4">Phase</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Sites & Subjects</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {studies.map((study) => (
                                    <tr key={study.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                    <FlaskConical className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{study.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-xs">{study.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                {study.protocol}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {study.phase}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${study.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                study.status === 'Recruiting' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                {study.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="h-3 w-3 text-gray-400" />
                                                    {study.sites} Sites
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3 text-gray-400" />
                                                    {study.subjects} Subjects
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                        <span>Showing 1 to 4 of 4 entries</span>
                        <div className="flex gap-1">
                            <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                            <button disabled className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
