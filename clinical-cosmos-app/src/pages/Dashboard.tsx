import {
    FileText, ChartColumn, CircleArrowUp, FlaskConical, Clock, MessagesSquare,
    AlarmClock, ListChecks, Activity, Flag, CircleCheck, Bell, Award, Microscope,
    ChevronRight, Eye, CircleAlert, CircleDashed, Database, Link2, FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
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
                        value="4"
                        icon={FlaskConical}
                        color="blue"
                        subtext="1 new this month"
                        subtextColor="text-green-600"
                        subtextIcon={CircleArrowUp}
                        progress={53}
                    />
                    <StatCard
                        title="Open Queries"
                        value="42"
                        icon={MessagesSquare}
                        color="indigo"
                        subtext="8 requiring attention"
                        subtextColor="text-amber-600"
                        subtextIcon={Clock}
                        progress={76}
                    />
                    <StatCard
                        title="Tasks"
                        value="27"
                        icon={ListChecks}
                        color="emerald"
                        subtext="5 overdue tasks"
                        subtextColor="text-red-600"
                        subtextIcon={AlarmClock}
                        progress={68}
                    />
                    <StatCard
                        title="Signals Detected"
                        value="14"
                        icon={Flag}
                        color="rose"
                        subtext="3 critical signals"
                        subtextColor="text-blue-600"
                        subtextIcon={Activity}
                        progress={62}
                    />
                </div>

                {/* Quality Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard title="Data Quality" score="86%" label="Overall data quality score" icon={CircleCheck} color="blue" />
                    <MetricCard title="Operational" score="72%" label="Site operational efficiency" icon={Activity} color="indigo" />
                    <MetricCard title="Safety" score="91%" label="Protocol safety adherence" icon={Bell} color="emerald" />
                    <MetricCard title="Compliance" score="83%" label="Regulatory compliance score" icon={Award} color="amber" />
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
                                <StudyItem
                                    title="Diabetes Type 2 Study"
                                    description="Investigating efficacy of GLP-1 receptor agonists in glycemic control for T2DM patients"
                                    phase="Phase III" sites="28 sites" subjects="342 subjects"
                                    risk="Low Risk" riskColor="green"
                                    progress={76}
                                />
                                <StudyItem
                                    title="Rheumatoid Arthritis Study"
                                    description="Evaluation of JAK inhibitor in moderate to severe rheumatoid arthritis"
                                    phase="Phase II" sites="15 sites" subjects="187 subjects"
                                    risk="Medium Risk" riskColor="amber"
                                    progress={45}
                                />
                                <StudyItem
                                    title="Advanced Breast Cancer"
                                    description="CDK4/6 inhibitor combination therapy in HR+/HER2- advanced breast cancer"
                                    phase="Phase III" sites="32 sites" subjects="274 subjects"
                                    risk="High Risk" riskColor="red"
                                    progress={28}
                                />
                                <StudyItem
                                    title="Alzheimer's Disease"
                                    description="Beta-amyloid monoclonal antibody for early-stage Alzheimer's disease"
                                    phase="Phase II" sites="12 sites" subjects="156 subjects"
                                    risk="Low Risk" riskColor="green"
                                    progress={64}
                                />
                            </div>
                            <div className="flex items-center p-6 pt-0 pb-3">
                                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                    <FlaskConical className="mr-2 h-4 w-4" />
                                    Create New Study
                                </button>
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
                                    <EndpointItem title="HbA1c Reduction" study="Diabetes Type 2 Study" status="On Track" statusColor="green" target="≥ 1.0%" current="0.85%" />
                                    <EndpointItem title="ACR20 Response" study="Rheumatoid Arthritis Study" status="Monitoring" statusColor="amber" target="≥ 60%" current="42%" />
                                    <EndpointItem title="Progression-free Survival" study="Advanced Breast Cancer" status="Concern" statusColor="red" target="≥ 12 months" current="9.7 months" />
                                    <EndpointItem title="ADAS-Cog Change" study="Alzheimer's Disease" status="On Track" statusColor="green" target="≤ -3.5 points" current="-2.8 points" />
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
                                <div className="space-y-3">
                                    <TaskItem id="T-123" priority="High" priorityColor="red" title="Review protocol deviation in Subject 1078" due="May 2, 2025" assignee="J. Wilson" status="In Progress" statusColor="blue" />
                                    <TaskItem id="T-124" priority="Medium" priorityColor="amber" title="Verify vital signs data queries from Site 3" due="May 5, 2025" assignee="M. Johnson" status="Pending" statusColor="gray" />
                                    <TaskItem id="T-125" priority="High" priorityColor="red" title="Reconcile liver enzyme test discrepancies in Lab Results" due="May 1, 2025" assignee="A. Martinez" status="Overdue" statusColor="red" />
                                    <TaskItem id="T-126" priority="Low" priorityColor="blue" title="Update risk-based monitoring plan for Boston site" due="May 10, 2025" assignee="S. Patel" status="Completed" statusColor="green" />
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Link to="/tasks">
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 border border-input mt-2">
                                            View All Tasks
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
                                <DeviationItem code="PD-101: Eligibility" severity="Minor" severityColor="amber" desc="Subject enrolled outside inclusion criteria #4" site="Site: Boston Medical" />
                                <DeviationItem code="PD-102: Treatment" severity="Major" severityColor="red" desc="Missed dose on day 14±2" site="Site: NYC Research" />
                                <DeviationItem code="PD-103: Procedure" severity="Minor" severityColor="amber" desc="Blood sample collected outside window" site="Site: Chicago Clinical" />
                            </div>
                        </div>

                        {/* SDTM Domains */}
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <h3 className="font-semibold tracking-tight text-lg flex items-center">
                                    <Database className="mr-2 h-5 w-5 text-blue-600" />
                                    SDTM Domains
                                </h3>
                            </div>
                            <div className="p-6 pt-0 space-y-2">
                                <SDTMItem code="DM" name="Demographics" records="959" progress="98%" progressColor="green-600" />
                                <SDTMItem code="VS" name="Vital Signs" records="4,782" progress="93%" progressColor="green-600" />
                                <SDTMItem code="LB" name="Laboratory Tests" records="12,568" progress="88%" progressColor="amber-600" />
                                <SDTMItem code="AE" name="Adverse Events" records="873" progress="95%" progressColor="green-600" />
                                <SDTMItem code="CM" name="Concomitant Medications" records="1,924" progress="82%" progressColor="amber-600" />
                                <SDTMItem code="EX" name="Exposure" records="959" progress="97%" progressColor="green-600" />
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
                                <IntegrationItem name="Medidata Rave EDC" status="Connected" time="30 min ago" count="4,352" label="CRF forms" />
                                <IntegrationItem name="Veeva Vault CTMS" status="Connected" time="1 hour ago" count="1,865" label="Site activities" />
                                <IntegrationItem name="TransPerfect TMF" status="Connected" time="2 hours ago" count="12,450" label="Documents" />
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

function EndpointItem({ title, study, status, statusColor, target, current }: any) {
    return (
        <div className="border rounded-lg p-3">
            <div className="flex justify-between mb-2">
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-neutral-500">{study}</p>
                </div>
                <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-${statusColor}-100 text-${statusColor}-800`}>
                    {status}
                </div>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span>Target: {target}</span>
                <span>Current: {current}</span>
            </div>
        </div>
    )
}

function TaskItem({ id, priority, priorityColor, title, due, assignee, status, statusColor }: any) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center">
                <div className="mr-3">
                    <div className={`bg-${priority === 'High' ? 'red' : 'blue'}-100 p-2 rounded-full`}>
                        <ListChecks className={`h-5 w-5 text-${priority === 'High' ? 'red' : 'blue'}-600`} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center">
                        <span className="text-sm font-medium">{id}</span>
                        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold ml-2 text-xs bg-${priorityColor}-100 text-${priorityColor}-800`}>
                            {priority}
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">{title}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>Due: {due}</span>
                        <span className="mx-2">•</span>
                        <span>Assigned to: {assignee}</span>
                    </div>
                </div>
            </div>
            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-${statusColor}-50 text-${statusColor}-800 border-${statusColor}-200`}>
                {status}
            </div>
        </div>
    )
}

function DeviationItem({ code, severity, severityColor, desc, site }: any) {
    return (
        <div className="flex items-center p-3 border rounded-lg hover:bg-slate-50">
            <div className="mr-3">
                <div className={`p-2 rounded-full bg-${severityColor}-100`}>
                    <CircleDashed className={`h-4 w-4 text-${severityColor}-600`} />
                </div>
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{code}</p>
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-${severityColor}-100 text-${severityColor}-800`}>
                        {severity}
                    </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{desc}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{site}</p>
            </div>
        </div>
    )
}

function SDTMItem({ code, name, records, progress, progressColor }: any) {
    return (
        <div className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-slate-50">
            <div>
                <div className="flex items-center">
                    <div className="bg-blue-100 rounded p-1 mr-2">
                        <span className="text-xs font-semibold text-blue-700">{code}</span>
                    </div>
                    <span className="text-sm">{name}</span>
                </div>
                <div className="flex mt-1 text-xs text-gray-500">
                    <span>{records} records</span>
                </div>
            </div>
            <div className="text-sm font-medium">
                <span className={`text-${progressColor}`}>{progress}</span>
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
