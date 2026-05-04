import React, { useState } from 'react';
import { motion } from 'motion/react';

const WatchImg = 'https://res.cloudinary.com/mustanser/image/upload/v1777858868/Gemini_Generated_Image_wm43vwm43vwm43vw_ffrr7i.png';
const AboutImg = 'https://res.cloudinary.com/mustanser/image/upload/v1777858866/Gemini_Generated_Image_67yuvo67yuvo67yu2_ohtzrv.png';
const LogoContentImg = 'https://res.cloudinary.com/mustanser/image/upload/v1777858879/Group_1_ftoi8r.png';
const LogoHeaderImg = 'https://res.cloudinary.com/mustanser/image/upload/v1777858878/mst-text_aq3hk0.png';

export default function App() {
  const [subscribed, setSubscribed] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) {
      setError('Please provide your email or phone number.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
      const digitsOnly = val.replace(/\D/g, '');
      
      const isEmailFormat = emailRegex.test(val);
      const isPhoneFormat = phoneRegex.test(val) && digitsOnly.length >= 7;

      if (!isEmailFormat && !isPhoneFormat) {
        setIsSubmitting(false);
        setError('Please enter a valid email address or phone number.');
        return;
      }

      const payloadEmail = isEmailFormat ? val : null;
      const payloadPhone = isPhoneFormat ? val : null;

      // In case keys aren't added, skip actual fetch to prevent crash but show success for demo.
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.warn('Supabase keys missing, falling back to mock success.');
        await new Promise(resolve => setTimeout(resolve, 800));
        setSubscribed(true);
      } else {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
              email: payloadEmail, 
              phone: payloadPhone 
            })
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorDetail = 'Failed to save information';
            try {
              const errorData = await response.json();
              console.error("Supabase Error Data:", errorData);
              errorDetail = errorData.message || errorData.details || errorData.hint || errorDetail;
              
              if (errorDetail.includes('null value in column "id"')) {
                 errorDetail = "Database error: Please ensure the 'id' column in your Supabase 'waitlist' table has a default value (e.g., gen_random_uuid()).";
              } else if (errorDetail.includes('duplicate key value violates unique constraint') || errorDetail.includes('waitlist_email_key') || errorDetail.includes('waitlist_phone_key')) {
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
            throw new Error("The request took too long. If you are using a free Supabase database, it might be waking up from sleep. Please try again in a minute.");
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
    <div className="bg-background text-on-background font-body-md selection:bg-secondary-container min-h-screen flex flex-col">
      {/* Minimal Header */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 z-50 py-6 md:py-8 px-6 md:px-16 xl:px-24 flex justify-between items-center transition-all bg-transparent gap-4"
      >
        <a href="#" aria-label="Mustanser Home" className="flex-shrink-0 cursor-pointer transition-opacity hover:opacity-80">
          <img 
            src={LogoHeaderImg} 
            alt="Mustanser Logo" 
            loading="eager"
            className="h-5 sm:h-8 md:h-12 w-auto object-contain" 
          />
        </a>
        <div className="flex gap-4 sm:gap-6 md:gap-12">
            <a className="font-label-caps text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] text-cream hover:text-champagne-gold transition-colors uppercase whitespace-nowrap" href="#about">About us</a>
            <a className="font-label-caps text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] text-cream hover:text-champagne-gold transition-colors uppercase whitespace-nowrap" href="#contact">Contact</a>
        </div>
      </motion.header>

      <main className="flex-grow">
        {/* Full Bleed Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Full Screen Background Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0 bg-background"
          >
            <img 
              alt="Mustanser Parfum Texture" 
              className="w-full h-full object-cover scale-105" 
              loading="eager"
              src={WatchImg}
            />
          </motion.div>
          
          {/* Content Container */}
          <div className="relative z-10 w-full px-4 md:px-6 flex flex-col items-center justify-center max-w-4xl mx-auto mt-0">
            {/* Clear Blur Container wrapping all hero text and form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-10 md:px-12 md:py-14 w-full max-w-2xl shadow-2xl relative flex flex-col items-center text-center"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                src={LogoContentImg} 
                alt="Mustanser Parfum Logo"
                loading="eager"
                className="h-14 md:h-20 w-auto object-contain mx-auto mb-6 cursor-pointer hover:opacity-90 transition-opacity"
              />
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="font-label-caps text-[10px] md:text-sm tracking-[0.3em] text-cream/90 uppercase mb-4 md:mb-6 drop-shadow-md"
              >
                Launching soon.
              </motion.p>

              <motion.h1 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.6 }
                  }
                }}
                className="font-h1 text-[24px] sm:text-[32px] md:text-[38px] lg:text-[46px] leading-[1.2] md:leading-[1.1] mb-8 md:mb-10 text-cream tracking-tight drop-shadow-xl max-w-[90vw] mx-auto"
              >
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className="block"
                >
                  Timeless fragrances
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className="italic font-accent-italic text-champagne-gold block mt-2 text-[26px] sm:text-[34px] md:text-[42px] lg:text-[50px]"
                >
                  crafted for you.
                </motion.span>
              </motion.h1>

              {/* Minimal Form */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="w-full max-w-[300px] mx-auto"
              >
                {!subscribed ? (
                  <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input 
                      className="w-full bg-transparent focus:bg-transparent hover:bg-transparent border-b border-cream/20 py-3 px-2 focus:border-champagne-gold transition-colors font-body-md text-cream placeholder:text-cream/40 outline-none focus:outline-none focus:ring-0 appearance-none text-center tracking-wide" 
                      style={{ 
                        WebkitBoxShadow: '0 0 0px 1000px transparent inset', 
                        transition: 'background-color 5000s ease-in-out 0s' 
                      }}
                      placeholder="Email or phone number" 
                      autoComplete="off"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    
                    {error && (
                      <p className="text-red-400 text-xs tracking-wider mt-2">{error}</p>
                    )}

                    <button 
                      type="submit" 
                      disabled={isSubmitting || !inputValue.trim()}
                      className="w-full bg-transparent border border-champagne-gold text-champagne-gold font-label-caps text-[10px] py-4 tracking-[0.2em] hover:bg-champagne-gold hover:text-carbon-black transition-all duration-300 uppercase mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-champagne-gold"
                    >
                      {isSubmitting ? 'Submitting...' : 'Notify me'}
                    </button>
                  </form>
                ) : (
                  <div className="w-full py-8 text-center flex flex-col items-center">
                    <p className="font-body-md text-champagne-gold tracking-wide mb-6 animate-fade-in">
                      Thank you. You are on the list.
                    </p>
                    <button 
                      onClick={() => {
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-cream text-[10px] font-label-caps tracking-[0.2em] border-b border-cream/30 pb-1 hover:border-champagne-gold hover:text-champagne-gold transition-colors uppercase animate-fade-in-delayed"
                    >
                      Explore Our Story
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The House / About Section */}
        <section id="about" className="py-24 md:py-40 px-8 md:px-16 lg:px-32 bg-background flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 max-w-[1600px] mx-auto overflow-hidden">
          {/* Right Image (Now placed left on desktop for editorial layout rhythm) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-5/12 relative order-2 md:order-1 flex justify-center"
          >
             <div className="aspect-[3/4] w-full max-w-[400px] relative bg-carbon-black shadow-2xl mx-auto md:ml-0 md:mr-auto group overflow-hidden">
                <img 
                  src={AboutImg} 
                  alt="The Mustanser Atelier" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2s] ease-out" 
                />
             </div>
             
             {/* Editorial overlapping text */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -bottom-8 -right-4 md:-right-12 lg:-right-20 bg-surface p-8 shadow-xl border border-outline-variant/10 z-20 w-[90%] md:w-auto md:max-w-[280px]"
             >
                <span className="block font-accent-italic text-2xl md:text-3xl text-primary mb-3">The Atelier</span>
                <p className="font-body-md text-sm text-charcoal font-light leading-relaxed">
                  Where raw ingredients meet uncompromising sophistication.
                </p>
             </motion.div>
          </motion.div>

          {/* Left Text */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 }
              }
            }}
            className="w-full md:w-1/2 flex flex-col justify-center order-1 md:order-2"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="font-label-caps text-[10px] tracking-[0.3em] text-gold uppercase">About Us</span>
              <div className="w-16 h-[1px] bg-gold"></div>
            </motion.div>

            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="font-h1 text-[44px] md:text-[56px] leading-[1.05] mb-8 text-primary"
            >
              The Architecture <br /> of Essence.
            </motion.h2>

            <div className="font-body-md text-charcoal space-y-6 font-light leading-relaxed mb-12 max-w-lg text-[15px]">
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                Mustanser Parfum crafts timeless olfactory experiences built on precision, patience, and intention. We view fragrance as presence.
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                Every composition is a careful study in chemistry and craft. Built with carefully selected raw materials, balanced structures, and a strict attention to detail, we create our fragrances as lasting signatures.
              </motion.p>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer / Contact Section */}
      <footer id="contact" className="w-full bg-carbon-black pt-16 md:pt-32 pb-8 md:pb-12 px-6 md:px-16 lg:px-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 mb-16 md:mb-24"
          >
            
            {/* Left Box: Logo & Mission */}
            <div className="max-w-xs flex flex-col items-start text-left">
              <a href="#" aria-label="Mustanser Home" className="block mb-8 cursor-pointer transition-opacity hover:opacity-80">
                <img 
                  src={LogoHeaderImg} 
                  alt="Mustanser Logo" 
                  className="h-10 md:h-12 w-auto object-contain" 
                />
              </a>
              <p className="font-body-md text-sm text-cream/70 font-light leading-relaxed">
                We craft timeless olfactory experiences built on precision, patience, and intention.
              </p>
            </div>

            {/* Right Box: Grid with Contact & Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-24 w-full md:w-auto text-left">
              
              {/* Contact Links */}
              <div className="flex flex-col gap-6">
                <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-champagne-gold uppercase mb-2">Get in touch</h3>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-label-caps tracking-[0.2em] uppercase text-cream/40">Inquiries</span>
                  <a href="mailto:info@mustanser.com" className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors">info@mustanser.com</a>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-label-caps tracking-[0.2em] uppercase text-cream/40">Support</span>
                  <a href="mailto:support@mustanser.com" className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors">support@mustanser.com</a>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-label-caps tracking-[0.2em] uppercase text-cream/40">Phone</span>
                  <a href="tel:+923395255255" className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors">+92 339 5255255</a>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-col gap-6">
                <h3 className="font-label-caps text-[10px] tracking-[0.3em] text-champagne-gold uppercase mb-2">Follow Us</h3>
                <a className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors" href="https://www.instagram.com/mustanserparfum/" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors" href="https://www.facebook.com/mustanserparfum" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
                <a className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors" href="https://www.tiktok.com/@mustanserparfum" target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
                <a className="text-sm font-body-md text-cream hover:text-champagne-gold transition-colors" href="https://wa.me/923395255255" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>
            
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-[1440px] mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex gap-8 items-center cursor-pointer">
              <a className="font-label-caps text-[9px] tracking-[0.2em] text-cream/40 hover:text-champagne-gold transition-colors uppercase" href="#">Privacy Policy</a>
              <a className="font-label-caps text-[9px] tracking-[0.2em] text-cream/40 hover:text-champagne-gold transition-colors uppercase" href="#">Terms of Service</a>
            </div>
            
            <div className="font-label-caps text-[9px] tracking-[0.2em] text-cream/40 uppercase text-center md:text-right">
              © {new Date().getFullYear()} Mustanser Parfum. All rights reserved.
            </div>
          </motion.div>
        </footer>
    </div>
  );
}
