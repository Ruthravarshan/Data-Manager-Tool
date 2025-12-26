import { ChartNoAxesColumnIncreasing, Download, ChartLine, ChartColumn } from 'lucide-react';

export default function Analytics() {
    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Reports & Analytics</h1>
                        <p className="text-neutral-500 mt-1">Risk trends, performance metrics, and operational insights</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                            <ChartNoAxesColumnIncreasing className="mr-2 h-4 w-4" />
                            View Reports
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                        </button>
                    </div>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-lg flex items-center">
                            <ChartLine className="mr-2 h-5 w-5 text-blue-600" />
                            Analytics Dashboard
                        </h3>
                        <p className="text-sm text-muted-foreground">This module has been cleared for the demo per your request</p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                                <div className="text-sm font-medium text-gray-500">Total Studies</div>
                                <div className="text-2xl font-bold text-blue-700 mt-1">12</div>
                                <div className="text-xs text-gray-500 mt-1">3 active, 9 completed</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                                <div className="text-sm font-medium text-gray-500">Data Quality Score</div>
                                <div className="text-2xl font-bold text-green-700 mt-1">94.5%</div>
                                <div className="text-xs text-gray-500 mt-1">↑ 2.3% from last month</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-purple-50 border-purple-100">
                                <div className="text-sm font-medium text-gray-500">Total Subjects</div>
                                <div className="text-2xl font-bold text-purple-700 mt-1">1,247</div>
                                <div className="text-xs text-gray-500 mt-1">Across all studies</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                                <div className="text-sm font-medium text-gray-500">Open Queries</div>
                                <div className="text-2xl font-bold text-amber-700 mt-1">24</div>
                                <div className="text-xs text-gray-500 mt-1">8 high priority</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartLine className="h-4 w-4 mr-2 text-blue-600" />
                                    Enrollment Trend
                                </h4>
                                <div className="h-48 flex items-end justify-around gap-2">
                                    {[45, 62, 78, 85, 92, 88].map((height, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div className="w-full bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                                            <span className="text-xs text-gray-500 mt-2">M{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartColumn className="h-4 w-4 mr-2 text-blue-600" />
                                    Query Resolution Rate
                                </h4>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Resolved', value: 156, percent: 85, color: 'bg-green-500' },
                                        { label: 'In Progress', value: 18, percent: 10, color: 'bg-blue-500' },
                                        { label: 'Open', value: 10, percent: 5, color: 'bg-amber-500' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{item.label}</span>
                                                <span className="font-medium">{item.value}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Recent Activity</h4>
                            <div className="space-y-2">
                                {[
                                    { action: 'Data integration completed', study: 'ABC-123', time: '2 hours ago' },
                                    { action: 'Query resolved', study: 'XYZ-789', time: '4 hours ago' },
                                    { action: 'New subject enrolled', study: 'ABC-123', time: '6 hours ago' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{item.action}</span>
                                            <span className="text-sm text-gray-500 ml-2">• {item.study}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
