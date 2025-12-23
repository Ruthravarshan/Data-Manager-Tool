import {
    CircleAlert, Cpu, ChevronLeft, ChevronDown, Sparkles, LoaderCircle,
    EyeOff, Download, Send, Minimize, X, RefreshCw, Clock,
} from 'lucide-react';
import { useState } from 'react';

export default function DataManagerAI() {
    const [activeTab, setActiveTab] = useState('issues');
    const [agentsVisible, setAgentsVisible] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [taskMode, setTaskMode] = useState('Agent.AI'); // Agent.AI or Manual

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    const toggleAgents = () => {
        setAgentsVisible(!agentsVisible);
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

                {agentsVisible && (
                    <div className="agent-card data-manager-agent mb-6">
                        <div className="agent-icon-wrapper">
                            <div className="hexagon-frame">
                                <div className="glow-effect teal-glow"></div>
                                <Cpu className="agent-icon teal-icon h-24 w-24" />
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
                        {/* Agent Cards */}
                        <div className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                    <h4 className="font-medium text-blue-800">Data Fetch Agent</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">active</div>
                                    <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center"><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">Listening for data refresh events from all integrated sources</p>
                            <div className="mb-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Records in progress:</span>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">0</div>
                                </div>
                                <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '30%' }}></div></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>41 minutes ago</span></div>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">1 records</span>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                    <h4 className="font-medium text-blue-800">DQ Processing</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">active</div>
                                    <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center"><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">Running data quality checks across all SDTM domains</p>
                            <div className="mb-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Records in progress:</span>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">45</div>
                                </div>
                                <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '45%' }}></div></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>41 minutes ago</span></div>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">40 issues</span>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                    <h4 className="font-medium text-blue-800">Reconciliation</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">active</div>
                                    <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center"><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">Cross-checking data consistency between sources</p>
                            <div className="mb-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Records in progress:</span>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">0</div>
                                </div>
                                <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }}></div></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>Nov 6, 10:52 PM</span></div>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">0 issues</span>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                    <h4 className="font-medium text-blue-800">Protocol Check</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">active</div>
                                    <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center"><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">Verifying adherence to protocol procedures</p>
                            <div className="mb-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Records in progress:</span>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">16</div>
                                </div>
                                <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }}></div></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>Apr 24, 09:46 AM</span></div>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">Trial 1</span>
                            </div>
                        </div>

                        <div className="border border-blue-100 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-40 group-hover:opacity-60 transition-opacity duration-200"></div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                    <h4 className="font-medium text-blue-800">Task Manager</h4>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">active</div>
                                    <button className="h-4 w-4 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center"><RefreshCw className="h-3 w-3 text-blue-600" /></button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">Creating tasks based on detected issues</p>
                            <div className="mb-2 text-xs text-gray-600">
                                <div className="flex items-center justify-between">
                                    <span>Tasks in progress:</span>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 bg-blue-50 text-blue-600">0</div>
                                </div>
                                <div className="w-full bg-blue-100 h-1 mt-1 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: '15%' }}></div></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500 flex items-center"><Clock className="h-3 w-3 mr-1 inline" /><span>Nov 6, 10:52 PM</span></div>
                                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full">1 tasks</span>
                            </div>
                        </div>

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
                            <p className="opacity-70">[<span className="text-blue-400">Apr 24, 2025 09:46:54</span>] <span className="text-purple-400">SignalDetectionAgent</span>: Monitoring protocol adherence for Diabetes Type 2 Study (PRO001)</p>
                            <p className="opacity-70">[<span className="text-blue-400">Apr 24, 2025 09:46:54</span>] <span className="text-purple-400">SignalDetectionAgent</span>: Monitoring protocol adherence for all trials</p>
                            <p className="opacity-70">[<span className="text-blue-400">Apr 30, 2025 04:47:50</span>] <span className="text-purple-400">DataFetchAgent</span>: Fetched 1 records from integrated sources for all trials</p>
                            <p className="opacity-70">[<span className="text-blue-400">Apr 30, 2025 13:07:39</span>] <span className="text-purple-400">DataQualityAgent</span>: Analyzing data for all trials (1 records), found 1 issues</p>
                            <p className="opacity-70">[<span className="text-blue-400">Dec 22, 2025 17:03:00</span>] <span className="text-purple-400">DataFetchAgent</span>: Fetched 1 records from integrated sources for Diabetes Type 2 Study (PRO001)</p>
                            <p className="opacity-70">[<span className="text-blue-400">Dec 22, 2025 17:03:00</span>] <span className="text-purple-400">DataQualityAgent</span>: Analyzing data for Diabetes Type 2 Study (PRO001) (100 records), found 40 issues</p>
                            <p className="opacity-75">[<span className="text-blue-400">Dec 22, 2025 17:44:19</span>] <span className="text-purple-400">AgentMonitor</span>: All agents operating within normal parameters</p>
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
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle font-medium"><button className="text-blue-600 hover:underline">DQ-001</button></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200">Missing Data</div></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-purple-100 text-purple-700">DQ</div></td>
                                                    <td className="p-4 align-middle">Missing dates in Demographics domain</td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">Detected</div></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-red-100 text-red-700 hover:bg-red-200">High</div></td>
                                                    <td className="p-4 align-middle">DM</td>
                                                    <td className="p-4 align-middle">Apr 1, 2025</td>
                                                    <td className="p-4 align-middle"><button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">View</button></td>
                                                </tr>
                                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td className="p-4 align-middle font-medium"><button className="text-blue-600 hover:underline">DR-001</button></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200">Inconsistent Data</div></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-indigo-100 text-indigo-700">Reconciliation</div></td>
                                                    <td className="p-4 align-middle">Lab results inconsistent with EDC data</td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-amber-100 text-amber-700">Reviewing</div></td>
                                                    <td className="p-4 align-middle"><div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200">Medium</div></td>
                                                    <td className="p-4 align-middle">LB, VS</td>
                                                    <td className="p-4 align-middle">Mar 28, 2025</td>
                                                    <td className="p-4 align-middle"><button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">View</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab !== 'issues' && (
                            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg text-gray-500">
                                Content for {activeTab} tab is coming soon.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Chatbot specific to this page */}
            <div className="rounded-lg border text-card-foreground fixed bottom-6 right-6 shadow-lg transition-all duration-200 bg-white w-80 md:w-96 h-[450px] z-50">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <Cpu className="h-5 w-5" />
                        <span className="font-medium">Data Manager Assistant</span>
                    </div>
                    <div className="flex space-x-1">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-7 w-7 text-white hover:bg-blue-700">
                            <Minimize className="h-4 w-4" />
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-7 w-7 text-white hover:bg-blue-700">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <div className="p-0 flex flex-col h-[calc(450px-56px)]">
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
            </div>
        </div>
    );
}
