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
        
        {/* Hero Section - Clean & Modern */}
        <div className="relative min-h-screen flex items-center justify-center">
          {/* Subtle Background Elements */}
          <FloatingElements />
          
          {/* Main Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Clean Status Badge */}
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">50K+ Students Connected</span>
              </div>

              {/* Clean Main Heading */}
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                <span className="text-white">Connect.</span>
                <br />
                <span className="bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                  Create.
                </span>
                <br />
                <span className="text-white">Collaborate.</span>
              </h1>

              {/* Simple Tagline */}
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Your digital space to hang out, stream music, watch movies, and chat with friends.
              </p>

              {/* Clean CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-neon-cyan to-neon-pink hover:opacity-90 
                           text-white font-semibold px-8 py-3 rounded-xl 
                           transition-all duration-300 border-0"
                  onClick={() => window.location.href = "/music"}
                >
                  <Music className="h-5 w-5 mr-2" />
                  Start Music Room
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-neon-green text-neon-green hover:bg-neon-green 
                           hover:text-black font-semibold px-8 py-3 rounded-xl 
                           transition-all duration-300 backdrop-blur-sm"
                  onClick={() => window.location.href = "/video"}
                >
                  <Video className="h-5 w-5 mr-2" />
                  Watch Together
                </Button>
              </div>

              {/* Clean Feature Pills */}
              <div className="flex flex-wrap justify-center gap-3 pt-8">
                <span className="text-sm text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                  Real-time Chat
                </span>
                <span className="text-sm text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                  HD Streaming
                </span>
                <span className="text-sm text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2">
                  Private Rooms
                </span>
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
