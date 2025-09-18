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
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Bluetooth,
  Plus,
  Trash2,
  Radio,
  Signal,
  MapPin,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Beacon {
  id: string;
  name: string;
  macAddress: string;
  signal: number;
  battery: number;
  status: "connected" | "disconnected" | "scanning";
  location: string;
}

export default function BluetoothSetup() {
  const [isScanning, setIsScanning] = useState(false);
  const [beacons, setBeacons] = useState<Beacon[]>([
    {
      id: "1",
      name: "Room A2 - Front",
      macAddress: "AA:BB:CC:DD:EE:01",
      signal: 85,
      battery: 92,
      status: "connected",
      location: "Front of classroom"
    },
    {
      id: "2", 
      name: "Room A2 - Back",
      macAddress: "AA:BB:CC:DD:EE:02",
      signal: 78,
      battery: 67,
      status: "connected",
      location: "Back of classroom"
    }
  ]);
  const [newBeacon, setNewBeacon] = useState({ name: "", location: "" });

  // Simulate beacon scanning
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setBeacons(prev => prev.map(beacon => ({
        ...beacon,
        signal: Math.max(30, beacon.signal + Math.random() * 10 - 5),
        battery: Math.max(0, beacon.battery - Math.random() * 0.1)
      })));
    }, 1000);

    // Simulate finding new beacons
    const findNewBeacon = setTimeout(() => {
      if (Math.random() > 0.7) {
        const newId = (beacons.length + 1).toString();
        setBeacons(prev => [...prev, {
          id: newId,
          name: `Beacon ${newId}`,
          macAddress: `AA:BB:CC:DD:EE:0${newId}`,
          signal: 60 + Math.random() * 30,
          battery: 80 + Math.random() * 20,
          status: "scanning",
          location: "Unknown"
        }]);
      }
      setIsScanning(false);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(findNewBeacon);
    };
  }, [isScanning, beacons.length]);

  const addBeacon = () => {
    if (!newBeacon.name) return;
    
    const beacon: Beacon = {
      id: Date.now().toString(),
      name: newBeacon.name,
      macAddress: `AA:BB:CC:DD:EE:${Math.random().toString(36).substr(2, 2).toUpperCase()}`,
      signal: 70 + Math.random() * 25,
      battery: 80 + Math.random() * 20,
      status: "connected",
      location: newBeacon.location || "Unknown"
    };
    
    setBeacons(prev => [...prev, beacon]);
    setNewBeacon({ name: "", location: "" });
  };

  const removeBeacon = (id: string) => {
    setBeacons(prev => prev.filter(beacon => beacon.id !== id));
  };

  const getSignalColor = (signal: number) => {
    if (signal > 75) return "text-green-600 bg-green-100";
    if (signal > 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-green-600";
    if (battery > 20) return "text-yellow-600";
    return "text-red-600";
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
          <h1 className="text-2xl font-bold tracking-tight">Bluetooth Setup</h1>
          <p className="text-muted-foreground">Configure Bluetooth beacons for proximity-based attendance</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Beacon Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-primary" />
                  Bluetooth Beacons
                </CardTitle>
                <CardDescription>Manage and configure your beacon network</CardDescription>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => setIsScanning(!isScanning)}
                  disabled={isScanning}
                  variant={isScanning ? "secondary" : "default"}
                >
                  {isScanning ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Scan for Beacons
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {beacons.map((beacon, index) => (
                  <motion.div
                    key={beacon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{beacon.name}</h3>
                          <Badge 
                            variant={beacon.status === "connected" ? "default" : 
                                   beacon.status === "scanning" ? "secondary" : "destructive"}
                          >
                            {beacon.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {beacon.location}
                          </div>
                          <div className="font-mono">{beacon.macAddress}</div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Signal className="h-4 w-4" />
                            <div className={cn(
                              "px-2 py-1 rounded text-xs font-medium",
                              getSignalColor(beacon.signal)
                            )}>
                              {beacon.signal.toFixed(0)}%
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "text-sm font-medium",
                              getBatteryColor(beacon.battery)
                            )}>
                              🔋 {beacon.battery.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeBeacon(beacon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Signal strength visualization */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={cn(
                          "h-2 rounded-full transition-all duration-1000",
                          beacon.signal > 75 ? "bg-green-500" :
                          beacon.signal > 50 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${beacon.signal}%` }}
                        animate={{ width: `${beacon.signal}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {beacons.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Bluetooth className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No beacons found. Click "Scan for Beacons" to discover devices.</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add New Beacon & Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Beacon
              </CardTitle>
              <CardDescription>Manually add a new beacon to your network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="beacon-name">Beacon Name</Label>
                <Input
                  id="beacon-name"
                  value={newBeacon.name}
                  onChange={(e) => setNewBeacon(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Room A2 - Door"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beacon-location">Location</Label>
                <Input
                  id="beacon-location"
                  value={newBeacon.location}
                  onChange={(e) => setNewBeacon(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Near classroom entrance"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={addBeacon}
                  className="w-full"
                  disabled={!newBeacon.name}
                >
                  Add Beacon
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Beacons</span>
                <Badge variant="outline">{beacons.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Connected</span>
                <Badge variant="default">
                  {beacons.filter(b => b.status === "connected").length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Coverage Range</span>
                <span className="text-sm text-muted-foreground">~10m radius</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Place beacons at classroom entrances</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Ensure 70%+ signal strength</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Replace batteries when below 20%</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span>Test range before class sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}