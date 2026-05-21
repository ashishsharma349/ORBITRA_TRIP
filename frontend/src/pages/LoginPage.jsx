import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden">
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl font-black tracking-wider text-indigo-400">ORBITRA</span>
        <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">TRIP</span>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
