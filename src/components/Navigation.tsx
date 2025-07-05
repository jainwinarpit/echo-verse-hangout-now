import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  MessageCircle,
  Plus
} from 'lucide-react';

const Navigation = () => {
  const [notifications] = useState(3);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mx-4 mt-3">
      <div className="glass-card border border-white/10 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HH</span>
              </div>
              <h1 className="text-xl font-display font-bold text-holographic">
                HangoutHub
              </h1>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search friends, rooms..."
                  className="w-full px-6 py-3 glass rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 group-hover:bg-white/10"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-cyan/20 to-neon-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
            {/* Quick Create */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-white/10 transition-all duration-300 rounded-xl" 
              onClick={() => document.getElementById('room-creator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Plus className="h-5 w-5" />
            </Button>

            {/* Messages */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-white/10 transition-all duration-300 rounded-xl" 
              onClick={() => window.location.href = '/chat'}
            >
              <MessageCircle className="h-5 w-5" />
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-neon-pink glow-neon"
              >
                2
              </Badge>
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-white/10 transition-all duration-300 rounded-xl" 
              onClick={() => alert('Notifications feature coming soon!')}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-neon-cyan glow-neon"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl hover:bg-white/10 transition-all duration-300">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/50 hover:ring-primary transition-all duration-300">
                    <AvatarImage src="" alt={user?.email || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-pink text-white font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-green rounded-full border-2 border-background pulse-online"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-card border-white/10 mr-4" align="end" forceMount>
                <div className="flex items-center space-x-3 p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={user?.email || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-pink text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                      Online
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;