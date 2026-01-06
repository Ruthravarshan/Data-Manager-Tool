import {
    CircleAlert, Server, ChevronLeft, ChevronDown, RefreshCw, EyeOff, Maximize2,
    Eye, X, ArrowRight, Check, Loader2, AlertCircle, Activity, FileText, CheckCircle2, AlertTriangle, Settings, Plus, Trash2, Sparkles, Bot, ShieldCheck, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CentralMonitorAI() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showAgents, setShowAgents] = useState(true);
    const [isAgentMode, setIsAgentMode] = useState(true);
    const [isMonitorExpanded, setIsMonitorExpanded] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(true);
    const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState('PRO001 - Diabetes Type 2 Study');
    const [isStudyDropdownOpen, setIsStudyDropdownOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [activeQueryTab, setActiveQueryTab] = useState('All');
    const [isCreateQueryModalOpen, setIsCreateQueryModalOpen] = useState(false);
    const [currentQueryPage, setCurrentQueryPage] = useState(1);

    const [newQuery, setNewQuery] = useState({
        site: '',
        category: '',
        subjectId: '',
        priority: '',
        queryText: ''
    });

    const [activeTaskTab, setActiveTaskTab] = useState('All');
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [currentTaskPage, setCurrentTaskPage] = useState(1);
    const [newTask, setNewTask] = useState({
        title: '',
        assignee: '',
        priority: 'Medium',
        dueDate: '',
        description: '',
        relatedItems: [] as string[]
    });

    const [isCreateWorkflowModalOpen, setIsCreateWorkflowModalOpen] = useState(false);
    const [isEditWorkflowModalOpen, setIsEditWorkflowModalOpen] = useState(false);
    const [currentEventPage, setCurrentEventPage] = useState(1);
    const [newWorkflow, setNewWorkflow] = useState({
        name: '',
        description: '',
        agentType: 'Site Monitor',
        executionMode: 'Sequential',
        prerequisites: [] as string[],
        enabled: true
    });
    const [editingWorkflow, setEditingWorkflow] = useState({
        id: '',
        name: '',
        description: '',
        agentType: '',
        executionMode: '',
        prerequisites: [] as string[],
        enabled: true
    });

    const [settings, setSettings] = useState({
        activeMonitoring: true,
        scheduledMonitoring: false,
        scheduleFrequency: {
            daily: true,
            weekly: true,
            biWeekly: false,
            monthly: true
        },
        eventTriggeredMonitoring: true,
        triggerEvents: {
            dataImport: true,
            queryResponse: true,
            siteAddition: true,
            subjectAddition: true
        },
        notificationTypes: {
            newQueries: true,
            taskAssignments: true,
            safetySignals: true,
            protocolDeviations: true,
            dataImports: true,
            enrollmentUpdates: true
        },
        deliveryMethods: {
            email: true,
            sms: false,
            inApp: true,
            slack: false
        },
        emailRecipients: 'sarah.johnson@example.com, robert.chen@example.com',
        protocolDeviationDetection: true,
        safetySignalDetection: true,
        dataQualityChecks: true,
        sitePerformanceMetrics: false,
        aiEnhancedAnalysis: true,
        aiGeneratedSuggestions: true,
        predictiveAnalytics: true,
        aiProvider: 'OpenAI GPT-4o',
        gdprCompliance: true,
        hipaaCompliance: true,
        cfrPart11Compliance: true,
        auditTrail: true,
        electronicSignatures: true
    });

    const queriesData = [
        { id: 'QRY-132', subject: 'S101-004', category: 'Laboratory', site: 'Site 101', created: 'April 5, 2025', status: 'Pending', priority: 'High' },
        { id: 'QRY-131', subject: 'S104-008', category: 'Adverse Event', site: 'Site 104', created: 'April 4, 2025', status: 'Open', priority: 'Medium' },
        { id: 'QRY-130', subject: 'S102-011', category: 'Protocol Deviation', site: 'Site 102', created: 'April 3, 2025', status: 'Answered', priority: 'High' },
        { id: 'QRY-129', subject: 'S103-002', category: 'Eligibility Criteria', site: 'Site 103', created: 'April 1, 2025', status: 'Closed', priority: 'Medium' },
        { id: 'QRY-128', subject: 'S103-006', category: 'Laboratory', site: 'Site 103', created: 'March 30, 2025', status: 'Answered', priority: 'Low' }
    ];

    const tasksData = [
        { id: 'TSK-045', title: 'Review elevated ALT values at Site 101', assignee: 'Sarah Johnson', dueDate: 'April 8, 2025', status: 'In Progress', priority: 'High', related: 'QRY-132' },
        { id: 'TSK-044', title: 'Verify protocol compliance at Site 104', assignee: 'Michael Wong', dueDate: 'April 10, 2025', status: 'Open', priority: 'Medium', related: 'Site 104' },
        { id: 'TSK-043', title: 'Evaluate enrollment delays at Site 102', assignee: 'Jennifer Lee', dueDate: 'April 15, 2025', status: 'Under Review', priority: 'Medium', related: 'Site 102' },
        { id: 'TSK-042', title: 'Review safety narratives for SAEs', assignee: 'Sarah Johnson', dueDate: 'April 5, 2025', status: 'Completed', priority: 'High', related: 'QRY-128, QRY-129' },
        { id: 'TSK-041', title: 'Prepare monthly safety monitoring report', assignee: 'Robert Chen', dueDate: 'April 20, 2025', status: 'In Progress', priority: 'Low', related: 'Report' }
    ];

    const eventLogsData = [
        { id: 'EVT-215', timestamp: 'April 8, 2025 08:32', type: 'Data Import', description: 'New laboratory data received from central lab', domains: 'LB', items: ['QRY-132', 'TSK-045'], status: 'Completed' },
        { id: 'EVT-214', timestamp: 'April 7, 2025 16:15', type: 'Query Response', description: 'Site 103 responded to protocol deviation query', domains: 'DV', items: ['TSK-043'], status: 'Completed' },
        { id: 'EVT-213', timestamp: 'April 7, 2025 10:23', type: 'Scheduled', description: 'Weekly site enrollment metrics analysis', domains: 'DM, SV', items: ['QRY-131'], status: 'Completed' },
        { id: 'EVT-212', timestamp: 'April 6, 2025 09:00', type: 'Scheduled', description: 'Daily protocol compliance check', domains: 'ALL', items: ['No items'], status: 'Completed' },
        { id: 'EVT-211', timestamp: 'April 5, 2025 14:42', type: 'Data Import', description: 'New adverse event data from Site 102', domains: 'AE', items: ['QRY-130', 'TSK-042'], status: 'Completed' },
        { id: 'EVT-210', timestamp: 'April 5, 2025 10:35', type: 'Manual', description: 'Medical monitor initiated lab trend analysis', domains: 'LB', items: ['TSK-045'], status: 'Completed' },
        { id: 'EVT-209', timestamp: 'April 4, 2025 16:20', type: 'Threshold', description: 'Site 104 exceeded query threshold (>5%)', domains: 'ALL', items: ['TSK-044'], status: 'Completed' },
        { id: 'EVT-208', timestamp: 'April 3, 2025 09:00', type: 'Scheduled', description: 'Daily protocol compliance check', domains: 'ALL', items: ['QRY-129'], status: 'Completed' }
    ];

    const workflowsData = [
        { id: 'WF-001', agentType: 'Site Monitor', name: 'Test', executionMode: 'Conditional', dependencies: ['Signal Detection'], status: 'Active' }
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-amber-100 text-amber-800';
            case 'Low': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTaskStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-600';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Under Review': return 'bg-purple-100 text-purple-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const studies = [
        'PRO001 - Diabetes Type 2 Study',
        'PRO002 - Oncology Combination Therapy',
        'PRO003 - Cardiovascular Outcomes Study'
    ];

    const toggleAgentMode = () => {
        setIsAgentMode(!isAgentMode);
    };

    const handleRunMonitor = () => {
        if (isRunning) return;
        setIsRunning(true);
        setProgress(0);

        // Simulate analysis process
        const duration = 3000; // 3 seconds
        const interval = 30;
        const steps = duration / interval;
        const increment = 100 / steps;

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setIsRunning(false);
                        setShowCompletionModal(true);
                    }, 500);
                    return 100;
                }
                return next;
            });
        }, interval);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <button
                        onClick={() => navigate('/ai-agents')}
                        className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 flex items-center gap-1 text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50">
                        <ChevronLeft className="h-4 w-4" />
                        Back to AI Agents Hub
                    </button>
                </div>
                <div className="bg-gradient-to-r from-rose-600 to-red-600 py-2.5 px-4 mb-6 rounded-md shadow-md flex items-center justify-center border border-rose-500/50">
                    <ShieldCheck className="h-5 w-5 mr-3 text-white stroke-[2.5]" />
                    <span className="text-white font-bold text-sm tracking-wide uppercase">
                        Sentinel Protocol Active • Real-time Safety Scanning
                    </span>
                </div>
                <div className="rounded-xl bg-[#0f172a] overflow-hidden mb-6 relative shadow-lg ring-1 ring-slate-900/10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]"></div>
                    <div className="flex items-center p-6 bg-gradient-to-br from-slate-900 via-[#1e293b] to-slate-900 relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
                        <div className="relative h-16 w-16 mr-6 flex-shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent rotate-45 rounded-lg border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]"></div>
                            <div className="absolute inset-[4px] border border-rose-400/30 rotate-45 rounded-md backdrop-blur-sm bg-black/20"></div>
                            <ShieldCheck className="h-8 w-8 text-rose-500 relative z-10 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        </div>
                        <div className="flex flex-col relative z-10">
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-200 to-rose-400 mb-0.5 tracking-wider uppercase drop-shadow-sm font-['Orbitron',_sans-serif]">The Sentinel Guardian</h2>
                            <div className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
                                <span className="uppercase tracking-widest text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">Central Monitor.AI</span>
                                <span className="h-px w-8 bg-slate-700"></span>
                            </div>
                            <div className="flex items-center bg-slate-800/50 rounded-full pr-4 w-fit border border-slate-700/50 backdrop-blur-md">
                                <span className="relative flex h-3 w-3 mr-2.5 ml-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                </span>
                                <span className="text-rose-100/80 text-xs font-medium tracking-wide py-1">Vigilance activated across {studies.length} active protocols</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 mb-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1 text-sm font-medium text-rose-600/80">
                                <ChevronLeft className="h-4 w-4" />
                                <span>Back to AI Agents Hub</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Central Monitor.AI</h1>
                            <p className="text-slate-500 font-medium">Continuous AI oversight and risk detection dashboard</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 relative">
                            <button
                                onClick={() => setIsStudyDropdownOpen(!isStudyDropdownOpen)}
                                className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[240px]">
                                <span className="line-clamp-1 text-left">{selectedStudy}</span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                            {isStudyDropdownOpen && (
                                <div className="absolute top-12 left-0 z-50 w-[240px] rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 bg-white">
                                    <div className="p-1">
                                        {studies.map((study) => (
                                            <div
                                                key={study}
                                                onClick={() => {
                                                    setSelectedStudy(study);
                                                    setIsStudyDropdownOpen(false);
                                                }}
                                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-gray-100"
                                            >
                                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                                    {selectedStudy === study && <Check className="h-4 w-4 text-blue-600" />}
                                                </span>
                                                <span className="pl-8">{study}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200">
                                <span className="text-sm font-bold text-gray-900">Task Assignment Mode:</span>
                                <span className="text-sm font-medium text-blue-600 w-24">{isAgentMode ? 'Agent.AI' : 'Human in Loop'}</span>
                                <div
                                    onClick={toggleAgentMode}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isAgentMode ? 'bg-[#2563eb]' : 'bg-gray-300'}`}
                                >
                                    <span className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${isAgentMode ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                </div>
                            </div>
                            <button
                                onClick={handleRunMonitor}
                                disabled={isRunning}
                                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white h-10 px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-rose-200 active:scale-95 transition-all`}>
                                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                {isRunning ? 'Scanning Protocols...' : 'Initiate Sentinel Scan'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsRefreshing(true);
                                    setTimeout(() => setIsRefreshing(false), 3000);
                                }}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-gray-200">
                                <RefreshCw className="h-4 w-4" />
                                Refresh Agents
                            </button>
                            <button
                                onClick={() => setShowAgents(!showAgents)}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-gray-200">
                                {showAgents ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                {showAgents ? 'Hide Agents' : 'Show Agents'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                            <Bot className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-800">Intelligent monitoring active</h3>
                            <ul className="space-y-2 text-sm text-slate-600 font-medium">
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                                    AI agents actively monitor data refresh events to automatically trigger quality checks
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                                    Cross-data reconciliation maps subjects across EDC, Labs, and external data sources
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500"></div>
                                    Protocol compliance verification compares data to study specifications
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {isRunning && (
                    <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider text-slate-500">
                            <span>Scanning Protocol Data layers...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-100 ease-linear rounded-full"
                                style={{ width: `${progress}% ` }}
                            ></div>
                        </div>
                    </div>
                )}

                {showAgents && (
                    <div className="mb-6 relative animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-blue-800">AI Monitoring Agents</h2>
                            <button
                                onClick={() => setIsMonitorExpanded(true)}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-blue-600">
                                <Maximize2 className="h-4 w-4 mr-1" />
                                Expand
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { title: 'Protocol Deviations', active: true, desc: 'Monitoring adherence', left: '3 critical', right: '2 pending' },
                                { title: 'Site Performance', active: true, desc: 'Tracking metrics', left: '12 active', right: '1 risk' },
                                { title: 'Lab Data Security', active: true, desc: 'Analyzing trends', left: 'Live stream', right: 'Secure' },
                                { title: 'Adverse Events', active: true, desc: 'Safety Signal Detection', left: '42 scanned', right: '3 signals' }
                            ].map((agent, i) => (
                                <div key={i} className="group relative rounded-xl bg-white p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:border-rose-200">
                                    <div className="absolute top-0 left-0 h-full w-1 bg-slate-200 rounded-l-xl group-hover:bg-rose-500 transition-colors"></div>
                                    <div className="flex items-center justify-between mb-3 pl-2">
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex h-3 w-3">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                            </div>
                                            <h4 className="font-bold text-slate-700 text-sm">{agent.title}</h4>
                                        </div>
                                        <div className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isRunning ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                                            {isRunning ? 'Scanning' : 'Active'}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4 pl-2 font-medium">{agent.desc}</p>
                                    <div className="flex justify-between items-end text-xs pl-2 border-t border-slate-100 pt-3">
                                        <span className="text-slate-400 font-semibold">{agent.left}</span>
                                        <span className="font-bold text-rose-600 hover:text-rose-700 cursor-pointer">{agent.right}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex-1 flex flex-col">
                    <div className="h-12 items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500 grid grid-cols-6 mb-8 w-full shadow-inner border border-slate-200">
                        {['Dashboard', 'Queries', 'Tasks', 'Event Log', 'Workflows', 'Settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === tab ? 'bg-white text-rose-600 shadow-sm ring-1 ring-black/5' : 'hover:bg-slate-200 hover:text-slate-700'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border-blue-100 bg-white flex-1 animate-in fade-in zoom-in-95 duration-200">
                        {activeTab === 'Dashboard' && (<>
                            <div className="rounded-xl border bg-white text-slate-800 shadow-sm mb-6 border-slate-200">
                                <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b border-slate-100">
                                    <h3 className="tracking-tight text-lg font-bold text-slate-800 flex items-center">
                                        <Server className="h-5 w-5 mr-2 text-rose-500" />
                                        DB Lock Compliance Overview
                                    </h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Activity className="h-12 w-12 text-slate-900" />
                                            </div>
                                            <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Lock Status</div>
                                            <div className="text-xl font-black text-rose-600">IN PROGRESS</div>
                                            <div className="mt-2 text-xs font-medium text-slate-500 flex items-center">
                                                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                                                Target: 09/01/2026
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200 shadow-sm">
                                            <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Readiness Index</div>
                                            <div className="text-2xl font-black text-slate-800">75%</div>
                                            <div className="relative w-full overflow-hidden rounded-full bg-slate-100 h-1.5 mt-3">
                                                <div className="h-full w-full flex-1 bg-rose-500 transition-all shadow-[0_0_8px_rgba(244,63,94,0.4)]" style={{ transform: 'translateX(-25%)' }}></div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-4 border border-slate-200 shadow-sm">
                                            <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Blockers</div>
                                            <div className="text-2xl font-black text-slate-800">8</div>
                                            <div className="mt-1 text-xs text-rose-500 font-medium">Critical across 3 sites</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Site Readiness</span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">Complete</span>
                                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">0/3</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">Ready</span>
                                                    <span className="font-bold text-blue-600 bg-blue-50 px-1.5 rounded">1/3</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-600">In Progress</span>
                                                    <span className="font-bold text-amber-600 bg-amber-50 px-1.5 rounded">2/3</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 border-t border-blue-100 pt-4">
                                        <h4 className="font-medium text-blue-800 mb-3">Site-Level DB Lock Compliance</h4>
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm">
                                                <thead className="[&_tr]:border-b">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Site</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Readiness</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Outstanding Issues</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Updated</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle font-medium">Boston Medical Center</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-blue-100 text-blue-800">
                                                                IN PROGRESS
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex items-center">
                                                                <span className="mr-2 w-8">78%</span>
                                                                <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2 flex-1">
                                                                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-22%)' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">4</td>
                                                        <td className="p-4 align-middle">08/12/2025</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle font-medium">Chicago Research Hospital</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800">
                                                                READY
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex items-center">
                                                                <span className="mr-2 w-8">92%</span>
                                                                <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2 flex-1">
                                                                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-8%)' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">0</td>
                                                        <td className="p-4 align-middle">09/12/2025</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle font-medium">Denver Health Institute</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-blue-100 text-blue-800">
                                                                IN PROGRESS
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex items-center">
                                                                <span className="mr-2 w-8">67%</span>
                                                                <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2 flex-1">
                                                                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-33%)' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle">8</td>
                                                        <td className="p-4 align-middle">07/12/2025</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                {/* Queries */}
                                <div className="rounded-xl border bg-white text-slate-800 shadow-sm border-slate-200">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Queries</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-3xl font-black text-slate-800">24</div>
                                        <div className="text-sm text-slate-500 mt-1 font-medium">8 Open • 16 Closed</div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-600 font-medium">Response Rate</span>
                                                <span className="font-bold text-slate-800">83%</span>
                                            </div>
                                            <div className="relative w-full overflow-hidden rounded-full bg-slate-100 h-1.5">
                                                <div className="h-full w-full flex-1 bg-green-500 transition-all shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ transform: 'translateX(-17%)' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Sites */}
                                <div className="rounded-xl border bg-white text-slate-800 shadow-sm border-slate-200">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Sites</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-3xl font-black text-slate-800">12</div>
                                        <div className="text-sm text-slate-500 mt-1 font-medium">10 Active • 2 Pending</div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-600 font-medium">Enrollment Target</span>
                                                <span className="font-bold text-slate-800">68%</span>
                                            </div>
                                            <div className="relative w-full overflow-hidden rounded-full bg-slate-100 h-1.5">
                                                <div className="h-full w-full flex-1 bg-blue-500 transition-all shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ transform: 'translateX(-32%)' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Issues */}
                                <div className="rounded-xl border bg-white text-slate-800 shadow-sm border-slate-200">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Protocol Deviations</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="text-3xl font-black text-slate-800">7</div>
                                        <div className="text-sm text-slate-500 mt-1 font-medium">3 Major • 4 Minor</div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-600 font-medium">Resolution Rate</span>
                                                <span className="font-bold text-slate-800">42%</span>
                                            </div>
                                            <div className="relative w-full overflow-hidden rounded-full bg-slate-100 h-1.5">
                                                <div className="h-full w-full flex-1 bg-amber-500 transition-all shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{ transform: 'translateX(-58%)' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* Site Performance Overview - Takes up 2 columns */}
                                <div className="lg:col-span-2 rounded-xl border bg-white border-slate-200 shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b border-slate-100">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Site Performance Overview</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm">
                                                <thead className="[&_tr]:border-b">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Site</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subjects</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Query Rate</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Response Time</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    {[
                                                        { site: 'Site 101', sub: 12, rate: '2.4%', time: '1.2 days', status: 'Good', color: 'bg-green-100 text-green-800' },
                                                        { site: 'Site 102', sub: 8, rate: '3.8%', time: '2.5 days', status: 'Attention', color: 'bg-amber-100 text-amber-800' },
                                                        { site: 'Site 103', sub: 15, rate: '1.9%', time: '0.8 days', status: 'Good', color: 'bg-green-100 text-green-800' },
                                                        { site: 'Site 104', sub: 7, rate: '5.2%', time: '4.1 days', status: 'Alert', color: 'bg-red-100 text-red-800' },
                                                        { site: 'Site 105', sub: 10, rate: '2.7%', time: '1.4 days', status: 'Good', color: 'bg-green-100 text-green-800' },
                                                    ].map((row, i) => (
                                                        <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                                                            <td className="p-4 align-middle font-medium">{row.site}</td>
                                                            <td className="p-4 align-middle">{row.sub}</td>
                                                            <td className="p-4 align-middle">{row.rate}</td>
                                                            <td className="p-4 align-middle">{row.time}</td>
                                                            <td className="p-4 align-middle">
                                                                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${row.color}`}>
                                                                    {row.status}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Priority Alerts */}
                                <div className="rounded-xl border bg-white text-slate-800 shadow-sm border-slate-200">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b border-slate-100">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Priority Alerts</h3>
                                    </div>
                                    <div className="p-6 pt-0 space-y-4">
                                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-red-800">Site 104 Performance</h4>
                                                    <p className="text-sm text-red-600 mt-1">High query rate and slow response time. Review needed.</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-amber-800">Lab Data Signal</h4>
                                                    <p className="text-sm text-amber-600 mt-1">3 subjects with CTCAE Grade 2+ liver enzyme elevations</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <CircleAlert className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-blue-800">Enrollment Rate</h4>
                                                    <p className="text-sm text-blue-600 mt-1">Overall enrollment is 12% below projection for Q2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Safety Signals and Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Safety Signals - Takes up 2 columns */}
                                <div className="lg:col-span-2 rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b border-slate-100">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Recent Safety Signals</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm">
                                                <thead className="[&_tr]:border-b">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Signal ID</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Detected</th>
                                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">SIG-042</td>
                                                        <td className="p-4 align-middle">Lab Abnormality</td>
                                                        <td className="p-4 align-middle">Elevated liver enzymes in 3 subjects</td>
                                                        <td className="p-4 align-middle">2d ago</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-800">
                                                                Investigating
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">SIG-041</td>
                                                        <td className="p-4 align-middle">AE Pattern</td>
                                                        <td className="p-4 align-middle">Increased GI events at Site 102</td>
                                                        <td className="p-4 align-middle">3d ago</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800">
                                                                Reviewing
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                                        <td className="p-4 align-middle font-medium">SIG-040</td>
                                                        <td className="p-4 align-middle">Protocol Deviation</td>
                                                        <td className="p-4 align-middle">Dosing schedule not followed in 2 subjects</td>
                                                        <td className="p-4 align-middle">4d ago</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-100 text-green-800">
                                                                Resolved
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-2 border-b border-slate-100">
                                        <h3 className="tracking-tight text-lg font-bold text-slate-800">Recent Activity</h3>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="relative mt-1">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">Query Response</p>
                                                    <p className="text-sm text-muted-foreground">Site 103 responded to Query ID: QRY-128</p>
                                                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="relative mt-1">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                                        <Server className="h-4 w-4 text-green-600" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">Data Received</p>
                                                    <p className="text-sm text-muted-foreground">New lab data imported - 42 records</p>
                                                    <p className="text-xs text-muted-foreground">35 minutes ago</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="relative mt-1">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">Signal Detected</p>
                                                    <p className="text-sm text-muted-foreground">New safety signal created: SIG-042</p>
                                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="relative mt-1">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                                        <Activity className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">Analysis Complete</p>
                                                    <p className="text-sm text-muted-foreground">Protocol compliance analysis finished</p>
                                                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>)}

                        {activeTab === 'Queries' && (
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold text-slate-800">Clinical Queries</h2>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                            24 Total
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-200 bg-white hover:bg-gray-50 h-10 px-4 py-2 text-gray-700 shadow-sm">
                                            <FileText className="mr-2 h-4 w-4 text-gray-500" />
                                            Export
                                        </button>
                                        <button
                                            onClick={() => setIsCreateQueryModalOpen(true)}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 h-10 px-4 py-2 shadow-sm transition-all shadow-rose-200">
                                            Create Query
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                    {[
                                        { id: 'All', label: 'All', count: 24 },
                                        { id: 'Open', label: 'Open', count: 8 },
                                        { id: 'Pending', label: 'Pending Response', count: 5 },
                                        { id: 'Answered', label: 'Answered', count: 3 },
                                        { id: 'Closed', label: 'Closed', count: 16 }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveQueryTab(tab.id)}
                                            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold transition-all ${activeQueryTab === tab.id ? 'bg-rose-600 text-white border-transparent shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {tab.label}
                                            <span className="ml-1 text-inherit opacity-90">({tab.count})</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-md border border-gray-200">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-gray-50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Query ID</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Site</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0 text-[#1e293b]">
                                            {queriesData.filter(q => activeQueryTab === 'All' || (activeQueryTab === 'Pending' ? q.status === 'Pending' : q.status === activeQueryTab)).map((query) => (
                                                <tr key={query.id} className="border-b transition-colors hover:bg-gray-50/50">
                                                    <td className="p-4 align-middle font-bold text-rose-600">{query.id}</td>
                                                    <td className="p-4 align-middle font-medium">{query.subject}</td>
                                                    <td className="p-4 align-middle">{query.category}</td>
                                                    <td className="p-4 align-middle">{query.site}</td>
                                                    <td className="p-4 align-middle">{query.created}</td>
                                                    <td className="p-4 align-middle">
                                                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${query.status === 'Pending' ? 'bg-[#fef9c3] text-[#a16207]' :
                                                            query.status === 'Open' ? 'bg-blue-50 text-blue-700' :
                                                                query.status === 'Answered' ? 'bg-emerald-50 text-emerald-700' :
                                                                    'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {query.status}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${query.priority === 'High' ? 'bg-[#fee2e2] text-[#b91c1c]' :
                                                            query.priority === 'Medium' ? 'bg-[#ffedd5] text-[#c2410c]' :
                                                                'bg-[#eff6ff] text-[#1d4ed8]'
                                                            }`}>
                                                            {query.priority}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button className="text-slate-400 hover:text-rose-600 transition-colors">
                                                                <Eye className="h-5 w-5" />
                                                            </button>
                                                            <button className="text-gray-600 hover:text-green-600">
                                                                <Check className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm text-gray-500">Showing 1 to 5 of {queriesData.length} results</div>
                                    <div className="flex items-center gap-1">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {[1, 2, 3, 4, 5].map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentQueryPage(page)}
                                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-8 w-8 ${currentQueryPage === page ? 'bg-rose-600 text-white shadow-sm' : 'border border-gray-200 bg-white hover:bg-slate-50 text-slate-600'}`}>
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Tasks' && (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-slate-900">Monitoring Tasks</h2>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            {tasksData.length} Total
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-blue-600 bg-white">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export
                                        </button>
                                        <button
                                            onClick={() => setIsCreateTaskModalOpen(true)}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-rose-600 text-white hover:bg-rose-700 h-9 px-4 py-2 shadow-sm shadow-rose-100">
                                            Create Task
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {['All', 'Open', 'In Progress', 'Under Review', 'Completed'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTaskTab(tab)}
                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${activeTaskTab === tab ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            {tab}
                                            <span className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${activeTaskTab === tab ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                {tab === 'All' ? tasksData.length : tasksData.filter(t => t.status === tab).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="rounded-md border border-gray-200">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-gray-50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Task ID</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assignee</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Priority</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Related Items</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {tasksData.filter(t => activeTaskTab === 'All' || t.status === activeTaskTab).map((task) => (
                                                <tr key={task.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 align-middle font-medium text-blue-600">{task.id}</td>
                                                    <td className="p-4 align-middle">{task.title}</td>
                                                    <td className="p-4 align-middle">{task.assignee}</td>
                                                    <td className="p-4 align-middle">
                                                        <span className={task.dueDate.includes('April 8') || task.dueDate.includes('April 5') ? 'text-red-500 font-medium' : ''}>
                                                            {task.dueDate}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getTaskStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        {task.related.split(',').map((item, idx) => (
                                                            <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 mr-1 border border-gray-200">
                                                                {item.trim()}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="p-4 align-middle text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 text-gray-500">
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 text-gray-500">
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm text-gray-500">Showing 1 to 5 of {tasksData.length} results</div>
                                    <div className="flex items-center gap-1">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {[1, 2, 3, 4, 5].map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentTaskPage(page)}
                                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-8 w-8 ${currentTaskPage === page ? 'bg-blue-600 text-white' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}>
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Event Log' && (
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-slate-900">Event Monitoring Log</h2>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                                            42 Events
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-gray-700 bg-white shadow-sm">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export Log
                                        </button>
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-gray-700 bg-white shadow-sm">
                                            <FileText className="mr-2 h-4 w-4" />
                                            JSON
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-md border border-gray-200 overflow-hidden shadow-sm">
                                    <table className="w-full caption-bottom text-sm bg-white">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-gray-50/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Timestamp</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Trigger ID</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Event Type</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Description</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Domains</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Items Created</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0 text-gray-700">
                                            {eventLogsData.map((log) => (
                                                <tr key={log.id} className="border-b transition-colors hover:bg-gray-50/50">
                                                    <td className="p-4 align-middle font-bold text-gray-900">{log.timestamp}</td>
                                                    <td className="p-4 align-middle">{log.id}</td>
                                                    <td className="p-4 align-middle">{log.type}</td>
                                                    <td className="p-4 align-middle">{log.description}</td>
                                                    <td className="p-4 align-middle">{log.domains}</td>
                                                    <td className="p-4 align-middle">
                                                        <div className="flex flex-wrap gap-1">
                                                            {log.items.map((item, idx) => (
                                                                <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-200">
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 align-middle">
                                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-sm text-gray-500">Showing 1 to 8 of 42 results</div>
                                    <div className="flex items-center gap-1">
                                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8">
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        {[1, 2, 3, 4, 5].map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentEventPage(page)}
                                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-8 w-8 ${currentEventPage === page ? 'bg-rose-600 text-white shadow-sm' : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'}`}>
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'Workflows' && (
                            <div className="p-6 space-y-6">
                                <div className="flex flex-col space-y-1">
                                    <h2 className="text-2xl font-bold text-slate-900">Agent Workflow Management</h2>
                                </div>

                                <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-50">
                                        <h3 className="text-lg font-bold text-rose-600 mb-2 font-['Inter']">Configure Agent Dependencies</h3>
                                        <p className="text-sm text-gray-500">
                                            Define how Central Monitor AI agents work together. Use sequential mode to ensure agents run in a specific order, or independent mode for parallel execution.
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-gray-900">Agent Workflow Dependencies</h3>
                                            <button
                                                onClick={() => setIsCreateWorkflowModalOpen(true)}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-rose-600 text-white hover:bg-rose-700 h-10 px-4 py-2 gap-2 shadow-sm transition-colors shadow-rose-200">
                                                <Plus className="h-4 w-4" />
                                                Add Workflow
                                            </button>
                                        </div>

                                        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                                            <div className="p-5 border-b border-gray-100 bg-white">
                                                <h4 className="text-lg font-bold text-gray-900">Workflow Configuration</h4>
                                                <p className="text-xs text-gray-500 mt-1.5">Define how AI agents collaborate in the CentralMonitorAI system. Configure dependencies and execution modes to optimize automation.</p>
                                            </div>
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b bg-gray-50/50">
                                                        <th className="h-12 px-6 text-left align-middle font-bold text-gray-500">Agent Type</th>
                                                        <th className="h-12 px-6 text-left align-middle font-bold text-gray-500">Workflow Name</th>
                                                        <th className="h-12 px-6 text-left align-middle font-bold text-gray-500">Execution Mode</th>
                                                        <th className="h-12 px-6 text-left align-middle font-bold text-gray-500">Dependencies</th>
                                                        <th className="h-12 px-6 text-left align-middle font-bold text-gray-500">Status</th>
                                                        <th className="h-12 px-6 text-right align-middle font-bold text-gray-500">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {workflowsData.map((wf) => (
                                                        <tr key={wf.id} className="border-b last:border-0 hover:bg-gray-50/20 transition-colors">
                                                            <td className="p-6 align-middle font-bold text-gray-900">{wf.agentType}</td>
                                                            <td className="p-6 align-middle font-bold text-gray-900">{wf.name}</td>
                                                            <td className="p-6 align-middle">
                                                                <div className="flex items-center gap-2 text-gray-700 font-bold">
                                                                    <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                                                                    {wf.executionMode}
                                                                </div>
                                                            </td>
                                                            <td className="p-6 align-middle">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {wf.dependencies.map((dep, idx) => (
                                                                        <span key={idx} className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                                                                            {dep}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="p-6 align-middle">
                                                                <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-bold text-[#166534]">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a] mr-2"></div>
                                                                    {wf.status}
                                                                </span>
                                                            </td>
                                                            <td className="p-6 align-middle text-right">
                                                                <div className="flex items-center justify-end gap-4">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingWorkflow({
                                                                                id: wf.id,
                                                                                name: wf.name,
                                                                                description: '',
                                                                                agentType: wf.agentType,
                                                                                executionMode: wf.executionMode,
                                                                                prerequisites: wf.dependencies,
                                                                                enabled: wf.status === 'Active'
                                                                            });
                                                                            setIsEditWorkflowModalOpen(true);
                                                                        }}
                                                                        className="text-slate-900 hover:text-rose-600 transition-colors">
                                                                        <Settings className="h-5 w-5" />
                                                                    </button>
                                                                    <button className="text-red-500 hover:text-red-700 transition-colors">
                                                                        <Trash2 className="h-5 w-5 text-red-500" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div className="p-6 bg-white border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500 font-medium">Showing {workflowsData.length} workflow</span>
                                                    <button
                                                        onClick={() => setIsCreateWorkflowModalOpen(true)}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-[#0085ff] text-white hover:bg-blue-600 h-10 px-4 py-2 gap-2 shadow-sm transition-colors">
                                                        <Plus className="h-4 w-4" />
                                                        Add Workflow
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Settings' && (
                            <div className="p-6 space-y-8 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-slate-900">Settings Configuration</h2>
                                    <button
                                        onClick={() => {
                                            console.log('Saving settings:', settings);
                                            // Mock save success
                                        }}
                                        className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all gap-2 shadow-rose-200"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Save Settings
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Monitoring Settings */}
                                    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-8">
                                        <h3 className="text-xl font-bold text-gray-900">Monitoring Settings</h3>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[17px] font-bold text-gray-900">Active Monitoring</p>
                                                    <p className="text-sm text-gray-500">Enables real-time monitoring of incoming data and events</p>
                                                </div>
                                                <button
                                                    onClick={() => setSettings({ ...settings, activeMonitoring: !settings.activeMonitoring })}
                                                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings.activeMonitoring ? 'bg-rose-600' : 'bg-slate-200'}`}
                                                >
                                                    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings.activeMonitoring ? 'translate-x-7' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            <div className={`space-y-4 pt-4 border-t border-gray-50 ${settings.activeMonitoring ? 'opacity-50' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[17px] font-bold text-gray-900">Scheduled Monitoring</p>
                                                        <p className="text-sm text-gray-500">Run analysis on a defined schedule</p>
                                                        {settings.activeMonitoring && <p className="text-xs text-amber-600 font-medium">Disabled while Active Monitoring is enabled</p>}
                                                    </div>
                                                    <button
                                                        disabled={settings.activeMonitoring}
                                                        onClick={() => setSettings({ ...settings, scheduledMonitoring: !settings.scheduledMonitoring })}
                                                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings.scheduledMonitoring ? 'bg-rose-600' : 'bg-slate-200'}`}
                                                    >
                                                        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings.scheduledMonitoring ? 'translate-x-7' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>

                                                <div className="pl-6 space-y-4">
                                                    <p className="text-[15px] font-bold text-gray-900">Schedule Frequency</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {Object.entries(settings.scheduleFrequency).map(([key, val]) => (
                                                            <label key={key} className={`flex items-center gap-3 cursor-pointer group ${settings.activeMonitoring ? 'cursor-not-allowed' : ''}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    disabled={settings.activeMonitoring}
                                                                    checked={val}
                                                                    onChange={() => setSettings({
                                                                        ...settings,
                                                                        scheduleFrequency: { ...settings.scheduleFrequency, [key]: !val }
                                                                    })}
                                                                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                                                                />
                                                                <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, '-$1')}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {settings.activeMonitoring && <p className="text-xs text-amber-600 font-medium">Scheduling options disabled while Active Monitoring is enabled</p>}
                                                </div>
                                            </div>

                                            <div className={`space-y-4 pt-4 border-t border-gray-50 ${settings.activeMonitoring ? 'opacity-50' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[17px] font-bold text-gray-900">Event-Triggered Monitoring</p>
                                                        <p className="text-sm text-gray-500">Run analysis when specific events occur</p>
                                                        {settings.activeMonitoring && <p className="text-xs text-amber-600 font-medium">Disabled while Active Monitoring is enabled</p>}
                                                    </div>
                                                    <button
                                                        disabled={settings.activeMonitoring}
                                                        onClick={() => setSettings({ ...settings, eventTriggeredMonitoring: !settings.eventTriggeredMonitoring })}
                                                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings.eventTriggeredMonitoring ? 'bg-rose-600' : 'bg-slate-200'}`}
                                                    >
                                                        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings.eventTriggeredMonitoring ? 'translate-x-7' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>

                                                <div className="pl-6 space-y-4">
                                                    <p className="text-[15px] font-bold text-gray-900">Trigger Events</p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {Object.entries(settings.triggerEvents).map(([key, val]) => (
                                                            <label key={key} className={`flex items-center gap-3 cursor-pointer group ${settings.activeMonitoring ? 'cursor-not-allowed' : ''}`}>
                                                                <input
                                                                    type="checkbox"
                                                                    disabled={settings.activeMonitoring}
                                                                    checked={val}
                                                                    onChange={() => setSettings({
                                                                        ...settings,
                                                                        triggerEvents: { ...settings.triggerEvents, [key]: !val }
                                                                    })}
                                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {settings.activeMonitoring && <p className="text-xs text-amber-600 font-medium">Event triggers disabled while Active Monitoring is enabled</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Notification Settings */}
                                        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                                            <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>

                                            <div className="space-y-4">
                                                <p className="text-[15px] font-bold text-gray-900">Notification Types</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(settings.notificationTypes).map(([key, val]) => (
                                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={val}
                                                                onChange={() => setSettings({
                                                                    ...settings,
                                                                    notificationTypes: { ...settings.notificationTypes, [key]: !val }
                                                                })}
                                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <p className="text-[15px] font-bold text-gray-900">Delivery Methods</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {Object.entries(settings.deliveryMethods).map(([key, val]) => (
                                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={val}
                                                                onChange={() => setSettings({
                                                                    ...settings,
                                                                    deliveryMethods: { ...settings.deliveryMethods, [key]: !val }
                                                                })}
                                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[15px] font-bold text-gray-900">Email Recipients</p>
                                                <textarea
                                                    className="w-full h-24 rounded-lg border border-slate-200 p-4 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-slate-50/20 resize-none"
                                                    value={settings.emailRecipients}
                                                    onChange={(e) => setSettings({ ...settings, emailRecipients: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Rule-Based Detection */}
                                        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                                            <h3 className="text-xl font-bold text-gray-900">Rule-Based Detection</h3>

                                            <div className="space-y-6">
                                                {[
                                                    { key: 'protocolDeviationDetection', label: 'Protocol Deviation Detection', desc: 'Automatically detect protocol deviations based on predefined rules' },
                                                    { key: 'safetySignalDetection', label: 'Safety Signal Detection', desc: 'Detect potential safety signals from AEs and labs' },
                                                    { key: 'dataQualityChecks', label: 'Data Quality Checks', desc: 'Run automated data quality and consistency checks' },
                                                    { key: 'sitePerformanceMetrics', label: 'Site Performance Metrics', desc: 'Track and alert on site performance metrics', badge: 'Disabled' }
                                                ].map((item) => (
                                                    <div key={item.key} className="flex items-center justify-between">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[15px] font-bold text-gray-900">{item.label}</p>
                                                                {item.badge && <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 border border-gray-200">{item.badge}</span>}
                                                            </div>
                                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                                                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings[item.key as keyof typeof settings] ? 'bg-rose-600' : 'bg-slate-200'}`}
                                                        >
                                                            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-0'}`} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* AI Configuration */}
                                    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-8">
                                        <h3 className="text-xl font-bold text-gray-900">AI Configuration</h3>

                                        <div className="space-y-6">
                                            {[
                                                { key: 'aiEnhancedAnalysis', label: 'AI-Enhanced Analysis', desc: 'Uses AI to enhance signal detection and data analysis' },
                                                { key: 'aiGeneratedSuggestions', label: 'AI-Generated Suggestions', desc: 'Provides AI-generated suggestions for queries and tasks' },
                                                { key: 'predictiveAnalytics', label: 'Predictive Analytics', desc: 'Uses historical data to predict potential issues' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[15px] font-bold text-gray-900">{item.label}</p>
                                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                                                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="space-y-3 pt-2">
                                                <p className="text-[15px] font-bold text-gray-900">AI Provider</p>
                                                <div className="relative">
                                                    <select
                                                        className="w-full h-12 appearance-none items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium text-slate-700"
                                                        value={settings.aiProvider}
                                                        onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                                                    >
                                                        <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
                                                        <option value="Anthropic Claude 3.5">Anthropic Claude 3.5</option>
                                                        <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-4 h-4 w-4 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compliance Configuration */}
                                    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-8">
                                        <h3 className="text-xl font-bold text-gray-900">Compliance Configuration</h3>

                                        <div className="space-y-6">
                                            {[
                                                { key: 'gdprCompliance', label: 'GDPR Compliance', desc: 'Ensures data handling complies with GDPR requirements' },
                                                { key: 'hipaaCompliance', label: 'HIPAA Compliance', desc: 'Ensures data handling complies with HIPAA requirements' },
                                                { key: 'cfrPart11Compliance', label: '21 CFR Part 11 Compliance', desc: 'Ensures system meets 21 CFR Part 11 requirements' },
                                                { key: 'auditTrail', label: 'Audit Trail', desc: 'Maintains comprehensive audit trail of all activities' },
                                                { key: 'electronicSignatures', label: 'Electronic Signatures', desc: 'Enables FDA-compliant electronic signatures' }
                                            ].map((item) => (
                                                <div key={item.key} className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <p className="text-[15px] font-bold text-gray-900">{item.label}</p>
                                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key as keyof typeof settings] })}
                                                        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                                    >
                                                        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-0'}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Chatbot specific to this page */}
            {
                isChatbotOpen && (
                    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isChatbotMinimized ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
                        <div className="rounded-xl border text-card-foreground shadow-2xl bg-white w-[400px] h-[550px] flex flex-col overflow-hidden">
                            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Bot className="h-6 w-6" />
                                    <span className="text-lg font-bold">Data Manager Assistant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsChatbotMinimized(true)}
                                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                                        <Maximize2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsChatbotMinimized(true);
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                                        <X className="h-5 w-5 font-bold" />
                                    </button>
                                </div>
                            </div>
                            {/* Chat Content */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="p-4 bg-white border-b flex flex-wrap gap-2">
                                    {['Run DQ Checks', 'Create Task', 'Assign Task', 'View Task', 'Trial Health'].map((action) => (
                                        <button key={action} className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 hover:bg-gray-50 shadow-sm transition-colors">
                                            {action}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30">
                                    <div className="flex items-start gap-3">
                                        <div className="h-9 w-9 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 border border-rose-200">
                                            <Bot className="h-5 w-5 text-rose-600" />
                                        </div>
                                        <div className="max-w-[85%] rounded-2xl p-4 bg-white text-gray-800 shadow-sm border border-gray-100">
                                            <div className="text-[15px] leading-relaxed">
                                                Hello! I'm your Data Manager AI assistant. How can I help you with data quality management for Diabetes Type 2 Study?
                                                <br /><br />
                                                You can ask me about:
                                                <ul className="mt-2 space-y-1">
                                                    <li>• Trial health summary</li>
                                                    <li>• Data source health status</li>
                                                    <li>• Domain completeness</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border-t space-y-3">
                                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-sm font-bold text-gray-900 leading-none">Task Assignment Mode: <span className="text-gray-500 font-medium ml-1">{isAgentMode ? 'Agent.AI' : 'Human in Loop'}</span></span>
                                        <div
                                            onClick={toggleAgentMode}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${isAgentMode ? 'bg-rose-600' : 'bg-slate-300'}`}
                                        >
                                            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${isAgentMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 relative">
                                        <input
                                            className="flex h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-[15px] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all placeholder:text-slate-400"
                                            placeholder="Ask about DQ checks, settings, monitoring..."
                                        />
                                        <button className="h-12 w-12 rounded-lg bg-rose-400 text-white flex items-center justify-center flex-shrink-0 hover:bg-rose-600 transition-colors shadow-sm">
                                            <Sparkles className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Minimized Chatbot Icon */}
            <div
                onClick={() => {
                    setIsChatbotOpen(true);
                    setIsChatbotMinimized(false);
                }}
                className={`fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300 ${(!isChatbotOpen || isChatbotMinimized) ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
            >
                <div className="h-14 w-14 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:bg-rose-700 transition-all shadow-rose-200">
                    <Bot className="h-7 w-7" />
                </div>
            </div>

            {/* Refresh Notification Popup */}
            <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${isRefreshing ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 px-6 py-4 min-w-[320px]">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[17px] font-bold text-gray-900 tracking-tight">Refreshing agent statuses</h4>
                        <p className="text-sm text-gray-500 font-medium">Latest agent data is being loaded...</p>
                    </div>
                </div>
            </div>

            {/* Expanded Monitor Modal */}
            {
                isMonitorExpanded && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">AI Agent System Monitor</h2>
                                    <p className="text-sm text-gray-500">Real-time view of all active AI agents processing your clinical trial data</p>
                                </div>
                                <button
                                    onClick={() => setIsMonitorExpanded(false)}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6 bg-gray-50 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        {
                                            title: 'Protocol Monitor', active: true,
                                            desc: 'Monitoring protocol deviations across sites and subjects',
                                            activity: '5m ago',
                                            stats: [
                                                { label: 'Subjects monitored', value: '52' },
                                                { label: 'Deviations detected', value: '3' },
                                                { label: 'Queries created', value: '2' }
                                            ]
                                        },
                                        {
                                            title: 'Site Performance', active: true,
                                            desc: 'Tracking enrollment, data entry, and query resolution metrics',
                                            activity: '1m ago',
                                            stats: [
                                                { label: 'Sites monitored', value: '12' },
                                                { label: 'Enrollment alerts', value: '1' },
                                                { label: 'Task assignments', value: '3' }
                                            ]
                                        },
                                        {
                                            title: 'Lab Data Monitor', active: true,
                                            desc: 'Analyzing lab trends and flagging clinically significant changes',
                                            activity: 'Just now',
                                            stats: [
                                                { label: 'Lab values analyzed', value: '287' },
                                                { label: 'Abnormal results', value: '8' },
                                                { label: 'CTCAE Grade 3+', value: '2' }
                                            ]
                                        },
                                        {
                                            title: 'Safety Signal', active: true,
                                            desc: 'Detecting potential safety signals across AEs and lab data',
                                            activity: '3m ago',
                                            stats: [
                                                { label: 'AEs analyzed', value: '42' },
                                                { label: 'Potential signals', value: '3' },
                                                { label: 'Safety queries', value: '2' }
                                            ]
                                        }
                                    ].map((agent, i) => (
                                        <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                                    <h3 className="font-semibold text-slate-800 text-lg">{agent.title}</h3>
                                                </div>
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Active</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4 h-10">{agent.desc}</p>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Last activity:</span>
                                                    <span className="font-medium text-gray-900">{agent.activity}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">Status:</span>
                                                    <span className="font-medium text-green-600">Running</span>
                                                </div>
                                                {agent.stats.map((stat, j) => (
                                                    <div key={j} className="flex justify-between text-sm">
                                                        <span className="text-gray-500">{stat.label}:</span>
                                                        <span className="font-medium text-gray-900">{stat.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border border-gray-700">
                                    <div className="bg-[#0f172a] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                                            <h3 className="text-white font-mono font-medium">Monitor Activity Log <span className="text-gray-400 text-sm font-normal">Detailed agent activity</span></h3>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 font-mono text-sm max-h-[300px] overflow-y-auto">
                                        {[
                                            { time: '13:51:15', agent: 'ProtocolMonitorAgent', msg: 'Checking visit schedule adherence for 52 subjects...', color: 'text-purple-400' },
                                            { time: '13:50:48', agent: 'SitePerformanceAgent', msg: 'Site 103 showing 22% decline in enrollment rate', color: 'text-emerald-400' },
                                            { time: '13:50:30', agent: 'LabDataMonitorAgent', msg: 'New lab data received from central lab (287 results)', color: 'text-purple-400' },
                                            { time: '13:50:15', agent: 'SafetySignalAgent', msg: 'Creating Query #PD-042 for elevated liver enzymes in 3 subjects', color: 'text-blue-400' },
                                            { time: '13:49:55', agent: 'ProtocolMonitorAgent', msg: 'Detected 3 protocol deviations in visit window compliance', color: 'text-purple-400' },
                                            { time: '13:49:30', agent: 'SitePerformanceAgent', msg: 'Analyzing query resolution times for all sites', color: 'text-emerald-400' },
                                            { time: '13:49:10', agent: 'LabDataMonitorAgent', msg: 'Applying reference ranges to new lab results', color: 'text-purple-400' },
                                            { time: '13:48:45', agent: 'SafetySignalAgent', msg: 'Cross-referencing AEs with concomitant medications', color: 'text-blue-400' },
                                            { time: '13:48:30', agent: 'ProtocolMonitorAgent', msg: 'Updating trial milestones', color: 'text-purple-400' },
                                            { time: '13:48:00', agent: 'SitePerformanceAgent', msg: 'Calculating data entry metrics by site', color: 'text-emerald-400' },
                                            { time: '13:47:45', agent: 'LabDataMonitorAgent', msg: 'Trend analysis of hematology values', color: 'text-purple-400' },
                                            { time: '13:47:30', agent: 'SafetySignalAgent', msg: 'Safety report generation scheduled', color: 'text-blue-400' },
                                        ].map((log, i) => (
                                            <div key={i} className="mb-2 last:mb-0">
                                                <span className="text-cyan-500">[{log.time}]</span>{' '}
                                                <span className={log.color}>{log.agent}:</span>{' '}
                                                <span className="text-gray-300">{log.msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Completion Analysis Modal */}
            {
                showCompletionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden relative">
                            <button
                                onClick={() => setShowCompletionModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Monitoring Analysis Complete</h2>
                                <p className="text-gray-500 mb-8">Here's a summary of issues detected in {selectedStudy.split('-')[0]}</p>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { count: 4, label: 'New Queries', color: 'text-rose-600' },
                                        { count: 6, label: 'New Tasks', color: 'text-rose-600' },
                                        { count: 1, label: 'Issues Found', color: 'text-rose-600' },
                                        { count: 2, label: 'Signals Detected', color: 'text-rose-600' }
                                    ].map((stat, i) => (
                                        <div key={i} className="border border-slate-100 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-center shadow-sm">
                                            <span className={`text - 4xl font - bold ${stat.color} mb - 1`}>{stat.count}</span>
                                            <span className="text-gray-600">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-slate-50/50 rounded-lg p-6 mb-8 border border-slate-100">
                                    <h3 className="font-semibold text-slate-800 mb-4 text-lg">Key Findings</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-800">Potential safety signal detected related to blood pressure measurements</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-800">1 data consistency issue requiring review</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-800">Created 4 new queries for site review</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-800">Assigned 6 tasks to study team members</span>
                                        </li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setShowCompletionModal(false)}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-md transition-colors text-lg shadow-sm shadow-rose-200"
                                >
                                    View Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Query Modal */}
            {
                isCreateQueryModalOpen && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Create New Query</h3>
                                    <p className="text-sm text-gray-500">Create a new query to request clarification or additional information.</p>
                                </div>
                                <button onClick={() => setIsCreateQueryModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Site</label>
                                    <select
                                        value={newQuery.site}
                                        onChange={(e) => setNewQuery({ ...newQuery, site: e.target.value })}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select a site</option>
                                        <option value="Site 101">Site 101</option>
                                        <option value="Site 102">Site 102</option>
                                        <option value="Site 103">Site 103</option>
                                        <option value="Site 104">Site 104</option>
                                        <option value="Site 105">Site 105</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
                                    <select
                                        value={newQuery.category}
                                        onChange={(e) => setNewQuery({ ...newQuery, category: e.target.value })}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Laboratory">Laboratory</option>
                                        <option value="Adverse Event">Adverse Event</option>
                                        <option value="Informed Consent">Informed Consent</option>
                                        <option value="Eligibility Criteria">Eligibility Criteria</option>
                                        <option value="Concomitant Medication">Concomitant Medication</option>
                                        <option value="Protocol Deviation">Protocol Deviation</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subject ID</label>
                                    <input
                                        value={newQuery.subjectId}
                                        onChange={(e) => setNewQuery({ ...newQuery, subjectId: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter subject ID"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Priority</label>
                                    <select
                                        value={newQuery.priority}
                                        onChange={(e) => setNewQuery({ ...newQuery, priority: e.target.value })}
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select priority</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Query Text</label>
                                    <textarea
                                        value={newQuery.queryText}
                                        onChange={(e) => setNewQuery({ ...newQuery, queryText: e.target.value })}
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Enter your query..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsCreateQueryModalOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Creating query:', newQuery);
                                        setIsCreateQueryModalOpen(false);
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-rose-600 text-white hover:bg-rose-700 h-10 px-4 py-2 shadow-sm shadow-rose-200">
                                    Create Query
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Task Modal */}
            {
                isCreateTaskModalOpen && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
                                    <p className="text-sm text-gray-500">Create a new task for site monitoring activities.</p>
                                </div>
                                <button onClick={() => setIsCreateTaskModalOpen(false)} className="text-gray-400 hover:text-gray-500 p-1">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Task Title</label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Enter task title"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Assignee</label>
                                    <select
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        value={newTask.assignee}
                                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                                    >
                                        <option value="">Select an assignee</option>
                                        <option value="Michael Wong (CRA)">Michael Wong (CRA)</option>
                                        <option value="Jennifer Lee (CRA)">Jennifer Lee (CRA)</option>
                                        <option value="Robert Chen (Data Manager)">Robert Chen (Data Manager)</option>
                                        <option value="Sarah Johnson (Medical Monitor)">Sarah Johnson (Medical Monitor)</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Priority</label>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Due Date</label>
                                        <input
                                            type="date"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={newTask.dueDate}
                                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="Enter task description..."
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Related Items</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="link-qry" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            <label htmlFor="link-qry" className="text-sm text-gray-700">Link to Query #QRY-132</label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="link-site" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            <label htmlFor="link-site" className="text-sm text-gray-700">Link to Site 101</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsCreateTaskModalOpen(false)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-gray-100 h-10 px-6 py-2 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Creating task:', newTask);
                                        setIsCreateTaskModalOpen(false);
                                    }}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-rose-600 text-white hover:bg-rose-700 h-10 px-6 py-2 shadow-sm transition-colors shadow-rose-200">
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Workflow Modal */}
            {
                isCreateWorkflowModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[580px] overflow-hidden border border-gray-100 italic-none">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                                <div>
                                    <h3 className="text-[22px] font-bold text-gray-900">Create Agent Workflow</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">Configure how agents work together in the CentralMonitorAI system.</p>
                                </div>
                                <button onClick={() => setIsCreateWorkflowModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Name</label>
                                    <input
                                        className="flex h-11 w-full rounded-lg border border-slate-200 bg-slate-50/30 px-4 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                                        placeholder="Test"
                                        value={newWorkflow.name}
                                        onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-start">
                                    <label className="text-[15px] font-bold text-gray-900 text-right mt-2">Description</label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-slate-50/30 px-4 py-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none"
                                        placeholder="What this workflow does..."
                                        value={newWorkflow.description}
                                        onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Agent Type</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-11 w-full appearance-none items-center justify-between rounded-lg border border-slate-200 bg-slate-50/30 px-4 py-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                                            value={newWorkflow.agentType}
                                            onChange={(e) => setNewWorkflow({ ...newWorkflow, agentType: e.target.value })}
                                        >
                                            <option value="Signal Detection">Signal Detection</option>
                                            <option value="Task Manager">Task Manager</option>
                                            <option value="Query Manager">Query Manager</option>
                                            <option value="Site Monitor">Site Monitor</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Execution Mode</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-11 w-full appearance-none items-center justify-between rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            value={newWorkflow.executionMode}
                                            onChange={(e) => setNewWorkflow({ ...newWorkflow, executionMode: e.target.value })}
                                        >
                                            <option value="sequential">sequential</option>
                                            <option value="independent">independent</option>
                                            <option value="conditional">conditional</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-start">
                                    <label className="text-[15px] font-bold text-gray-900 text-right mt-2">Prerequisites</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                        {['Signal Detection', 'Task Manager', 'Query Manager'].map((dep) => (
                                            <label key={dep} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={newWorkflow.prerequisites.includes(dep)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewWorkflow({ ...newWorkflow, prerequisites: [...newWorkflow.prerequisites, dep] });
                                                        } else {
                                                            setNewWorkflow({ ...newWorkflow, prerequisites: newWorkflow.prerequisites.filter(p => p !== dep) });
                                                        }
                                                    }}
                                                    className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 transition-all cursor-pointer"
                                                />
                                                <span className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dep}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Enabled</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setNewWorkflow({ ...newWorkflow, enabled: !newWorkflow.enabled })}
                                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${newWorkflow.enabled ? 'bg-rose-600' : 'bg-slate-200'}`}
                                        >
                                            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${newWorkflow.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                        <span className="text-[15px] font-bold text-gray-900">Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsCreateWorkflowModalOpen(false)}
                                    className="h-11 px-8 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Adding workflow:', newWorkflow);
                                        setIsCreateWorkflowModalOpen(false);
                                    }}
                                    className="h-11 px-8 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-200 transition-all">
                                    Create Workflow
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Workflow Modal */}
            {
                isEditWorkflowModalOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-[580px] overflow-hidden border border-gray-100 italic-none">
                            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                                <div>
                                    <h3 className="text-[22px] font-bold text-gray-900">Edit Agent Workflow</h3>
                                    <p className="text-sm text-gray-500">Edit existing agent workflow parameters.</p>
                                </div>
                                <button onClick={() => setIsEditWorkflowModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Name</label>
                                    <input
                                        className="flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        placeholder="Enter workflow name"
                                        value={editingWorkflow.name}
                                        onChange={(e) => setEditingWorkflow({ ...editingWorkflow, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-start">
                                    <label className="text-[15px] font-bold text-gray-900 text-right mt-2">Description</label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                        placeholder="What this workflow does..."
                                        value={editingWorkflow.description}
                                        onChange={(e) => setEditingWorkflow({ ...editingWorkflow, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Agent Type</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-11 w-full appearance-none items-center justify-between rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            value={editingWorkflow.agentType}
                                            onChange={(e) => setEditingWorkflow({ ...editingWorkflow, agentType: e.target.value })}
                                        >
                                            <option value="Signal Detection">Signal Detection</option>
                                            <option value="Task Manager">Task Manager</option>
                                            <option value="Query Manager">Query Manager</option>
                                            <option value="Site Monitor">Site Monitor</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Execution Mode</label>
                                    <div className="relative">
                                        <select
                                            className="flex h-11 w-full appearance-none items-center justify-between rounded-lg border border-gray-200 bg-gray-50/30 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            value={editingWorkflow.executionMode}
                                            onChange={(e) => setEditingWorkflow({ ...editingWorkflow, executionMode: e.target.value })}
                                        >
                                            <option value="sequential">sequential</option>
                                            <option value="independent">independent</option>
                                            <option value="conditional">conditional</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-start">
                                    <label className="text-[15px] font-bold text-gray-900 text-right mt-2">Prerequisites</label>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                                        {['Signal Detection', 'Task Manager', 'Query Manager'].map((dep) => (
                                            <label key={dep} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={editingWorkflow.prerequisites.includes(dep)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setEditingWorkflow({ ...editingWorkflow, prerequisites: [...editingWorkflow.prerequisites, dep] });
                                                        } else {
                                                            setEditingWorkflow({ ...editingWorkflow, prerequisites: editingWorkflow.prerequisites.filter(p => p !== dep) });
                                                        }
                                                    }}
                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                                />
                                                <span className="text-[15px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{dep}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[130px_1fr] gap-6 items-center">
                                    <label className="text-[15px] font-bold text-gray-900 text-right">Enabled</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setEditingWorkflow({ ...editingWorkflow, enabled: !editingWorkflow.enabled })}
                                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none ${editingWorkflow.enabled ? 'bg-rose-600' : 'bg-slate-200'}`}
                                        >
                                            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${editingWorkflow.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                                        </button>
                                        <span className="text-[15px] font-bold text-gray-900">Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditWorkflowModalOpen(false)}
                                    className="h-11 px-8 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        console.log('Updating workflow:', editingWorkflow);
                                        setIsEditWorkflowModalOpen(false);
                                    }}
                                    className="h-11 px-8 rounded-lg bg-[#0085ff] text-white text-sm font-bold hover:bg-blue-600 shadow-md shadow-blue-200 transition-all">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
