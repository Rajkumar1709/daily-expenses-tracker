import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, PieChart, Settings, ArrowUpCircle, ArrowDownCircle, X } from 'lucide-react';
import clsx from 'clsx';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [showAddMenu, setShowAddMenu] = useState(false);

    if (!token) return null;

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        {
            path: null, // Special handling
            icon: Plus,
            label: 'Add',
            special: true,
            onClick: () => setShowAddMenu(true)
        },
        { path: '/analytics', icon: PieChart, label: 'Analytics' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const handleNavigation = (path) => {
        setShowAddMenu(false);
        navigate(path);
    };

    return (
        <>
            <nav className="w-full bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-800 pb-safe pb-6 pt-2 px-6 flex justify-between items-center shadow-lg">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    if (item.special) {
                        return (
                            <button
                                key={index}
                                onClick={item.onClick}
                                className="flex flex-col items-center gap-1 -mt-6"
                            >
                                <div className={clsx(
                                    "bg-primary text-white p-3 rounded-full shadow-lg transform transition-transform active:scale-95",
                                    showAddMenu && "rotate-45 bg-gray-800"
                                )}>
                                    <Icon size={28} />
                                </div>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-colors duration-200",
                                isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Add Menu Overlay */}
            {showAddMenu && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 pb-24" onClick={() => setShowAddMenu(false)}>

                    <div className="flex gap-6 mb-8" onClick={(e) => e.stopPropagation()}>

                        {/* Income Button */}
                        <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300 delay-75">
                            <button
                                onClick={() => handleNavigation('/add?type=income')}
                                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
                            >
                                <ArrowUpCircle size={32} />
                            </button>
                            <span className="text-white font-medium mt-2 text-sm">Income</span>
                        </div>

                        {/* Expense Button */}
                        <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
                            <button
                                onClick={() => handleNavigation('/add?type=expense')}
                                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:scale-110 transition-transform"
                            >
                                <ArrowDownCircle size={32} />
                            </button>
                            <span className="text-white font-medium mt-2 text-sm">Expense</span>
                        </div>

                    </div>

                    <button
                        onClick={() => setShowAddMenu(false)}
                        className="absolute bottom-6 bg-white dark:bg-dark-surface p-3 rounded-full text-gray-800 dark:text-gray-200 shadow-lg animate-in fade-in zoom-in duration-200"
                    >
                        <X size={24} />
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
