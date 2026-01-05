import {
<<<<<<< HEAD
    Cpu, ChevronLeft, ChevronDown, Sparkles, RefreshCw, EyeOff, Eye,
    Maximize2, X, Bot, Activity, Package, Check, Loader2,
    Database, FileText, Share2, ClipboardList, AlertCircle, Play,
    LayoutDashboard, Calendar, Trash2, Settings, ArrowDown, ArrowRight, Plus,
    ChevronsUpDown, Save
=======
    ChevronLeft, ChevronDown, Sparkles, RefreshCw, EyeOff, Eye,
    Maximize2, X, Bot, Activity, Check, Loader2,
    Database, FileText, Share2, ClipboardList, AlertCircle,
    LayoutDashboard, Calendar, Trash2, Settings, ArrowDown, ArrowRight, Plus,
    ChevronsUpDown, Save, Cpu
>>>>>>> Ruthra
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DataManagerAI() {
    const navigate = useNavigate();
    const [isAgentMode, setIsAgentMode] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
    const [isChatbotOpen] = useState(true);
    const [showAgents, setShowAgents] = useState(true);
    const [selectedStudy, setSelectedStudy] = useState('PRO001 - Diabetes Type 2 Study');
    const [isStudyDropdownOpen, setIsStudyDropdownOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Notification & Modal States
    const [showStartToast, setShowStartToast] = useState(false);
    const [showEndToast, setShowEndToast] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    const studies = [
        'PRO001 - Diabetes Type 2 Study',
        'PRO002 - Oncology Combination Therapy',
        'PRO003 - Cardiovascular Outcomes Study'
    ];

    const logs = [
        "[Apr 24, 2025 09:46:54] SignalDetectionAgent: Monitoring protocol adherence for Diabetes Type 2 Study (PRO001)",
        "[Apr 24, 2025 09:46:54] SignalDetectionAgent: Monitoring protocol adherence for all trials",
        "[Apr 30, 2025 04:47:50] DataFetchAgent: Fetched 1 records from integrated sources for all trials",
        "[Apr 30, 2025 13:07:39] DataQualityAgent: Analyzing data for all trials (1 records), found 1 issues",
        "[Apr 30, 2025 13:07:39] DataReconciliationAgent: Cross-checking data for all trials, found 1 discrepancies",
        "[Apr 30, 2025 13:07:39] TaskManagerAgent: Created 1 tasks for data managers across all trials",
        "[Nov 6, 2025 22:52:33] DataReconciliationAgent: Cross-checking data for Diabetes Type 2 Study (PRO001), found 0 discrepancies",
        "[Nov 6, 2025 22:52:33] TaskManagerAgent: Created 1 tasks for data managers in Diabetes Type 2 Study (PRO001)",
        "[Dec 25, 2025 09:18:27] DataFetchAgent: Fetched 1 records from integrated sources for Diabetes Type 2 Study (PRO001)",
        "[Dec 25, 2025 09:18:28] DataQualityAgent: Analyzing data for Diabetes Type 2 Study (PRO001) (100 records), found 40 issues",
        "[Dec 25, 2025 09:39:01] AgentMonitor: All agents operating within normal parameters"
    ];

    const toggleAgentMode = () => setIsAgentMode(!isAgentMode);

    const handleRunMonitor = () => {
        setIsRunning(true);
        setProgress(0);
        setShowStartToast(true);
        setTimeout(() => setShowStartToast(false), 3000);
    };

    useEffect(() => {
        if (isRunning && progress < 100) {
            const timer = setTimeout(() => setProgress(prev => prev + 2), 50);
            return () => clearTimeout(timer);
        } else if (progress >= 100) {
            setIsRunning(false);
            setShowEndToast(true);
            setShowResultModal(true);
            // Hide end toast after a few seconds
            setTimeout(() => setShowEndToast(false), 5000);
        }
    }, [isRunning, progress]);

    const [activeTab, setActiveTab] = useState('DQ and Reconciliation');

    // Filter States
    const [selectedType, setSelectedType] = useState('All Types');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [selectedTaskStatus, setSelectedTaskStatus] = useState('Not Started');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isTaskStatusDropdownOpen, setIsTaskStatusDropdownOpen] = useState(false);

    // Filter Constants
    const filterTypes = ["All Types", "Missing Data", "Inconsistent Data", "Out of Range", "Format Error", "Duplicate Records", "Specification Violation"];
    const filterCategories = ["All Categories", "DQ", "Reconciliation"];
    const filterStatuses = ["All Statuses", "Detected", "Reviewing", "Resolving", "Resolved", "Closed"];
    const taskStatuses = ["All Statuses", "Not Started", "Assigned", "In Progress", "Responded", "Under Review", "Reopened", "Completed", "Closed"];

    // Reports Tab States
    const [selectedReportDomain, setSelectedReportDomain] = useState('All Domains');
    const [isReportDomainDropdownOpen, setIsReportDomainDropdownOpen] = useState(false);

    const reportDomains = [
        "All Domains",
        "Demographics (DM)",
        "Adverse Events (AE)",
        "Laboratory (LB)",
        "Vital Signs (VS)",
        "Concomitant Meds (CM)",
        "Tumor Assessment (TU)",
        "Imaging (IM)",
        "EKG (EG)",
        "Exposure (EX)"
    ];

    const studyReportIssues: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { id: 'DQ-2501-01', domain: 'LB', type: 'Data Quality', severity: 'Critical', status: 'In Review', dueDate: 'Apr 10, 2025', slaStatus: 'On Track' },
            { id: 'RC-2501-02', domain: 'VS', type: 'Reconciliation', severity: 'High', status: 'In Progress', dueDate: 'Apr 12, 2025', slaStatus: 'On Track' },
            { id: 'DQ-2501-03', domain: 'DM', type: 'Data Quality', severity: 'Medium', status: 'Open', dueDate: 'Apr 5, 2025', slaStatus: 'Overdue' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { id: 'DQ-2502-01', domain: 'TU', type: 'Data Quality', severity: 'Critical', status: 'In Review', dueDate: 'May 10, 2025', slaStatus: 'On Track' },
            { id: 'RC-2502-02', domain: 'AE', type: 'Reconciliation', severity: 'High', status: 'In Progress', dueDate: 'May 12, 2025', slaStatus: 'On Track' },
            { id: 'DQ-2502-03', domain: 'IM', type: 'Data Quality', severity: 'Medium', status: 'Open', dueDate: 'May 5, 2025', slaStatus: 'On Track' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { id: 'DQ-2503-01', domain: 'EG', type: 'Data Quality', severity: 'Critical', status: 'In Review', dueDate: 'Jun 10, 2025', slaStatus: 'On Track' },
            { id: 'RC-2503-02', domain: 'AE', type: 'Reconciliation', severity: 'High', status: 'In Progress', dueDate: 'Jun 12, 2025', slaStatus: 'On Track' },
            { id: 'DQ-2503-03', domain: 'LB', type: 'Data Quality', severity: 'Medium', status: 'Open', dueDate: 'Jun 5, 2025', slaStatus: 'Overdue' },
        ]
    };

    const studyValidationIssues: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { type: 'Invalid Format', domain: 'LB', records: 18, severity: 'Medium', status: 'In Progress' },
            { type: 'Out of Range', domain: 'VS', records: 7, severity: 'High', status: 'Resolved' },
            { type: 'Missing Variable', domain: 'DM', records: 12, severity: 'Critical', status: 'Review' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { type: 'RECIST Mismatch', domain: 'TU', records: 24, severity: 'Critical', status: 'In Progress' },
            { type: 'Baseline Missing', domain: 'IM', records: 15, severity: 'High', status: 'Pending' },
            { type: 'CTCAE Grading', domain: 'AE', records: 32, severity: 'Medium', status: 'Review' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { type: 'EKG Anomaly', domain: 'EG', records: 5, severity: 'Critical', status: 'Reviewing' },
            { type: 'MACE Adjudication', domain: 'AE', records: 9, severity: 'High', status: 'Pending' },
            { type: 'Troponin Range', domain: 'LB', records: 21, severity: 'Medium', status: 'In Progress' },
        ]
    };

    // Event Monitoring States
    const [selectedEventType, setSelectedEventType] = useState('All Events');
    const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
    const [eventStartDate, setEventStartDate] = useState('2025-04-01');
    const [eventEndDate, setEventEndDate] = useState('2025-04-08');
    const [appliedEventStartDate, setAppliedEventStartDate] = useState('2025-04-01');
    const [appliedEventEndDate, setAppliedEventEndDate] = useState('2025-04-08');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tasksCurrentPage, setTasksCurrentPage] = useState(1);
    const [tasksRowsPerPage, setTasksRowsPerPage] = useState(10);

    const eventTypes = ["All Events", "System Events", "User Actions", "Data Events", "AI Activities"];

    const studyEventLogs: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { timestamp: '2025-04-08 14:32:15', id: 'EVT-2504-0042', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'DQ and Reconciliation analysis completed for PRO001 - Diabetes Type 2. 42 issues identified and tasks created.', status: 'Completed' },
            { timestamp: '2025-04-08 14:30:22', id: 'EVT-2504-0041', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Starting DQ and Reconciliation analysis for PRO001 - Diabetes Type 2 on datasets: DM, VS, LB, AE, CM.', status: 'Completed' },
            { timestamp: '2025-04-08 14:15:08', id: 'EVT-2504-0040', type: 'Data', source: 'Integration Service', user: 'System', description: 'New data loaded for PRO001 - Diabetes Type 2: 156 new records in Laboratory (LB) domain from Labcorp.', status: 'Completed' },
            { timestamp: '2025-04-08 13:58:44', id: 'EVT-2504-0039', type: 'User', source: 'Web Client', user: 'John Smith', description: 'Response submitted for task TSK-2504-0018: "Missing lab values for subject PRO001-023 at Visit 3".', status: 'Completed' },
            { timestamp: '2025-04-08 13:45:19', id: 'EVT-2504-0038', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Reviewing task response for TSK-2504-0015: "Inconsistent vital signs for subject PRO001-015 between visits 2 and 3".', status: 'Completed' },
            { timestamp: '2025-04-08 13:30:02', id: 'EVT-2504-0037', type: 'System', source: 'Integration Service', user: 'System', description: 'Failed connection attempt to IQVIA CTMS API endpoint. Retry scheduled in 15 minutes.', status: 'Failed' },
            { timestamp: '2025-04-08 12:45:23', id: 'EVT-2504-0036', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Compliance check completed for PRO001 - Diabetes Type 2. Protocol adherence rate: 92%, 3 potential protocol deviations identified.', status: 'Completed' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { timestamp: '2025-05-08 10:32:15', id: 'EVT-2505-0010', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Tumor assessment analysis triggered for PRO002. RECIST 1.1 criteria applied.', status: 'Completed' },
            { timestamp: '2025-05-08 10:15:00', id: 'EVT-2505-0009', type: 'Data', source: 'Integration Service', user: 'System', description: 'New scans for oncologist review uploaded to central repository.', status: 'Completed' },
            { timestamp: '2025-05-08 09:45:00', id: 'EVT-2505-0008', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Automated RECIST grading for Subject 202 completed.', status: 'Completed' },
            { timestamp: '2025-05-08 09:15:08', id: 'EVT-2505-0007', type: 'Data', source: 'Lab', user: 'System', description: 'Genomic data import completed: 42 subjects updated in TU domain.', status: 'Completed' },
            { timestamp: '2025-05-08 08:30:00', id: 'EVT-2505-0006', type: 'System', source: 'PACS', user: 'System', description: 'Imaging server sync completed. 15 new scans available.', status: 'Completed' },
            { timestamp: '2025-05-07 16:30:00', id: 'EVT-2505-0005', type: 'User', source: 'Web Client', user: 'Alice Wong', description: 'Query responded for missing biopsy date for Subject 014.', status: 'Completed' },
            { timestamp: '2025-05-07 14:00:00', id: 'EVT-2505-0004', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Cross-domain check between LB and AE domains for potential SAEs.', status: 'Completed' },
            { timestamp: '2025-05-07 11:20:00', id: 'EVT-2505-0003', type: 'Data', source: 'CTMS', user: 'System', description: 'Enrollment update: 5 new subjects randomized.', status: 'Completed' },
            { timestamp: '2025-05-06 15:45:00', id: 'EVT-2505-0002', type: 'User', source: 'Web Client', user: 'Bob Vance', description: 'Site protocol training certificate uploaded for Site 02.', status: 'Completed' },
            { timestamp: '2025-05-06 09:00:00', id: 'EVT-2505-0001', type: 'System', source: 'Integration Service', user: 'System', description: 'Daily backup of PRO002 database successful.', status: 'Completed' },
            { timestamp: '2025-05-05 10:00:00', id: 'EVT-2505-0000', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Weekly data quality report generated for PRO002.', status: 'Completed' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { timestamp: '2025-06-08 11:32:15', id: 'EVT-2506-0010', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Adverse Event trend analysis completed for PRO003. MACE events summary updated.', status: 'Completed' },
            { timestamp: '2025-06-08 10:45:00', id: 'EVT-2506-0009', type: 'Data', source: 'EKG System', user: 'System', description: 'Batch upload of EKG strips for cohort B.', status: 'Completed' },
            { timestamp: '2025-06-08 09:30:00', id: 'EVT-2506-0008', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Risk assessment engine identified high rate of palpitations in Site 12.', status: 'Completed' },
            { timestamp: '2025-06-08 08:15:08', id: 'EVT-2506-0007', type: 'Data', source: 'EKG System', user: 'System', description: 'Heart rate telemetry synchronization successful. 85 subjects updated.', status: 'Completed' },
            { timestamp: '2025-06-08 07:45:00', id: 'EVT-2506-0006', type: 'User', source: 'Web Client', user: 'Sarah Doe', description: 'Medical history batch upload for cardiovascular cohort.', status: 'Completed' },
            { timestamp: '2025-06-07 14:20:00', id: 'EVT-2506-0005', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Compliance audit: 98% records synchronized with central ECG lab.', status: 'Completed' },
            { timestamp: '2025-06-07 11:05:00', id: 'EVT-2506-0004', type: 'Data', source: 'IVRS', user: 'System', description: 'Drug shipment notification for Site 05 received.', status: 'Completed' },
            { timestamp: '2025-06-07 09:15:00', id: 'EVT-2506-0003', type: 'System', source: 'Server', user: 'System', description: 'Database performance optimization completed.', status: 'Completed' },
            { timestamp: '2025-06-06 16:50:00', id: 'EVT-2506-0002', type: 'User', source: 'Web Client', user: 'Charlie Brook', description: 'Subject randomization override for Subject 305.', status: 'Completed' },
            { timestamp: '2025-06-06 13:10:00', id: 'EVT-2506-0001', type: 'AI', source: 'Data Manager.AI', user: 'System', description: 'Mismatch identified between VS and AE dates for cardiac event.', status: 'Completed' },
            { timestamp: '2025-06-06 08:30:00', id: 'EVT-2506-0000', type: 'System', source: 'Integration Service', user: 'System', description: 'Connection restored to partner lab API.', status: 'Completed' },
        ]
    };

    // Domain Progress States

    const domainProgressData: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { label: 'Demographics', code: 'DM', percentage: 98, recordsText: '152/155 subjects' },
            { label: 'Laboratory Tests', code: 'LB', percentage: 82, recordsText: '6,425/7,834 records' },
            { label: 'Vital Signs', code: 'VS', percentage: 90, recordsText: '2,788/3,100 records' },
            { label: 'Adverse Events', code: 'AE', percentage: 68, recordsText: '542/798 records' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { label: 'Demographics', code: 'DM', percentage: 95, recordsText: '210/220 subjects' },
            { label: 'Tumor Assessment', code: 'TU', percentage: 76, recordsText: '812/1,068 records' },
            { label: 'Imaging Data', code: 'IM', percentage: 85, recordsText: '310/364 records' },
            { label: 'Adverse Events', code: 'AE', percentage: 45, recordsText: '1,204/2,675 records' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { label: 'Demographics', code: 'DM', percentage: 100, recordsText: '85/85 subjects' },
            { label: 'EKG Readings', code: 'EG', percentage: 88, recordsText: '4,500/5,113 records' },
            { label: 'Laboratory Tests', code: 'LB', percentage: 95, recordsText: '1,800/1,895 records' },
            { label: 'Adverse Events', code: 'AE', percentage: 82, recordsText: '950/1,158 records' },
        ]
    };

    const studyTimelineData: Record<string, any> = {
        'PRO001 - Diabetes Type 2 Study': { start: 'Jan 15, 2025', current: 'Apr 8, 2025', end: 'Dec 15, 2025', progress: 25, monthsText: '3 months / 12 months' },
        'PRO002 - Oncology Combination Therapy': { start: 'Feb 1, 2025', current: 'Apr 8, 2025', end: 'Feb 1, 2026', progress: 18, monthsText: '2 months / 12 months' },
        'PRO003 - Cardiovascular Outcomes Study': { start: 'Dec 1, 2024', current: 'Apr 8, 2025', end: 'Sep 30, 2025', progress: 45, monthsText: '4 months / 10 months' }
    };

    // Agent Workflow States
    const [workflows, setWorkflows] = useState([
        { id: 1, agentType: 'Data Quality', name: 'test', description: 'qewwe', executionMode: 'Sequential', dependencies: ['Data Fetch'], status: true },
        { id: 2, agentType: 'Data Fetch', name: 'test', description: 'sfsf', executionMode: 'Sequential', dependencies: ['Data Reconciliation'], status: true },
        { id: 3, agentType: 'Data Quality', name: 'test', description: 'qewwe', executionMode: 'Sequential', dependencies: ['Data Fetch'], status: true },
        { id: 4, agentType: 'Data Fetch', name: 'test', description: 'sfsf', executionMode: 'Sequential', dependencies: ['Data Reconciliation'], status: true },
        { id: 5, agentType: 'Data Quality', name: 'test', description: 'qewwe', executionMode: 'Conditional', dependencies: ['Data Fetch'], status: true },
        { id: 6, agentType: 'Data Fetch', name: 'test', description: 'sfsf', executionMode: 'Sequential', dependencies: ['Data Reconciliation'], status: false },
        { id: 7, agentType: 'Data Quality', name: 'test', description: 'qewwe', executionMode: 'Sequential', dependencies: ['Data Fetch', 'Data Reconciliation', 'Report Generator', 'Domain Progress'], status: true },
        { id: 8, agentType: 'Data Quality', name: 'test', description: 'sfsf', executionMode: 'Independent', dependencies: ['Data Reconciliation'], status: true },
        { id: 9, agentType: 'Data Fetch', name: 'test1', description: 'sfsf', executionMode: 'Sequential', dependencies: ['Data Reconciliation'], status: true },
    ]);

    const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
    const [workflowModalMode, setWorkflowModalMode] = useState<'add' | 'edit'>('add');
    const [editingWorkflowId, setEditingWorkflowId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [workflowToDelete, setWorkflowToDelete] = useState<number | null>(null);

    const [workflowForm, setWorkflowForm] = useState({
        name: '',
        description: '',
        agentType: 'Data Fetch',
        executionMode: 'Sequential',
        prerequisites: [] as string[],
        enabled: true
    });

    const workflowAgentTypes = ["Data Fetch", "Data Quality", "Data Reconciliation", "Report Generator", "Domain Progress"];
    const workflowModes = ["Sequential", "Independent", "Conditional"];

    // Settings States
    interface SettingsState {
        missingDataDetection: boolean;
        outOfRangeValues: boolean;
        invalidFormatDetection: boolean;
        dataConsistency: boolean;
        crossFormValidation: boolean;
        subjectMatching: boolean;
        demographicsMatching: boolean;
        aeMedicalHistoryMatching: boolean;
        labValueMatching: boolean;
        protocolAdherenceChecking: boolean;
        auditTrailMonitoring: boolean;
        protocolDeviationDetection: boolean;
        regulatoryStandardAlerts: boolean;
        isActiveMonitoring: boolean;
        isScheduledMonitoring: boolean;
        monitorSchedule: string;
        monitorPriority: string;
        emailNotify: boolean;
        inAppNotify: boolean;
        smsNotify: boolean;
        slackNotify: boolean;
        immediateCritical: boolean;
        dailySummary: boolean;
        weeklySummary: boolean;
    }

    const [settings, setSettings] = useState<SettingsState>({
        missingDataDetection: true,
        outOfRangeValues: true,
        invalidFormatDetection: true,
        dataConsistency: true,
        crossFormValidation: true,
        subjectMatching: true,
        demographicsMatching: true,
        aeMedicalHistoryMatching: true,
        labValueMatching: true,
        protocolAdherenceChecking: true,
        auditTrailMonitoring: false,
        protocolDeviationDetection: true,
        regulatoryStandardAlerts: true,
        isActiveMonitoring: true,
        isScheduledMonitoring: false,
        monitorSchedule: 'Daily',
        monitorPriority: 'Medium',
        emailNotify: true,
        inAppNotify: true,
        smsNotify: false,
        slackNotify: false,
        immediateCritical: true,
        dailySummary: true,
        weeklySummary: false,
    });

    const [showSaveToast, setShowSaveToast] = useState(false);
    const [isMonitoringScheduleOpen, setIsMonitoringScheduleOpen] = useState(false);
    const [isMonitoringPriorityOpen, setIsMonitoringPriorityOpen] = useState(false);

    const settingToggle = (label: string, desc: string, key: keyof SettingsState) => (
        <div className="flex items-center justify-between">
            <div className="pr-4">
                <h4 className="font-bold text-gray-900">{label}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
            <div
                onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                className={`relative h-6 w-12 rounded-full cursor-pointer transition-colors p-1 ${settings[key] ? 'bg-[#0084ff]' : 'bg-gray-300'}`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );

    const notificationCheckbox = (label: string, key: keyof SettingsState) => (
        <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={settings[key] as boolean}
                    onChange={() => setSettings({ ...settings, [key]: !settings[key] })}
                    className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                />
                <div className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${settings[key] ? 'bg-[#2563eb] border-[#2563eb]' : 'bg-white border-gray-200 group-hover:border-blue-400'}`}>
                    <Check className={`h-3 w-3 text-white transition-opacity ${settings[key] ? 'opacity-100' : 'opacity-0'}`} />
                </div>
            </div>
            <span className={`text-sm font-bold ${settings[key] ? 'text-gray-900' : 'text-gray-500'}`}>{label}</span>
        </label>
    );

    const studyTasks: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { id: 'TSK-001-01', title: 'Verify insulin dosage records', status: 'Not Started', assignedTo: 'Michael Chen', dueDate: 'Feb 2, 2025', created: 'Oct 2, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-02', title: 'Missing HbA1c values for S-101', status: 'Assigned', assignedTo: 'Venkata', dueDate: 'No due date', created: 'Nov 17, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-03', title: 'Check BMI consistency across visits', status: 'In Progress', assignedTo: 'Sarah Johnson', dueDate: 'Jan 15, 2025', created: 'Dec 1, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-04', title: 'Resolve invalid birth date for subject 042', status: 'Responded', assignedTo: 'Michael Chen', dueDate: 'Jan 20, 2025', created: 'Dec 5, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-05', title: 'Review medical history for potential eligibility conflict', status: 'Under Review', assignedTo: 'Clinical Lead', dueDate: 'Jan 25, 2025', created: 'Dec 10, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-06', title: 'Discrepancy in concomitant medications for S-105', status: 'Reopened', assignedTo: 'Michael Chen', dueDate: 'Feb 5, 2025', created: 'Dec 15, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-07', title: 'Verify demographics data for all subjects in Site 01', status: 'Completed', assignedTo: 'Michael Chen', dueDate: 'Jan 10, 2025', created: 'Dec 1, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-08', title: 'Close out all queries for first cohort', status: 'Closed', assignedTo: 'Study Manager', dueDate: 'Feb 1, 2025', created: 'Nov 1, 2024', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-09', title: 'Additional task to verify pagination 1', status: 'Not Started', assignedTo: 'Michael Chen', dueDate: 'Feb 10, 2025', created: 'Jan 1, 2025', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-10', title: 'Additional task to verify pagination 2', status: 'Assigned', assignedTo: 'Michael Chen', dueDate: 'Feb 12, 2025', created: 'Jan 2, 2025', study: 'PRO001', relatedIssue: 'N/A' },
            { id: 'TSK-001-11', title: 'Additional task to verify pagination 3', status: 'In Progress', assignedTo: 'Michael Chen', dueDate: 'Feb 15, 2025', created: 'Jan 5, 2025', study: 'PRO001', relatedIssue: 'N/A' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { id: 'TSK-002-01', title: 'Complete RECIST 1.1 assessment training', status: 'Not Started', assignedTo: 'Sarah Johnson', dueDate: 'Jan 26, 2025', created: 'Oct 2, 2024', study: 'PRO002', relatedIssue: 'N/A' },
            { id: 'TSK-002-02', title: 'Resolve CT scan field discrepancy', status: 'Assigned', assignedTo: 'jane.doe@clinicaltrials.com', dueDate: 'Jul 31, 2025', created: 'Jul 30, 2024', study: 'PRO002', relatedIssue: 'N/A' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { id: 'TSK-003-01', title: 'Adjudicate MACE event for S-305', status: 'Responded', assignedTo: 'Cardiologist Reviewer', dueDate: 'May 4, 2025', created: 'May 1, 2024', study: 'PRO003', relatedIssue: 'N/A' },
            { id: 'TSK-003-02', title: 'Review EKG abnormal findings', status: 'Completed', assignedTo: 'Safety Manager', dueDate: 'Nov 13, 2025', created: 'Nov 6, 2024', study: 'PRO003', relatedIssue: 'N/A' },
        ]
    };

    const studyIssues: Record<string, any[]> = {
        'PRO001 - Diabetes Type 2 Study': [
            { id: 'DQ-001', type: 'Missing Data', category: 'DQ', title: 'Missing dates in Demographics domain', status: 'Detected', severity: 'High', domain: 'DM', created: 'Apr 1, 2025' },
            { id: 'DR-001', type: 'Inconsistent Data', category: 'Reconciliation', title: 'Lab results inconsistent with EDC data', status: 'Reviewing', severity: 'Medium', domain: 'LB, VS', created: 'Mar 28, 2025' },
        ],
        'PRO002 - Oncology Combination Therapy': [
            { id: 'DQ-002', type: 'Missing Data', category: 'DQ', title: 'Tumor scan records missing for oncology site 04', status: 'Detected', severity: 'High', domain: 'TU', created: 'May 1, 2025' },
            { id: 'DR-002', type: 'Inconsistent Data', category: 'Reconciliation', title: 'RECIST evaluation does not match CT scan findings', status: 'Reviewing', severity: 'High', domain: 'TU, IM', created: 'May 5, 2025' },
        ],
        'PRO003 - Cardiovascular Outcomes Study': [
            { id: 'DQ-003', type: 'Out of Range', category: 'DQ', title: 'Blood pressure values out of expected range', status: 'Detected', severity: 'High', domain: 'VS', created: 'Jun 1, 2025' },
            { id: 'DR-003', type: 'Missing Data', category: 'Reconciliation', title: 'EKG data not synchronized for randomization visit', status: 'Reviewing', severity: 'Medium', domain: 'EG, DM', created: 'Jun 3, 2025' },
        ]
    };

    const filteredData = (studyIssues[selectedStudy] || []).filter(issue => {
        const typeMatch = selectedType === 'All Types' || issue.type === selectedType;
        const categoryMatch = selectedCategory === 'All Categories' || issue.category === selectedCategory;
        const statusMatch = selectedStatus === 'All Statuses' || issue.status === selectedStatus;
        return typeMatch && categoryMatch && statusMatch;
    });

    const filteredTasks = (studyTasks[selectedStudy] || []).filter(task => {
        return selectedTaskStatus === 'All Statuses' || task.status === selectedTaskStatus;
    });

    const paginatedTasks = filteredTasks.slice(
        (tasksCurrentPage - 1) * tasksRowsPerPage,
        tasksCurrentPage * tasksRowsPerPage
    );

    const filteredReportIssues = (studyReportIssues[selectedStudy] || []).filter(issue => {
        if (selectedReportDomain === 'All Domains') return true;
        const code = selectedReportDomain.match(/\((.*?)\)/)?.[1];
        return issue.domain === code;
    });

    const filteredEventLogs = (studyEventLogs[selectedStudy] || []).filter(log => {
        // Event Type Filter
        if (selectedEventType !== 'All Events') {
            const mapping: Record<string, string> = {
                'System Events': 'System',
                'User Actions': 'User',
                'Data Events': 'Data',
                'AI Activities': 'AI'
            };
            if (log.type !== mapping[selectedEventType]) return false;
        }

        // Date Range Filter
        const logDate = log.timestamp.split(' ')[0];
        if (logDate < appliedEventStartDate || logDate > appliedEventEndDate) return false;

        return true;
    });

    const paginatedEventLogs = filteredEventLogs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedEventType, appliedEventStartDate, appliedEventEndDate, selectedStudy]);

    useEffect(() => {
        setTasksCurrentPage(1);
    }, [selectedTaskStatus, selectedStudy]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Detected':
            case 'Not Started':
                return 'bg-[#2563eb] text-white shadow-sm shadow-blue-200';
            case 'Reviewing':
            case 'Assigned':
            case 'In Progress':
                return 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]';
            case 'Resolving':
            case 'Responded':
            case 'Under Review':
                return 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]';
            case 'Resolved':
            case 'Completed':
                return 'bg-green-500 text-white shadow-sm shadow-green-200';
            case 'Closed':
            case 'Reopened':
                return 'bg-gray-100 text-gray-600 border border-gray-200';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Active Monitoring Banner */}
                <div className="bg-[#2563eb] rounded-lg p-3 text-white flex items-center justify-center gap-2 font-bold shadow-sm">
                    <AlertCircle className="h-5 w-5" />
                    Active monitoring on the data from Trial Data Management
                </div>

                {/* Header Card */}
<<<<<<< HEAD
                <div className="bg-[#1e293b] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700 transition-all duration-200 active:scale-[0.98] cursor-pointer hover:shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] -ml-32 -mb-32 rounded-full"></div>

                    <div className="relative z-10 flex items-center">
                        <div className="relative h-16 w-16 mr-6 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-transparent rotate-45 rounded-lg"></div>
                            <div className="absolute inset-[3px] border border-teal-500/30 rotate-45 rounded-lg backdrop-blur-sm"></div>
                            <Bot className="h-7 w-7 text-teal-400 relative z-10" />
=======
                {/* Header Card - Restored Old Design */}
                {showAgents && (
                    <div className="agent-card data-manager-agent mb-6">
                        <div className="agent-icon-wrapper">
                            <div className="hexagon-frame">
                                <div className="glow-effect teal-glow"></div>
                                <Cpu className="h-24 w-24 agent-icon teal-icon" />
                                <div className="data-particles"></div>
                            </div>
>>>>>>> Ruthra
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-teal-400 mb-0.5 tracking-wide uppercase">The Quantum Analyst</h2>
                            <div className="text-gray-300 text-sm font-medium mb-3">Data Manager.AI</div>
                            <div className="flex items-center">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#2ecc71] mr-2.5 shadow-[0_0_8px_rgba(46,204,113,0.5)]"></span>
                                <span className="text-gray-400 text-xs font-medium tracking-wide">Optimizing data quality across all domains</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Control Bar */}
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-col items-start">
                            <button
                                onClick={() => navigate('/ai-agents')}
                                className="flex items-center gap-2 mb-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-all group">
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                <span>Back to AI Agents Hub</span>
                            </button>
                            <h1 className="text-2xl font-bold text-blue-900 tracking-tight ml-3">Data Manager.AI</h1>
                            <p className="text-sm text-gray-500 font-medium ml-3">AI-powered data quality management and reconciliation</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 relative">
                            {/* Study Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsStudyDropdownOpen(!isStudyDropdownOpen)}
                                    className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 w-[280px] hover:border-blue-400 transition-colors shadow-sm">
                                    <span className="line-clamp-1">{selectedStudy}</span>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </button>
                                {isStudyDropdownOpen && (
                                    <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1">
                                        {studies.map((study) => (
                                            <div
                                                key={study}
                                                onClick={() => {
                                                    setSelectedStudy(study);
                                                    setIsStudyDropdownOpen(false);
                                                }}
                                                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-blue-50 text-gray-700 cursor-pointer transition-colors"
                                            >
                                                {selectedStudy === study && <Check className="h-4 w-4 text-blue-600 mr-2" />}
                                                <span className={selectedStudy === study ? 'text-blue-600' : ''}>{study}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm h-11">
                                <span className="text-sm font-bold text-gray-900 whitespace-nowrap leading-none">Task Assignment Mode:</span>
                                <span className={`text-sm font-bold min-w-[90px] ${isAgentMode ? 'text-[#2563eb]' : 'text-gray-500'}`}>{isAgentMode ? 'Agent.AI' : 'Human-in-Loop'}</span>
                                <div
                                    onClick={toggleAgentMode}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${isAgentMode ? 'bg-[#2563eb]' : 'bg-gray-200'}`}
                                >
                                    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${isAgentMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            <button
                                onClick={handleRunMonitor}
                                disabled={isRunning}
                                className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold bg-[#2563eb] text-white hover:bg-blue-700 h-11 px-6 shadow-md shadow-blue-200 transition-all active:scale-95 disabled:opacity-50">
                                {isRunning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                                {isRunning ? 'Running checks...' : 'Run DQ and Reconciliation'}
                            </button>

                            <button
                                onClick={() => {
                                    setIsRefreshing(true);
                                    setTimeout(() => setIsRefreshing(false), 3000);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-11 px-4 shadow-sm transition-all">
                                <RefreshCw className={`h-4 w-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh Agents
                            </button>

                            <button
                                onClick={() => setShowAgents(!showAgents)}
                                className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 h-11 px-4 shadow-sm transition-all"
                            >
                                {showAgents ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-blue-600" />}
                                {showAgents ? 'Hide Agents' : 'Show Agents'}
                            </button>
                        </div>
                    </div>

                    {/* Blue Info Card */}
                    <div className="mt-6 bg-[#f0f9ff] rounded-xl border border-blue-100 p-6 flex gap-4">
                        <div className="bg-white p-2.5 rounded-lg border border-blue-50 shadow-sm h-fit">
                            <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-blue-900 leading-none">Intelligent monitoring active</h3>
                            <ul className="space-y-2.5">
                                <li className="flex items-center gap-3 text-[15px] font-bold text-[#0369a1]">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    AI agents actively monitor data refresh events to automatically trigger quality checks
                                </li>
                                <li className="flex items-center gap-3 text-[15px] font-bold text-[#0369a1]">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Cross-data reconciliation maps subjects across EDC, Labs, and external data sources
                                </li>
                                <li className="flex items-center gap-3 text-[15px] font-bold text-[#0369a1]">
                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    Protocol compliance verification compares data to study specifications
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Rendering */}
                {isRunning && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-blue-900">System performing comprehensive DQ analysis...</span>
                            <span className="text-lg font-black text-blue-600 uppercase tracking-tighter">{progress}%</span>
                        </div>
                        <div className="h-4 w-full bg-blue-100 rounded-full overflow-hidden border border-blue-50 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Agents Section - Conditionally Hidden */}
                {showAgents && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                        {/* 5 Agent Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Card 1: Data Fetch Agent */}
<<<<<<< HEAD
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
=======
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
>>>>>>> Ruthra
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <Database className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-bold uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        active
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">Data Fetch Agent</h3>
                                <p className="text-xs text-gray-500 mb-4 h-10 line-clamp-2">Listening for data refresh events from all integrated sources</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Records in progress:</span>
                                        <span className="text-blue-600 font-bold">0</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-0"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                        <RefreshCw className="h-3 w-3" /> 21 minutes ago
                                        <span className="ml-auto bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">1 records</span>
                                    </div>
                                </div>
                            </div>
                            {/* Card 2: DQ Processing */}
<<<<<<< HEAD
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
=======
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
>>>>>>> Ruthra
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-bold uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        active
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">DQ Processing</h3>
                                <p className="text-xs text-gray-500 mb-4 h-10 line-clamp-2">Running data quality checks across all SDTM domains</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Records in progress:</span>
                                        <span className="text-indigo-600 font-bold">45</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[45%]"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                        <RefreshCw className="h-3 w-3" /> 21 minutes ago
                                        <span className="ml-auto bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">40 issues</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Reconciliation */}
<<<<<<< HEAD
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
=======
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
>>>>>>> Ruthra
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
                                        <Share2 className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-bold uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        active
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">Reconciliation</h3>
                                <p className="text-xs text-gray-500 mb-4 h-10 line-clamp-2">Cross-checking data consistency between sources</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Records in progress:</span>
                                        <span className="text-teal-600 font-bold">0</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal-500 w-0"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                        <RefreshCw className="h-3 w-3" /> Nov 6, 10:52 PM
                                        <span className="ml-auto bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100">0 issues</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Protocol Check */}
<<<<<<< HEAD
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
=======
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
>>>>>>> Ruthra
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-bold uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        active
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">Protocol Check</h3>
                                <p className="text-xs text-gray-500 mb-4 h-10 line-clamp-2">Verifying adherence to protocol procedures</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Records in progress:</span>
                                        <span className="text-orange-600 font-bold">16</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[16%]"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                        <RefreshCw className="h-3 w-3" /> Apr 24, 09:46 AM
                                        <span className="ml-auto bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-100">Trial 1</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Task Manager */}
<<<<<<< HEAD
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
=======
                            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
>>>>>>> Ruthra
                                <div className="flex justify-between items-start mb-3">
                                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                                        <ClipboardList className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-bold uppercase">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        active
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">Task Manager</h3>
                                <p className="text-xs text-gray-500 mb-4 h-10 line-clamp-2">Creating tasks based on detected issues</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-500">Tasks in progress:</span>
                                        <span className="text-purple-600 font-bold">0</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-0"></div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2">
                                        <RefreshCw className="h-3 w-3" /> Nov 6, 10:52 PM
                                        <span className="ml-auto bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100">1 tasks</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agent Activity Log */}
                        <div className="bg-[#0f172a] rounded-2xl p-6 text-xs relative shadow-2xl overflow-hidden border border-slate-800">
                            <div className="absolute top-4 right-4 flex gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-red-500/80"></div>
                                <div className="h-2 w-2 rounded-full bg-yellow-500/80"></div>
                                <div className="h-2 w-2 rounded-full bg-green-500/80"></div>
                            </div>
                            <h4 className="text-white text-sm font-bold mb-4 flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-3 animate-pulse"></span>
                                Agent Activity Log <span className="ml-2 text-gray-400 font-normal">Real-time processing</span>
                            </h4>
                            <div className="space-y-1.5 h-[160px] overflow-y-auto custom-scrollbar font-mono">
                                {logs.map((log, index) => {
                                    // Basic syntax highlighting for the log
                                    const timeMatch = log.match(/^\[(.*?)\]/);
                                    const time = timeMatch ? timeMatch[0] : '';
                                    const rest = log.replace(time, '');
                                    const agentMatch = rest.match(/ \w+:/);
                                    const agent = agentMatch ? agentMatch[0] : '';
                                    const message = rest.replace(agent, '');

                                    let colorClass = "text-teal-400";
                                    if (agent.includes("DataQuality")) colorClass = "text-blue-400";
                                    if (agent.includes("Reconciliation")) colorClass = "text-purple-400";
                                    if (agent.includes("Error")) colorClass = "text-red-400";

                                    return (
                                        <div key={index} className="opacity-90 hover:opacity-100 transition-opacity">
                                            <span className="text-gray-500">{time}</span>
                                            <span className={colorClass}>{agent}</span>
                                            <span className="text-gray-300">{message}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Sections - Update for Tabs */}
                <div className="space-y-6">
                    {/* Tabs Navigation */}
<<<<<<< HEAD
                    <div className="flex bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm overflow-x-auto w-fit">
=======
                    <div className="flex bg-slate-100/80 backdrop-blur-sm rounded-xl p-1.5 shadow-inner overflow-x-auto w-fit border border-slate-200">
>>>>>>> Ruthra
                        {['DQ and Reconciliation', 'Tasks', 'Reports', 'Event Monitoring', 'Domain Progress', 'Agent Workflow', 'Settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
<<<<<<< HEAD
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#2563eb] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
=======
                                className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-300 ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm shadow-blue-900/5 ring-1 ring-black/5 scale-[1.02]' : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'}`}
>>>>>>> Ruthra
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* DQ and Reconciliation Tab Content */}
                    {activeTab === 'DQ and Reconciliation' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Filters */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Type Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setIsTypeDropdownOpen(!isTypeDropdownOpen);
                                                setIsCategoryDropdownOpen(false);
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 min-w-[200px] hover:border-blue-400 transition-colors shadow-sm">
                                            <span className="line-clamp-1">{selectedType}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180' : 'opacity-50'}`} />
                                        </button>
                                        {isTypeDropdownOpen && (
<<<<<<< HEAD
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1 border-gray-100">
=======
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 slide-in-from-top-2 p-1.5 mt-1 ring-1 ring-black/5">
>>>>>>> Ruthra
                                                {filterTypes.map((type) => (
                                                    <div
                                                        key={type}
                                                        onClick={() => {
                                                            setSelectedType(type);
                                                            setIsTypeDropdownOpen(false);
                                                        }}
<<<<<<< HEAD
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedType === type && <Check className="h-4 w-4 text-gray-900" />}
=======
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-blue-50/50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedType === type && <Check className="h-4 w-4 text-blue-600" />}
>>>>>>> Ruthra
                                                        </div>
                                                        <span className={selectedType === type ? 'text-gray-900 font-bold' : ''}>{type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Category Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                                                setIsTypeDropdownOpen(false);
                                                setIsStatusDropdownOpen(false);
                                            }}
                                            className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 min-w-[180px] hover:border-blue-400 transition-colors shadow-sm">
                                            <span className="line-clamp-1">{selectedCategory}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : 'opacity-50'}`} />
                                        </button>
                                        {isCategoryDropdownOpen && (
<<<<<<< HEAD
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1 border-gray-100">
=======
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 slide-in-from-top-2 p-1.5 mt-1 ring-1 ring-black/5">
>>>>>>> Ruthra
                                                {filterCategories.map((cat) => (
                                                    <div
                                                        key={cat}
                                                        onClick={() => {
                                                            setSelectedCategory(cat);
                                                            setIsCategoryDropdownOpen(false);
                                                        }}
<<<<<<< HEAD
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedCategory === cat && <Check className="h-4 w-4 text-gray-900" />}
=======
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-blue-50/50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedCategory === cat && <Check className="h-4 w-4 text-blue-600" />}
>>>>>>> Ruthra
                                                        </div>
                                                        <span className={selectedCategory === cat ? 'text-gray-900 font-bold' : ''}>{cat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                                                setIsTypeDropdownOpen(false);
                                                setIsCategoryDropdownOpen(false);
                                            }}
                                            className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 min-w-[180px] hover:border-blue-400 transition-colors shadow-sm">
                                            <span className="line-clamp-1">{selectedStatus}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isStatusDropdownOpen ? 'rotate-180' : 'opacity-50'}`} />
                                        </button>
                                        {isStatusDropdownOpen && (
<<<<<<< HEAD
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1 border-gray-100">
=======
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 slide-in-from-top-2 p-1.5 mt-1 ring-1 ring-black/5">
>>>>>>> Ruthra
                                                {filterStatuses.map((status) => (
                                                    <div
                                                        key={status}
                                                        onClick={() => {
                                                            setSelectedStatus(status);
                                                            setIsStatusDropdownOpen(false);
                                                        }}
<<<<<<< HEAD
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedStatus === status && <Check className="h-4 w-4 text-gray-900" />}
=======
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-blue-50/50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedStatus === status && <Check className="h-4 w-4 text-blue-600" />}
>>>>>>> Ruthra
                                                        </div>
                                                        <span className={selectedStatus === status ? 'text-gray-900 font-bold' : ''}>{status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                    <Share2 className="h-4 w-4" />
                                    Export
                                </button>
                            </div>

                            {/* Table */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Type</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Category</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide w-1/3">Title</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Severity</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Domain</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Created</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredData.map((issue) => (
<<<<<<< HEAD
                                                <tr key={issue.id} className="hover:bg-blue-50/30 transition-colors group">
=======
                                                <tr key={issue.id} className="hover:bg-blue-50/50 transition-all duration-200 group border-b border-gray-50/50 hover:border-blue-100/50">
>>>>>>> Ruthra
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-blue-600 whitespace-nowrap">{issue.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
<<<<<<< HEAD
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${issue.type === 'Missing Data' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-800'}`}>
=======
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap backdrop-blur-md border ${issue.type === 'Missing Data' ? 'bg-blue-50/80 text-blue-700 border-blue-200' : 'bg-orange-50/80 text-orange-800 border-orange-200'}`}>
>>>>>>> Ruthra
                                                            {issue.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${issue.category === 'DQ' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                            {issue.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 leading-snug min-w-[200px]">{issue.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyles(issue.status)}`}>
                                                            {issue.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${issue.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                            {issue.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{issue.domain}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">{issue.created}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap">View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredData.length === 0 && (
                                                <tr>
                                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 font-medium">
                                                        No issues found matching the selected filters.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Tasks' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Task Filters */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsTaskStatusDropdownOpen(!isTaskStatusDropdownOpen)}
                                            className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 min-w-[200px] hover:border-blue-400 transition-colors shadow-sm">
                                            <span className="line-clamp-1">{selectedTaskStatus}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isTaskStatusDropdownOpen ? 'rotate-180' : 'opacity-50'}`} />
                                        </button>
                                        {isTaskStatusDropdownOpen && (
<<<<<<< HEAD
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1 border-gray-100">
=======
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 slide-in-from-top-2 p-1.5 mt-1 ring-1 ring-black/5">
>>>>>>> Ruthra
                                                {taskStatuses.map((status) => (
                                                    <div
                                                        key={status}
                                                        onClick={() => {
                                                            setSelectedTaskStatus(status);
                                                            setIsTaskStatusDropdownOpen(false);
                                                        }}
<<<<<<< HEAD
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedTaskStatus === status && <Check className="h-4 w-4 text-gray-900" />}
=======
                                                        className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-blue-50/50 text-gray-700 cursor-pointer transition-colors"
                                                    >
                                                        <div className="w-5 flex items-center justify-center mr-2">
                                                            {selectedTaskStatus === status && <Check className="h-4 w-4 text-blue-600" />}
>>>>>>> Ruthra
                                                        </div>
                                                        <span className={selectedTaskStatus === status ? 'text-gray-900 font-bold' : ''}>{status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                    <Share2 className="h-4 w-4" />
                                    Export
                                </button>
                            </div>

                            {/* Tasks Table */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">ID</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide w-1/4">Title</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Assigned To</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Due Date</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Created</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Study</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Related Issue</th>
                                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {paginatedTasks.map((task) => (
<<<<<<< HEAD
                                                <tr key={task.id} className="hover:bg-blue-50/30 transition-colors group">
=======
                                                <tr key={task.id} className="hover:bg-blue-50/50 transition-all duration-200 group border-b border-gray-50/50 hover:border-blue-100/50">
>>>>>>> Ruthra
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-blue-600 whitespace-nowrap">{task.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 leading-snug min-w-[200px]">{task.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusStyles(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-700 whitespace-nowrap">{task.assignedTo}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-600 whitespace-nowrap">{task.dueDate}</td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">{task.created}</td>
                                                    <td className="px-6 py-4">
<<<<<<< HEAD
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 uppercase whitespace-nowrap">
=======
                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase whitespace-nowrap backdrop-blur-md">
>>>>>>> Ruthra
                                                            {task.study}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 whitespace-nowrap">{task.relatedIssue}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors whitespace-nowrap">View</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {paginatedTasks.length === 0 && (
                                                <tr>
                                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500 font-medium">
                                                        No tasks found matching the selected status.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tasks Pagination Footer */}
                            <div className="px-8 py-5 bg-white border border-gray-100 border-t-0 rounded-b-xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setTasksCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={tasksCurrentPage === 1}
                                        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold transition-all ${tasksCurrentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95'}`}>
                                        <ChevronLeft className="h-4 w-4" /> Previous
                                    </button>
                                    <button
                                        onClick={() => setTasksCurrentPage(prev => Math.min(Math.ceil(filteredTasks.length / tasksRowsPerPage), prev + 1))}
                                        disabled={tasksCurrentPage >= Math.ceil(filteredTasks.length / tasksRowsPerPage)}
                                        className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold transition-all ${tasksCurrentPage >= Math.ceil(filteredTasks.length / tasksRowsPerPage) ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95'}`}>
                                        Next <ChevronLeft className="h-4 w-4 rotate-180" />
                                    </button>
                                </div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
                                    Showing <span className="text-gray-900">{filteredTasks.length === 0 ? 0 : (tasksCurrentPage - 1) * tasksRowsPerPage + 1}-{Math.min(tasksCurrentPage * tasksRowsPerPage, filteredTasks.length)}</span> of <span className="text-gray-900">{filteredTasks.length}</span> tasks
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={tasksRowsPerPage}
                                            onChange={(e) => {
                                                setTasksRowsPerPage(Number(e.target.value));
                                                setTasksCurrentPage(1);
                                            }}
                                            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-gray-700 focus:outline-none hover:border-blue-400 transition-colors cursor-pointer min-w-[80px]">
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">per page</span>
                                </div>
                            </div>

                            {/* DB Lock Compliance Dashboard */}
                            <div className="space-y-6 pt-8 border-t border-gray-100 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
                                <h2 className="text-2xl font-bold text-gray-900 px-2 uppercase tracking-tight">DB Lock Compliance Dashboard</h2>

                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6 space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-blue-700">
                                            <LayoutDashboard className="h-5 w-5" />
                                            <h3 className="font-bold text-lg">DB Lock Compliance Overview</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Status</div>
                                                <div className="text-[#2563eb] text-xl font-bold mb-1">IN PROGRESS</div>
                                                <div className="text-sm text-gray-500 font-medium">Est. Lock Date: 1/24/2026</div>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Overall Readiness</div>
                                                <div className="text-[#2563eb] text-3xl font-extrabold mb-4">75%</div>
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                                                </div>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Outstanding Issues</div>
                                                <div className="text-[#ea580c] text-3xl font-extrabold mb-3">8</div>
                                                <div className="text-sm text-gray-500 font-medium font-sans">Across 3 sites</div>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Site Readiness</div>
                                                <div className="space-y-2 font-medium text-xs leading-relaxed">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Complete</span>
                                                        <span className="font-bold text-gray-900">0/3</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">Ready</span>
                                                        <span className="font-bold text-gray-900">1/3</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-gray-600">In Progress</span>
                                                        <span className="font-bold text-gray-900">2/3</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                        <h4 className="font-bold text-[#2563eb]">Site-Level DB Lock Compliance</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#f8fafc]">
                                                    <tr className="border-b border-gray-100">
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Site</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide w-1/4">Readiness</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Outstanding Issues</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Last Updated</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {[
                                                        { site: 'Boston Medical Center', status: 'IN PROGRESS', readiness: 78, issues: 4, updated: '12/23/2025' },
                                                        { site: 'Chicago Research Hospital', status: 'READY', readiness: 92, issues: 0, updated: '12/24/2025' },
                                                        { site: 'Denver Health Institute', status: 'IN PROGRESS', readiness: 67, issues: 8, updated: '12/22/2025' },
                                                    ].map((row, i) => (
                                                        <tr key={i} className="hover:bg-blue-50/10 transition-colors">
                                                            <td className="px-6 py-5 text-sm font-bold text-gray-900">{row.site}</td>
                                                            <td className="px-6 py-5">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${row.status === 'READY' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#dbeafe] text-[#1e40af]'
                                                                    }`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm font-bold text-gray-700 min-w-[35px]">{row.readiness}%</span>
                                                                    <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.readiness}%` }} />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5 text-sm font-bold text-gray-900">{row.issues}</td>
                                                            <td className="px-6 py-5 text-sm text-gray-500">{row.updated}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Reports' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
                            {/* Image 1: Header & Overall Study Health */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Study Health Dashboard</h2>
                                <div className="flex items-center gap-3">
                                    {/* Removed redundant study dropdown */}
                                    <button className="h-12 px-6 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                        <Share2 className="h-4 w-4" />
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            {/* Overall Study Health Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Overall Study Health</h3>
                                    <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold">85% Healthy</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {[
                                        { label: 'Data Quality', value: '85%' },
                                        { label: 'Compliance', value: '92%' },
                                        { label: 'Protocol Adherence', value: '78%' },
                                        { label: 'Vendor Performance', value: '88%' },
                                        { label: 'DB Compliance', value: '90%' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-blue-50/30 rounded-2xl p-6 text-center border border-blue-50 transition-all hover:shadow-md">
                                            <div className="text-3xl font-black text-blue-600 mb-2">{stat.value}</div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image 2: Issues and Vendor Performance */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* DQ & Reconciliation Issues */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900">DQ & Reconciliation Issues</h3>
                                        <div className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">Updated 2 hours ago</div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">Issue Status Distribution</div>
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                                {[
                                                    { label: 'Open Issues', count: 42, color: 'bg-red-500' },
                                                    { label: 'In Review', count: 28, color: 'bg-orange-400' },
                                                    { label: 'In Progress', count: 15, color: 'bg-blue-500' },
                                                    { label: 'Resolved', count: 68, color: 'bg-green-500' },
                                                ].map((item, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                                                                <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                                        </div>
                                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${(item.count / 153) * 100}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">Issue Type Breakdown</div>
                                            <div className="flex gap-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                                                    <span className="text-sm font-bold text-gray-900">Data Quality <span className="text-gray-400 ml-1">65%</span></span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                                                    <span className="text-sm font-bold text-gray-900">Reconciliation <span className="text-gray-400 ml-1">35%</span></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-6 border-t border-gray-50 space-y-4">
                                            <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">AI Detection Metrics</div>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-gray-600">Issues Identified by AI</span>
                                                    <span className="text-sm font-bold text-gray-900">87%</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-gray-600">Issues Identified Manually</span>
                                                    <span className="text-sm font-bold text-gray-900">13%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vendor Response Performance */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold text-gray-900">Vendor Response Performance</h3>
                                        <div className="text-xs font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">Last 30 days</div>
                                    </div>
                                    <div className="space-y-8">
                                        {[
                                            { name: 'IQVIA (CRO)', avg: '1.2 days', sla: '2 days', status: 'On time', color: 'bg-green-500', statusColor: 'bg-green-100 text-green-700' },
                                            { name: 'Labcorp (Lab)', avg: '2.4 days', sla: '2 days', status: 'Slightly delayed', color: 'bg-yellow-500', statusColor: 'bg-yellow-100 text-yellow-700' },
                                            { name: 'Medidata (EDC)', avg: '0.8 days', sla: '1 day', status: 'On time', color: 'bg-green-500', statusColor: 'bg-green-100 text-green-700' },
                                            { name: 'Calyx (Imaging)', avg: '3.6 days', sla: '2 days', status: 'Delayed', color: 'bg-red-500', statusColor: 'bg-red-100 text-red-700' },
                                        ].map((vendor, i) => (
                                            <div key={i} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-bold text-gray-900">{vendor.name}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vendor.statusColor}`}>{vendor.status}</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${vendor.color} rounded-full`} style={{ width: i === 0 ? '75%' : i === 1 ? '90%' : i === 2 ? '85%' : '65%' }} />
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <span>Average: {vendor.avg}</span>
                                                    <span>SLA: {vendor.sla}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Image 3: Issues Tracking & SLA Compliance */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Issues Tracking & SLA Compliance</h3>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsReportDomainDropdownOpen(!isReportDomainDropdownOpen)}
                                            className="flex h-10 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 min-w-[180px] hover:border-blue-400 transition-all">
                                            <span>{selectedReportDomain}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform ${isReportDomainDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isReportDomainDropdownOpen && (
                                            <div className="absolute top-11 right-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 border-gray-100">
                                                {reportDomains.map((domain) => (
                                                    <div
                                                        key={domain}
                                                        onClick={() => {
                                                            setSelectedReportDomain(domain);
                                                            setIsReportDomainDropdownOpen(false);
                                                        }}
                                                        className="px-3 py-2 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer rounded-md">
                                                        {domain}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Issues', value: 153, color: 'text-gray-900' },
                                        { label: 'Open Issues', value: 85, color: 'text-orange-500' },
                                        { label: 'Overdue Issues', value: 23, color: 'text-red-500' },
                                        { label: 'Resolved Issues', value: 68, color: 'text-green-600' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center shadow-sm">
                                            <div className={`text-4xl font-extrabold mb-1 ${stat.color}`}>{stat.value}</div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-[#f8fafc] border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Issue ID</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking_widest">Data Domain</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking_widest">Type</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking_widest">Severity</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking_widest">Status</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking_widest">SLA Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredReportIssues.map((issue) => (
                                                    <tr key={issue.id} className="hover:bg-blue-50/10 transition-colors">
                                                        <td className="px-6 py-5 text-sm font-bold text-blue-600">{issue.id}</td>
                                                        <td className="px-6 py-5 text-sm font-bold text-gray-900">{issue.domain}</td>
                                                        <td className="px-6 py-5 text-sm font-semibold text-gray-600">{issue.type}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${issue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                                issue.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                                                                    issue.severity === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                                }`}>{issue.severity}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                                issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-50 text-orange-700'
                                                                }`}>{issue.status}</span>
                                                        </td>
                                                        <td className="px-6 py-5 text-sm font-semibold text-gray-600">{issue.dueDate}</td>
                                                        <td className="px-6 py-5">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${issue.slaStatus === 'On Track' ? 'bg-green-50 text-green-700' :
                                                                issue.slaStatus === 'Overdue' ? 'bg-red-50 text-red-700' : 'bg-green-100 text-green-700'
                                                                }`}>{issue.slaStatus}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-100 flex items-center justify-between">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                                            <ChevronLeft className="h-4 w-4" /> Previous
                                        </button>
                                        <div className="text-sm font-bold text-gray-500">Showing <span className="text-gray-900">1-5</span> of 153 issues</div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                                            Next <ChevronLeft className="h-4 w-4 rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Image 4: Database Compliance */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                                <h3 className="text-2xl font-bold text-gray-900">Database Compliance</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {[
                                        { label: 'SDTM Compliance', value: '92%', subLeft: 'Standards Version:', subLeftVal: 'SDTM v2.0', subRight: 'Last Validation:', subRightVal: 'Apr 1, 2025', color: 'bg-green-500' },
                                        { label: 'Missing Data', value: '6.5%', subLeft: 'Required Fields Missing:', subLeftVal: '42', subRight: 'Expected Data Points:', subRightVal: '12,568', color: 'bg-orange-400' },
                                        { label: 'Data Consistency', value: '94%', subLeft: 'Cross-Domain Consistency:', subLeftVal: '97%', subRight: 'Internal Consistency:', subRightVal: '91%', color: 'bg-green-500' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-gray-900">{stat.label}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${i === 1 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{stat.value}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.value }} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.subLeft}</div>
                                                    <div className="text-xs font-bold text-gray-900">{stat.subLeftVal}</div>
                                                </div>
                                                <div className="space-y-1 text-right">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{stat.subRight}</div>
                                                    <div className="text-xs font-bold text-gray-900">{stat.subRightVal}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-700">Recent Data Validation Issues</h4>
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#f8fafc]">
                                                    <tr>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Issue Type</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Domain</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Affected Records</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Severity</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {(studyValidationIssues[selectedStudy] || []).map((issue: any, i: number) => (
                                                        <tr key={i} className="hover:bg-blue-50/10 transition-colors">
                                                            <td className="px-6 py-4 text-sm font-bold text-gray-700">{issue.type}</td>
                                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{issue.domain}</td>
                                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{issue.records}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${issue.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                                                                    issue.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                                                    }`}>{issue.severity}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                                    issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-50 text-orange-700'
                                                                    }`}>{issue.status}</span>
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
                    ) : activeTab === 'Event Monitoring' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
                            {/* Header Section */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Event Monitoring</h2>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)}
                                            className="flex h-11 items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-600 min-w-[200px] hover:border-blue-400 transition-all shadow-sm">
                                            <span>{selectedEventType}</span>
                                            <ChevronDown className={`h-4 w-4 transition-transform ${isEventTypeDropdownOpen ? 'rotate-180' : 'opacity-50'}`} />
                                        </button>
                                        {isEventTypeDropdownOpen && (
                                            <div className="absolute top-12 left-0 z-50 w-full rounded-lg border bg-white shadow-xl animate-in fade-in zoom-in-95 p-1 mt-1 border-gray-100">
                                                {eventTypes.map((type) => (
                                                    <div
                                                        key={type}
                                                        onClick={() => {
                                                            setSelectedEventType(type);
                                                            setIsEventTypeDropdownOpen(false);
                                                        }}
                                                        className="px-3 py-2.5 text-sm font-medium hover:bg-gray-50 text-gray-700 cursor-pointer rounded-md transition-colors">
                                                        {type}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                        <Share2 className="h-4 w-4" />
                                        Export Logs
                                    </button>
                                </div>
                            </div>

                            {/* Event Logs Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                {/* Filter Bar */}
                                <div className="bg-white px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">Event Logs</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-[#f8fafc] rounded-lg border border-gray-100 px-3 py-1.5 gap-3">
                                            <div className="relative flex items-center">
                                                <Calendar className="absolute left-0 h-4 w-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    value={eventStartDate}
                                                    onChange={(e) => setEventStartDate(e.target.value)}
                                                    className="bg-transparent border-none text-sm font-bold text-gray-700 focus:outline-none cursor-pointer pl-6"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">to</span>
                                            <div className="relative flex items-center">
                                                <Calendar className="absolute left-0 h-4 w-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    value={eventEndDate}
                                                    onChange={(e) => setEventEndDate(e.target.value)}
                                                    className="bg-transparent border-none text-sm font-bold text-gray-700 focus:outline-none cursor-pointer pl-6"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setAppliedEventStartDate(eventStartDate);
                                                setAppliedEventEndDate(eventEndDate);
                                            }}
                                            className="h-10 px-5 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Logs Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-[#94a3b8] text-[11px] font-black uppercase tracking-[0.1em] border-b border-gray-100">
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Timestamp</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Event ID</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Event Type</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Source</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">User</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Description</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Status</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {paginatedEventLogs.length > 0 ? (
                                                paginatedEventLogs.map((log, i) => (
                                                    <tr key={i} className="hover:bg-blue-50/10 transition-colors">
                                                        <td className="px-8 py-6 text-sm font-semibold text-gray-600 tabular-nums whitespace-nowrap">{log.timestamp}</td>
                                                        <td className="px-8 py-6 text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap">{log.id}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${log.type === 'AI' ? 'bg-[#dbeafe] text-[#1e40af]' :
                                                                log.type === 'Data' ? 'bg-[#f3e8ff] text-[#6b21a8]' :
                                                                    log.type === 'User' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#ffe4e6] text-[#9f1239]'
                                                                }`}>{log.type}</span>
                                                        </td>
                                                        <td className="px-8 py-6 text-sm font-bold text-gray-900 whitespace-nowrap">{log.source}</td>
                                                        <td className="px-8 py-6 text-sm font-bold text-gray-900 whitespace-nowrap">{log.user}</td>
                                                        <td className="px-8 py-6 text-sm font-semibold text-gray-600 leading-snug">{log.description}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${log.status === 'Completed' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                                                                {log.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600">
                                                                <Maximize2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8} className="px-8 py-12 text-center text-gray-400 font-bold">No event logs found for the selected criteria.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Footer */}
                                <div className="px-8 py-5 bg-white border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95'}`}>
                                            <ChevronLeft className="h-4 w-4" /> Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredEventLogs.length / rowsPerPage), prev + 1))}
                                            disabled={currentPage >= Math.ceil(filteredEventLogs.length / rowsPerPage)}
                                            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold transition-all ${currentPage >= Math.ceil(filteredEventLogs.length / rowsPerPage) ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-50 shadow-sm active:scale-95'}`}>
                                            Next <ChevronLeft className="h-4 w-4 rotate-180" />
                                        </button>
                                    </div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">
                                        Showing <span className="text-gray-900">{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredEventLogs.length)}</span> of <span className="text-gray-900">{filteredEventLogs.length}</span> events
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <select
                                                value={rowsPerPage}
                                                onChange={(e) => {
                                                    setRowsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-bold text-gray-700 focus:outline-none hover:border-blue-400 transition-colors cursor-pointer min-w-[80px]">
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Domain Progress' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
                            {/* Header Section */}
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Domain Progress</h2>
                                <div className="flex items-center gap-3">
                                    <button className="h-11 px-6 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-bold flex items-center gap-2 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                                        <Share2 className="h-4 w-4" />
                                        Export Progress
                                    </button>
                                </div>
                            </div>

                            {/* Progress Dashboard */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900">SDTM Domain Progress</h3>
                                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-black tracking-tight">
                                        Overall: {Math.round(domainProgressData[selectedStudy].reduce((acc, curr) => acc + curr.percentage, 0) / domainProgressData[selectedStudy].length)}% Complete
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {domainProgressData[selectedStudy].map((domain, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
                                                    <span className="font-bold text-gray-700">{domain.label} ({domain.code})</span>
                                                </div>
                                                <div className="font-bold text-gray-500">
                                                    <span className="text-gray-400 mr-2 font-medium">{domain.percentage}%</span>
                                                    ({domain.recordsText})
                                                </div>
                                            </div>
                                            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(37,99,235,0.2)]"
                                                    style={{ width: `${domain.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Timeline Section */}
                                <div className="mt-12 bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Data Collection Timeline</h4>
                                    </div>

                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <div>Study Start: <span className="text-gray-600">{studyTimelineData[selectedStudy].start}</span></div>
                                        <div>Current Date: <span className="text-gray-600">{studyTimelineData[selectedStudy].current}</span></div>
                                        <div>Estimated Completion: <span className="text-gray-600">{studyTimelineData[selectedStudy].end}</span></div>
                                    </div>

                                    <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-blue-100 p-0.5">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-sm"
                                            style={{ width: `${studyTimelineData[selectedStudy].progress}%` }}
                                        ></div>
                                    </div>

                                    <div className="text-center text-xs font-bold text-gray-500 tracking-tight lowercase">
                                        Study progress: <span className="text-blue-600">{studyTimelineData[selectedStudy].progress}%</span> ({studyTimelineData[selectedStudy].monthsText})
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'Agent Workflow' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                            {/* Header Section */}
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-4">
                                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agent Workflow Management</h2>
                                <p className="text-gray-500 font-medium max-w-4xl text-sm leading-relaxed">
                                    Configure how data management AI agents work together. Set up dependencies between agents and define execution order. Available agents include: Data Fetch, Data Quality, Data Reconciliation, Domain Progress, and Report Generator.
                                </p>

                                <div className="pt-4 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        Agent Workflow Dependencies
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setWorkflowModalMode('add');
                                            setWorkflowForm({ name: '', description: '', agentType: 'Data Fetch', executionMode: 'Sequential', prerequisites: [], enabled: true });
                                            setIsWorkflowModalOpen(true);
                                        }}
                                        className="h-11 px-6 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                        <Plus className="h-5 w-5" />
                                        Add Workflow
                                    </button>
                                </div>
                            </div>

                            {/* Workflow Table Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-gray-50">
                                    <h3 className="text-xl font-bold text-gray-900">Workflow Configuration</h3>
                                    <p className="text-sm text-gray-400 font-bold mt-1">Define how AI agents collaborate in the DataManagerAI system. Configure dependencies and execution modes to optimize automation.</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-[#94a3b8] text-[11px] font-black uppercase tracking-[0.1em] border-b border-gray-100">
                                                <th className="px-8 py-5">Agent Type</th>
                                                <th className="px-8 py-5">Workflow Name</th>
                                                <th className="px-8 py-5">Execution Mode</th>
                                                <th className="px-8 py-5">Dependencies</th>
                                                <th className="px-8 py-5">Status</th>
                                                <th className="px-8 py-5">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {workflows.map((wf) => (
                                                <tr key={wf.id} className="hover:bg-blue-50/5 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            {wf.agentType === 'Data Quality' ? (
                                                                <div className="h-4 w-4 rounded-full border border-green-500 flex items-center justify-center">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                                </div>
                                                            ) : (
                                                                <div className="h-4 w-4 rounded-full bg-[#dbeafe] flex items-center justify-center">
                                                                    <ArrowDown className="h-3 w-3 text-blue-600" />
                                                                </div>
                                                            )}
                                                            <span className="text-sm font-black text-gray-900">{wf.agentType}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900">{wf.name}</div>
                                                            <div className="text-xs font-bold text-gray-400 mt-0.5">{wf.description}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            {wf.executionMode === 'Sequential' ? (
                                                                <ArrowDown className="h-4 w-4 text-blue-500" />
                                                            ) : wf.executionMode === 'Independent' ? (
                                                                <ArrowRight className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <ChevronsUpDown className="h-4 w-4 text-orange-500" />
                                                            )}
                                                            <span className="text-sm font-bold text-gray-700">{wf.executionMode}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {wf.dependencies.map(dep => (
                                                                <span key={dep} className="px-3 py-1 bg-[#eff6ff] text-[#2563eb] rounded-full text-[10px] font-black tracking-tight border border-[#dbeafe]">
                                                                    {dep}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase w-fit tracking-wide ${wf.status ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                            <div className={`h-1.5 w-1.5 rounded-full ${wf.status ? 'bg-[#22c55e]' : 'bg-red-500'}`}></div>
                                                            {wf.status ? 'Active' : 'Inactive'}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    setWorkflowModalMode('edit');
                                                                    setEditingWorkflowId(wf.id);
                                                                    setWorkflowForm({
                                                                        name: wf.name,
                                                                        description: wf.description,
                                                                        agentType: wf.agentType,
                                                                        executionMode: wf.executionMode,
                                                                        prerequisites: wf.dependencies,
                                                                        enabled: wf.status
                                                                    });
                                                                    setIsWorkflowModalOpen(true);
                                                                }}
                                                                className="p-2 bg-white rounded-lg border-2 border-gray-900 text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
                                                                <Settings className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setWorkflowToDelete(wf.id);
                                                                    setIsDeleteModalOpen(true);
                                                                }}
                                                                className="p-2 bg-white rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors shadow-sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-8 border-t border-gray-50 flex items-center justify-between">
                                    <div className="text-sm font-bold text-gray-400">Showing {workflows.length} workflows</div>
                                    <button
                                        onClick={() => {
                                            setWorkflowModalMode('add');
                                            setWorkflowForm({ name: '', description: '', agentType: 'Data Fetch', executionMode: 'Sequential', prerequisites: [], enabled: true });
                                            setIsWorkflowModalOpen(true);
                                        }}
                                        className="h-11 px-6 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                        <Plus className="h-5 w-5" />
                                        Add Workflow
                                    </button>
                                </div>
                            </div>

                            {/* Create/Edit Workflow Modal */}
                            {isWorkflowModalOpen && (
                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsWorkflowModalOpen(false)}></div>
                                    <div className="relative bg-white rounded-3xl w-[500px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">{workflowModalMode === 'add' ? 'Create Agent Workflow' : 'Edit Agent Workflow'}</h3>
                                                <p className="text-sm text-gray-400 font-bold mt-1">
                                                    {workflowModalMode === 'add' ? 'Configure how agents work together in the DataManagerAI system.' : 'Update the configuration for this workflow.'}
                                                </p>
                                            </div>
                                            <button onClick={() => setIsWorkflowModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                <X className="h-5 w-5 text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                            {/* Name */}
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right">Name</label>
                                                <input
                                                    value={workflowForm.name}
                                                    onChange={e => setWorkflowForm({ ...workflowForm, name: e.target.value })}
                                                    className="flex-1 h-12 rounded-xl border-2 border-gray-900 px-4 text-sm font-bold focus:outline-none placeholder:text-gray-300"
                                                    placeholder="My Workflow"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="flex items-start gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right pt-3">Description</label>
                                                <textarea
                                                    value={workflowForm.description}
                                                    onChange={e => setWorkflowForm({ ...workflowForm, description: e.target.value })}
                                                    className="flex-1 rounded-xl border border-gray-200 p-4 text-sm font-bold focus:outline-none min-h-[100px] hover:border-blue-400 transition-colors"
                                                    placeholder="What this workflow does..."
                                                ></textarea>
                                            </div>

                                            {/* Agent Type */}
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right">Agent Type</label>
                                                <div className="relative flex-1">
                                                    <select
                                                        value={workflowForm.agentType}
                                                        onChange={e => setWorkflowForm({ ...workflowForm, agentType: e.target.value })}
                                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-10 text-sm font-bold focus:outline-none appearance-none cursor-pointer hover:border-blue-400 transition-colors">
                                                        {workflowAgentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Execution Mode */}
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right">Execution Mode</label>
                                                <div className="relative flex-1">
                                                    <select
                                                        value={workflowForm.executionMode}
                                                        onChange={e => setWorkflowForm({ ...workflowForm, executionMode: e.target.value })}
                                                        className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-10 text-sm font-bold focus:outline-none appearance-none cursor-pointer hover:border-blue-400 transition-colors">
                                                        {workflowModes.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Prerequisites */}
                                            <div className="flex items-start gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right pt-3">Prerequisites</label>
                                                <div className="flex-1 rounded-xl border border-gray-100 bg-gray-50/30 p-4 space-y-3">
                                                    {workflowAgentTypes.filter(t => t !== workflowForm.agentType).map(t => (
                                                        <label key={t} className="flex items-center gap-3 cursor-pointer group">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={workflowForm.prerequisites.includes(t)}
                                                                    onChange={() => {
                                                                        const next = workflowForm.prerequisites.includes(t)
                                                                            ? workflowForm.prerequisites.filter(p => p !== t)
                                                                            : [...workflowForm.prerequisites, t];
                                                                        setWorkflowForm({ ...workflowForm, prerequisites: next });
                                                                    }}
                                                                    className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
                                                                />
                                                                <div className={`h-5 w-5 rounded-md border-2 transition-all flex items-center justify-center ${workflowForm.prerequisites.includes(t) ? 'bg-[#0084ff] border-[#0084ff]' : 'bg-white border-gray-200 group-hover:border-blue-400'}`}>
                                                                    <Check className={`h-3 w-3 text-white transition-opacity ${workflowForm.prerequisites.includes(t) ? 'opacity-100' : 'opacity-0'}`} />
                                                                </div>
                                                            </div>
                                                            <span className={`text-sm font-bold ${workflowForm.prerequisites.includes(t) ? 'text-gray-900' : 'text-gray-500'}`}>{t}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Enabled Toggle */}
                                            <div className="flex items-center gap-4">
                                                <label className="text-sm font-black text-gray-900 w-32 text-right">Enabled</label>
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div
                                                        onClick={() => setWorkflowForm({ ...workflowForm, enabled: !workflowForm.enabled })}
                                                        className={`relative h-6 w-12 rounded-full cursor-pointer transition-colors p-1 ${workflowForm.enabled ? 'bg-[#0084ff]' : 'bg-gray-300'}`}>
                                                        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${workflowForm.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900">Active</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/30">
                                            <button
                                                onClick={() => setIsWorkflowModalOpen(false)}
                                                className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (workflowModalMode === 'add') {
                                                        const newWf = {
                                                            id: Date.now(),
                                                            agentType: workflowForm.agentType,
                                                            name: workflowForm.name || 'New Workflow',
                                                            description: workflowForm.description || 'No description',
                                                            executionMode: workflowForm.executionMode,
                                                            dependencies: workflowForm.prerequisites,
                                                            status: workflowForm.enabled
                                                        };
                                                        setWorkflows([...workflows, newWf]);
                                                    } else {
                                                        setWorkflows(workflows.map(wf => wf.id === editingWorkflowId ? {
                                                            ...wf,
                                                            name: workflowForm.name,
                                                            description: workflowForm.description,
                                                            agentType: workflowForm.agentType,
                                                            executionMode: workflowForm.executionMode,
                                                            dependencies: workflowForm.prerequisites,
                                                            status: workflowForm.enabled
                                                        } : wf));
                                                    }
                                                    setIsWorkflowModalOpen(false);
                                                }}
                                                className="px-6 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95">
                                                {workflowModalMode === 'add' ? 'Create Workflow' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation Modal */}
                            {isDeleteModalOpen && (
                                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                                    <div className="relative bg-white rounded-3xl w-[360px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center space-y-6">
                                        <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <AlertCircle className="h-8 w-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-black text-gray-900">Are you sure?</h3>
                                            <p className="text-sm text-gray-400 font-bold leading-relaxed px-4">
                                                Do you really want to delete this workflow? This action cannot be undone.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={() => {
                                                    setWorkflows(workflows.filter(wf => wf.id !== workflowToDelete));
                                                    setIsDeleteModalOpen(false);
                                                }}
                                                className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-black shadow-lg shadow-red-100 transition-all active:scale-95 capitalize">
                                                yes, delete it
                                            </button>
                                            <button
                                                onClick={() => setIsDeleteModalOpen(false)}
                                                className="w-full py-3.5 rounded-2xl bg-gray-50 text-gray-500 text-sm font-black hover:bg-gray-100 transition-colors">
                                                no, keep it
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : activeTab === 'Settings' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                            {/* Header Section */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Settings Configuration</h2>
                                <button
                                    onClick={() => {
                                        setShowSaveToast(true);
                                        setTimeout(() => setShowSaveToast(false), 3000);
                                    }}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                                    <Save className="h-5 w-5" />
                                    Save Settings
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Left Column */}
                                    <div className="space-y-8">
                                        {/* Data Quality Settings */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Data Quality Settings</h3>
                                            <div className="space-y-4 p-6 bg-gray-50/30 rounded-2xl border border-gray-50">
                                                {settingToggle('Missing Data Detection', 'Detect missing required fields and incomplete data entries', 'missingDataDetection')}
                                                {settingToggle('Out of Range Values', 'Identify values outside expected ranges (numeric, dates)', 'outOfRangeValues')}
                                                {settingToggle('Invalid Format Detection', 'Check for incorrectly formatted data (dates, IDs, codes)', 'invalidFormatDetection')}
                                                {settingToggle('Data Consistency', 'Identify logically inconsistent data within a domain', 'dataConsistency')}
                                                {settingToggle('Cross Form Validation', 'Validate data consistency across related forms', 'crossFormValidation')}
                                            </div>
                                        </section>

                                        {/* Monitoring Settings */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Monitoring Settings</h3>
                                            <div className="space-y-6 p-6 bg-gray-50/30 rounded-2xl border border-gray-50">
                                                {settingToggle('Active Monitoring', 'Continuously monitor data changes in real-time', 'isActiveMonitoring')}

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className={`${settings.isActiveMonitoring ? 'opacity-40' : ''}`}>
                                                            <h4 className="font-bold text-gray-900">Scheduled Monitoring</h4>
                                                            <p className="text-xs text-gray-500 mt-0.5">Run checks based on configured schedule</p>
                                                        </div>
                                                        <div
                                                            onClick={() => !settings.isActiveMonitoring && setSettings({ ...settings, isScheduledMonitoring: !settings.isScheduledMonitoring })}
                                                            className={`relative h-6 w-12 rounded-full transition-colors p-1 ${settings.isActiveMonitoring ? 'cursor-not-allowed opacity-50 bg-gray-200' : 'cursor-pointer'} ${settings.isScheduledMonitoring && !settings.isActiveMonitoring ? 'bg-[#0084ff]' : 'bg-gray-300'}`}>
                                                            <div className={`h-4 w-4 rounded-full bg-white transition-transform ${settings.isScheduledMonitoring ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                        </div>
                                                    </div>

                                                    <div className={`space-y-4 ${settings.isActiveMonitoring ? 'opacity-40 pointer-events-none' : ''}`}>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold text-gray-700">Monitoring Schedule</label>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setIsMonitoringScheduleOpen(!isMonitoringScheduleOpen)}
                                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between hover:border-blue-400 transition-colors">
                                                                    <span className="text-sm font-medium text-gray-900">{settings.monitorSchedule}</span>
                                                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isMonitoringScheduleOpen ? 'rotate-180' : ''}`} />
                                                                </button>
                                                                {isMonitoringScheduleOpen && (
                                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-2 overflow-hidden animate-in zoom-in-95 duration-200">
                                                                        {['Hourly', 'Daily', 'Weekly', 'Bi-weekly'].map(sch => (
                                                                            <button
                                                                                key={sch}
                                                                                onClick={() => {
                                                                                    setSettings({ ...settings, monitorSchedule: sch });
                                                                                    setIsMonitoringScheduleOpen(false);
                                                                                }}
                                                                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                                                                {sch}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-sm font-bold text-gray-700">Monitoring Priority</label>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setIsMonitoringPriorityOpen(!isMonitoringPriorityOpen)}
                                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white flex items-center justify-between hover:border-blue-400 transition-colors">
                                                                    <span className="text-sm font-medium text-gray-900">{settings.monitorPriority}</span>
                                                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isMonitoringPriorityOpen ? 'rotate-180' : ''}`} />
                                                                </button>
                                                                {isMonitoringPriorityOpen && (
                                                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-2 overflow-hidden animate-in zoom-in-95 duration-200">
                                                                        {['High', 'Medium', 'Low'].map(p => (
                                                                            <button
                                                                                key={p}
                                                                                onClick={() => {
                                                                                    setSettings({ ...settings, monitorPriority: p });
                                                                                    setIsMonitoringPriorityOpen(false);
                                                                                }}
                                                                                className="w-full px-4 py-2.5 text-left text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                                                                {p}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-8">
                                        {/* Reconciliation Settings */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Reconciliation Settings</h3>
                                            <div className="space-y-4 p-6 bg-gray-50/30 rounded-2xl border border-gray-50">
                                                {settingToggle('Subject Matching', 'Verify subject IDs match across all data sources', 'subjectMatching')}
                                                {settingToggle('Demographics Matching', 'Compare demographic information across systems', 'demographicsMatching')}
                                                {settingToggle('AE and Medical History Matching', 'Cross-check adverse events and medical history', 'aeMedicalHistoryMatching')}
                                                {settingToggle('Lab Value Matching', 'Compare lab values from EDC with lab data sources', 'labValueMatching')}
                                            </div>
                                        </section>

                                        {/* Compliance Settings */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Compliance Settings</h3>
                                            <div className="space-y-4 p-6 bg-gray-50/30 rounded-2xl border border-gray-50">
                                                {settingToggle('Protocol Adherence Checking', 'Verify data complies with protocol requirements', 'protocolAdherenceChecking')}
                                                {settingToggle('Audit Trail Monitoring', 'Track and analyze data changes in audit logs', 'auditTrailMonitoring')}
                                                {settingToggle('Protocol Deviation Detection', 'Identify deviations from protocol procedures', 'protocolDeviationDetection')}
                                                {settingToggle('Regulatory Standard Alerts', 'Flag potential issues against regulatory standards', 'regulatoryStandardAlerts')}
                                            </div>
                                        </section>

                                        {/* Notification Settings */}
                                        <section className="space-y-4">
                                            <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
                                            <div className="p-6 bg-gray-50/30 rounded-2xl border border-gray-50 space-y-6">
                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-gray-900 block">Notification Types</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {notificationCheckbox('Email', 'emailNotify')}
                                                        {notificationCheckbox('In-App', 'inAppNotify')}
                                                        {notificationCheckbox('SMS', 'smsNotify')}
                                                        {notificationCheckbox('Slack', 'slackNotify')}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-black text-gray-900 block">Notification Frequency</label>
                                                    <div className="space-y-3">
                                                        {notificationCheckbox('Immediate for Critical', 'immediateCritical')}
                                                        {notificationCheckbox('Daily Summary', 'dailySummary')}
                                                        {notificationCheckbox('Weekly Summary', 'weeklySummary')}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Toast Notification */}
                            {showSaveToast && (
                                <div className="fixed bottom-10 right-10 z-[300] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 flex items-start gap-4 max-w-sm animate-in slide-in-from-right-10 duration-300">
                                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black text-gray-900 text-lg">Settings saved</h4>
                                        <p className="text-sm text-gray-400 font-bold mt-1">Your data quality and reconciliation settings have been updated.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm h-64 flex flex-col items-center justify-center text-gray-400 animate-in fade-in">
                            <Bot className="h-12 w-12 mb-4 opacity-10" />
                            <p className="font-bold">Select 'DQ and Reconciliation' to view detailed analysis</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chatbot Implementation */}
            {isChatbotOpen && (
                <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-[600ms] cubic-bezier(0.4, 0, 0.2, 1) ${isChatbotMinimized ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 translate-y-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]'}`}>
                    <div className="bg-white rounded-2xl border border-gray-200 w-[420px] h-[600px] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#2563eb] text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none">Data Manager Assistant</h3>
                                    <div className="flex items-center mt-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#93c5fd]">Active Tracking</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsChatbotMinimized(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <Maximize2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setIsChatbotMinimized(true)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="p-4 bg-gray-50/50 border-b flex flex-wrap gap-2">
                                {['Run DQ Checks', 'Create Task', 'Assign Task', 'View Task', 'Trial Health'].map(act => (
                                    <button key={act} className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all">{act}</button>
                                ))}
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0 shadow-sm">
                                        <Bot className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700 leading-relaxed font-medium">
                                        Hello! I'm your Data Manager AI assistant. How can I help you with data quality management for Diabetes Type 2 Study?
                                        <br /><br />
                                        Try asking:
                                        <ul className="mt-2 space-y-1">
                                            <li className="flex items-center gap-2"><div className="h-1 w-1 bg-blue-400 rounded-full"></div>Trial health summary</li>
                                            <li className="flex items-center gap-2"><div className="h-1 w-1 bg-blue-400 rounded-full"></div>Data source health status</li>
                                            <li className="flex items-center gap-2"><div className="h-1 w-1 bg-blue-400 rounded-full"></div>Domain completeness</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-5 bg-white border-t space-y-4">
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">Task Assignment Mode: <span className="text-blue-600 ml-1">{isAgentMode ? 'Agent.AI' : 'Human in Loop'}</span></span>
                                    <div
                                        onClick={toggleAgentMode}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${isAgentMode ? 'bg-[#2563eb]' : 'bg-gray-300'}`}
                                    >
                                        <span className={`h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform ${isAgentMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 shadow-inner" placeholder="Analyze DQ, settings, monitoring..." />
                                    <button className="h-12 w-12 bg-[#818cf8] hover:bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-all active:scale-90">
                                        <Sparkles className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Minimized Logo */}
            <div
                onClick={() => setIsChatbotMinimized(false)}
                className={`fixed bottom-8 right-8 z-[101] cursor-pointer transition-all duration-700 ease-in-out transform ${!isChatbotMinimized ? 'opacity-0 scale-0 -rotate-180 pointer-events-none' : 'opacity-100 scale-100 rotate-0'}`}>
                <div className="h-16 w-16 bg-[#2563eb] rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.6)] hover:scale-110 active:scale-95 transition-all">
                    <Bot className="h-8 w-8" />
                </div>
            </div>

            {/* Refresh Notification */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 transform ${isRefreshing ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 px-8 py-5 min-w-[340px] flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                    <div>
                        <h4 className="text-[17px] font-extrabold text-[#111827] tracking-tight">Refreshing agent statuses</h4>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mt-0.5">LATEST AGENT DATA IS BEING LOADED...</p>
                    </div>
                </div>
            </div>

            {/* Start Analysis Toast Notification */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 transform ${showStartToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 px-8 py-5 min-w-[340px] flex gap-4 items-center border-l-4 border-l-blue-500">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-[#111827]">DQ and reconsilation started</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Analysing across all data domains</p>
                    </div>
                </div>
            </div>

            {/* End Analysis Toast Notification */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 transform ${showEndToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] border border-gray-100 px-8 py-5 min-w-[340px] flex gap-4 items-center border-l-4 border-l-green-500">
                    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h4 className="text-[15px] font-bold text-[#111827]">Analysis trigerred</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Successfully triggered analysis for LB domain</p>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            {showResultModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-blue-900">DQ and Reconciliation Complete</h2>
                                <p className="text-gray-500 text-sm mt-1">Here's a summary of the analysis on PRO001</p>
                            </div>
                            <button
                                onClick={() => setShowResultModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50/50 rounded-xl p-6 text-center border border-blue-100">
                                    <div className="text-3xl font-black text-blue-600 mb-1">6</div>
                                    <div className="text-sm font-bold text-gray-500">DQ Issues</div>
                                </div>
                                <div className="bg-blue-50/50 rounded-xl p-6 text-center border border-blue-100">
                                    <div className="text-3xl font-black text-blue-600 mb-1">2</div>
                                    <div className="text-sm font-bold text-gray-500">Reconciliation Issues</div>
                                </div>
                                <div className="bg-blue-50/50 rounded-xl p-6 text-center border border-blue-100">
                                    <div className="text-3xl font-black text-blue-600 mb-1">6</div>
                                    <div className="text-sm font-bold text-gray-500">Tasks Created</div>
                                </div>
                                <div className="bg-blue-50/50 rounded-xl p-6 text-center border border-blue-100">
                                    <div className="text-3xl font-black text-blue-600 mb-1">3</div>
                                    <div className="text-sm font-bold text-gray-500">Domains Affected</div>
                                </div>
                            </div>

                            {/* Key Findings */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                                <h3 className="text-blue-900 font-bold mb-4">Key Findings</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">6 data quality issues detected in 2 domains</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">2 cross-source reconciliation discrepancies identified</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">Created 6 tasks for data managers and site monitors</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">Processed 1,247 records across 3 domains</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Recommended */}
                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-5 w-5 text-orange-700" />
                                    <h3 className="text-orange-900 font-bold">Action Recommended</h3>
                                </div>
                                <p className="text-orange-800/80 text-sm font-medium leading-relaxed">
                                    Review and address the identified issues. Several require immediate action based on their priority level.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowResultModal(false)}
                                className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                View Issues
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
