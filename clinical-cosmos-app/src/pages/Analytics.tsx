import { ChartNoAxesColumnIncreasing, Download, ChartLine, ChartColumn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { studyService, dashboardService, activityService } from '../services/api';

export default function Analytics() {
    const [stats, setStats] = useState({
        totalStudies: 0,
        activeSites: 0,
        totalSubjects: 0,
        avgCompletion: 0
    });
    const [metrics, setMetrics] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [enrollmentTrend, setEnrollmentTrend] = useState<any[]>([]);
    const [queryResolution, setQueryResolution] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studiesData, metricsData, activitiesData] = await Promise.all([
                    studyService.getStudies(),
                    dashboardService.getMetrics(),
                    activityService.getRecentActivities()
                ]);

                // Calculate aggregates
                const studies = studiesData || [];
                const totalStudies = studies.length;
                const activeSites = studies.reduce((acc: number, study: any) => acc + (study.sites_count || 0), 0);
                const totalSubjects = studies.reduce((acc: number, study: any) => acc + (study.subjects_count || 0), 0);
                const avgCompletion = totalStudies > 0
                    ? Math.round(studies.reduce((acc: number, study: any) => acc + (study.completion_percentage || 0), 0) / totalStudies)
                    : 0;

                setStats({
                    totalStudies,
                    activeSites,
                    totalSubjects,
                    avgCompletion
                });

                setMetrics(metricsData || []);
                setActivities(activitiesData || []);

                // Fetch Chart Data
                const enrollmentData = await dashboardService.getEnrollmentTrend();
                setEnrollmentTrend(enrollmentData || []);

                const queryData = await dashboardService.getQueryResolution();
                setQueryResolution(queryData);

            } catch (error) {
                console.error("Failed to fetch analytics data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get specific metric value
    const getMetricValue = (key: string) => {
        const metric = metrics.find(m => m.key === key);
        return metric ? metric.value : "0%";
    };
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
                                <div className="text-2xl font-bold text-blue-700 mt-1">{stats.totalStudies}</div>
                                <div className="text-xs text-gray-500 mt-1">Fetched from DB</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                                <div className="text-sm font-medium text-gray-500">Data Quality Score</div>
                                <div className="text-2xl font-bold text-green-700 mt-1">{getMetricValue('data_quality')}</div>
                                <div className="text-xs text-gray-500 mt-1">Overall score</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-purple-50 border-purple-100">
                                <div className="text-sm font-medium text-gray-500">Total Subjects</div>
                                <div className="text-2xl font-bold text-purple-700 mt-1">{stats.totalSubjects}</div>
                                <div className="text-xs text-gray-500 mt-1">Across all studies</div>
                            </div>
                            <div className="p-4 border rounded-lg bg-amber-50 border-amber-100">
                                <div className="text-sm font-medium text-gray-500">Average Completion</div>
                                <div className="text-2xl font-bold text-amber-700 mt-1">{stats.avgCompletion}%</div>
                                <div className="text-xs text-gray-500 mt-1">Global progress</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-4 bg-white">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartLine className="h-4 w-4 mr-2 text-blue-600" />
                                    Enrollment Trend (Actual vs Expected)
                                </h4>
                                <div className="h-48 flex items-end justify-between space-x-2 px-2">
                                    {enrollmentTrend.length > 0 ? (
                                        enrollmentTrend.map((item, idx) => {
                                            const maxVal = Math.max(...enrollmentTrend.map((d: any) => Math.max(d.actual, d.expected)));
                                            const actualHeight = (item.actual / maxVal) * 100;
                                            const expectedHeight = (item.expected / maxVal) * 100;

                                            return (
                                                <div key={idx} className="flex flex-col items-center flex-1 group relative">
                                                    <div className="w-full flex justify-center items-end h-32 space-x-1">
                                                        {/* Expected Bar */}
                                                        <div
                                                            className="w-3 bg-gray-200 rounded-t transiton-all duration-500 relative"
                                                            style={{ height: `${expectedHeight}%` }}
                                                        >
                                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                                                                Exp: {item.expected}
                                                            </div>
                                                        </div>
                                                        {/* Actual Bar */}
                                                        <div
                                                            className="w-3 bg-blue-600 rounded-t transiton-all duration-500 relative"
                                                            style={{ height: `${actualHeight}%` }}
                                                        >
                                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap">
                                                                Act: {item.actual}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-slate-500 mt-2">{item.month}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No data</div>
                                    )}
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-white">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartColumn className="h-4 w-4 mr-2 text-blue-600" />
                                    Query Resolution Rate
                                </h4>
                                {queryResolution ? (
                                    <div className="flex h-48 items-center justify-around">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            {/* Simple CSS Pie representation - using a conic gradient would be better but simple circle for now or stat */}
                                            <svg viewBox="0 0 36 36" className="w-full h-full text-blue-600 transform -rotate-90">
                                                <path
                                                    className="text-gray-200"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                />
                                                <path
                                                    className="text-blue-600 drop-shadow-sm"
                                                    strokeDasharray={`${queryResolution.rate}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3.8"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-2xl font-bold text-gray-800">{queryResolution.rate}%</span>
                                                <span className="text-xs text-gray-500">Resolved</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                <span className="text-gray-600 w-20">Resolved</span>
                                                <span className="font-bold">{queryResolution.resolved}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                                <span className="text-gray-600 w-20">Open</span>
                                                <span className="font-bold">{queryResolution.open}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                                <span className="text-gray-600 w-20">Pending</span>
                                                <span className="font-bold">{queryResolution.pending}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center bg-slate-50 rounded text-neutral-400 text-sm">
                                        No query data available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Recent Activity</h4>
                            <div className="space-y-2">
                                {activities.length > 0 ? (
                                    activities.slice(0, 5).map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                            <div>
                                                <span className="font-medium">{item.description}</span>
                                                <span className="text-sm text-gray-500 ml-2">• {item.related_entity_type || 'System'}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-neutral-500 text-sm">
                                        No recent activity logged.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
