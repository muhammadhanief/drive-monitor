'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import LoginForm from '@/app/components/LoginForm';
import { Cloud } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="relative min-h-screen selection:bg-blue-500/30 overflow-hidden">
      <div className="bg-mesh" />

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/8 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-300/8 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Logo & Branding */}
          <div className="mb-10 flex flex-col items-center gap-4 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl scale-150 animate-pulse"></div>
              <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-600/30">
                <Cloud className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-blue-950 uppercase leading-none">Drive Monitor</h1>
            </div>
          </div>

          <LoginForm action={formAction} isPending={isPending} error={state?.error} />

          {/* Footer */}
          <div className="mt-12 text-center animate-fade-in">
            <p className="text-[10px] font-medium text-blue-900/25 tracking-wider uppercase">
              © 2026 BPS Provinsi Jawa Tengah
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
