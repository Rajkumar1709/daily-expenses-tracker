import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-black z-50">
            {/* Glassmorphism Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 shadow-2xl"
            >
                {/* Animated Logo Container */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/30"
                >
                    <DollarSign size={48} className="text-white" strokeWidth={3} />
                </motion.div>

                {/* Loading Text */}
                <motion.h2
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl font-bold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent"
                >
                    ExpenseTracker
                </motion.h2>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
