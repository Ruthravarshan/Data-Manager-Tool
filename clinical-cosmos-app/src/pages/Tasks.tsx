import {
    User, ClipboardList, Plus, Search, ChevronDown, ArrowUpDown, FileText, Clock, X, MessageSquare, AlertCircle, BarChart2, RotateCcw, Check
} from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';

const TASK_DATA = [
    {
        taskID: 'CRA-1759413490216-fruzcc',
        queryID: 'N/A',
        title: 'Document deviation, assess data impact, implement corrective action',
        description: '[CLOSED] Subject MGH-007 Visit 4 conducted 6 days outside protocol-defined window (±3 days). May impact efficacy assessments. Automatically closed by Data Manager.AI after verification that issues were resolved.',
        priority: 'medium',
        status: 'Closed',
        assignedTo: { name: 'Sarah Johnson (CRA)', initial: 'SJ' },
        createdDate: 'Oct 2, 2025',
        dueDate: 'Jan 23, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Diabetes Type 2 Study',
        domain: 'protocol_compliance',
        recordID: 'PC-001',
        source: 'CRA Agent',
        dataContext: {
            agentType: 'protocol_compliance',
            outcomeId: 'PC-001',
            actionType: 'protocol_compliance',
            confidence: '0.85',
            businessImpact: 'Potential impact on primary endpoint analysis'
        },
        responses: [
            {
                user: { name: 'System Administrator', initial: 'SA' },
                time: 'Oct 28, 2025 9:45 PM',
                message: 'Test'
            },
            {
                user: { name: 'Data Manager.AI', initial: 'S' },
                time: 'Oct 28, 2025 9:45 PM',
                message: '**Task Closed**: This task has been closed at 10/28/2025, 4:15:37 PM. The issue has been resolved. No further action is needed. This notification was generated automatically by Data Manager.AI',
                isAuto: true
            }
        ]
    },
    {
        taskID: 'CRA-1755587216558-iwand7',
        queryID: 'N/A',
        title: 'Obtain IRB approval for protocol amendment v3.2',
        description: '[CLOSED] Site 1002 has not submitted IRB approval for protocol amendment v3.2. This blocks patient enrollment. Automatically closed by Data Manager.AI after verification that issues were resolved.',
        priority: 'high',
        status: 'Closed',
        assignedTo: { name: 'Sarah Johnson (CRA)', initial: 'SJ' },
        createdDate: 'Aug 19, 2025',
        dueDate: 'Jan 25, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Diabetes Type 2 Study',
        domain: 'site_initiation',
        recordID: 'SI-001',
        source: 'CRA Agent'
    },
    {
        taskID: 'CRA-1759413977078-cbeyet',
        queryID: 'N/A',
        title: 'Obtain IRB approval for protocol amendment v3.2',
        description: 'Site 1002 has not submitted IRB approval for protocol amendment v3.2. This blocks patient enrollment.',
        priority: 'high',
        status: 'Not Started',
        assignedTo: { name: 'Sarah Johnson (CRA)', initial: 'SJ' },
        createdDate: 'Oct 2, 2025',
        dueDate: 'Jan 26, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Diabetes Type 2 Study',
        domain: 'site_initiation',
        recordID: 'SI-001',
        source: 'CRA Agent'
    },
    {
        taskID: 'CRA-1759413993862-vjbm9a',
        queryID: 'N/A',
        title: 'Complete site qualification visit and staff training',
        description: 'Site 1003 has 0/6 staff members trained. Site qualification visit needed before activation.',
        priority: 'critical',
        status: 'Not Started',
        assignedTo: { name: 'Michael Chen (CRA)', initial: 'MC' },
        createdDate: 'Oct 2, 2025',
        dueDate: 'Feb 2, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Diabetes Type 2 Study',
        domain: 'site_initiation',
        recordID: 'SI-002',
        source: 'CRA Agent'
    },
    {
        taskID: 'TASK_8047556',
        queryID: '531',
        title: 'Fix LB out_of_range',
        description: '[CLOSED] Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was manually created by the direct test. Automatically closed by Data Manager.AI after verification that issues were resolved.',
        priority: 'Critical',
        status: 'Closed',
        assignedTo: { name: 'Data Manager', initial: 'DM' },
        createdDate: 'Apr 29, 2025',
        dueDate: 'Apr 30, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-3',
        source: 'EDC'
    },
    {
        taskID: 'TASK_8833383',
        queryID: '532',
        title: 'Fix LB out_of_range',
        description: '[CLOSED] Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was manually created by the direct test. Automatically closed by Data Manager.AI after verification that issues were resolved.',
        priority: 'Critical',
        status: 'Closed',
        assignedTo: { name: 'Data Manager', initial: 'DM' },
        createdDate: 'Apr 29, 2025',
        dueDate: 'Apr 30, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-3',
        source: 'EDC'
    },
    {
        taskID: 'TASK_205853',
        queryID: '534',
        title: 'Fix LB out of range',
        description: 'Lab value 120 is outside normal range (7-20) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-1',
        source: 'EDC'
    },
    {
        taskID: 'TASK_206606',
        queryID: '536',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-3',
        source: 'EDC'
    },
    {
        taskID: 'TASK_207258',
        queryID: '538',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-2',
        source: 'EDC'
    },
    {
        taskID: 'TASK_207908',
        queryID: '540',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-4',
        source: 'EDC'
    },
    {
        taskID: 'TASK_208572',
        queryID: '542',
        title: 'Fix LB out of range',
        description: 'Lab value 30 is outside normal range (70-115) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-5',
        source: 'EDC'
    },
    {
        taskID: 'TASK_209195',
        queryID: '544',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-6',
        source: 'EDC'
    },
    {
        taskID: 'TASK_209827',
        queryID: '546',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-7',
        source: 'EDC'
    },
    {
        taskID: 'TASK_210508',
        queryID: '548',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-8',
        source: 'EDC'
    },
    {
        taskID: 'TASK_211143',
        queryID: '550',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-9',
        source: 'EDC'
    },
    {
        taskID: 'TASK_211782',
        queryID: '552',
        title: 'Fix LB out of range',
        description: 'Lab value 999 is outside normal range (0-100) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-11',
        source: 'EDC'
    },
    {
        taskID: 'TASK_214448',
        queryID: '560',
        title: 'Fix LB out of range',
        description: 'Lab value 99.9 is outside normal range (13-17) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'LB-EDC-3-1-50',
        source: 'EDC'
    },
    {
        taskID: 'TASK_448275',
        queryID: '562',
        title: 'Fix LB out of range',
        description: 'Lab value 250 is outside normal range (5-20) Recommended Action: Review out-of-range lab value and verify clinical significance This task was auto-generated by DataManager.AI based on data quality checks.',
        priority: 'Critical',
        status: 'Not Started',
        assignedTo: { name: 'Lab Data Manager', initial: 'LDM' },
        createdDate: 'Apr 30, 2025',
        dueDate: 'May 1, 2025',
        dueIn: '-',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'LB',
        recordID: 'TEST_MIDDLEWARE_BUN_HIGH',
        source: 'EDC'
    },
    // Synthetic data to ensure each dropdown has 3-4 rows
    {
        taskID: 'TASK-ONCO-001',
        queryID: '901',
        title: 'Review combination dosage',
        description: 'Dosage for drug A and B exceeds safety threshold in combination.',
        priority: 'Low',
        status: 'Assigned',
        assignedTo: { name: 'John Doe', initial: 'JD' },
        createdDate: 'Dec 1, 2025',
        dueDate: 'Dec 15, 2025',
        dueIn: '14 days',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Oncology Combination Therapy',
        domain: 'safety',
        recordID: 'SF-001',
        source: 'CRA Agent'
    },
    {
        taskID: 'TASK-ONCO-002',
        queryID: '902',
        title: 'Verify tumor measurement',
        description: 'RECIST measurement seems inconsistent with prior scans.',
        priority: 'Medium',
        status: 'In Progress',
        assignedTo: { name: 'Alice Smith', initial: 'AS' },
        createdDate: 'Dec 2, 2025',
        dueDate: 'Dec 10, 2025',
        dueIn: '8 days',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Oncology Combination Therapy',
        domain: 'imaging',
        recordID: 'IM-001',
        source: 'EDC'
    },
    {
        taskID: 'TASK-ONCO-003',
        queryID: '903',
        title: 'Patient consent missing',
        description: 'Uploaded consent form is missing signature on page 4.',
        priority: 'High',
        status: 'Under Review',
        assignedTo: { name: 'Bob Wilson', initial: 'BW' },
        createdDate: 'Dec 3, 2025',
        dueDate: 'Dec 5, 2025',
        dueIn: '2 days',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Oncology Combination Therapy',
        domain: 'compliance',
        recordID: 'CP-001',
        source: 'CRA Agent'
    },
    {
        taskID: 'TASK-ONCO-004',
        queryID: 'N/A',
        title: 'Site activation pending',
        description: 'All documents received except site insurance certificate.',
        priority: 'Medium',
        status: 'Reopened',
        assignedTo: { name: 'Michael Chen (CRA)', initial: 'MC' },
        createdDate: 'Dec 4, 2025',
        dueDate: 'Dec 20, 2025',
        dueIn: '16 days',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Oncology Combination Therapy',
        domain: 'site_initiation',
        recordID: 'SI-005',
        source: 'CRA Agent'
    },
    {
        taskID: 'TASK-DIAB-005',
        queryID: '101',
        title: 'HbA1c value verification',
        description: 'Entry 15.2% exceeds physiological limit.',
        priority: 'Critical',
        status: 'Responded',
        assignedTo: { name: 'Sarah Johnson (CRA)', initial: 'SJ' },
        createdDate: 'Jan 5, 2026',
        dueDate: 'Jan 6, 2026',
        dueIn: '1 day',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Diabetes Type 2 Study',
        domain: 'vital_signs',
        recordID: 'VS-001',
        source: 'EDC'
    },
    {
        taskID: 'TASK-CARD-006',
        queryID: '202',
        title: 'ECG tracing unclear',
        description: 'Uploaded ECG image has significant artifacts.',
        priority: 'Low',
        status: 'Completed',
        assignedTo: { name: 'Data Manager', initial: 'DM' },
        createdDate: 'Jan 10, 2026',
        dueDate: 'Jan 15, 2026',
        dueIn: '5 days',
        createdBy: 'Manual',
        assignedBy: 'Data Manager',
        study: 'Cardiovascular Outcomes Study',
        domain: 'imaging',
        recordID: 'IM-005',
        source: 'EDC'
    },
    {
        taskID: 'TASK-SA-007',
        queryID: '303',
        title: 'Review production logs for data sync issues',
        description: 'Partial sync observed in Site 1005 for the Oncology study. Require manual verification of record IDs.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: { name: 'System Administrator', initial: 'SA' },
        createdDate: 'Jan 2, 2026',
        dueDate: 'Jan 5, 2026',
        dueIn: '2 days',
        createdBy: 'System',
        assignedBy: 'Auto-scheduler',
        study: 'Oncology Combination Therapy',
        domain: 'integration',
        recordID: 'INT-001',
        source: 'System Log'
    },
    {
        taskID: 'TASK-SA-008',
        queryID: 'N/A',
        title: 'Update user permissions for new study lead',
        description: 'New Principal Investigator added to Cardiovascular study. Update access rights in the system portal.',
        priority: 'Medium',
        status: 'Assigned',
        assignedTo: { name: 'System Administrator', initial: 'SA' },
        createdDate: 'Jan 3, 2026',
        dueDate: 'Jan 4, 2026',
        dueIn: '24 hours',
        createdBy: 'Manual',
        assignedBy: 'John Doe',
        study: 'Cardiovascular Outcomes Study',
        domain: 'access_control',
        recordID: 'AC-005',
        source: 'Request Portal'
    }
];

