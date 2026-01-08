import {
    FileText, ChartColumn, CircleArrowUp, FlaskConical, Clock, MessagesSquare,
    AlarmClock, ListChecks, Activity, Flag, CircleCheck, Bell, Award, Microscope,
    ChevronRight, Eye, CircleAlert, CircleDashed, Database, Link2, FileSpreadsheet,
    ChevronUp, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, studyService, activityService, dataFileService, integrationService } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tasks');
    const [metrics, setMetrics] = useState<any[]>([]);
    const [activeStudiesCount, setActiveStudiesCount] = useState<number>(0);
    const [studies, setStudies] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // SDTM Data State
    const [sdtmFiles, setSdtmFiles] = useState<any[]>([]);
    const [selectedProtocol, setSelectedProtocol] = useState<string>('all');
    const [sdtmDomains, setSdtmDomains] = useState<any[]>([]);

    // Integrations State
    const [integrations, setIntegrations] = useState<any[]>([]);

    useEffect(() => {
        const fetchSDTMData = async () => {
            try {
                // Fetch files based on selected protocol
                const protocol = selectedProtocol === 'all' ? undefined : selectedProtocol;
                const files = await dataFileService.getDataFiles(undefined, undefined, protocol);
                setSdtmFiles(files || []);

                // Group by section (domain)
                const grouped = (files || []).reduce((acc: any, file: any) => {
                    const domain = file.section || 'Unclassified';
                    if (!acc[domain]) {
                        acc[domain] = {
                            code: domain,
                            name: getDomainName(domain),
                            files: [],
                            totalRecords: 0
                        };
                    }
                    acc[domain].files.push(file);
                    acc[domain].totalRecords += (file.record_count || 0);
                    return acc;
                }, {});

                // Calculate progress/completeness (mock logic for now as we don't have target records)
                // Removed as per user request since it was hardcoded/mock

                setSdtmDomains(Object.values(grouped).sort((a: any, b: any) => a.code.localeCompare(b.code)));
            } catch (error) {
                console.error("Failed to fetch SDTM data", error);
                setSdtmFiles([]);
            }
        };

        fetchSDTMData();
    }, [selectedProtocol]);

    const getDomainName = (code: string) => {
        const names: any = {
            'DM': 'Demographics',
            'AE': 'Adverse Events',
            'VS': 'Vital Signs',
            'LB': 'Laboratory Tests',
            'CM': 'Concomitant Medications',
            'EX': 'Exposure',
            'DS': 'Disposition',
            'SV': 'Subject Visits'
        };
        return names[code] || code;
    };

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await dashboardService.getMetrics();
                setMetrics(data);
            } catch (error) {
                console.error("Failed to fetch metrics", error);
                setMetrics([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    useEffect(() => {
        const fetchActiveStudiesCount = async () => {
            try {
                const count = await studyService.getActiveStudiesCount();
                setActiveStudiesCount(count);
            } catch (error) {
                console.error("Failed to fetch active studies count", error);
                // Fallback to 0 if API fails
                setActiveStudiesCount(0);
            }
        };
        fetchActiveStudiesCount();
    }, []);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const data = await studyService.getStudies();
                setStudies(data);
            } catch (error) {
                console.error("Failed to fetch studies", error);
                // Fallback to empty array if API fails
                setStudies([]);
            }
        };
        fetchStudies();
    }, []);

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const data = await activityService.getRecentActivities(10);
                setRecentActivities(data);
            } catch (error) {
                console.error("Failed to fetch recent activities", error);
                setRecentActivities([]);
            }
        };
        fetchRecentActivities();
        // Refresh activities every 5 seconds
        const interval = setInterval(fetchRecentActivities, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const data = await integrationService.getIntegrations();
                setIntegrations(data);
            } catch (error) {
                console.error("Failed to fetch integrations", error);
                setIntegrations([]);
            }
        };
        fetchIntegrations();
    }, []);

    return (
        <div className="p-6">
            <div className="container mx-auto py-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-800">Dashboard</h1>
                        <p className="text-neutral-500 mt-1">Clinical Business Orchestration and AI Technology Platform</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Reports
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700">
                            <ChartColumn className="mr-2 h-4 w-4" />
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Active Studies"
                        value={activeStudiesCount.toString()}
                        icon={FlaskConical}
                        color="blue"
                        subtext="Fetched from DB"
                        subtextColor="text-neutral-500"
                        subtextIcon={CircleCheck}
                        progress={0}
                    />
                    <StatCard
                        title="Open Queries"
                        value="0"
                        icon={MessagesSquare}
                        color="indigo"
                        subtext="No data"
                        subtextColor="text-neutral-400"
                        subtextIcon={CircleDashed}
                        progress={0}
                    />
                    <StatCard
                        title="Tasks"
                        value="0"
                        icon={ListChecks}
                        color="emerald"
                        subtext="No new tasks"
                        subtextColor="text-neutral-400"
                        subtextIcon={CircleDashed}
                        progress={0}
                    />
                    <StatCard
                        title="Signals Detected"
                        value="0"
                        icon={Flag}
                        color="rose"
                        subtext="No signals"
                        subtextColor="text-neutral-400"
                        subtextIcon={CircleDashed}
                        progress={0}
                    />
                </div>

                {/* Quality Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-4 text-center py-4">Loading metrics...</div>
                    ) : (
                        metrics.map((metric) => {
                            let icon = Activity;
                            let color = "blue";
                            if (metric.key === 'data_quality') { icon = CircleCheck; color = "blue"; }
                            if (metric.key === 'operational') { icon = Activity; color = "indigo"; }
                            if (metric.key === 'safety') { icon = Bell; color = "emerald"; }
                            if (metric.key === 'compliance') { icon = Award; color = "amber"; }

                            return (
                                <MetricCard
                                    key={metric.key}
                                    title={metric.key.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                    score={metric.value}
                                    label={metric.label}
                                    icon={icon}
                                    color={color}
                                />
                            );
                        })
                    )}
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Studies) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                        <Microscope className="mr-2 h-5 w-5 text-blue-600" />
                                        Clinical Studies
                                    </h3>
                                    <Link to="/study-management">
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-blue-600">
                                            View All Studies
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 pt-0 space-y-2">
                                {studies.length > 0 ? (
                                    studies.map((study) => (
                                        <StudyItem
                                            key={study.id}
                                            title={study.title}
                                            description={study.description}
                                            phase={study.phase}
                                            sites={`${study.sites_count} sites`}
                                            subjects={`${study.subjects_count} subjects`}
                                            risk={study.risk_level || "Low Risk"}
                                            riskColor={study.risk_color || "green"}
                                            progress={study.completion_percentage || 0}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-neutral-500 text-sm">
                                        No active studies found.
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center p-6 pt-0 pb-3">
                                <Link to="/study-management" className="w-full">
                                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                        <FlaskConical className="mr-2 h-4 w-4" />
                                        Create New Study
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Eye className="mr-2 h-5 w-5 text-blue-600" />
                                    Primary Endpoints
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Current progress towards key clinical endpoints
                                </p>
                            </div>
                            <div className="p-6 pt-0">
                                <div className="space-y-4">
                                    <div className="text-center py-4 text-neutral-500 text-sm">
                                        No primary endpoints data available.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Recent Activities */}
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-0">
                                <h3 className="font-semibold tracking-tight text-lg">Recent Activities</h3>
                            </div>
                            <div className="p-6 pt-3">
                                {/* Tab Navigation */}
                                <div className="h-10 items-center justify-center rounded-md bg-blue-50 p-1 text-blue-600 grid grid-cols-3 mb-3">
                                    <button
                                        onClick={() => setActiveTab('activities')}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'activities' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                                    >
                                        All Activities
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tasks')}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'tasks' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                                    >
                                        Tasks
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('queries')}
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === 'queries' ? 'bg-white text-blue-700 shadow-sm' : 'hover:bg-blue-100 hover:text-blue-800'}`}
                                    >
                                        Queries
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="space-y-3">
                                    {activeTab === 'activities' && (
                                        <>
                                            {recentActivities.length > 0 ? (
                                                recentActivities.map((activity) => (
                                                    <ActivityItem key={activity.id} {...activity} />
                                                ))
                                            ) : (
                                                <div className="text-center text-sm text-neutral-500 py-4">
                                                    No recent activities
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'tasks' && (
                                        <div className="text-center text-sm text-neutral-500 py-4">
                                            No recent tasks
                                        </div>
                                    )}

                                    {activeTab === 'queries' && (
                                        <div className="text-center text-sm text-neutral-500 py-4">
                                            No recent queries
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center mt-2">
                                    <Link to={activeTab === 'tasks' ? "/tasks" : activeTab === 'signals' ? "/signal-detection" : "#"}>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 border border-input mt-2">
                                            View All {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Protocol Deviations */}
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <CircleAlert className="mr-2 h-5 w-5 text-blue-600" />
                                    Protocol Deviations
                                </h3>
                            </div>
                            <div className="p-6 pt-0 space-y-3">
                                <div className="text-center py-4 text-neutral-500 text-sm">
                                    No protocol deviations detected.
                                </div>
                            </div>
                        </div>

                        {/* SDTM Domains */}
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-3 p-6 pb-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                        <Database className="mr-2 h-5 w-5 text-blue-600" />
                                        SDTM Domains
                                    </h3>
                                    <select
                                        value={selectedProtocol}
                                        onChange={(e) => setSelectedProtocol(e.target.value)}
                                        className="h-8 text-xs border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        <option value="all">All Protocols</option>
                                        {studies.map(study => (
                                            <option key={study.id} value={study.protocol_id || study.title}>
                                                {study.protocol_id || study.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 pt-0 space-y-2">
                                {sdtmDomains.length > 0 ? (
                                    sdtmDomains.map((domain: any) => (
                                        <SDTMDomainItem
                                            key={domain.code}
                                            code={domain.code}
                                            name={domain.name}
                                            records={domain.totalRecords.toLocaleString()}
                                            fileCount={domain.files.length}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm">
                                        No data found for selected protocol
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center p-6 pt-0">
                                <Link to="/trial-data-management" className="w-full">
                                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-full">
                                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                                        Manage Data
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Data Integrations */}
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Link2 className="mr-2 h-5 w-5 text-blue-600" />
                                    Data Integrations
                                </h3>
                            </div>
                            <div className="p-6 pt-0 space-y-3">
                                {integrations.length > 0 ? (
                                    integrations.slice(0, 3).map((integration) => (
                                        <IntegrationItem
                                            key={integration.id}
                                            name={integration.name}
                                            status={integration.status}
                                            time={new Date(integration.last_sync).toLocaleString()}
                                            count={integration.data_count || "0"}
                                            label={integration.description || "Records"}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-neutral-500 text-sm">
                                        No integrations configured.
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

// Subcomponents for reusability within the file

function StatCard({ title, value, icon: Icon, color, subtext, subtextColor, subtextIcon: SubIcon, progress }: any) {
    return (
        <div className={`rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 border-l-${color}-500`}>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-neutral-500">{title}</p>
                        <h3 className="text-2xl font-bold mt-1">{value}</h3>
                        <div className={`flex items-center mt-1 text-xs ${subtextColor}`}>
                            <SubIcon className="h-3 w-3 mr-1" />
                            <span>{subtext}</span>
                        </div>
                    </div>
                    <div className={`bg-${color}-100 p-2 rounded-full`}>
                        <Icon className={`h-5 w-5 text-${color}-600`} />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span>Overall Progress</span>
                        <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="relative w-full overflow-hidden rounded-full bg-secondary h-2">
                        <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - progress}%)` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, score, label, icon: Icon, color }: any) {
    return (
        <div className={`rounded-lg bg-card text-card-foreground shadow-sm border border-${color}-100 bg-gradient-to-br from-${color}-50 to-white`}>
            <div className="p-4">
                <div className="flex justify-between mb-2">
                    <div className={`bg-${color}-100 p-1.5 rounded-md`}>
                        <Icon className={`h-4 w-4 text-${color}-600`} />
                    </div>
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-${color}-600 border-${color}-200 bg-${color}-50`}>
                        {title}
                    </div>
                </div>
                <h3 className={`text-xl font-bold text-${color}-700 mb-1`}>{score}</h3>
                <p className={`text-xs text-${color}-600/80`}>{label}</p>
                <div className={`relative w-full overflow-hidden rounded-full h-1.5 mt-3 bg-${color}-100`}>
                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ width: score }}></div>
                </div>
            </div>
        </div>
    );
}

function StudyItem({ title, description, phase, sites, subjects, risk, riskColor, progress }: any) {
    return (
        <div className="p-4 rounded-lg border border-gray-100 hover:border-blue-100 bg-white hover:bg-blue-50/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-medium text-neutral-800">{title}</h3>
                    <p className="text-xs text-neutral-600 mt-1">{description}</p>
                    <div className="flex items-center text-sm text-neutral-500 mt-2">
                        <span className="mr-3">{phase}</span>
                        <span className="mr-3">{sites}</span>
                        <span>{subjects}</span>
                    </div>
                </div>
                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-${riskColor}-100 text-${riskColor}-800`}>
                    {risk}
                </div>
            </div>
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{progress}%</span>
                </div>
                <div className={`relative w-full overflow-hidden rounded-full h-2 bg-${riskColor}-100`}>
                    <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - progress}%)` }} />
                </div>
            </div>
        </div>
    )
}



function ActivityItem({ action_type, description, user_name, timestamp, related_entity_type }: any) {
    const getActionIcon = (type: string) => {
        if (type.includes('study')) return <FlaskConical className="h-5 w-5 text-blue-600" />;
        if (type.includes('query')) return <MessagesSquare className="h-5 w-5 text-indigo-600" />;
        if (type.includes('task')) return <ListChecks className="h-5 w-5 text-emerald-600" />;
        if (type.includes('document')) return <FileText className="h-5 w-5 text-purple-600" />;
        if (type.includes('dq')) return <CircleCheck className="h-5 w-5 text-amber-600" />;
        return <Activity className="h-5 w-5 text-blue-600" />;
    };

    const getActionLabel = (type: string) => {
        return type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
            <div className="mt-1">
                {getActionIcon(action_type)}
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{getActionLabel(action_type)}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{user_name}</span>
                    <span>•</span>
                    <span>{formatTime(timestamp)}</span>
                </div>
            </div>
        </div>
    )
}



function SDTMDomainItem({ code, name, records, fileCount }: any) {
    return (
        <div className="group flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs ring-4 ring-white group-hover:ring-blue-50 transition-all">
                    {code}
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 leading-none mb-1">{name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{fileCount} files</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <span className="block text-lg font-bold text-gray-900 tracking-tight">{records}</span>
                <span className="text-[10px] uppercase font-semibold text-gray-400">Records</span>
            </div>
        </div>
    )
}

function IntegrationItem({ name, status, time, count, label }: any) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center">
                <div className="mr-3">
                    <div className="p-2 rounded-full bg-green-100">
                        <Link2 className="h-4 w-4 text-green-600" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium">{name}</p>
                    <div className="flex items-center mt-0.5">
                        <span className="text-xs text-green-600">{status}</span>
                        <span className="mx-1.5 text-neutral-300">•</span>
                        <span className="text-xs text-neutral-500">{time}</span>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs font-medium text-neutral-700">{count}</span>
                <p className="text-xs text-neutral-500">{label}</p>
            </div>
        </div>
    )
}

// Mock Data
