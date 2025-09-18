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
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  QrCode, 
  Download,
  RefreshCw,
  Timer,
  Shield,
  Copy,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function QRGenerator() {
  const [sessionCode, setSessionCode] = useState("ENG101-A2");
  const [duration, setDuration] = useState(50);
  const [qrData, setQrData] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate QR data
  useEffect(() => {
    const generateQRData = () => {
      const timestamp = Date.now();
      const expiryTime = timestamp + (duration * 60 * 1000);
      return JSON.stringify({
        sessionCode,
        timestamp,
        expiryTime,
        securityToken: Math.random().toString(36).substr(2, 9)
      });
    };
    
    setQrData(generateQRData());
  }, [sessionCode, duration]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Regenerate QR when expired
      setQrData(JSON.stringify({
        sessionCode,
        timestamp: Date.now(),
        expiryTime: Date.now() + (duration * 60 * 1000),
        securityToken: Math.random().toString(36).substr(2, 9)
      }));
      setTimeLeft(duration * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionCode, duration]);

  const startSession = () => {
    setIsActive(true);
    setTimeLeft(duration * 60);
  };

  const regenerateQR = () => {
    const timestamp = Date.now();
    const expiryTime = timestamp + (duration * 60 * 1000);
    setQrData(JSON.stringify({
      sessionCode,
      timestamp,
      expiryTime,
      securityToken: Math.random().toString(36).substr(2, 9)
    }));
    if (isActive) {
      setTimeLeft(duration * 60);
    }
  };

  const copyQRData = async () => {
    await navigator.clipboard.writeText(qrData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Create a visual QR representation (placeholder)
  const QRVisualization = () => {
    const gridSize = 21;
    const pattern = Array.from({ length: gridSize * gridSize }, (_, i) => {
      // Create a deterministic pattern based on QR data
      const hash = qrData.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return (hash + i) % 3 === 0;
    });

    return (
      <div className="grid grid-cols-21 gap-[1px] p-4 bg-white rounded-lg">
        {pattern.map((filled, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square",
              filled ? "bg-black" : "bg-white"
            )}
          />
        ))}
      </div>
    );
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
          <h1 className="text-2xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-muted-foreground">Generate secure, time-bound QR codes for attendance</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* QR Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Session QR Code
              </span>
              {isActive && (
                <motion.div 
                  className="flex items-center gap-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Active
                </motion.div>
              )}
            </CardTitle>
            <CardDescription>Scan to mark attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div 
              className="flex justify-center"
              animate={{ 
                rotate: isActive ? [0, 1, 0] : 0,
                scale: isActive ? [1, 1.02, 1] : 1
              }}
              transition={{ 
                duration: 3, 
                repeat: isActive ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <div className={cn(
                  "border-4 rounded-2xl p-4 transition-all duration-500",
                  isActive 
                    ? "border-green-500 shadow-lg shadow-green-500/25" 
                    : "border-muted"
                )}>
                  <QRVisualization />
                </div>
                {timeLeft > 0 && timeLeft < 300 && isActive && (
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {formatTime(timeLeft)}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session:</span>
                <span className="font-mono font-medium">{sessionCode}</span>
              </div>
              
              {isActive && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time remaining:</span>
                  <span className={cn(
                    "font-mono font-bold",
                    timeLeft < 300 ? "text-red-600" : "text-green-600"
                  )}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={copyQRData}
                  variant="outline" 
                  className="flex-1"
                  size="sm"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Data"}
                </Button>
                <Button 
                  onClick={regenerateQR}
                  variant="outline" 
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Session Settings
              </CardTitle>
              <CardDescription>Configure your attendance session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-code">Session Code</Label>
                <Input
                  id="session-code"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  placeholder="ENG101-A2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="5"
                  max="180"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={startSession}
                  className="w-full"
                  size="lg"
                  disabled={isActive}
                >
                  {isActive ? "Session Active" : "Start Session"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Time-bound validity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Unique security tokens</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Session-specific encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Anti-proxy measures</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Link to="/attendance-screen">
                  <Button variant="outline" size="sm" className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    Live View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}