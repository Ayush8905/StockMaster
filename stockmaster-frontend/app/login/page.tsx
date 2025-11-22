'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { LogIn } from 'lucide-react';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', data.email);
            const response = await authAPI.login(data.email, data.password);
            console.log('Login response:', response);
            login(response.token, { email: response.email, role: response.role });
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);
            console.error('Error response:', err.response);
            const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password';
            console.error('Error message:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient p-4">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-strong p-8 relative z-10 animate-scaleIn">
                <div className="flex items-center justify-center mb-8 animate-bounceIn">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg animate-pulseGlow">
                        <LogIn className="h-10 w-10 text-white" />
                    </div>
                </div>

                <div className="animate-fadeIn">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        StockMaster
                    </h1>
                    <p className="text-center text-gray-600 mb-8 font-medium">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideInLeft shadow-md">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="animate-slideInLeft animate-delay-100">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium placeholder-gray-400 hover:border-gray-300"
                                placeholder="you@example.com"
                                style={{ color: '#1f2937', WebkitTextFillColor: '#1f2937' }}
                            />
                            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="animate-slideInLeft animate-delay-200">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 font-medium placeholder-gray-400 hover:border-gray-300"
                                placeholder="••••••••"
                                style={{ color: '#1f2937', WebkitTextFillColor: '#1f2937' }}
                            />
                            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-600 flex items-center animate-fadeIn">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl btn-ripple animate-slideInLeft animate-delay-300"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600 animate-fadeIn animate-delay-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline transition-all">
                        Sign up
                    </Link>
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200 animate-fadeIn animate-delay-400">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                        <p className="text-xs text-center text-gray-600 font-medium">
                            🔐 Test Account
                        </p>
                        <p className="text-xs text-center text-indigo-600 font-mono mt-1">
                            ayush@stockmaster.com / ayush123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
