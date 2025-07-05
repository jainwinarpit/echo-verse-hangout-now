import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Text3D, Float } from '@react-three/drei';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Video, Users, MessageCircle, Sparkles, Zap, Globe } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  // 3D Scene Component
  const Scene3D = () => (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 32, 32]} position={[-2, 0, 0]}>
          <meshStandardMaterial color="#00D4FF" wireframe />
        </Sphere>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.8} floatIntensity={1.5}>
        <Box args={[1.5, 1.5, 1.5]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#FF0080" wireframe />
        </Box>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.7, 16, 16]} position={[0, 2, -1]}>
          <meshStandardMaterial color="#00FF88" />
        </Sphere>
      </Float>
      
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
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
        
        {/* Hero Section with 3D Elements */}
        <div className="relative min-h-screen flex items-center">
          {/* 3D Background */}
          <div className="absolute inset-0 opacity-30">
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center mt-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-display font-bold text-holographic mb-6 leading-tight">
                Hang Out
                <span className="block bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green bg-clip-text text-transparent">
                  Together
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of social connection. Listen to music, watch movies, 
                and vibe with friends in immersive virtual rooms. Distance means nothing when hearts connect.
              </p>
              
              {/* Quick action buttons */}
              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="group transform hover:scale-105 transition-all duration-300" 
                  onClick={() => window.location.href = '/music'}
                >
                  <Music className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Start Music Room
                </Button>
                <Button 
                  variant="neon" 
                  size="xl" 
                  className="group transform hover:scale-105 transition-all duration-300" 
                  onClick={() => window.location.href = '/video'}
                >
                  <Video className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Watch Together
                </Button>
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="group transform hover:scale-105 transition-all duration-300" 
                  onClick={() => window.location.href = '/messages'}
                >
                  <MessageCircle className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                  Chat Now
                </Button>
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
