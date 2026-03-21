import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import API from '../api';

import PageWrapper from '../components/PageWrapper';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            console.log('Attempting login with:', email);
            const { data } = await API.post('/auth/login', { email, password });
            console.log('Login success:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload(); // To update header state
        } catch (err: any) {
            console.error('Login error details:', err.response || err);
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <section className="max-w-md mx-auto px-4 py-20">
                <h2 className="text-4xl text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Login</h2>
                {error && <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D85C63]/50 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D85C63]/50 transition-all"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D85C63] text-white py-4 rounded-full transition-all duration-300 hover:bg-[#d1535a] shadow-lg disabled:bg-gray-400"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-center mt-8 text-gray-600">
                    Don't have an account? <Link to="/register" className="text-[#D85C63] font-semibold hover:underline">Register</Link>
                </p>
            </section>
        </PageWrapper>
    );
};

export default LoginPage;