export default function Tasks() {
    const [activeTab, setActiveTab] = useState('All Queries & Tasks');
    const [activeResponseTab, setActiveResponseTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showExportToast, setShowExportToast] = useState(false);
    const [filters, setFilters] = useState({
        priority: 'All Priorities',
        status: 'All Statuses',
        study: 'All Studies',
        type: 'All Types'
    });

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('Task Details');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const filteredTasks = useMemo(() => {
        return TASK_DATA.filter((task) => {
            const matchesSearch =
                task.taskID.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.queryID.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesPriority = filters.priority === 'All Priorities' || task.priority.toLowerCase() === filters.priority.toLowerCase();
            const matchesStatus = filters.status === 'All Statuses' || task.status.toLowerCase() === filters.status.toLowerCase();
            const matchesStudy = filters.study === 'All Studies' || task.study === filters.study;
            const matchesType = filters.type === 'All Types' || (filters.type === 'N/A' && task.queryID === 'N/A');

            const matchesTab =
                activeTab === 'All Queries & Tasks' ||
                (activeTab === 'Assigned to Me' && task.assignedTo.name === 'System Administrator') ||
                (activeTab === 'Created by Me' && task.createdBy === 'Manual') || // Simplified logic for demo
                (activeTab === 'Responded' && task.status === 'Responded');

            return matchesSearch && matchesPriority && matchesStatus && matchesStudy && matchesType && matchesTab;
        });
    }, [searchQuery, filters, activeTab]);

    const filteredResponses = useMemo(() => {
        if (!selectedTask || !selectedTask.responses) return [];
        return selectedTask.responses.filter((resp: any) => {
            if (activeResponseTab === 'All') return true;
            if (activeResponseTab === 'Assigned to Me') return resp.user.name === 'System Administrator';
            if (activeResponseTab === 'Created by Me') return !resp.isAuto && resp.user.name !== 'Data Manager.AI';
            if (activeResponseTab === 'Responded') return resp.isAuto;
            return true;
        });
    }, [selectedTask, activeResponseTab]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setOpenDropdown(null);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setFilters({
            priority: 'All Priorities',
            status: 'All Statuses',
            study: 'All Studies',
            type: 'All Types'
        });
        setActiveTab('All Queries & Tasks');
    };

    const handleExport = () => {
        setShowExportToast(true);
        setTimeout(() => setShowExportToast(false), 3000);
    };

    const priorities = ['All Priorities', 'Critical', 'High', 'Medium', 'Low'];
    const statuses = ['All Statuses', 'Not Started', 'Assigned', 'In Progress', 'Responded', 'Under Review', 'Reopened', 'Completed', 'Closed'];
    const studies = ['All Studies', 'Diabetes Type 2 Study', 'Cardiovascular Outcomes Study', 'Oncology Combination Therapy'];
    const types = ['All Types', 'N/A'];

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Query & Task Workflow Management</h1>
                        <p className="text-neutral-500 mt-1">Manage and track queries and tasks across clinical trials and stakeholders</p>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
                            <User className="h-5 w-5 text-neutral-800" />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-neutral-800 leading-tight">System</span>
                                <span className="text-sm font-bold text-neutral-800 leading-tight">Administrator</span>
                            </div>
                        </div>
                        <button
                            onClick={handleExport}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-4"
                        >
                            <ClipboardList className="mr-1 h-4 w-4" />
                            Export
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 rounded-md px-4 shadow-sm">
                            <Plus className="mr-1 h-4 w-4" />
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
                                        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                                        activeTab === tab ? "bg-white text-blue-700 shadow-sm" : "hover:bg-blue-100 hover:text-blue-800"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white overflow-hidden">
                    <div className="flex flex-col space-y-1.5 p-6 pb-0">
                        <div className="flex flex-col lg:flex-row justify-between gap-4 pb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 w-full"
                                    placeholder="Search by ID, title, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {/* Priority Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'priority' ? null : 'priority')}
                                        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[140px]"
                                    >
                                        <span className="line-clamp-1">{filters.priority}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                    {openDropdown === 'priority' && (
                                        <div className="absolute z-10 mt-1 w-[140px] rounded-md border bg-white shadow-lg">
                                            {priorities.map(p => (
                                                <div
                                                    key={p}
                                                    onClick={() => handleFilterChange('priority', p)}
                                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                                                >
                                                    {p}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                                        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[140px]"
                                    >
                                        <span className="line-clamp-1">{filters.status}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                    {openDropdown === 'status' && (
                                        <div className="absolute z-10 mt-1 w-[140px] rounded-md border bg-white shadow-lg overflow-hidden">
                                            {statuses.map(s => (
                                                <div
                                                    key={s}
                                                    onClick={() => handleFilterChange('status', s)}
                                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Study Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'study' ? null : 'study')}
                                        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"
                                    >
                                        <span className="line-clamp-1">{filters.study}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                    {openDropdown === 'study' && (
                                        <div className="absolute z-10 mt-1 w-[180px] rounded-md border bg-white shadow-lg">
                                            {studies.map(s => (
                                                <div
                                                    key={s}
                                                    onClick={() => handleFilterChange('study', s)}
                                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                                                >
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Type Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                                        className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[120px]"
                                    >
                                        <span className="line-clamp-1">{filters.type}</span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </button>
                                    {openDropdown === 'type' && (
                                        <div className="absolute z-10 mt-1 w-[120px] rounded-md border bg-white shadow-lg">
                                            {types.map(t => (
                                                <div
                                                    key={t}
                                                    onClick={() => handleFilterChange('type', t)}
                                                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                                                >
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-2 text-neutral-500 hover:text-blue-600 font-semibold px-4 py-2 hover:bg-neutral-50 rounded-md transition-all border border-transparent hover:border-blue-100"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-0 overflow-x-auto">
                        <div className="border rounded-lg min-w-[1600px]">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="bg-[#FAFBFC] border-b">
                                    <tr>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </th>
                                        {[
                                            'Task ID', 'Query ID', 'Title', 'Priority', 'Status', 'Assigned To',
                                            'Created Date', 'Due Date', 'Due in', 'Created by', 'Assigned by',
                                            'Study', 'Domain', 'Record ID', 'Source', 'Actions'
                                        ].map((header) => (
                                            <th key={header} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                                                <div className="flex items-center cursor-pointer hover:text-neutral-900">
                                                    {header}
                                                    {header !== 'Actions' && header !== 'Assigned To' && header !== 'Created by' && header !== 'Assigned by' && header !== 'Study' && header !== 'Due in' && <ArrowUpDown className="ml-1 h-3 w-3" />}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0 bg-white">
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map((item, i) => (
                                            <tr
                                                key={i}
                                                onClick={() => {
                                                    setSelectedTask(item);
                                                    setIsModalOpen(true);
                                                    setActiveModalTab('Task Details');
                                                }}
                                                className="border-b transition-colors hover:bg-blue-50 cursor-pointer"
                                            >
                                                <td className="p-4 align-middle w-[50px]" onClick={(e) => e.stopPropagation()}>
                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                </td>
                                                <td className="p-4 align-middle font-medium text-neutral-800">{item.taskID}</td>
                                                <td className="p-4 align-middle text-blue-600">{item.queryID}</td>
                                                <td className="p-4 align-middle max-w-sm">
                                                    <div className="font-semibold text-neutral-800 leading-tight mb-1">{item.title}</div>
                                                    <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className={clsx(
                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                        item.priority.toLowerCase() === 'critical' ? "bg-red-50 text-red-600 border border-red-100" :
                                                            item.priority.toLowerCase() === 'high' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                                                                item.priority.toLowerCase() === 'medium' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                                                    "bg-gray-50 text-gray-600 border border-gray-100"
                                                    )}>
                                                        {item.priority.toLowerCase()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className={clsx(
                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                        item.status.toLowerCase() === 'closed' ? "bg-green-100 text-green-700" :
                                                            item.status.toLowerCase() === 'not started' ? "bg-gray-100 text-gray-700" :
                                                                item.status.toLowerCase() === 'in progress' ? "bg-blue-100 text-blue-700" :
                                                                    item.status.toLowerCase() === 'responded' ? "bg-yellow-100 text-yellow-700" :
                                                                        "bg-neutral-100 text-neutral-700"
                                                    )}>
                                                        {item.status}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full w-8 h-8 text-[10px] font-bold">
                                                            {item.assignedTo.initial}
                                                        </div>
                                                        <span className="text-xs font-medium text-neutral-700">{item.assignedTo.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap text-neutral-600">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-3.5 w-3.5 text-neutral-400" />
                                                        {item.createdDate}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap text-neutral-600">
                                                    <div className="flex items-center">
                                                        <Clock className="mr-2 h-3.5 w-3.5 text-neutral-400" />
                                                        <span className={clsx(
                                                            item.status === 'Not Started' && "text-red-600 font-medium"
                                                        )}>
                                                            {item.dueDate}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap text-neutral-600">{item.dueIn}</td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-semibold text-neutral-600 border border-neutral-200 uppercase">
                                                        {item.createdBy}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-semibold text-neutral-600 border border-neutral-200 uppercase">
                                                        {item.assignedBy}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-700 border border-neutral-200">
                                                        {item.study}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-100">
                                                        {item.domain}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap text-blue-600 font-medium hover:underline">
                                                    {item.recordID}
                                                </td>
                                                <td className="p-4 align-middle whitespace-nowrap">
                                                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-700 border border-neutral-200">
                                                        {item.source}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTask(item);
                                                            setIsModalOpen(true);
                                                            setActiveModalTab('Task Details');
                                                        }}
                                                        className="p-2 hover:bg-neutral-100 rounded-md transition-colors"
                                                    >
                                                        <FileText className="h-4 w-4 text-neutral-500" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={17} className="py-20 text-center bg-white">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center">
                                                        <RotateCcw className="h-8 w-8 text-neutral-300" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-neutral-500 font-medium">No tasks or queries match your filters</p>
                                                    </div>
                                                    <button
                                                        onClick={handleResetFilters}
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 hover:bg-blue-50 rounded-md transition-colors"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                        Reset Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Metrics Dashboard Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Workflow Distribution */}
                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart2 className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-neutral-800">Workflow Distribution</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Data Manager', value: 3, total: 1465, color: 'bg-blue-500' },
                                { label: 'CRA', value: 0, total: 1465, color: 'bg-neutral-200' },
                                { label: 'Medical Monitor', value: 0, total: 1465, color: 'bg-neutral-200' },
                                { label: 'Other Roles', value: 1462, total: 1465, color: 'bg-orange-500' }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-600">{item.label}</span>
                                        <span className="font-medium text-neutral-800">{item.value} tasks</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-50">
                                        <div
                                            className={clsx("h-full rounded-full transition-all duration-500", item.color)}
                                            style={{ width: (item.value / item.total * 100) + '%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Summary & Query Type */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                                <h3 className="font-semibold text-neutral-800">Status Summary</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Awaiting Review', value: 3, color: 'text-orange-500' },
                                    { label: 'Overdue', value: 250, color: 'text-red-500' },
                                    { label: 'Not Started', value: 237, color: 'text-blue-500' },
                                    { label: 'Completed', value: 41, color: 'text-green-500' }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 flex flex-col items-center justify-center text-center">
                                        <div className={clsx("text-3xl font-bold mb-1", item.color)}>{item.value}</div>
                                        <div className="text-xs text-neutral-500 font-medium">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border shadow-sm">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-neutral-800">Query Type Distribution</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-neutral-500">N/A</span>
                                        <span className="text-neutral-800 font-medium">0 (0%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-neutral-300 w-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Details Modal */}
            {isModalOpen && selectedTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100/50">
                                        <MessageSquare className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-neutral-800 tracking-tight">
                                            {selectedTask.taskID}: {selectedTask.title}
                                        </h2>
                                        <div className="flex gap-2">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                                                selectedTask.priority.toLowerCase() === 'medium' ? "bg-neutral-100 text-neutral-700 border border-neutral-200" :
                                                    "bg-red-50 text-red-600 border border-red-100"
                                            )}>
                                                {selectedTask.priority}
                                            </span>
                                            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
                                                {selectedTask.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                                    <X className="h-6 w-6 text-neutral-400" />
                                </button>
                            </div>

                            {/* Modal Tabs */}
                            <div className="flex bg-blue-50/50 p-1 rounded-lg w-full">
                                {['Task Details', 'Responses'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveModalTab(tab)}
                                        className={clsx(
                                            "flex-1 py-2 text-sm font-semibold rounded-md transition-all",
                                            activeModalTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-blue-400 hover:text-blue-600"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {activeModalTab === 'Task Details' ? (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-medium text-neutral-400">Description</h3>
                                        <p className="text-neutral-700 leading-relaxed">
                                            {selectedTask.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 py-6 border-t border-b border-neutral-100">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Assigned To</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                                                        {selectedTask.assignedTo.initial}
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-700">{selectedTask.assignedTo.name}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Created</h3>
                                                <div className="text-sm text-neutral-700 font-medium">{selectedTask.createdDate}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Domain</h3>
                                                <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">{selectedTask.domain}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Data Source</h3>
                                                <div className="text-sm text-neutral-700 font-medium">{selectedTask.source}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Due Date</h3>
                                                <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium">
                                                    <Clock className="h-4 w-4 text-neutral-400" />
                                                    {selectedTask.dueDate}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Study</h3>
                                                <div className="text-sm text-neutral-700 font-medium">{selectedTask.study}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Record ID</h3>
                                                <div className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">{selectedTask.recordID}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Context Section */}
                                    <div className="bg-blue-50/30 p-6 rounded-xl border border-blue-100/50 space-y-6">
                                        <h3 className="font-semibold text-neutral-800">Data Context</h3>
                                        <div className="grid grid-cols-2 gap-y-6">
                                            {[
                                                { label: 'agentType', value: selectedTask.dataContext?.agentType || 'protocol_compliance' },
                                                { label: 'outcomeId', value: selectedTask.dataContext?.outcomeId || 'PC-001' },
                                                { label: 'actionType', value: selectedTask.dataContext?.actionType || 'protocol_compliance' },
                                                { label: 'confidence', value: selectedTask.dataContext?.confidence || '0.85' },
                                                { label: 'businessImpact', value: selectedTask.dataContext?.businessImpact || 'Potential impact on primary endpoint analysis', full: true }
                                            ].map((ctx, idx) => (
                                                <div key={idx} className={clsx("space-y-1", ctx.full && "col-span-2")}>
                                                    <div className="text-xs font-medium text-neutral-400">{ctx.label}</div>
                                                    <div className="text-sm text-neutral-800 font-medium">{ctx.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-semibold text-neutral-500">Previous Responses</h3>
                                        <div className="flex bg-neutral-100 p-1 rounded-lg">
                                            {['All', 'Assigned to Me', 'Created by Me', 'Responded'].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveResponseTab(tab)}
                                                    className={clsx(
                                                        "px-3 py-1 text-xs font-bold rounded-md transition-all",
                                                        activeResponseTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                                                    )}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        {filteredResponses.length > 0 ? (
                                            filteredResponses.map((resp: any, idx: number) => (
                                                <div key={idx} className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold text-sm border border-neutral-200 uppercase">
                                                                {resp.user.initial}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-bold text-neutral-800">{resp.user.name}</span>
                                                                <span className="text-xs text-neutral-400 font-medium">{resp.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-neutral-700 leading-relaxed bg-neutral-50/50 p-5 rounded-xl border border-neutral-100/50">
                                                        {resp.isAuto && (
                                                            <div className="flex items-start gap-2 mb-2">
                                                                <div className="mt-0.5 bg-green-500 text-white rounded p-0.5 flex items-center justify-center">
                                                                    <Check className="h-3 w-3" strokeWidth={4} />
                                                                </div>
                                                                <span className="font-bold text-neutral-800">
                                                                    {resp.message.split(': ')[0]}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className={clsx(resp.isAuto && "text-neutral-600")}>
                                                            {resp.isAuto ? resp.message.split(': ').slice(1).join(': ') : resp.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-4">
                                                    <div className="w-16 h-16 bg-neutral-50 rounded-lg border border-neutral-100 flex items-center justify-center">
                                                        <RotateCcw className="h-8 w-8 text-neutral-300" />
                                                    </div>
                                                    <p className="text-neutral-500 font-medium">No responses match your filter</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t bg-white flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-8 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200"
                            >
                                Cancel
                            </button>
                            <button className="px-8 py-3 text-sm font-bold bg-[#90CAF9] text-white hover:bg-[#64B5F6] rounded-lg transition-all shadow-sm active:scale-95">
                                Update Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Export Success Toast */}
            {showExportToast && (
                <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-white border border-neutral-200 shadow-xl rounded-lg px-4 py-3 flex items-center gap-3">
                        <div className="bg-green-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-neutral-800">Exported successfully</span>
                        <button
                            onClick={() => setShowExportToast(false)}
                            className="ml-2 text-neutral-400 hover:text-neutral-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
