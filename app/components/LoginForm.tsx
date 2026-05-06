"use client";

import { useState } from "react";
import { LogIn, User, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
    action: (formData: FormData) => void;
    isPending: boolean;
    error?: string | null;
}

export default function LoginForm({ action, isPending, error }: LoginFormProps) {
    const [focused, setFocused] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-sm mx-auto space-y-6 animate-slide-up">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-blue-950">Selamat Datang</h2>
                <p className="text-blue-800/50 text-sm font-medium">
                    Masuk dengan akun SSO BPS Anda
                </p>
            </div>

            <div className="glass rounded-[28px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

                {/* Decorative corner glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none"></div>

                <form action={action} className="space-y-5 relative z-10">
                    <div className="space-y-4">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-blue-900/50 tracking-[0.2em] uppercase flex items-center gap-1.5 px-1">
                                <User className="h-3 w-3" />
                                Username
                            </label>
                            <div className={`relative rounded-xl transition-all duration-200 ${focused === 'username' ? 'ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10' : ''}`}>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="tanpa @bps.go.id"
                                    onFocus={() => setFocused('username')}
                                    onBlur={() => setFocused(null)}
                                    className="w-full px-4 py-3.5 text-sm border border-blue-200/60 rounded-xl focus:border-blue-500/40 outline-none transition-all font-medium bg-white/90 text-blue-950 placeholder:text-blue-800/30"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-blue-900/50 tracking-[0.2em] uppercase flex items-center gap-1.5 px-1">
                                <Lock className="h-3 w-3" />
                                Password
                            </label>
                            <div className={`relative rounded-xl transition-all duration-200 ${focused === 'password' ? 'ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10' : ''}`}>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    className="w-full px-4 py-3.5 pr-12 text-sm border border-blue-200/60 rounded-xl focus:border-blue-500/40 outline-none transition-all font-medium bg-white/90 text-blue-950 placeholder:text-blue-800/30"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-800/40 hover:text-blue-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200/60 animate-scale-in">
                            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <span className="text-xs font-semibold text-red-600">{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="group relative w-full py-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold shadow-xl shadow-blue-600/25 transform transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2.5 uppercase tracking-widest text-xs">
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    MENGOTENTIKASI...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    MASUK
                                </>
                            )}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
