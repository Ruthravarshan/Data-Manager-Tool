import {
    CircleAlert, Zap, Brain, Search, Filter, ChevronDown, ArrowDown, ExternalLink
} from 'lucide-react';

export default function SignalDetection() {
    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Signal Detection</h1>
                        <p className="text-neutral-500 mt-1">Monitor and manage risk signals across clinical trials</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <CircleAlert className="mr-2 h-4 w-4" />
                            Manual Detection
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3">
                            <Zap className="mr-2 h-4 w-4" />
                            Auto Detection
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-lg flex items-center">
                            <Brain className="mr-2 h-5 w-5 text-blue-600" />
                            AI-Detected Signals
                        </h3>
                        <p className="text-sm text-muted-foreground">Signals automatically detected by AI analysis across clinical trial data</p>
                    </div>
                    <div className="p-6 pt-0 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-blue-50 to-white border-blue-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-blue-700 mb-1">50</div>
                                        <div className="text-sm text-gray-600">Total Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-red-50 to-white border-red-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-red-700 mb-1">7</div>
                                        <div className="text-sm text-gray-600">Critical Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-amber-50 to-white border-amber-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-amber-700 mb-1">22</div>
                                        <div className="text-sm text-gray-600">Overdue Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-purple-50 to-white border-purple-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-purple-700 mb-1">20</div>
                                        <div className="text-sm text-gray-600">Open Signals</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="flex-1 min-w-[240px]">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9" placeholder="Search signals..." type="text" />
                                </div>
                            </div>
                            <div className="w-[160px]">
                                <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>All Priority</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </div>
                            <div className="w-[160px]">
                                <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>All Status</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                            </div>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                Clear Filters
                            </button>
                        </div>

                        <div className="rounded-md border overflow-hidden">
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px] cursor-pointer">Signal ID</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">Type</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">Observation</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[110px] cursor-pointer">Priority</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px] cursor-pointer">Study</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px] cursor-pointer">
                                                <div className="flex items-center">
                                                    Detected
                                                    <ArrowDown className="ml-1 h-4 w-4" />
                                                </div>
                                            </th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px] cursor-pointer">Due Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]">Recommendation</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px]">Assigned To</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[120px] cursor-pointer">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {[
                                            {
                                                id: 'SF_Risk_004', type: 'Safety Risk', obs: 'QTc prolongation >15ms from baseline in drug arm', priority: 'Critical',
                                                study: 'PRO001', detected: 'Dec 9, 2025', due: 'Dec 16, 2025', rec: 'Immediate cardiac assessment, consider protocol amendment for ECG monitoring',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'red'
                                            },
                                            {
                                                id: 'SF_Risk_011', type: 'Safety Risk', obs: 'Frequent hypoglycemia events in diabetic subjects', priority: 'Critical',
                                                study: 'PRO001', detected: 'Dec 8, 2025', due: 'Dec 15, 2025', rec: 'Protocol amendment for glucose monitoring, dietary guidance implementation',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'red'
                                            },
                                            {
                                                id: 'SF_Risk_047', type: 'Safety Risk', obs: 'Syncope in 3 subjects with orthostatic hypotension', priority: 'Critical',
                                                study: 'PRO001', detected: 'Dec 8, 2025', due: 'Dec 15, 2025', rec: 'Orthostatic vital sign protocol, fall prevention guidance',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'red'
                                            },
                                            {
                                                id: 'SF_Risk_025', type: 'Safety Risk', obs: 'ECG T-wave abnormalities in 3 subjects on high dose', priority: 'Critical',
                                                study: 'PRO003', detected: 'Dec 6, 2025', due: 'Dec 13, 2025', rec: 'Cardiology consultation, continuous ECG monitoring consideration',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'red'
                                            },
                                            {
                                                id: 'SF_Risk_001', type: 'Safety Risk', obs: 'Elevated liver enzymes (ALT/AST) in 5 patients, 3x ULN', priority: 'Critical',
                                                study: 'PRO001', detected: 'Dec 4, 2025', due: 'Dec 11, 2025', rec: 'Review patient data immediately, consider dosing adjustment',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'red'
                                            },
                                            {
                                                id: 'AE_Risk_013', type: 'AE Risk', obs: 'Increased dizziness reports in elderly population (>70 years)', priority: 'High',
                                                study: 'PRO004', detected: 'Dec 4, 2025', due: 'Dec 18, 2025', rec: 'Neurological assessment, fall risk mitigation strategies',
                                                assignee: 'Medical Monitor', status: 'Open', color: 'orange'
                                            }
                                        ].map((signal, i) => (
                                            <tr key={i} className="border-b transition-colors hover:bg-blue-50 cursor-pointer group">
                                                <td className="p-4 align-middle font-medium">{signal.id}</td>
                                                <td className="p-4 align-middle">{signal.type}</td>
                                                <td className="p-4 align-middle max-w-[300px] truncate" title={signal.obs}>{signal.obs}</td>
                                                <td className="p-4 align-middle">
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 ${signal.color === 'red' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {signal.priority}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{signal.study}</td>
                                                <td className="p-4 align-middle">{signal.detected}</td>
                                                <td className="p-4 align-middle">{signal.due}</td>
                                                <td className="p-4 align-middle max-w-[300px] truncate relative" title={signal.rec}>
                                                    <div className="flex items-center justify-between">
                                                        <span>{signal.rec}</span>
                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 transform -translate-y-1/2 transition-opacity">
                                                            <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{signal.assignee}</td>
                                                <td className="p-4 align-middle">
                                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-blue-100 text-blue-800">
                                                        {signal.status}
                                                    </div>
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
