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
                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartLine className="h-4 w-4 mr-2 text-blue-600" />
                                    Enrollment Trend
                                </h4>
                                <div className="h-48 flex items-center justify-center bg-slate-50 rounded text-neutral-400 text-sm">
                                    No enrollment trend data available
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-4 flex items-center">
                                    <ChartColumn className="h-4 w-4 mr-2 text-blue-600" />
                                    Query Resolution Rate
                                </h4>
                                <div className="h-48 flex items-center justify-center bg-slate-50 rounded text-neutral-400 text-sm">
                                    No query data available
                                </div>
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
