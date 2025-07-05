import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RoomCreator from '@/components/RoomCreator';
import ActiveRooms from '@/components/ActiveRooms';
import { Plus, Activity, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeRooms: 12,
    totalUsers: 1247,
    newToday: 34
  });

  return (
    <div className="min-h-screen bg-cosmic">
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-holographic mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Create rooms, join friends, and manage your hangout experience
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-6 w-6 text-neon-cyan" />
              </div>
              <div className="text-2xl font-bold text-holographic">{stats.activeRooms}</div>
              <div className="text-sm text-muted-foreground">Active Rooms</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink/20 to-neon-pink/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-neon-pink" />
              </div>
              <div className="text-2xl font-bold text-holographic">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-green/20 to-neon-green/40 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-neon-green" />
              </div>
              <div className="text-2xl font-bold text-holographic">{stats.newToday}</div>
              <div className="text-sm text-muted-foreground">New Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Room Creator */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Room
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RoomCreator />
              </CardContent>
            </Card>
          </div>

          {/* Active Rooms */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Active Rooms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActiveRooms />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;