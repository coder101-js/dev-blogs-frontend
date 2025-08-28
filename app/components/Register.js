'use client';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [togglePassword, setTogglePassword] = useState(true);
    const [loading, setLoading] = useState(false)
    const [formError, setFormError] = useState(false);
    const formRef = useRef(null);

    const sendData = async (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const email = formData.get('email')?.trim();
        const password = formData.get('password')?.trim();
        const name = formData.get('name')?.trim();
        if (!email || !password || !name) {
            toast.error('All fields are required! ');
            setFormError(false);
            requestAnimationFrame(() => setFormError(true));
            return;
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast.error('Enter a valid email ');
            setFormError(false);
            requestAnimationFrame(() => setFormError(true));
            return;
        }

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters ');
            setFormError(false);
            requestAnimationFrame(() => setFormError(true));
            return;
        }
        setFormError(false)
        setLoading(true)
        toast.loading('Creating an account...');

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
                { email, password, name },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            toast.dismiss();

            if (response.status === 200) {
                toast.success('Account created');

                const { redirectTo } = response.data;
                formRef.current.reset();
                if (redirectTo) {
                    router.push(redirectTo);
                }
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response.data.message);
            console.error(err);
            if (err.status === 429) {
                toast.dismiss();
                toast.error('Too many request');

            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-bl from-[#374151] via-[#3b82f6] to-[#06b6d4] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-8 text-white">
                <h2 className="text-2xl font-semibold mb-6 text-center">Sign in to your account</h2>

                <form
                    className={`space-y-5 ${formError ? 'animate-shake' : ''}`}
                    ref={formRef}
                    onSubmit={sendData}
                    onAnimationEnd={() => setFormError(false)}
                >
                    <div>
                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-300">Full name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-300">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={togglePassword ? "password" : "text"}
                                id="password"
                                name="password"
                                className="w-full pr-12 px-4 py-2 rounded-md bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                type="button"
                                onClick={() => setTogglePassword(!togglePassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                            >
                                {togglePassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
                            </button>
                        </div>

                    </div>

                    {/* Submit */}
                    <button
                        disabled={loading ? true : false}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all py-2 rounded-md font-semibold"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="border-4 border-white border-t-transparent animate-spin w-[20px] h-[20px] rounded-full"></div>
                            </div>
                        ) : (
                            "Create account"
                        )}
                    </button>

                    {/* <div className="flex items-center gap-2">
                        <div className="flex-grow border-t border-gray-500" />
                        <span className="text-sm text-gray-300">or</span>
                        <div className="flex-grow border-t border-gray-500" />
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="w-full bg-white text-black hover:bg-gray-100 transition-all py-2 rounded-md font-semibold flex items-center justify-center gap-3"
                    >
                        <Image src="/google.png" width={24} height={24} alt="Google" />
                        Sign In with Google
                    </button> */}

                    <div className="text-center mt-4">
                        <span className='text-[13px]'>Already have an account? </span>
                        <Link
                            href="/login"
                            className="text-[14.5px] text-blue-200 hover:text-blue-100 hover:underline transition-all"
                        >
                            Sign in
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}
