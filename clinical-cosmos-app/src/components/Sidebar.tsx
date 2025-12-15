import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FlaskConical,
    Database,
    FileText,
    Cpu,
    Bot,
    Radio,
    CheckSquare,
    Shield,
    BarChart3,
    Bell,
    Settings,
    Brain
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
    { name: 'AI Agents', href: '/ai-agents', icon: Brain, highlight: true },
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Study Management', href: '/study-management', icon: FlaskConical },
    { name: 'Data Integration', href: '/data-integration', icon: Database },
    { name: 'Trial Data Management', href: '/trial-data-management', icon: FileText },
    { name: 'Data Manager.AI', href: '/data-manager-ai', icon: Cpu },
    { name: 'Central Monitor.AI', href: '/central-monitor-ai', icon: Bot },
    { name: 'Signal Detection', href: '/signal-detection', icon: Radio },
    { name: 'Tasks Management', href: '/tasks', icon: CheckSquare },
    { name: 'Profile Management', href: '/risk-profiles', icon: Shield },
    { name: 'Reporting and Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Admin', href: '/admin', icon: Settings },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <nav className="bg-blue-700 w-64 h-full flex flex-col shadow-md shrink-0">
            <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <li key={item.name} className="mb-1">
                                <Link to={item.href}>
                                    {item.highlight ? (
                                        <div className="relative mb-3 mt-1 group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-400 to-cyan-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg border border-blue-400">
                                                <item.icon className="mr-3 h-6 w-6 flex-shrink-0 text-cyan-300 animate-pulse" />
                                                <span className="truncate flex items-center font-bold">
                                                    {item.name}
                                                    <span className="ml-2 text-[10px] bg-white text-blue-700 px-1 rounded font-bold uppercase">
                                                        AI HUB
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={clsx(
                                                "flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer transition-all duration-200",
                                                isActive
                                                    ? "bg-blue-800 text-white shadow-inner"
                                                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                                            )}
                                        >
                                            <item.icon className={clsx("mr-3 h-6 w-6 flex-shrink-0", isActive ? "text-white" : "text-blue-300")} />
                                            <span className="truncate">{item.name}</span>
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
