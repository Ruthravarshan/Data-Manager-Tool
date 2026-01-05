import {
    CircleAlert, Zap, Brain, Search, Filter, ChevronDown, ArrowDown, ExternalLink, Check, Clock
} from 'lucide-react';
import { useState } from 'react';

export default function SignalDetection() {
    // Mock data extracted from user screenshots
    const signals = [
        {
            id: 'SF_Risk_004', type: 'Safety Risk', obs: 'QTc prolongation >15ms from baseline in drug arm', priority: 'Critical',
            study: 'PRO001', detected: 'Dec 30, 2025', due: 'Jan 6, 2026', rec: 'Immediate cardiac assessment, consider protocol amendment for ECG monitoring',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_019', type: 'Safety Risk', obs: 'Blood pressure elevation >15 mmHg systolic', priority: 'High',
            study: 'PRO001', detected: 'Dec 28, 2025', due: 'Jan 11, 2026', rec: 'Implement home BP monitoring, review antihypertensive history',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_025', type: 'Safety Risk', obs: 'ECG T-wave abnormalities in 3 subjects on high dose', priority: 'Critical',
            study: 'PRO003', detected: 'Dec 28, 2025', due: 'Jan 4, 2026', rec: 'Cardiology consultation, continuous ECG monitoring',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'AE_Risk_013', type: 'AE Risk', obs: 'Increased dizziness reports in elderly population (>70 years)', priority: 'High',
            study: 'PRO004', detected: 'Dec 26, 2025', due: 'Jan 9, 2026', rec: 'Neurological assessment, fall risk mitigation strategies',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'PD_Risk_028', type: 'PD Risk', obs: 'Efficacy marker shows minimal change at 4 weeks', priority: 'High',
            study: 'PRO002', detected: 'Dec 26, 2025', due: 'Jan 9, 2026', rec: 'Interim efficacy analysis, dose adjustment consideration',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_029', type: 'Safety Risk', obs: 'Cardiac troponin elevation in 2 elderly subjects', priority: 'Critical',
            study: 'PRO003', detected: 'Dec 26, 2025', due: 'Jan 2, 2026', isOverdue: true, rec: 'Immediate cardiac evaluation, trial suspension consideration',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'LAB_Risk_030', type: 'LAB Testing Risk', obs: 'Hyperkalemia trend in renal impaired subjects', priority: 'High',
            study: 'PRO004', detected: 'Dec 26, 2025', due: 'Jan 9, 2026', rec: 'Electrolyte monitoring increase, medication review',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_035', type: 'Safety Risk', obs: 'Hypersensitivity reactions in 3 subjects after dose 2', priority: 'Critical',
            study: 'PRO001', detected: 'Dec 26, 2025', due: 'Jan 2, 2026', isOverdue: true, rec: 'Allergy/immunology consultation, premedication protocol',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_050', type: 'Safety Risk', obs: 'Hyponatremia in 7% of elderly subjects', priority: 'High',
            study: 'PRO004', detected: 'Dec 26, 2025', due: 'Jan 9, 2026', rec: 'Electrolyte monitoring protocol, fluid intake guidelines',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_001', type: 'Safety Risk', obs: 'Elevated liver enzymes (ALT/AST) in 5 patients, 3x ULN', priority: 'Critical',
            study: 'PRO001', detected: 'Dec 25, 2025', due: 'Jan 1, 2026', isOverdue: true, rec: 'Review patient data immediately, consider dose adjustment',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_009', type: 'Safety Risk', obs: 'Transient neutropenia (<1000/µL) in 3 subjects', priority: 'High',
            study: 'PRO004', detected: 'Dec 25, 2025', due: 'Jan 8, 2026', rec: 'Increase monitoring frequency, review infectious history',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'ST_Risk_026', type: 'Site Risk', obs: 'Protocol deviations at Site 102 exceeded threshold', priority: 'High',
            study: 'PRO004', detected: 'Dec 25, 2025', due: 'Jan 8, 2026', rec: 'For-cause audit, investigator meeting',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_047', type: 'Safety Risk', obs: 'Syncope in 3 subjects with orthostatic hypotension', priority: 'Critical',
            study: 'PRO001', detected: 'Dec 25, 2025', due: 'Jan 1, 2026', isOverdue: true, rec: 'Orthostatic vital sign protocol, fall prevention',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'ST_Risk_005', type: 'Site Risk', obs: 'Site 103 showing reporting delays of SAEs', priority: 'High',
            study: 'PRO004', detected: 'Dec 24, 2025', due: 'Jan 7, 2026', rec: 'Site retraining on SAE reporting timeframes, compliance',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'PD_Risk_007', type: 'PD Risk', obs: 'Drug concentration 40% lower than predicted', priority: 'High',
            study: 'PRO003', detected: 'Dec 23, 2025', due: 'Jan 6, 2026', rec: 'Review PK/PD model, check drug administration records',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_011', type: 'Safety Risk', obs: 'Frequent hypoglycemia events in diabetic subjects', priority: 'Critical',
            study: 'PRO001', detected: 'Dec 23, 2025', due: 'Dec 30, 2025', isOverdue: true, rec: 'Protocol amendment for glucose monitoring',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'SF_Risk_041', type: 'Safety Risk', obs: 'Increased fracture incidence in treatment arm', priority: 'High',
            study: 'PRO003', detected: 'Dec 23, 2025', due: 'Jan 6, 2026', rec: 'Bone density assessment, calcium/vitamin D supplementation',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'PD_Risk_045', type: 'PD Risk', obs: 'Response rate lower in Asian subpopulation', priority: 'High',
            study: 'PRO003', detected: 'Dec 22, 2025', due: 'Jan 5, 2026', rec: 'Pharmacogenomic analysis, dose adjustment considerations',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'ST_Risk_016', type: 'Site Risk', obs: 'Data entry errors at Site 107 (22% above threshold)', priority: 'High',
            study: 'PRO002', detected: 'Dec 21, 2025', due: 'Jan 4, 2026', rec: 'Site audit, retraining on data entry procedures',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'PD_Risk_020', type: 'PD Risk', obs: 'Target engagement 25% below predicted levels', priority: 'High',
            study: 'PRO002', detected: 'Dec 21, 2025', due: 'Jan 4, 2026', rec: 'Review dosing strategy, assess drug-drug interactions',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'PD_Risk_033', type: 'PD Risk', obs: 'Drug-drug interaction with statins suspected', priority: 'High',
            study: 'PRO003', detected: 'Dec 21, 2025', due: 'Jan 4, 2026', rec: 'PK analysis in statin users, protocol amendment',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'LAB_Risk_036', type: 'LAB Testing Risk', obs: 'Thrombocytopenia in 8% of treatment group', priority: 'High',
            study: 'PRO002', detected: 'Dec 21, 2025', due: 'Jan 4, 2026', rec: 'Hematology consultation, bleeding risk assessment',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'PD_Risk_040', type: 'PD Risk', obs: 'Antibody development in 10% of subjects', priority: 'High',
            study: 'PRO002', detected: 'Dec 19, 2025', due: 'Jan 2, 2026', isOverdue: true, rec: 'Immunogenicity assessment, efficacy correlation review',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_015', type: 'Safety Risk', obs: 'Mild hepatic steatosis on imaging in 4 subjects', priority: 'Medium',
            study: 'PRO001', detected: 'Dec 18, 2025', due: 'Jan 8, 2026', rec: 'Hepatology consultation, follow-up imaging schedule',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'AE_Risk_027', type: 'AE Risk', obs: 'Anxiety symptoms reported at 2x the expected rate', priority: 'Medium',
            study: 'PRO001', detected: 'Dec 18, 2025', due: 'Jan 8, 2026', rec: 'Psychiatric assessment tool implementation, analysis',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'ST_Risk_038', type: 'Site Risk', obs: 'Site 104 showing inconsistent vital signs data', priority: 'Medium',
            study: 'PRO004', detected: 'Dec 18, 2025', due: 'Jan 8, 2026', rec: 'Site retraining, equipment calibration verification',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'AE_Risk_017', type: 'AE Risk', obs: 'Sleep disturbance reports increasing weekly', priority: 'Medium',
            study: 'PRO003', detected: 'Dec 17, 2025', due: 'Jan 7, 2026', rec: 'Sleep quality assessment implementation, event log review',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'LAB_Risk_006', type: 'LAB Testing Risk', obs: 'Hemoglobin decrease >2g/dL in 10% of subjects', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 16, 2025', due: 'Jan 6, 2026', rec: 'Monitor for clinical signs of anemia, consider iron study',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'LAB_Risk_018', type: 'LAB Testing Risk', obs: 'Lipid profile worsening trend in treatment arm', priority: 'Medium',
            study: 'PRO004', detected: 'Dec 16, 2025', due: 'Jan 6, 2026', rec: 'Cardiovascular risk assessment, statin use evaluation',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'AE_Risk_037', type: 'AE Risk', obs: 'Visual disturbances reported at higher threshold', priority: 'Medium',
            study: 'PRO003', detected: 'Dec 16, 2025', due: 'Jan 6, 2026', rec: 'Ophthalmology assessment addition, visual acuity test',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'AE_Risk_043', type: 'AE Risk', obs: 'Fatigue reported by 45% vs 22% in control', priority: 'Medium',
            study: 'PRO001', detected: 'Dec 16, 2025', due: 'Jan 6, 2026', rec: 'Quality of life assessment, thyroid function testing',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'AE_Risk_049', type: 'AE Risk', obs: 'Peripheral edema in 18% of treatment group', priority: 'Medium',
            study: 'PRO003', detected: 'Dec 16, 2025', due: 'Jan 6, 2026', rec: 'Cardiac evaluation, sodium restriction guidance',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'AE_Risk_021', type: 'AE Risk', obs: 'GI tolerance issues in 30% of subjects', priority: 'Medium',
            study: 'PRO003', detected: 'Dec 15, 2025', due: 'Jan 5, 2026', rec: 'Modified dosing schedule with food, anti-emetic',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'SF_Risk_032', type: 'Safety Risk', obs: 'Weight loss >7% in 15% of treatment subjects', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 15, 2025', due: 'Jan 5, 2026', rec: 'Nutritional assessment, caloric intake monitoring',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_039', type: 'Safety Risk', obs: 'Prolonged cough in 25% of subjects vs 5% control', priority: 'Medium',
            study: 'PRO001', detected: 'Dec 15, 2025', due: 'Jan 5, 2026', rec: 'Pulmonary function testing, respiratory assessment',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'LAB_Risk_002', type: 'LAB Testing Risk', obs: 'Creatinine elevation pattern in elderly subjects', priority: 'High',
            study: 'PRO002', detected: 'Dec 14, 2025', due: 'Dec 28, 2025', isOverdue: true, rec: 'Check renal function across cohort, review concomitants',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'AE_Risk_003', type: 'AE Risk', obs: 'Increased incidence of headache (32% vs 15%)', priority: 'Medium',
            study: 'PRO003', detected: 'Dec 14, 2025', due: 'Jan 4, 2026', rec: 'Monitor neurological symptoms, correlate with dosing',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'LAB_Risk_048', type: 'LAB Testing Risk', obs: 'Hypophosphatemia in 12% of subjects on high dose', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 14, 2025', due: 'Jan 4, 2026', rec: 'Mineral supplement consideration, bone metabolism test',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_022', type: 'Safety Risk', obs: 'Increased ALT without AST elevation in 5 subjects', priority: 'Medium',
            study: 'PRO004', detected: 'Dec 13, 2025', due: 'Jan 3, 2026', rec: 'Hepatic safety monitoring, rule out muscle origin',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'LAB_Risk_024', type: 'LAB Testing Risk', obs: 'Urinalysis showing protein pattern in 12% of subjects', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 11, 2025', due: 'Jan 1, 2026', isOverdue: true, rec: 'Renal function monitoring, protein/creatinine ratio',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'AE_Risk_008', type: 'AE Risk', obs: 'Rash reported in 15% of subjects on active drug', priority: 'Medium',
            study: 'PRO001', detected: 'Dec 8, 2025', due: 'Dec 29, 2025', isOverdue: true, rec: 'Dermatologist consultation, photo documentation',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'LAB_Risk_012', type: 'LAB Testing Risk', obs: 'Elevated CRP levels correlating with joint pain', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 8, 2025', due: 'Dec 29, 2025', isOverdue: true, rec: 'Additional inflammatory markers assessment, exam',
            assignee: 'Medical Monitor', status: 'In Progress'
        },
        {
            id: 'SF_Risk_044', type: 'Safety Risk', obs: 'Tinnitus reported by 5 subjects on high dose', priority: 'Medium',
            study: 'PRO002', detected: 'Dec 8, 2025', due: 'Dec 29, 2025', isOverdue: true, rec: 'Audiology assessment, dose reduction consideration',
            assignee: 'Medical Monitor', status: 'Open'
        },
        {
            id: 'ENR_Risk_046', type: 'Enrollment Risk', obs: 'Elderly subject recruitment at 30% of target', priority: 'Low',
            study: 'PRO004', detected: 'Dec 8, 2025', due: 'Jan 7, 2026', rec: 'Geriatric site outreach, inclusion criteria review',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'PD_Risk_014', type: 'PD Risk', obs: 'Biomarker response shows plateau effect at mid-dose', priority: 'Low',
            study: 'PRO003', detected: 'Dec 5, 2025', due: 'Jan 4, 2026', rec: 'Assess dose-response curve, consider intermediate dose',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'LAB_Risk_042', type: 'LAB Testing Risk', obs: 'Uric acid elevation in 30% of treatment group', priority: 'Low',
            study: 'PRO004', detected: 'Dec 3, 2025', due: 'Jan 2, 2026', isOverdue: true, rec: 'Gout risk assessment, hydration guidance',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'ENR_Risk_034', type: 'Enrollment Risk', obs: 'Female participants underrepresented (28%)', priority: 'Low',
            study: 'PRO004', detected: 'Dec 1, 2025', due: 'Dec 31, 2025', isOverdue: true, rec: 'Gender-specific recruitment strategies, site support',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'AE_Risk_031', type: 'AE Risk', obs: 'Injection site reactions in 40% of subjects', priority: 'Low',
            study: 'PRO001', detected: 'Nov 30, 2025', due: 'Dec 30, 2025', isOverdue: true, rec: 'Injection technique review, topical management',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'ENR_Risk_010', type: 'Enrollment Risk', obs: 'Site 105 enrollment 45% below target', priority: 'Low',
            study: 'PRO002', detected: 'Nov 28, 2025', due: 'Dec 28, 2025', isOverdue: true, rec: 'Site support intervention, recruitment strategy',
            assignee: 'Medical Monitor', status: 'Closed'
        },
        {
            id: 'ENR_Risk_023', type: 'Enrollment Risk', obs: 'Screen failure rate 35% above predicted', priority: 'Low',
            study: 'PRO001', detected: 'Nov 28, 2025', due: 'Dec 28, 2025', isOverdue: true, rec: 'Inclusion/exclusion criteria review, pre-screening log',
            assignee: 'Medical Monitor', status: 'Closed'
        }
    ];

    const [priorityFilter, setPriorityFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Medium': return 'bg-amber-100 text-amber-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-purple-100 text-purple-800';
            case 'Closed': return 'bg-emerald-100 text-emerald-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredSignals = signals.filter(signal => {
        const matchesPriority = priorityFilter === 'All' || signal.priority === priorityFilter;
        const matchesStatus = statusFilter === 'All' || signal.status === statusFilter;
        const matchesSearch = searchTerm === '' || signal.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesPriority && matchesStatus && matchesSearch;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSignals = filteredSignals.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);

    // Dynamic stats calculation based on filtered results
    const totalSignals = filteredSignals.length;
    const criticalSignals = filteredSignals.filter(s => s.priority === 'Critical').length;
    const overdueSignals = filteredSignals.filter(s => s.isOverdue).length;
    const openSignals = filteredSignals.filter(s => s.status === 'Open').length;

    // Reset pagination when filters change
    const updatePriorityFilter = (value: string) => {
        setPriorityFilter(value);
        setCurrentPage(1);
    };

    const updateStatusFilter = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const updateSearchTerm = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setPriorityFilter('All');
        setStatusFilter('All');
        setSearchTerm('');
        setCurrentPage(1);
    };

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
                                        <div className="text-3xl font-bold text-blue-700 mb-1">{totalSignals}</div>
                                        <div className="text-sm text-gray-600">Total Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-red-50 to-white border-red-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-red-700 mb-1">{criticalSignals}</div>
                                        <div className="text-sm text-gray-600">Critical Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-amber-50 to-white border-amber-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-amber-700 mb-1">{overdueSignals}</div>
                                        <div className="text-sm text-gray-600">Overdue Signals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-gradient-to-br from-purple-50 to-white border-purple-100">
                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-3xl font-bold text-purple-700 mb-1">{openSignals}</div>
                                        <div className="text-sm text-gray-600">Open Signals</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6 z-10 relative">
                            <div className="flex-1 min-w-[240px]">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                        placeholder="Search signals..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => updateSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-[160px] relative">
                                <button
                                    onClick={() => {
                                        setShowPriorityDropdown(!showPriorityDropdown);
                                        setShowStatusDropdown(false);
                                    }}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{priorityFilter === 'All' ? 'All Priority' : priorityFilter}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                                {showPriorityDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-full rounded-md border bg-white shadow-lg z-50 py-1">
                                        {['All', 'Critical', 'High', 'Medium', 'Low'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    updatePriorityFilter(option);
                                                    setShowPriorityDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                                            >
                                                <span>{option === 'All' ? 'All Priorities' : option}</span>
                                                {priorityFilter === option && <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-[160px] relative">
                                <button
                                    onClick={() => {
                                        setShowStatusDropdown(!showStatusDropdown);
                                        setShowPriorityDropdown(false);
                                    }}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <div className="flex items-center">
                                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{statusFilter === 'All' ? 'All Status' : statusFilter}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                                {showStatusDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-full rounded-md border bg-white shadow-lg z-50 py-1">
                                        {['All', 'Open', 'In Progress', 'Closed'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    updateStatusFilter(option);
                                                    setShowStatusDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                                            >
                                                <span>{option === 'All' ? 'All Statuses' : option}</span>
                                                {statusFilter === option && <Check className="h-3.5 w-3.5" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                            >
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
                                        {currentSignals.map((signal, i) => (
                                            <tr key={i} className="border-b transition-colors hover:bg-blue-50 cursor-pointer group">
                                                <td className="p-4 align-middle font-medium">{signal.id}</td>
                                                <td className="p-4 align-middle">{signal.type}</td>
                                                <td className="p-4 align-middle max-w-[300px] truncate" title={signal.obs}>{signal.obs}</td>
                                                <td className="p-4 align-middle">
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getPriorityStyle(signal.priority)}`}>
                                                        {signal.priority}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">{signal.study}</td>
                                                <td className="p-4 align-middle">{signal.detected}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={signal.isOverdue ? "text-red-500 font-medium flex items-center" : ""}>
                                                        {signal.due}
                                                        {signal.isOverdue && <Clock className="ml-1.5 h-3.5 w-3.5" />}
                                                    </span>
                                                </td>
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
                                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusStyle(signal.status)}`}>
                                                        {signal.status === 'Closed' && <Check className="mr-1 h-3 w-3" />}
                                                        {signal.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground px-4">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSignals.length)} of {filteredSignals.length} signals
                            </div>
                            <div className="space-x-2 px-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
