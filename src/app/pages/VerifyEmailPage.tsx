import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import API from '../api';
import { toast } from 'sonner';
import PageWrapper from '../components/PageWrapper';

const VerifyEmailPage = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error('Please enter a 6-digit code');
            return;
        }

        try {
            setLoading(true);
            const { data } = await API.post('/auth/verify-email', { email, code });
            toast.success('Email verified successfully!');
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            await API.post('/auth/resend-code', { email });
            toast.success('New code sent to your email');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    return (
        <PageWrapper>
            <section className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-gray-100">
                    <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Verify Your Email</h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        We've sent a 6-digit verification code to <br />
                        <span className="font-bold text-gray-800">{email}</span>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <input 
                            type="text" 
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code"
                            className="w-full text-center text-3xl tracking-[10px] font-bold py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D85C63]/30 transition-all"
                            required
                        />
                        
                        <button 
                            type="submit"
                            disabled={loading || code.length !== 6}
                            className="w-full bg-[#D85C63] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#d1535a] transition-all disabled:bg-gray-300"
                        >
                            {loading ? 'Verifying...' : 'Verify Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                        <button 
                            onClick={handleResend}
                            disabled={resending}
                            className="text-[#D85C63] font-bold hover:underline disabled:text-gray-400"
                        >
                            {resending ? 'Resending...' : 'Resend Code'}
                        </button>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
};

export default VerifyEmailPage;
