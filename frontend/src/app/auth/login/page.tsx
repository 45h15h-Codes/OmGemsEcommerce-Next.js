'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@omgems.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      
      // Navigate to correct dashboard based on role
      if (user.redirect_path) {
        router.push(user.redirect_path);
      } else {
        router.push('/account'); // Fallback
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-foreground bg-background selection:bg-accent selection:text-foreground">
      {/* Left side: Editorial Image (Placeholder with elegant styling) */}
      <div className="hidden lg:flex w-1/2 relative bg-muted items-center justify-center overflow-hidden">
        {/* Subtle noise texture or gradient could go here temporarily until real image */}
        <div className="absolute inset-0 bg-gradient-to-br from-background to-muted opacity-50 mix-blend-multiply" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 text-center px-12"
        >
          <div className="font-serif italic text-4xl mb-4 tracking-tight text-muted-foreground">
            Om Gems
          </div>
          <p className="text-muted-foreground/80 tracking-widest text-sm uppercase">
            Exclusive Digital Salon
          </p>
        </motion.div>
        
        {/* Overlay subtle border */}
        <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-border" />
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Logo element for mobile */}
          <div className="lg:hidden font-serif italic text-3xl mb-12 tracking-tight text-foreground text-center">
            Om Gems
          </div>

          <div className="mb-12">
            <h1 className="font-serif text-3xl tracking-tight mb-3">Authentification</h1>
            <p className="text-muted-foreground text-sm font-sans tracking-wide">
              Please enter your credentials to access the Maison.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 font-sans">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[13px] text-red-800 bg-red-50 p-4 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="group relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-transparent border-b border-border py-3 text-foreground placeholder-transparent focus:outline-none focus:border-foreground transition-colors peer text-sm"
                  placeholder="Email"
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:text-foreground peer-focus:uppercase tracking-wider peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:text-muted-foreground"
                >
                  Email Address
                </label>
              </div>

              <div className="group relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-transparent border-b border-border py-3 text-foreground placeholder-transparent focus:outline-none focus:border-foreground transition-colors peer text-sm tracking-widest"
                  placeholder="Password"
                />
                <label 
                  htmlFor="password" 
                  className="absolute left-0 top-3 text-sm text-muted-foreground transition-all peer-focus:-top-4 peer-focus:text-[11px] peer-focus:text-foreground peer-focus:uppercase tracking-wider peer-valid:-top-4 peer-valid:text-[11px] peer-valid:uppercase peer-valid:text-muted-foreground cursor-text"
                >
                  Password
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs tracking-wider uppercase">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors pb-0.5 border-b border-transparent hover:border-foreground">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-4 bg-foreground text-background font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-4 w-4 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating
                  </span>
                ) : (
                  <span className="flex items-center gap-4">
                    Enter
                    <span className="block w-6 h-[1px] bg-background transform origin-left transition-transform group-hover:scale-x-150" />
                  </span>
                )}
              </motion.button>
            </div>
          </form>

          {/* Demo account helper row */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4 text-center">
              Demonstration Access
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Super Admin', email: 'admin@omgems.com' },
                { label: 'Admin', email: 'manager@omgems.com' },
                { label: 'Partner', email: 'vendor@partner.com' },
                { label: 'Wholesale', email: 'buyer@wholesale.com' },
                { label: 'Retail', email: 'customer@retail.com' }
              ].map(role => (
                <button 
                  key={role.email}
                  type="button" 
                  onClick={() => setEmail(role.email)} 
                  className="text-[11px] border border-border px-3 py-1.5 hover:border-foreground hover:bg-muted transition-all"
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
