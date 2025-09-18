import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Wifi,
  WifiOff,
  Router,
  Lock,
  Unlock,
  Signal,
  Users,
  Activity,
  Settings,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NetworkDevice {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  signal: number;
  connected: boolean;
  lastSeen: string;
}

export default function WifiController() {
  const [isControllerActive, setIsControllerActive] = useState(true);
  const [networkName, setNetworkName] = useState("TrackIt_Attendance_A2");
  const [password, setPassword] = useState("SecureClass2024!");
  const [showPassword, setShowPassword] = useState(false);
  const [maxDevices, setMaxDevices] = useState(35);
  const [autoDisconnect, setAutoDisconnect] = useState(true);
  const [devices, setDevices] = useState<NetworkDevice[]>([
    {
      id: "1",
      name: "Alex's iPhone",
      macAddress: "AA:BB:CC:11:22:33",
      ipAddress: "192.168.1.101",
      signal: 85,
      connected: true,
      lastSeen: "Just now"
    },
    {
      id: "2",
      name: "Maria-MacBook",
      macAddress: "AA:BB:CC:44:55:66",
      ipAddress: "192.168.1.102",
      signal: 92,
      connected: true,
      lastSeen: "2 min ago"
    }
  ]);

  // Simulate device connections
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        signal: Math.max(30, device.signal + Math.random() * 10 - 5),
        lastSeen: device.connected ? "Just now" : device.lastSeen
      })));

      // Randomly add/remove devices
      if (Math.random() > 0.9 && devices.length < 8) {
        const newDevice: NetworkDevice = {
          id: Date.now().toString(),
          name: `Device-${Math.random().toString(36).substr(2, 4)}`,
          macAddress: `AA:BB:CC:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
          ipAddress: `192.168.1.${100 + Math.floor(Math.random() * 50)}`,
          signal: 60 + Math.random() * 35,
          connected: true,
          lastSeen: "Just now"
        };
        setDevices(prev => [...prev, newDevice]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [devices.length]);

  const connectedDevices = devices.filter(d => d.connected);
  const disconnectedDevices = devices.filter(d => !d.connected);

  const disconnectDevice = (id: string) => {
    setDevices(prev => prev.map(device => 
      device.id === id 
        ? { ...device, connected: false, lastSeen: "Just disconnected" }
        : device
    ));
  };

  const getSignalIcon = (signal: number) => {
    if (signal > 75) return <Signal className="h-4 w-4 text-green-500" />;
    if (signal > 50) return <Signal className="h-4 w-4 text-yellow-500" />;
    return <Signal className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WiFi Controller</h1>
          <p className="text-muted-foreground">Manage WiFi-based attendance tracking</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Network Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Router className="h-5 w-5 text-primary" />
              Network Configuration
            </CardTitle>
            <CardDescription>Configure your attendance WiFi network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="controller-active">Controller Status</Label>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    backgroundColor: isControllerActive ? "#10b981" : "#6b7280" 
                  }}
                  className="h-2 w-2 rounded-full"
                />
                <Switch
                  id="controller-active"
                  checked={isControllerActive}
                  onCheckedChange={setIsControllerActive}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network-name">Network Name (SSID)</Label>
              <Input
                id="network-name"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                disabled={!isControllerActive}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Network Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isControllerActive}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-devices">Max Devices</Label>
              <Input
                id="max-devices"
                type="number"
                value={maxDevices}
                onChange={(e) => setMaxDevices(Number(e.target.value))}
                min="10"
                max="100"
                disabled={!isControllerActive}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-disconnect">Auto-disconnect after class</Label>
              <Switch
                id="auto-disconnect"
                checked={autoDisconnect}
                onCheckedChange={setAutoDisconnect}
                disabled={!isControllerActive}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full"
                disabled={!isControllerActive}
              >
                <Settings className="h-4 w-4 mr-2" />
                Apply Settings
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Network Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Network Statistics
            </CardTitle>
            <CardDescription>Real-time network status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                <motion.div 
                  className="text-2xl font-bold text-green-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {connectedDevices.length}
                </motion.div>
                <div className="text-sm text-green-700">Connected</div>
              </div>
              
              <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{maxDevices}</div>
                <div className="text-sm text-blue-700">Max Capacity</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Usage</span>
                <span>{Math.round((connectedDevices.length / maxDevices) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                  style={{ width: `${(connectedDevices.length / maxDevices) * 100}%` }}
                  animate={{ width: `${(connectedDevices.length / maxDevices) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-3">
                {isControllerActive ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  Network {isControllerActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                {password ? (
                  <Lock className="h-4 w-4 text-blue-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {password ? "Password Protected" : "Open Network"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">WPA2 Encryption</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure network security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">MAC Address Filtering</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Session-based Access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Automatic Disconnection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm">Traffic Monitoring</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              Advanced Security
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Connected Devices ({connectedDevices.length})
          </CardTitle>
          <CardDescription>Devices currently connected to the attendance network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{device.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="font-mono">{device.macAddress}</div>
                      <div>{device.ipAddress}</div>
                      <div>{device.lastSeen}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(device.signal)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectDevice(device.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {connectedDevices.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <Wifi className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No devices currently connected to the network.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}