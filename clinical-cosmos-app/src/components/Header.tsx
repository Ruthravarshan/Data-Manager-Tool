import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-lg z-20 relative">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold text-center tracking-wide">
                        Clinical Business Orchestration and AI Technology Platform
                    </h1>
                </div>
            </div>
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-6 py-3">
                    <div></div>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-1 transition-colors"
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium">
                                    SA
                                </span>
                            </span>
                            <div className="hidden md:flex flex-col text-left">
                                <span className="text-sm font-medium text-gray-900">System Administrator</span>
                                <span className="text-xs text-gray-500">System Administrator</span>
                            </div>
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <User className="h-4 w-4 mr-3 text-gray-400" />
                                    My Profile
                                </button>
                                <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                                    Settings
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut className="h-4 w-4 mr-3 text-red-500" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
