import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(formData);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.msg);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-2 text-center text-primary">ExpenseTracker</h1>
                <p className="text-center text-gray-500 mb-8">Welcome back!</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-transparent focus:border-primary outline-none text-lg"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-4 rounded-xl bg-white dark:bg-dark-surface border border-transparent focus:border-primary outline-none text-lg"
                        required
                    />

                    <button type="submit" className="bg-primary text-white p-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors mt-2">
                        Log In
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500">
                    Don't have an account? <Link to="/register" className="text-primary font-bold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
