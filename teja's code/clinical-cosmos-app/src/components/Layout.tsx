import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <Header />
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto relative bg-gray-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
