import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut, User, Moon, Sun, ChevronRight } from 'lucide-react';

const Settings = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen px-4 py-8 pb-24">
            <h1 className="text-2xl font-bold mb-8 dark:text-gray-100">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                    {user?.name?.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold dark:text-gray-100">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4">
                <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <User className="text-gray-500" size={20} />
                            <span className="font-medium dark:text-gray-200">Edit Profile</span>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                    {/* Theme Toggle could be automated or manual here. For now, just a placeholder or hook up later */}
                    <button className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                            <Moon className="text-gray-500" size={20} />
                            <span className="font-medium dark:text-gray-200">Dark Mode</span>
                        </div>
                        <span className="text-xs text-primary font-bold">AUTO</span>
                    </button>
                </div>

                <button
                    onClick={logout}
                    className="flex justify-center items-center gap-2 w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl font-bold mt-8 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    Log Out
                </button>
            </div>

            <p className="text-center text-gray-400 text-xs mt-12">Version 1.0.0</p>
        </div>
    );
};

export default Settings;
