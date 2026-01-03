import {
    CircleAlert, Server, ChevronLeft, ChevronDown, RefreshCw, EyeOff, Maximize2,
    Eye, Minimize, X, ArrowRight
} from 'lucide-react';
import { useState } from 'react';

export default function CentralMonitorAI() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    return (
        <div className="p-6">
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <button className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 flex items-center gap-1 text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50">
                        <ChevronLeft className="h-4 w-4" />
                        Back to AI Agents Hub
                    </button>
                </div>
                <div className="bg-blue-700 p-3 mb-4 rounded-md shadow-md text-center">
                    <CircleAlert className="h-5 w-5 inline-block mr-2 animate-pulse text-white" />
                    <span className="text-white font-bold">
                        Active monitoring on the data from Trial Data Management
                    </span>
                </div>
                <div className="agent-card monitor-agent mb-6">
                    <div className="agent-icon-wrapper">
                        <div className="diamond-frame">
                            <div className="glow-effect crimson-glow"></div>
                            <Server className="agent-icon crimson-icon h-24 w-24" />
                            <div className="scan-beam"></div>
                        </div>
                    </div>
                    <div className="agent-details">
                        <h3 className="agent-title">
                            <span className="highlight crimson">The Sentinel Guardian</span>
                        </h3>
                        <div className="agent-subtitle">Central Monitor.AI</div>
                        <div className="agent-status">
                            <span className="status-dot active"></span>
                            <span>Vigilance activated across all trial data</span>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 mb-6 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <button className="justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background h-9 rounded-md px-3 flex items-center gap-1 text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50">
                                    <ChevronLeft className="h-4 w-4" />
                                    Back to AI Agents Hub
                                </button>
                            </div>
                            <h1 className="text-2xl font-bold text-blue-800">Central Monitor.AI</h1>
                            <p className="text-gray-600">AI-powered monitoring for clinical trial data</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <button className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]">
                                <span className="line-clamp-1">PRO001 - Diabetes Type 2 Study</span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </button>
                            <div className="flex items-center mr-4 bg-blue-50 p-2 rounded-md border border-blue-100">
                                <div className="flex items-center space-x-2">
                                    <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-primary">
                                        <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform translate-x-5"></span>
                                    </div>
                                    <label className="text-sm leading-none font-medium text-blue-800">Agent.AI</label>
                                </div>
                            </div>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Run Monitor
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 border-blue-200">
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide Agents
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mb-6 relative">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-blue-800">AI Monitoring Agents</h2>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-blue-600">
                            <Maximize2 className="h-4 w-4 mr-1" />
                            Expand
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                            { title: 'Protocol Monitor', active: true, desc: 'Monitoring protocol deviations', left: '3 deviations detected', right: '2 queries' },
                            { title: 'Site Performance', active: true, desc: 'Tracking site metrics', left: '12 sites monitored', right: '1 alert' },
                            { title: 'Lab Data Monitor', active: true, desc: 'Analyzing lab trends', left: '287 values analyzed', right: '8 abnormal' },
                            { title: 'Safety Signal', active: true, desc: 'Detecting safety signals', left: '42 AEs analyzed', right: '3 signals' }
                        ].map((agent, i) => (
                            <div key={i} className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-3 border border-blue-100 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                        <h4 className="font-medium text-blue-800 text-sm">{agent.title}</h4>
                                    </div>
                                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 text-xs">
                                        Active
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600">{agent.desc}</p>
                                <div className="mt-2 flex justify-between text-xs">
                                    <span className="text-gray-500">{agent.left}</span>
                                    <span className="font-medium text-blue-600">{agent.right}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600 grid grid-cols-6 mb-4 w-full">
                        {['Dashboard', 'Queries', 'Tasks', 'Event Log', 'Workflows', 'Settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === tab ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 border-blue-100 bg-white flex-1 animate-in fade-in zoom-in-95 duration-200">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6 border-blue-100">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="tracking-tight text-lg font-medium text-blue-800 flex items-center">
                                    <Server className="h-5 w-5 mr-2 text-blue-600" />
                                    DB Lock Compliance Overview
                                </h3>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-md p-4 border border-blue-100">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                                        <div className="text-lg font-bold text-blue-700">IN PROGRESS</div>
                                        <div className="mt-2 text-sm text-gray-500">Est. Lock Date: 09/01/2026</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-md p-4 border border-blue-100">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Overall Readiness</div>
                                        <div className="text-lg font-bold text-blue-700">75%</div>
                                        <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2 mt-2">
                                            <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-25%)' }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-md p-4 border border-blue-100">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Outstanding Issues</div>
                                        <div className="text-lg font-bold text-amber-600">8</div>
                                        <div className="mt-2 text-sm text-gray-500">Across 3 sites</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-white rounded-md p-4 border border-blue-100">
                                        <div className="text-sm font-medium text-gray-500 mb-1">Site Readiness</div>
                                        <div className="flex items-center justify-between mt-1 text-sm">
                                            <span>Complete</span>
                                            <span className="font-medium">0/3</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1 text-sm">
                                            <span>Ready</span>
                                            <span className="font-medium">1/3</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1 text-sm">
                                            <span>In Progress</span>
                                            <span className="font-medium">2/3</span>
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

                        {/* More Dashboard items - Queries, Sites, etc. */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Queries */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                    <h3 className="tracking-tight text-lg font-medium text-blue-800">Queries</h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="text-3xl font-bold">24</div>
                                    <div className="text-sm text-gray-500 mt-1">8 Open • 16 Closed</div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Response Rate</span>
                                            <span className="font-medium">83%</span>
                                        </div>
                                        <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2">
                                            <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-17%)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Sites */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                    <h3 className="tracking-tight text-lg font-medium text-blue-800">Sites</h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="text-3xl font-bold">12</div>
                                    <div className="text-sm text-gray-500 mt-1">10 Active • 2 Pending</div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Enrollment Target</span>
                                            <span className="font-medium">68%</span>
                                        </div>
                                        <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2">
                                            <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-32%)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Issues */}
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                    <h3 className="tracking-tight text-lg font-medium text-blue-800">Issues</h3>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="text-3xl font-bold">7</div>
                                    <div className="text-sm text-gray-500 mt-1">3 Major • 4 Minor</div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Resolution Rate</span>
                                            <span className="font-medium">42%</span>
                                        </div>
                                        <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2">
                                            <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: 'translateX(-58%)' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity and Priority Alerts would go here - for brevity, I'm omitting the full table code but structure is similar */}
                    </div>
                </div>
            </div>

            {/* Chatbot specific to this page */}
            <div className="rounded-lg border text-card-foreground fixed bottom-6 right-6 shadow-lg transition-all duration-200 bg-white w-80 md:w-96 h-[450px] z-50">
                <div className="bg-blue-600 text-white p-3 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span className="font-medium">Central Monitor Assistant</span>
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
                        {['Create Query', 'Assign Query', 'View Query', 'Send Notification', 'Detect Signal', 'View Signal'].map((action) => (
                            <button key={action} className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs py-1 h-7">
                                {action}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-4">
                        <div className="flex items-start gap-2.5 justify-start">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Eye className="h-4 w-4" />
                                </span>
                            </span>
                            <div className="max-w-[75%] rounded-lg p-3 bg-gray-100 text-gray-800">
                                <p className="text-sm whitespace-pre-line">
                                    Hello! I'm your Central Monitor AI assistant. How can I help you with central monitoring activities for Diabetes Type 2 Study?
                                    {'\n\n'}You can ask me about:
                                    {'\n'}• Trial health summary
                                    {'\n'}• Site performance overview
                                    {'\n'}• Compliance metrics
                                    {'\n'}• What are your recommendations?
                                    {'\n'}• How many open queries are there?
                                    {'\n'}• Tell me about query Q-001
                                </p>
                                <p className="text-xs mt-1 opacity-70">12:02</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-3 border-t space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium">Query/Task Assignment Mode:</span>
                                <span className="text-xs">Agent.AI</span>
                            </div>
                            <div className="relative inline-flex h-5 w-10 items-center rounded-full transition-colors bg-blue-600">
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-5"></span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1" placeholder="Ask about queries, tasks, monitoring..." />
                            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 w-10 bg-blue-600 hover:bg-blue-700">
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
