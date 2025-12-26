import {
    CircleAlert, Cpu, ChevronLeft, ChevronDown, Sparkles, LoaderCircle,
    EyeOff, Download, Send, Minimize, X, RefreshCw, Clock,
    Box, Scale, ClipboardCheck, ListTodo, AlertTriangle, FileText, CheckCircle,
    Search, ArrowUpDown, User, ClipboardList, Plus, Filter, Calendar,
    UserPlus, KeyRound, Lock, Network, List, Settings,
    Bell, Info, CalendarClock, MessageSquare, Database, Activity, Beaker, Bot
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { dataManagerService } from '../services/api';

interface Agent {
    id: number;
    name: string;
    role: string;
    status: string;
    type: string;
    description: string;
    last_active: string;
    records_processed: number;
    issues_found: number;
    icon: string;
}

interface ActivityLog {
    id: number;
    agent_name: string;
    message: string;
    level: string;
    timestamp: string;
}

interface DataQualityIssue {
    id: string;
    study_id: string;
    type: string;
    category: string;
    title: string;
    status: string;
    severity: string;
    domain: string;
    created: string;
}

export default function DataManagerAI() {
    const [activeTab, setActiveTab] = useState('issues');
    const [activeSettingsTab, setActiveSettingsTab] = useState('users');
    const [agentsVisible, setAgentsVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [taskMode, setTaskMode] = useState('Agent.AI'); // Agent.AI or Manual
    const [isChatbotVisible, setIsChatbotVisible] = useState(true);
    const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);

    const [agents, setAgents] = useState<Agent[]>([]);
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [issues, setIssues] = useState<DataQualityIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // Set up polling for logs to make it feel "active"
        const interval = setInterval(fetchLogs, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchAgents(), fetchLogs(), fetchIssues()]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAgents = async () => {
        try {
            const data = await dataManagerService.getAgents();
            setAgents(data);
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    const fetchLogs = async () => {
        try {
            const data = await dataManagerService.getActivityLogs();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const fetchIssues = async () => {
        try {
            const data = await dataManagerService.getDQIssues();
            setIssues(data);
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Simulate refreshing all agents
            const refreshPromises = agents.map(agent => dataManagerService.refreshAgent(agent.id));
            await Promise.all(refreshPromises);

            // Re-fetch everything
            await fetchData();
        } catch (error) {
            console.error("Error refreshing agents:", error);
        } finally {
            setTimeout(() => setIsRefreshing(false), 1000);
        }
    };

    const toggleAgents = () => {
        setAgentsVisible(!agentsVisible);
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Box': return <Box className="h-24 w-24 agent-icon teal-icon" />;
            case 'Cpu': return <Cpu className="h-24 w-24 agent-icon teal-icon" />;
            case 'Scale': return <Scale className="h-24 w-24 agent-icon teal-icon" />;
            case 'ClipboardCheck': return <ClipboardCheck className="h-24 w-24 agent-icon teal-icon" />;
            case 'ListTodo': return <ListTodo className="h-24 w-24 agent-icon teal-icon" />;
            default: return <Cpu className="h-24 w-24 agent-icon teal-icon" />;
        }
    };

    // Small icon helper
    const getSmallIcon = (iconName: string) => {
        switch (iconName) {
            case 'Box': return <Box className="h-3 w-3 text-blue-600" />;
            case 'Cpu': return <Cpu className="h-3 w-3 text-blue-600" />;
            case 'Scale': return <Scale className="h-3 w-3 text-blue-600" />;
            case 'ClipboardCheck': return <ClipboardCheck className="h-3 w-3 text-blue-600" />;
            case 'ListTodo': return <ListTodo className="h-3 w-3 text-blue-600" />;
            default: return <RefreshCw className="h-3 w-3 text-blue-600" />;
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatTimeOnly = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour12: false });
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return formatDate(dateString);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col h-full">
                <div className="bg-blue-700 p-3 mb-4 rounded-md shadow-md text-center">
                    <CircleAlert className="h-5 w-5 inline-block mr-2 animate-pulse text-white" />
                    <span className="text-white font-bold">
                        Active monitoring on the data from Trial Data Management
                    </span>
                </div>

                {isRefreshing && (
                    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                            <LoaderCircle className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="font-medium text-gray-700">Refreshing Agents...</span>
                        </div>
                    </div>
                )}

                {agentsVisible && agents.length > 0 && (
                    <div className="agent-card data-manager-agent mb-6">
                        <div className="agent-icon-wrapper">
                            <div className="hexagon-frame">
                                <div className="glow-effect teal-glow"></div>
                                {getIcon('Cpu')}
                                <div className="data-particles"></div>
                            </div>
                        </div>
                        <div className="agent-details">
                            <h3 className="agent-title">
                                <span className="highlight teal">The Quantum Analyst</span>
                            </h3>
                            <div className="agent-subtitle">Data Manager.AI</div>
                            <div className="agent-status">
                                <span className="status-dot active"></span>
                                <span>Optimizing data quality across all domains</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 mb-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <button className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 flex items-center gap-1 text-pink-600 hover:text-pink-700 border-pink-200 hover:bg-pink-50">
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to AI Agents Hub
                                </button>
                            </div>
                            <h1 className="text-2xl font-bold text-blue-800">Data Manager.AI</h1>
                            <p className="text-gray-600">AI-powered data quality management and reconciliation</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="flex h-10 items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[240px] bg-white">
                                <span className="line-clamp-1">PRO001 - Diabetes Type 2 Study</span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                            <div className="flex items-center p-2 bg-white border border-blue-100 rounded-md">
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs font-medium">Task Assignment Mode:</span>
                                    <span className="text-xs font-semibold text-blue-700">{taskMode}</span>
                                </div>
                                <div
                                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ml-3 cursor-pointer ${taskMode === 'Agent.AI' ? 'bg-blue-600' : 'bg-gray-400'}`}
                                    onClick={() => setTaskMode(prev => prev === 'Agent.AI' ? 'Manual' : 'Agent.AI')}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${taskMode === 'Agent.AI' ? 'translate-x-5' : 'translate-x-1'}`}></span>
                                </div>
                            </div>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700" onClick={handleRefresh}>
                                <Sparkles className="mr-2 h-4 w-4 text-white" />
                                Run DQ and Reconciliation
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-xs" onClick={handleRefresh}>
                                <RefreshCw className={`mr-1 h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh Agents
                            </button>
                            <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-xs"
                                onClick={toggleAgents}
                            >
                                <EyeOff className="mr-1 h-3 w-3" />
                                {agentsVisible ? 'Hide Agents' : 'Show Agents'}
                            </button>
                        </div>
                    </div>

                    {agentsVisible && (
                        <div className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground text-foreground mt-4 bg-blue-50 border-blue-200">
                            <Cpu className="h-4 w-4 text-blue-600" />
                            <h5 className="mb-1 font-medium leading-none tracking-tight text-blue-800">Intelligent monitoring active</h5>
                            <div className="text-sm [&_p]:leading-relaxed text-blue-700">
                                <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                                    <li>AI agents actively monitor data refresh events to automatically trigger quality checks</li>
                                    <li>Cross-data reconciliation maps subjects across EDC, Labs, and external data sources</li>
                                    <li>Protocol compliance verification compares data to study specifications</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 bg-gradient-to-b from-blue-50 to-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* Dynamic Agent Cards */}
                        {agents.map((agent) => (
                            <div key={agent.id} className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className={`h-3 w-3 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} mr-2 animate-pulse`}></div>
                                        <h4 className="font-medium text-blue-800">{agent.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} text-xs`}>{agent.status}</div>
                                        <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center" onClick={() => dataManagerService.refreshAgent(agent.id).then(fetchData)}><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">{agent.description}</p>
                                <div className="mb-2 text-xs text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span>Records in progress:</span>
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">{agent.records_processed}</div>
                                    </div>
                                    <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(agent.records_processed, 100)}%` }}></div></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>{getRelativeTime(agent.last_active)}</span></div>
                                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">{agent.issues_found} issues</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 rounded-lg bg-gradient-to-r from-gray-900 to-blue-900 p-3 text-green-400 font-mono text-xs border border-gray-700 relative shadow-inner">
                        <div className="absolute top-2 right-2 flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <h4 className="text-white mb-2 text-sm flex items-center font-semibold">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            Agent Activity Log
                            <span className="text-xs text-gray-400 ml-2 font-normal">Real-time processing</span>
                        </h4>
                        <div className="space-y-1 max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 py-1">
                            {logs.map((log) => (
                                <p key={log.id} className="opacity-70">
                                    [<span className="text-blue-400">{formatDate(log.timestamp)}</span>] <span className="text-purple-400">{log.agent_name}</span>: {log.message}
                                </p>
                            ))}
                            {logs.length === 0 && <p className="opacity-50">No logs available...</p>}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="inline-flex h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600 mb-6 w-fit">
                        {['issues', 'tasks', 'reports', 'monitoring', 'progress', 'workflow', 'settings'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                            >
                                {tab === 'issues' ? 'DQ and Reconciliation' :
                                    tab === 'tasks' ? 'Tasks' :
                                        tab === 'reports' ? 'Reports' :
                                            tab === 'monitoring' ? 'Event Monitoring' :
                                                tab === 'progress' ? 'Domain Progress' :
                                                    tab === 'workflow' ? 'Agent Workflow' : 'Settings'}
                            </button>
                        ))}
                    </div>

                    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border-blue-100 bg-white flex-1 animate-in fade-in zoom-in-95 duration-200">
                        {activeTab === 'issues' && (
                            <>
                                <div className="flex justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <button className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
                                            <span className="line-clamp-1">All Types</span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </button>
                                        <button className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
                                            <span className="line-clamp-1">All Categories</span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </button>
                                        <button className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
                                            <span className="line-clamp-1">All Statuses</span>
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </button>
                                    </div>
                                    <button className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                    </button>
                                </div>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="relative w-full overflow-auto">
                                        <table className="w-full caption-bottom text-sm">
                                            <thead className="[&_tr]:border-b">
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Severity</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Domain</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="[&_tr:last-child]:border-0">
                                                {issues.length > 0 ? (
                                                    issues.map((issue) => (
                                                        <tr key={issue.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                            <td className="p-4 align-middle font-medium"><button className="text-blue-600 hover:underline">{issue.id}</button></td>
                                                            <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200">{issue.type}</div></td>
                                                            <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-purple-100 text-purple-700">{issue.category}</div></td>
                                                            <td className="p-4 align-middle">{issue.title}</td>
                                                            <td className="p-4 align-middle"><div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${issue.status === 'Detected' ? 'bg-red-100 text-red-700' : issue.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{issue.status}</div></td>
                                                            <td className="p-4 align-middle"><div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${issue.severity === 'High' ? 'bg-red-100 text-red-700' : issue.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{issue.severity}</div></td>
                                                            <td className="p-4 align-middle">{issue.domain}</td>
                                                            <td className="p-4 align-middle">{formatDate(issue.created).split(',')[0]}</td>
                                                            <td className="p-4 align-middle"><button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">View</button></td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={9} className="p-4 text-center text-gray-500">No issues found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-800">Query & Task Workflow Management</h3>
                                        <p className="text-neutral-500 mt-1 text-sm">Manage and track queries and tasks across clinical trials and stakeholders</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-md border border-blue-100">
                                            <User className="mr-2 h-4 w-4" />
                                            <span className="text-sm font-medium">System Administrator</span>
                                        </div>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            Export
                                        </button>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-9 rounded-md px-3">
                                            <Plus className="mr-2 h-4 w-4" />
                                            New Query
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center mb-6">
                                    <div className="flex-1">
                                        <div className="inline-flex h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600">
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-blue-700 shadow-sm">
                                                All Queries & Tasks
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-100 hover:text-blue-800">
                                                Assigned to Me
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-100 hover:text-blue-800">
                                                Created by Me
                                            </button>
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-100 hover:text-blue-800">
                                                Responded
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white">
                                    <div className="flex flex-col space-y-1.5 p-6 pb-0">
                                        <div className="flex flex-col lg:flex-row justify-between gap-4 pb-4">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <input className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 w-full" placeholder="Search by ID, title, or description..." />
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {['All Priorities', 'All Statuses', 'All Studies', 'All Types'].map((filter) => (
                                                    <button key={filter} className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[130px]">
                                                        <span className="line-clamp-1">{filter}</span>
                                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-0">
                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="relative w-full overflow-auto">
                                                <table className="w-full caption-bottom text-sm">
                                                    <thead className="[&_tr]:border-b bg-gray-50">
                                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[50px]">
                                                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                            </th>
                                                            {['Task ID', 'Query ID', 'Title', 'Priority', 'Status'].map((header) => (
                                                                <th key={header} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                                                    <div className="flex items-center cursor-pointer hover:text-gray-900">
                                                                        {header}
                                                                        <ArrowUpDown className="ml-1 h-3 w-3" />
                                                                    </div>
                                                                </th>
                                                            ))}
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Assigned To</th>
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="[&_tr:last-child]:border-0">
                                                        {[
                                                            { id: 'TASK-CM-006', queryId: 'SIG-045', title: 'Site enrollment rate below threshold', desc: 'Site 6 enrollment rate is 65% below target', priority: 'High', status: 'Completed', assignedTo: 'John Doe', dueDate: '2025-04-20' },
                                                            { id: 'TASK-DM-102', queryId: 'QRY-882', title: 'Missing concomitant meds date', desc: 'Subject 102-005 has CM record without start date', priority: 'Medium', status: 'In Progress', assignedTo: 'Sarah Smith', dueDate: '2025-04-22' },
                                                            { id: 'TASK-LB-033', queryId: 'QRY-129', title: 'Lab value out of range confirmation', desc: 'Confirm critical lab value for Subject 003-012', priority: 'High', status: 'Pending', assignedTo: 'Dr. Emily Chen', dueDate: '2025-04-18' },
                                                            { id: 'TASK-AE-009', queryId: 'SIG-012', title: 'SAE Reconciliation Required', desc: 'Reconcile SAE report with safety database', priority: 'Critical', status: 'Pending', assignedTo: 'Safety Team', dueDate: '2025-04-19' },
                                                            { id: 'TASK-VS-221', queryId: 'QRY-334', title: 'Vital Signs visit date mismatch', desc: 'Visit date does not match visit window', priority: 'Low', status: 'Completed', assignedTo: 'Data Team', dueDate: '2025-04-15' },
                                                        ].map((task, i) => (
                                                            <tr key={task.id} className="border-b transition-colors hover:bg-gray-50">
                                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                                </td>
                                                                <td className="p-4 align-middle font-medium text-gray-900">{task.id}</td>
                                                                <td className="p-4 align-middle text-blue-600 hover:underline cursor-pointer">{task.queryId}</td>
                                                                <td className="p-4 align-middle">
                                                                    <div className="font-medium text-gray-900">{task.title}</div>
                                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{task.desc}</div>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                                                                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                                                        }`}>
                                                                        {task.priority}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {task.status}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                                                            {task.assignedTo.split(' ').map(n => n[0]).join('')}
                                                                        </div>
                                                                        <span className="text-sm text-gray-700">{task.assignedTo}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <div className="flex items-center text-gray-500">
                                                                        <Calendar className="mr-1.5 h-3 w-3" />
                                                                        {task.dueDate}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 align-middle">
                                                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                                                                        View Details
                                                                    </button>
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
                        )}
                        {activeTab === 'reports' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Risk Profile</h4>
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">High</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">High Risk</div>
                                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Quality Profile</h4>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Good</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">92%</div>
                                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Compliance</h4>
                                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">Review</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">88%</div>
                                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Safety Profile</h4>
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">Excellent</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">98%</div>
                                        <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm lg:col-span-2">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Profile Trends</h3>
                                        <div className="h-64 flex items-end space-x-4">
                                            {[40, 65, 45, 80, 55, 70, 85].map((h, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                    <div className="w-full bg-blue-100 rounded-t-sm relative group hover:bg-blue-200 transition-colors" style={{ height: `${h}%` }}>
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {h}%
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">Day {i + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Distribution</h3>
                                        <div className="flex flex-col items-center justify-center h-64">
                                            <div className="relative h-40 w-40 rounded-full" style={{ background: 'conic-gradient(#3b82f6 40%, #10b981 40% 70%, #f59e0b 70% 90%, #ef4444 90%)' }}>
                                                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                                    <span className="text-2xl font-bold">142</span>
                                                    <span className="text-xs text-gray-500">Total Entities</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full px-4">
                                                <div className="flex items-center text-sm">
                                                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                                    <span>Sites (40%)</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                                    <span>Vendors (30%)</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                                                    <span>Labs (20%)</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                                    <span>CROs (10%)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'monitoring' && (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white rounded-lg border shadow-sm p-4">
                                        <h3 className="font-semibold text-lg flex items-center mb-4">
                                            <Bell className="mr-2 h-5 w-5 text-blue-600" />
                                            Filters
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium mb-2 text-gray-700">Status</h4>
                                                <div className="space-y-1">
                                                    <button className="w-full flex justify-between items-center text-sm p-2 rounded hover:bg-gray-100 text-blue-700 font-medium">
                                                        <span className="flex items-center"><Bell className="h-4 w-4 mr-2" /> All</span>
                                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">12</span>
                                                    </button>
                                                    <button className="w-full flex justify-between items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <span className="flex items-center"><Info className="h-4 w-4 mr-2" /> Unread</span>
                                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">5</span>
                                                    </button>
                                                    <button className="w-full flex justify-between items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <span className="flex items-center"><CircleAlert className="h-4 w-4 mr-2" /> Action Required</span>
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">2</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="border-t pt-4">
                                                <h4 className="text-sm font-medium mb-2 text-gray-700">Category</h4>
                                                <div className="space-y-1">
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <AlertTriangle className="h-4 w-4 mr-2 text-red-500" /> Signals
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <CalendarClock className="h-4 w-4 mr-2 text-blue-500" /> Tasks
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <MessageSquare className="h-4 w-4 mr-2 text-orange-500" /> Queries
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <Database className="h-4 w-4 mr-2 text-green-500" /> Data
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <FileText className="h-4 w-4 mr-2 text-purple-500" /> Protocol
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <Activity className="h-4 w-4 mr-2 text-cyan-500" /> Monitoring
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <Beaker className="h-4 w-4 mr-2 text-pink-500" /> Safety
                                                    </button>
                                                    <button className="w-full flex items-center text-sm p-2 rounded hover:bg-gray-100 text-gray-600">
                                                        <Settings className="h-4 w-4 mr-2 text-gray-500" /> System
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <div className="bg-white rounded-lg border shadow-sm">
                                        <div className="p-6 border-b flex justify-between items-center">
                                            <h3 className="font-semibold text-lg flex items-center">
                                                <Bell className="mr-2 h-5 w-5 text-blue-600" /> All Notifications
                                            </h3>
                                            <div className="flex space-x-2">
                                                <div className="relative">
                                                    <input className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" placeholder="Search notifications..." />
                                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divide-y">
                                            {[
                                                { title: 'New Signal Detected', desc: 'Potential safety signal identified in Site 001 - AE cluster reported.', time: '10 mins ago', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
                                                { title: 'Schema Mismatch', desc: 'Data ingestion failed for Batch #4092 due to schema validation error.', time: '1 hour ago', icon: Database, color: 'text-orange-500', bg: 'bg-orange-50' },
                                                { title: 'Task Assignment', desc: 'You have been assigned to review "Protocol Deviation #1204".', time: '2 hours ago', icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
                                                { title: 'System Update', desc: 'System maintenance scheduled for Saturday 10 PM EST.', time: '1 day ago', icon: Settings, color: 'text-gray-500', bg: 'bg-gray-50' },
                                                { title: 'Query Responded', desc: 'Site 012 responded to Query #994 regarding missing lab values.', time: '1 day ago', icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-50' },
                                            ].map((notif, i) => (
                                                <div key={i} className="p-4 flex items-start hover:bg-gray-50 transition-colors cursor-pointer group">
                                                    <div className={`p-2 rounded-full mr-4 ${notif.bg} ${notif.color}`}>
                                                        <notif.icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</h4>
                                                            <span className="text-xs text-gray-500">{notif.time}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 border-t text-center">
                                            <button className="text-sm text-blue-600 font-medium hover:underline">View All Notifications</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'progress' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Avg. Cycle Time</h4>
                                            <Clock className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">4.5 Days</div>
                                        <div className="my-1 h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                                            <ArrowUpDown className="h-3 w-3 mr-1 rotate-180" /> 12% decrease
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Risk Score Reduction</h4>
                                            <Sparkles className="h-4 w-4 text-purple-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">18%</div>
                                        <div className="my-1 h-1.5 w-full bg-purple-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                                            <ArrowUpDown className="h-3 w-3 mr-1" /> On target
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Recruitment Rate</h4>
                                            <UserPlus className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">12.5/mo</div>
                                        <div className="my-1 h-1.5 w-full bg-green-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }}></div>
                                        </div>
                                        <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                                            <ArrowUpDown className="h-3 w-3 mr-1" /> +2.5 vs target
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-500">Budget Utilization</h4>
                                            <Scale className="h-4 w-4 text-amber-500" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">45%</div>
                                        <div className="my-1 h-1.5 w-full bg-amber-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium flex items-center mt-1">
                                            Projected: 95%
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border shadow-sm">
                                    <div className="p-6 border-b">
                                        <h3 className="text-lg font-medium text-gray-900">Domain Completion Status</h3>
                                        <p className="text-sm text-gray-500 mt-1">Progress tracking by clinical domain</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-6">
                                            {['Demographics (DM)', 'Vital Signs (VS)', 'Adverse Events (AE)', 'Laboratory (LB)', 'Concomitant Meds (CM)', 'Medical History (MH)', 'Dispostion (DS)'].map((domain, i) => {
                                                const progress = [100, 92, 45, 78, 88, 100, 30][i];
                                                const status = progress === 100 ? 'Completed' : progress < 50 ? 'Delayed' : 'On Track';
                                                const statusColor = progress === 100 ? 'text-green-600 bg-green-50' : progress < 50 ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50';

                                                return (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <div className="flex items-center">
                                                                <span className="font-medium text-gray-900 w-48">{domain}</span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
                                                            </div>
                                                            <span className="font-medium text-gray-700">{progress}%</span>
                                                        </div>
                                                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : progress < 50 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'workflow' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg border shadow-sm p-8">
                                    <div className="max-w-4xl mx-auto">
                                        <h3 className="text-xl font-semibold text-center text-gray-900 mb-8">End-to-End Data Pipeline Workflow</h3>
                                        <div className="relative">
                                            {/* Connecting Line */}
                                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                                                {[
                                                    { title: 'Data Ingestion', icon: Database, color: 'text-blue-600', bg: 'bg-blue-100', status: 'Active' },
                                                    { title: 'Quality Check', icon: ClipboardCheck, color: 'text-purple-600', bg: 'bg-purple-100', status: 'Processing' },
                                                    { title: 'Reconciliation', icon: Scale, color: 'text-orange-600', bg: 'bg-orange-100', status: 'Pending' },
                                                    { title: 'Reporting', icon: FileText, color: 'text-green-600', bg: 'bg-green-100', status: 'Queue' },
                                                ].map((step, i) => (
                                                    <div key={i} className="flex flex-col items-center relative z-10 group">
                                                        <div className={`w-16 h-16 rounded-full ${step.bg} flex items-center justify-center mb-4 ring-4 ring-white shadow-sm transition-transform group-hover:scale-110`}>
                                                            <step.icon className={`h-8 w-8 ${step.color}`} />
                                                        </div>
                                                        <h4 className="font-semibold text-gray-900">{step.title}</h4>
                                                        <span className={`text-xs px-2 py-1 rounded-full mt-2 font-medium ${step.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                            step.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {step.status}
                                                        </span>

                                                        {/* Mobile connector */}
                                                        {i < 3 && <div className="h-8 w-0.5 bg-gray-200 my-2 md:hidden"></div>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                                        <h4 className="font-medium text-gray-900 mb-4">Active Processes</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                <div className="flex items-center">
                                                    <RefreshCw className="h-4 w-4 text-blue-500 mr-3 animate-spin" />
                                                    <span className="text-sm font-medium">Batch #4092 Ingestion</span>
                                                </div>
                                                <span className="text-xs text-blue-600">45%</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                <div className="flex items-center">
                                                    <Cpu className="h-4 w-4 text-purple-500 mr-3" />
                                                    <span className="text-sm font-medium">DQ Rule Application</span>
                                                </div>
                                                <span className="text-xs text-purple-600">Queued</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                                        <h4 className="font-medium text-gray-900 mb-4">Agent Status</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">System Load</span>
                                                <span className="font-medium">32%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mt-4">
                                                <span className="text-gray-600">Active Agents</span>
                                                <span className="font-medium">8/12</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-neutral-800">Administration</h3>
                                        <p className="text-neutral-500 mt-1 text-sm">Manage system settings, user accounts, and security policies</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <div className="relative w-64">
                                            <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" placeholder="Search..." />
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                        </div>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Add User
                                        </button>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                            <KeyRound className="mr-2 h-4 w-4" />
                                            Change Password
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600 grid grid-cols-5 w-full md:w-[750px]">
                                        {[
                                            { id: 'users', label: 'Users', icon: User },
                                            { id: 'roles', label: 'Roles & Permissions', icon: Lock },
                                            { id: 'menu', label: 'Menu Configuration', icon: List },
                                            { id: 'technical', label: 'Technical Details', icon: Network },
                                            { id: 'audit', label: 'Audit Logs', icon: FileText },
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveSettingsTab(tab.id)}
                                                className={`justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex items-center ${activeSettingsTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                                            >
                                                <tab.icon className="mr-2 h-4 w-4" />
                                                <span className="truncate">{tab.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {activeSettingsTab === 'users' ? (
                                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white">
                                            <div className="flex flex-col space-y-1.5 p-6">
                                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                                    <User className="mr-2 h-5 w-5 text-blue-600" />
                                                    User Management
                                                </h3>
                                                <p className="text-sm text-muted-foreground">Create, edit, and manage user accounts and study access</p>
                                            </div>
                                            <div className="p-6 pt-0">
                                                <div className="relative w-full overflow-auto">
                                                    <table className="w-full caption-bottom text-sm">
                                                        <thead className="[&_tr]:border-b">
                                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Full Name</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Login</th>
                                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Study Access</th>
                                                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="[&_tr:last-child]:border-0">
                                                            {[
                                                                { username: 'nivaasgd', name: 'Nivaas Damotharan', email: 'nivaasg@hexaware.com', role: 'Medical Monitor', status: 'Active', login: '22/04/2025, 16:00:00', studies: 'ABC-123 +1' },
                                                                { username: 'madhu', name: 'Madhu', email: 'orugantir@hexaware.com', role: 'System Administrator', status: 'Active', login: '22/04/2025, 15:30:00', studies: 'All Studies' },
                                                                { username: 'johndoe', name: 'John Doe', email: 'john.doe@example.com', role: 'System Administrator', status: 'Active', login: '08/04/2025, 15:00:00', studies: 'All Studies' },
                                                                { username: 'janedoe', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'Clinical Operations', status: 'Active', login: '07/04/2025, 20:15:00', studies: 'ABC-123 +2' },
                                                            ].map((user) => (
                                                                <tr key={user.username} className="border-b transition-colors hover:bg-gray-50">
                                                                    <td className="p-4 align-middle font-medium">{user.username}</td>
                                                                    <td className="p-4 align-middle">{user.name}</td>
                                                                    <td className="p-4 align-middle">{user.email}</td>
                                                                    <td className="p-4 align-middle">{user.role}</td>
                                                                    <td className="p-4 align-middle">
                                                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent text-primary-foreground bg-green-500 hover:bg-green-600">
                                                                            {user.status}
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-4 align-middle">{user.login}</td>
                                                                    <td className="p-4 align-middle">
                                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                                                            {user.studies}
                                                                            <ChevronDown className="ml-1 h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                    <td className="p-4 align-middle text-right">
                                                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                                                            <Settings className="h-4 w-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm bg-white p-6 text-center text-gray-500">
                                            Content for {activeSettingsTab} is currently being managed by the central admin system.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >

            {/* Chatbot specific to this page */}
            {
                isChatbotVisible && (
                    <div className={`rounded-lg border text-card-foreground fixed bottom-6 right-6 shadow-lg transition-all duration-300 bg-white w-80 md:w-96 z-50 ${isChatbotMinimized ? 'h-14 overflow-hidden' : 'h-[450px]'}`}>
                        <div className="bg-blue-600 text-white p-3 flex items-center justify-between rounded-t-lg cursor-pointer" onClick={() => setIsChatbotMinimized(!isChatbotMinimized)}>
                            <div className="flex items-center space-x-2">
                                <Cpu className="h-5 w-5" />
                                <span className="font-medium">Data Manager Assistant</span>
                            </div>
                            <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-7 w-7 text-white hover:bg-blue-700"
                                    onClick={() => setIsChatbotMinimized(!isChatbotMinimized)}
                                >
                                    <Minimize className="h-4 w-4" />
                                </button>
                                <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-7 w-7 text-white hover:bg-blue-700"
                                    onClick={() => setIsChatbotVisible(false)}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        {!isChatbotMinimized && (
                            <div className="p-0 flex flex-col h-[calc(450px-56px)] animate-in fade-in slide-in-from-bottom-5 duration-300">
                                <div className="p-2 bg-gray-50 border-b flex flex-wrap gap-2">
                                    {['Run DQ Checks', 'Create Task', 'Assign Task', 'View Task', 'Trial Health'].map((action) => (
                                        <button key={action} className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs py-1 h-7">
                                            {action}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                                    <div className="flex items-start gap-2.5 justify-start">
                                        <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                                            <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                <Cpu className="h-4 w-4" />
                                            </span>
                                        </span>
                                        <div className="max-w-[75%] rounded-lg p-3 bg-gray-100 text-gray-800">
                                            <p className="text-sm whitespace-pre-line">
                                                Hello! I'm your Data Manager AI assistant. How can I help you with data quality management for Diabetes Type 2 Study?
                                                {'\n\n'}You can ask me about:
                                                {'\n'}• Trial health summary
                                                {'\n'}• Data source health status
                                                {'\n'}• Domain completeness
                                                {'\n'}• What are your recommendations?
                                                {'\n'}• How many DQ issues are there?
                                                {'\n'}• Tell me about issue DQ-001
                                            </p>
                                            <p className="text-xs mt-1 opacity-70">12:02</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t space-y-2">
                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-medium">Task Assignment Mode:</span>
                                            <span className="text-xs">{taskMode}</span>
                                        </div>
                                        <div className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${taskMode === 'Agent.AI' ? 'bg-blue-600' : 'bg-gray-400'}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${taskMode === 'Agent.AI' ? 'translate-x-5' : 'translate-x-1'}`}></span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1" placeholder="Ask about DQ checks, settings, monitoring..." />
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 w-10 bg-blue-600 hover:bg-blue-700">
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
            {
                !isChatbotVisible && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={() => setIsChatbotVisible(true)}
                            className="h-14 w-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <Bot className="h-8 w-8" />
                        </button>
                    </div>
                )
            }
        </div >
    );
}
