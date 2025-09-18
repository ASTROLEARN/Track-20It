import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  QrCode, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Bluetooth,
  Wifi,
  ScanFace,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Student {
  id: number;
  name: string;
  status: "present" | "absent" | "pending";
  timestamp?: string;
}

export default function AttendanceScreen() {
  const [activeMethod, setActiveMethod] = useState<"qr" | "bluetooth" | "wifi" | "face">("qr");
  const [isScanning, setIsScanning] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alex Johnson", status: "pending" },
    { id: 2, name: "Maria Garcia", status: "pending" },
    { id: 3, name: "Chen Wei", status: "pending" },
    { id: 4, name: "Priya Patel", status: "pending" },
    { id: 5, name: "James Smith", status: "pending" },
  ]);

  // Simulate attendance marking
  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setStudents(prev => {
        const pending = prev.filter(s => s.status === "pending");
        if (pending.length === 0) {
          setIsScanning(false);
          return prev;
        }
        
        const randomStudent = pending[Math.floor(Math.random() * pending.length)];
        return prev.map(s => 
          s.id === randomStudent.id 
            ? { 
                ...s, 
                status: Math.random() > 0.1 ? "present" : "absent" as const,
                timestamp: new Date().toLocaleTimeString()
              }
            : s
        );
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning]);

  const presentCount = students.filter(s => s.status === "present").length;
  const absentCount = students.filter(s => s.status === "absent").length;
  const pendingCount = students.filter(s => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Attendance</h1>
            <p className="text-muted-foreground">ENG-101 • Room A2 • Active Session</p>
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-2 text-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Session Active
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{presentCount + absentCount + pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Attendance Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Attendance Methods
            </CardTitle>
            <CardDescription>Choose your preferred attendance tracking method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "qr", icon: QrCode, label: "QR Code" },
                { key: "bluetooth", icon: Bluetooth, label: "Bluetooth" },
                { key: "wifi", icon: Wifi, label: "Wi-Fi" },
                { key: "face", icon: ScanFace, label: "Face ID" },
              ].map(({ key, icon: Icon, label }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveMethod(key as any)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    activeMethod === key
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-muted hover:border-primary/50"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={false}
              animate={{ 
                backgroundColor: isScanning 
                  ? "hsl(var(--primary))" 
                  : "hsl(var(--secondary))" 
              }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                onClick={() => setIsScanning(!isScanning)}
                className="w-full"
                size="lg"
              >
                {isScanning ? "Stop Scanning" : "Start Attendance"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Student List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <CardDescription>Real-time attendance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      student.status === "present" && "bg-green-50 border-green-200",
                      student.status === "absent" && "bg-red-50 border-red-200",
                      student.status === "pending" && "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-3 w-3 rounded-full",
                        student.status === "present" && "bg-green-500",
                        student.status === "absent" && "bg-red-500",
                        student.status === "pending" && "bg-gray-400 animate-pulse"
                      )} />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        {student.timestamp && (
                          <p className="text-xs text-muted-foreground">
                            Marked at {student.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.status === "present" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-green-600"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </motion.div>
                      )}
                      {student.status === "absent" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4" />
                        </motion.div>
                      )}
                      {student.status === "pending" && (
                        <div className="text-gray-500">
                          <Clock className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}