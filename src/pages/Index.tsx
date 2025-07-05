import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import Preloader from '@/components/Preloader';
import Navigation from '@/components/Navigation';
import FriendsList from '@/components/FriendsList';
import RoomCreator from '@/components/RoomCreator';
import ActiveRooms from '@/components/ActiveRooms';
import { Button } from '@/components/ui/button';
import { Music, Video, Users, Play } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-cosmic">
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
        
        {/* Hero Section */}
        <div className="text-center py-8 px-4 mt-20">
          <h1 className="text-hero font-display font-bold text-holographic mb-4">
            Hang Out Together
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Listen to music, watch movies, and vibe with friends in virtual rooms. 
            Experience the feeling of being together, anywhere.
          </p>
          
          {/* Quick action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="hero" size="xl" className="group" onClick={() => document.getElementById('room-creator')?.scrollIntoView({ behavior: 'smooth' })}>
              <Music className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Start Music Room
            </Button>
            <Button variant="neon" size="xl" className="group" onClick={() => document.getElementById('room-creator')?.scrollIntoView({ behavior: 'smooth' })}>
              <Video className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Watch Together
            </Button>
            <Button variant="glass" size="xl" className="group" onClick={() => document.getElementById('active-rooms')?.scrollIntoView({ behavior: 'smooth' })}>
              <Users className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              Join Friends
            </Button>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Friends */}
            <div className="lg:col-span-1">
              <FriendsList />
            </div>

            {/* Center Column - Room Creator & Active Rooms */}
            <div className="lg:col-span-2 space-y-6">
              <div id="room-creator">
                <RoomCreator />
              </div>
              <div id="active-rooms">
                <ActiveRooms />
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for extra vibes */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button 
            variant="neon" 
            size="icon" 
            className="w-14 h-14 rounded-full shadow-2xl animate-pulse"
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
