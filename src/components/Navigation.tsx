import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Users, Music, Video, Send } from 'lucide-react';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: Users, label: 'Friends' },
    { id: 'music', icon: Music, label: 'Music' },
    { id: 'watch', icon: Video, label: 'Watch' },
    { id: 'chat', icon: Send, label: 'Chat' },
  ];

  return (
    <nav className="glass-card sticky top-0 z-40 p-4 m-4 rounded-2xl">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-display font-bold text-holographic">VIBE</span>
        </div>

        {/* Navigation items */}
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              className={`transition-smooth ${
                activeTab === item.id 
                  ? 'glow-primary bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
          </Button>
          
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="bg-secondary text-secondary-foreground">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden flex justify-center mt-4 space-x-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            className={`transition-smooth ${
              activeTab === item.id 
                ? 'glow-primary bg-primary text-primary-foreground' 
                : 'hover:bg-secondary'
            }`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;