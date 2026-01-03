import { ChevronDown } from 'lucide-react';

export function Header() {
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
                    <button
                        className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-1 transition-colors"
                        type="button"
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
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>
        </>
    );
}
