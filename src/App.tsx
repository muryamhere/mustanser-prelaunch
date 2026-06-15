import React, { useState } from 'react';
import { motion } from 'motion/react';
import Silk from './components/Silk';
import BorderGlow from './components/BorderGlow';

const LogoContentImg = 'https://res.cloudinary.com/mustanser/image/upload/v1777858879/Group_1_ftoi8r.png';

export default function App() {
  const [subscribed, setSubscribed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) {
      setError('Please provide your email.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailFormat = emailRegex.test(val);

      if (!isEmailFormat) {
        setIsSubmitting(false);
        setError('Please enter a valid email address.');
        return;
      }

      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        setIsSubmitting(false);
        setError('Database connection error: Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the settings menu.');
        return;
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
              id: crypto.randomUUID(),
              email: val
            })
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorDetail = 'Failed to save information';
            try {
              const errorData = await response.json();
              errorDetail = errorData.message || errorData.details || errorData.hint || errorDetail;
              
              if (errorDetail.includes('null value in column "id"')) {
                 errorDetail = "Database error: Please check database default values.";
              } else if (errorDetail.includes('duplicate key') || errorDetail.includes('waitlist_email_key')) {
                 setSubscribed(true);
                 return;
              }
            } catch (e) {
              console.error("Failed to parse error response");
            }
            throw new Error(errorDetail);
          }

          setSubscribed(true);
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          if (fetchErr.name === 'AbortError') {
            throw new Error("The request took too long. Please try again.");
          }
          throw fetchErr;
        }
      }
    } catch (err: any) {
      console.error("Error saving to waitlist:", err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#0a0a0a] text-white font-body-md">
      
      {/* Silk Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Silk 
          speed={3}
          scale={1}
          color="#E6C27A"
          noiseIntensity={1}
          rotation={0}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-20 pb-40">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8 md:mb-12"
        >
          <img 
            src={LogoContentImg} 
            alt="Mustanser Parfum Logo"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity" 
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-6xl sm:text-7xl md:text-[5.5rem] font-bold tracking-tight mb-12 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 drop-shadow-2xl"
          style={{ paddingBottom: '0.1em' }}
        >
          Coming soon!
        </motion.h1>

        {/* Glass Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-[620px] mx-auto rounded-[32px] bg-white/[0.04] backdrop-blur-[32px] border border-white/10 p-10 md:p-14 text-center relative overflow-hidden"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
        >
          {/* Subtle inner reflection */}
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl font-medium mb-4 text-white">Join our waitlist!</h2>
          <p className="text-white/60 text-[15px] mb-10 leading-relaxed max-w-[400px] mx-auto hidden sm:block">
            You'll know it the moment you smell it. Be the first to experience it. Secure your early access.
          </p>
          <p className="text-white/60 text-[15px] mb-8 leading-relaxed mx-auto sm:hidden">
            You'll know it the moment you smell it. Secure your early access.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <div className="relative w-full sm:w-auto flex-grow max-w-[340px]">
                <input 
                  type="email"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter email"
                  disabled={isSubmitting}
                  className="w-full bg-black/40 border border-white/10 rounded-full px-6 py-3.5 sm:py-4 text-[15px] text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors shadow-inner"
                />
              </div>
              <div className="w-full sm:w-auto relative cursor-pointer group">
                <BorderGlow
                  className="w-full sm:w-auto min-h-[50px] sm:min-h-[56px] cursor-pointer"
                  edgeSensitivity={40}
                  glowColor="40 68 69"
                  backgroundColor="#E6C27A"
                  borderRadius={50}
                  glowRadius={25}
                  glowIntensity={1.0}
                  coneSpread={20}
                  animated={true}
                  colors={['#ffffff', '#E6C27A', '#F2D696']}
                >
                  <button 
                    type="submit"
                    disabled={isSubmitting || !inputValue.trim()}
                    className="relative w-full h-full min-h-[50px] sm:min-h-[56px] flex items-center justify-center text-black font-semibold rounded-full px-8 text-[15px] hover:bg-white/10 disabled:opacity-50 transition-colors whitespace-nowrap outline-none"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </BorderGlow>
              </div>
            </form>
          ) : (
            <div className="py-4">
              <p className="text-[#E6C27A] font-medium tracking-wide">
                Thank you. You are on the list.
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-400/90 text-sm tracking-wider mt-5">{error}</p>
          )}
        </motion.div>

        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-10"
        >
          <a href="https://facebook.com/mustanserparfum" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E6C27A]/50 hover:text-[#E6C27A] hover:bg-white/10 transition-colors backdrop-blur-md">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="https://instagram.com/mustanserparfum" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E6C27A]/50 hover:text-[#E6C27A] hover:bg-white/10 transition-colors backdrop-blur-md">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="https://www.tiktok.com/@mustanserparfum" aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E6C27A]/50 hover:text-[#E6C27A] hover:bg-white/10 transition-colors backdrop-blur-md">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          </a>
          <a href="https://www.pinterest.com/mustanserparfum" aria-label="Pinterest" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E6C27A]/50 hover:text-[#E6C27A] hover:bg-white/10 transition-colors backdrop-blur-md">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.105 0 7.301 2.927 7.301 6.83 0 4.083-2.573 7.37-6.146 7.37-1.199 0-2.327-.624-2.712-1.362l-.741 2.827c-.268 1.021-.995 2.299-1.484 3.081 1.155.355 2.383.546 3.651.546 6.621 0 11.988-5.367 11.988-11.988C24 5.367 18.638 0 12.017 0z"/></svg>
          </a>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-10 text-center text-white/60 text-[13px] backdrop-blur-md bg-white/5 border border-white/10 px-8 py-5 rounded-3xl"
        >
          <div className="flex flex-col">
            <span className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Inquiries</span>
            <a href="mailto:info@mustanser.com" className="hover:text-[#E6C27A] transition-colors">info@mustanser.com</a>
          </div>
          <div className="hidden sm:block w-[1px] h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-white/40 text-[11px] uppercase tracking-wider mb-1">Support</span>
            <a href="mailto:support@mustanser.com" className="hover:text-[#E6C27A] transition-colors">support@mustanser.com</a>
          </div>
          <div className="hidden sm:block w-[1px] h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-white/40 text-[11px] uppercase tracking-wider mb-1">WhatsApp</span>
            <a href="https://wa.me/923395255255" target="_blank" rel="noopener noreferrer" className="hover:text-[#E6C27A] transition-colors">+92 339 5255255</a>
          </div>
        </motion.div>

      </main>

      {/* Floating Outline Text */}
      <div className="absolute -bottom-10 md:-bottom-24 left-0 right-0 z-0 flex justify-center pointer-events-none overflow-hidden select-none pb-12 w-full">
        <h2 className="text-[20vw] xl:text-[300px] font-bold leading-none tracking-tighter text-transparent w-full text-center"
            style={{ 
              WebkitTextStroke: '1.5px rgba(230,194,122,0.1)',
              transform: 'scaleY(1.1)' 
            }}>
          MUSTANSER
        </h2>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-10 flex justify-center items-center text-[11px] font-medium text-white/40 tracking-wider gap-3 select-none">
        <span>©{new Date().getFullYear()} Mustanser</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Architecture of Essence</span>
      </div>

    </div>
  );
}
