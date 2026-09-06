import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle } from 'lucide-react';

export default function AuthScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-600 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">EvacNOW</h1>
      <p className="text-slate-400 mb-8 text-center text-sm">Authority Dashboard Login</p>
      
      {error && (
        <div className="w-full bg-rose-500/20 border border-rose-500 text-rose-300 px-4 py-3 rounded-xl mb-6 flex gap-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Authority Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 bg-slate-900 border border-slate-800 rounded-xl px-4 text-white focus:outline-none focus:border-amber-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 bg-slate-900 border border-slate-800 rounded-xl px-4 text-white focus:outline-none focus:border-amber-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-amber-600 hover:bg-amber-500 glow-amber"
        >
          {loading ? 'Authenticating...' : 'Login to Dashboard'}
        </button>
      </form>
    </div>
  );
}
