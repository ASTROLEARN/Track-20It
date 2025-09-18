import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Users,
  QrCode,
  Bluetooth,
  Wifi,
  ScanFace,
  CheckCircle2,
  Clock,
  BookOpen,
  Monitor,
  Sparkles,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  component: "attendance" | "qr" | "bluetooth" | "wifi" | "face" | "dashboard";
  duration: number;
  icon: any;
}

interface DemoData {
  students: Array<{
    id: string;
    name: string;
    status: "present" | "absent" | "pending";
  }>;
  attendanceMethod: string;
  currentStep: number;
}

export default function DemoMode() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [demoData, setDemoData] = useState<DemoData>({
    students: [
      { id: "1", name: "Alex Johnson", status: "pending" },
      { id: "2", name: "Maria Garcia", status: "pending" },
      { id: "3", name: "Chen Wei", status: "pending" },
      { id: "4", name: "Priya Patel", status: "pending" },
      { id: "5", name: "James Smith", status: "pending" },
    ],
    attendanceMethod: "QR Code",
    currentStep: 0
  });

  const demoSteps: DemoStep[] = [
    {
      id: "welcome",
      title: "Welcome to Track it",
      description: "Interactive demo of smart attendance tracking system",
      component: "dashboard", 
      duration: 3,
      icon: Sparkles
    },
    {
      id: "qr-setup",
      title: "QR Code Generation",
      description: "Generate secure, time-bound QR codes for attendance",
      component: "qr",
      duration: 4,
      icon: QrCode
    },
    {
      id: "bluetooth-config",
      title: "Bluetooth Proximity",
      description: "Configure Bluetooth beacons for automatic detection",
      component: "bluetooth", 
      duration: 4,
      icon: Bluetooth
    },
    {
      id: "wifi-setup",
      title: "WiFi Controller",
      description: "Set up WiFi-based attendance tracking network",
      component: "wifi",
      duration: 4,
      icon: Wifi
    },
    {
      id: "face-recognition", 
      title: "Face Recognition",
      description: "Enroll students and verify using facial recognition",
      component: "face",
      duration: 5,
      icon: ScanFace
    },
    {
      id: "live-attendance",
      title: "Live Attendance Tracking",
      description: "Real-time attendance monitoring and analytics",
      component: "attendance",
      duration: 6,
      icon: Users
    }
  ];

  const currentStep = demoSteps[currentStepIndex];

  // Demo progress timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && currentStepIndex < demoSteps.length) {
      interval = setInterval(() => {
        setStepProgress(prev => {
          if (prev >= 100) {
            // Move to next step
            if (currentStepIndex < demoSteps.length - 1) {
              setCurrentStepIndex(curr => curr + 1);
              return 0;
            } else {
              // Demo finished
              setIsRunning(false);
              return 100;
            }
          }
          return prev + (100 / (currentStep.duration * 10)); // 100ms intervals
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentStepIndex, currentStep.duration, demoSteps.length]);

  // Simulate data changes during demo
  useEffect(() => {
    if (!isRunning) return;

    const dataInterval = setInterval(() => {
      setDemoData(prev => {
        const newData = { ...prev };
        
        // Simulate students checking in
        const pendingStudents = newData.students.filter(s => s.status === "pending");
        if (pendingStudents.length > 0 && Math.random() > 0.7) {
          const randomStudent = pendingStudents[Math.floor(Math.random() * pendingStudents.length)];
          newData.students = newData.students.map(s => 
            s.id === randomStudent.id 
              ? { ...s, status: Math.random() > 0.9 ? "absent" : "present" }
              : s
          );
        }

        // Update attendance method based on step
        switch (currentStep.component) {
          case "qr":
            newData.attendanceMethod = "QR Code";
            break;
          case "bluetooth":
            newData.attendanceMethod = "Bluetooth Beacon";
            break;
          case "wifi":
            newData.attendanceMethod = "WiFi Proximity";
            break;
          case "face":
            newData.attendanceMethod = "Face Recognition";
            break;
        }

        newData.currentStep = currentStepIndex;
        return newData;
      });
    }, 2000);

    return () => clearInterval(dataInterval);
  }, [isRunning, currentStepIndex, currentStep.component]);

  const startDemo = () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setStepProgress(0);
    // Reset demo data
    setDemoData({
      students: [
        { id: "1", name: "Alex Johnson", status: "pending" },
        { id: "2", name: "Maria Garcia", status: "pending" },
        { id: "3", name: "Chen Wei", status: "pending" },
        { id: "4", name: "Priya Patel", status: "pending" },
        { id: "5", name: "James Smith", status: "pending" },
      ],
      attendanceMethod: "QR Code",
      currentStep: 0
    });
  };

  const pauseDemo = () => {
    setIsRunning(!isRunning);
  };

  const nextStep = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
      setStepProgress(0);
    }
  };

  const resetDemo = () => {
    setIsRunning(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
  };

  const DemoContent = () => {
    switch (currentStep.component) {
      case "dashboard":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-16 w-16 mx-auto text-primary mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold">Welcome to Track it</h2>
              <p className="text-muted-foreground">Smart attendance tracking made simple</p>
            </div>
          </div>
        );

      case "qr":
        return (
          <div className="space-y-4">
            <div className="flex justify-center">
              <motion.div 
                className="border-4 border-primary rounded-2xl p-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                  borderColor: ["#3b82f6", "#10b981", "#3b82f6"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <QrCode className="h-24 w-24" />
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Generating Secure QR Code</h3>
              <p className="text-sm text-muted-foreground">Time-bound • Session-specific • Anti-proxy</p>
            </div>
          </div>
        );

      case "bluetooth":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="text-center p-3 border rounded-lg"
                  animate={{ 
                    backgroundColor: ["#f8fafc", "#dbeafe", "#f8fafc"] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                >
                  <Bluetooth className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs">Beacon {i}</p>
                  <p className="text-xs text-green-600">Connected</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Bluetooth Beacons Active</h3>
              <p className="text-sm text-muted-foreground">Proximity detection • 10m range</p>
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Wifi className="h-16 w-16 mx-auto text-green-500 mb-4" />
              </motion.div>
              <h3 className="font-semibold">WiFi Network Active</h3>
              <p className="text-sm text-muted-foreground">TrackIt_Attendance_A2</p>
              <Badge variant="outline" className="mt-2">
                {demoData.students.filter(s => s.status !== "pending").length} devices connected
              </Badge>
            </div>
          </div>
        );

      case "face":
        return (
          <div className="space-y-4">
            <div className="relative">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white text-center"
                >
                  <ScanFace className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Scanning for faces...</p>
                </motion.div>
              </div>
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  borderColor: ["#3b82f6", "#10b981", "#3b82f6"] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-32 h-32 border-4 rounded-lg border-blue-500" />
              </motion.div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Face Recognition Active</h3>
              <p className="text-sm text-muted-foreground">
                {demoData.students.filter(s => s.status === "present").length} students verified
              </p>
            </div>
          </div>
        );

      case "attendance":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {demoData.students.filter(s => s.status === "present").length}
                </p>
                <p className="text-xs text-green-700">Present</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {demoData.students.filter(s => s.status === "absent").length}
                </p>
                <p className="text-xs text-red-700">Absent</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {demoData.students.filter(s => s.status === "pending").length}
                </p>
                <p className="text-xs text-yellow-700">Pending</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-center">Live Attendance Feed</h3>
              {demoData.students.map((student, i) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "flex items-center justify-between p-2 rounded border",
                    student.status === "present" && "bg-green-50 border-green-200",
                    student.status === "absent" && "bg-red-50 border-red-200",
                    student.status === "pending" && "bg-gray-50 border-gray-200"
                  )}
                >
                  <span className="text-sm">{student.name}</span>
                  <Badge 
                    variant={
                      student.status === "present" ? "default" : 
                      student.status === "absent" ? "destructive" : 
                      "secondary"
                    }
                  >
                    {student.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Interactive Demo</h1>
          <p className="text-muted-foreground">Experience all Track it features in action</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Demo Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <currentStep.icon className="h-5 w-5 text-primary" />
                  {currentStep.title}
                </CardTitle>
                <CardDescription>{currentStep.description}</CardDescription>
              </div>
              <Badge variant="outline">
                Step {currentStepIndex + 1} of {demoSteps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(stepProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-gradient-to-r from-primary to-purple-500"
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            <div className="min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <DemoContent />
                </motion.div>
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Controls & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Demo Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    onClick={isRunning ? pauseDemo : startDemo}
                    className="w-full"
                    size="lg"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {currentStepIndex === 0 && stepProgress === 0 ? "Start Demo" : "Resume"}
                      </>
                    )}
                  </Button>
                </motion.div>
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={nextStep}
                variant="outline"
                className="w-full"
                disabled={currentStepIndex >= demoSteps.length - 1}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Next Step
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Demo Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded transition-colors",
                      index === currentStepIndex && "bg-primary/10 border border-primary/20",
                      index < currentStepIndex && "opacity-60"
                    )}
                  >
                    <div className={cn(
                      "p-1 rounded",
                      index === currentStepIndex && "bg-primary text-white",
                      index < currentStepIndex && "bg-green-500 text-white",
                      index > currentStepIndex && "bg-muted"
                    )}>
                      {index < currentStepIndex ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.duration}s</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Attendance Method:</span>
                <Badge variant="outline">{demoData.attendanceMethod}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Students Present:</span>
                <span className="font-medium text-green-600">
                  {demoData.students.filter(s => s.status === "present").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Demo Status:</span>
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? "Running" : "Paused"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}