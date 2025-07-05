import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Video, Users, MessageCircle, Sparkles, Zap, Globe } from 'lucide-react';

const Index = () => {
  const [showPreloader, setShowPreloader] = useState(() => {
    // Only show preloader on first app load
    return !sessionStorage.getItem('appLoaded');
  });
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (showPreloader) {
      // Mark app as loaded in session storage
      const timer = setTimeout(() => {
        sessionStorage.setItem('appLoaded', 'true');
        setShowPreloader(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPreloader]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  const handleAuthSuccess = () => {
    // Refresh to load authenticated state
    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cosmic flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-lg animate-pulse"></div>
          <div className="text-holographic animate-pulse">Loading HangoutHub...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  // Interactive floating elements animation
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-pulse ${
            i % 3 === 0 ? 'bg-neon-cyan/20' : 
            i % 3 === 1 ? 'bg-neon-pink/20' : 'bg-neon-green/20'
          }`}
          style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-hero ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-cosmic overflow-hidden">
      {/* Animated background particles */}
      <div className="particles fixed inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section - Gen Z Redesign */}
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Enhanced Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-bounce ${
                  i % 4 === 0 ? 'bg-neon-cyan/30' : 
                  i % 4 === 1 ? 'bg-neon-pink/30' : 
                  i % 4 === 2 ? 'bg-neon-green/30' : 'bg-neon-orange/30'
                } shadow-lg`}
                style={{
                  width: `${Math.random() * 80 + 40}px`,
                  height: `${Math.random() * 80 + 40}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-hero ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
          
          {/* Main Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Trendy Status Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 
                            backdrop-blur-sm border border-white/10 rounded-full px-6 py-2 mb-8 animate-pulse">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-ping"></div>
                <span className="text-sm font-medium text-white">✨ 50K+ Students Already Vibing</span>
              </div>

              {/* Dynamic Main Heading */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 leading-tight">
                <span className="text-white">Your</span>{" "}
                <span className="bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green 
                               bg-clip-text text-transparent animate-pulse">
                  Digital
                </span>
                <br />
                <span className="bg-gradient-to-r from-neon-green via-neon-orange to-neon-pink 
                               bg-clip-text text-transparent">
                  Squad Goals
                </span>{" "}
                <span className="text-white">🚀</span>
              </h1>

              {/* Gen Z Tagline */}
              <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white/80 mb-4">
                Where Friends = Forever Vibes
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                No cap, this is THE place to hang with your crew! 🎵 Stream together, binge-watch, 
                and chat without the drama. Distance? We don't know her. 💯
              </p>

              {/* Interactive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button 
                  size="xl"
                  className="group bg-gradient-to-r from-neon-pink to-neon-cyan hover:from-neon-cyan hover:to-neon-pink 
                           text-white font-bold px-8 py-4 rounded-2xl transform hover:scale-110 
                           transition-all duration-300 shadow-lg hover:shadow-neon border-0 text-lg"
                  onClick={() => window.location.href = '/music'}
                >
                  <Music className="h-6 w-6 mr-3 group-hover:animate-spin" />
                  Start the Party 🎉
                </Button>
                
                <Button 
                  size="xl"
                  variant="outline"
                  className="group border-2 border-neon-green text-neon-green hover:bg-neon-green 
                           hover:text-black font-bold px-8 py-4 rounded-2xl transform hover:scale-110 
                           transition-all duration-300 text-lg backdrop-blur-sm"
                  onClick={() => window.location.href = '/video'}
                >
                  <Video className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Movie Night Mode 🍿
                </Button>
              </div>

              {/* Social Proof Pills */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm text-white">💬 Instant DMs</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm text-white">🎮 Game Together</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm text-white">📱 Mobile Ready</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="text-sm text-white">🔥 Always Lit</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-neon-cyan">50K+</div>
                  <div className="text-sm text-white/60">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-neon-pink">24/7</div>
                  <div className="text-sm text-white/60">Always Online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-neon-green">100%</div>
                  <div className="text-sm text-white/60">Vibe Check</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-holographic mb-6">
                Why Choose HangoutHub?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built for the modern digital nomad. Connect, create, and collaborate in ways never before possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/40 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                    <Sparkles className="h-8 w-8 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-holographic mb-4">Immersive Experience</h3>
                  <p className="text-muted-foreground">
                    Feel like you're in the same room with friends, no matter where you are in the world.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-pink/20 to-neon-pink/40 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                    <Zap className="h-8 w-8 text-neon-pink" />
                  </div>
                  <h3 className="text-xl font-bold text-holographic mb-4">Lightning Fast</h3>
                  <p className="text-muted-foreground">
                    Real-time synchronization ensures everyone stays perfectly in sync, always.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/10 transform hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-green/20 to-neon-green/40 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                    <Globe className="h-8 w-8 text-neon-green" />
                  </div>
                  <h3 className="text-xl font-bold text-holographic mb-4">Global Community</h3>
                  <p className="text-muted-foreground">
                    Join millions of users from around the world in creating unforgettable moments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-display font-bold text-holographic mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your first room and invite friends to experience the magic of being together, anywhere.
            </p>
            <Button 
              variant="hero" 
              size="xl" 
              className="transform hover:scale-110 transition-all duration-300 glow-primary"
              onClick={() => window.location.href = '/music'}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
