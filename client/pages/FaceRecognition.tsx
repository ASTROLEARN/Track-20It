import { useState, useRef, useEffect } from "react";
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
  ScanFace,
  Camera,
  Users,
  UserPlus,
  UserCheck,
  Shield,
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnrolledStudent {
  id: string;
  name: string;
  studentId: string;
  enrollmentDate: string;
  lastSeen?: string;
  confidence?: number;
  imageCount: number;
  status: "enrolled" | "pending" | "verified";
}

export default function FaceRecognition() {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: "", studentId: "" });
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([
    {
      id: "1",
      name: "Alex Johnson",
      studentId: "ENG001",
      enrollmentDate: "2024-01-15",
      lastSeen: "2 hours ago",
      confidence: 96.5,
      imageCount: 15,
      status: "verified"
    },
    {
      id: "2", 
      name: "Maria Garcia",
      studentId: "ENG002",
      enrollmentDate: "2024-01-15",
      lastSeen: "5 minutes ago",
      confidence: 98.2,
      imageCount: 12,
      status: "verified"
    }
  ]);
  const [recognitionResults, setRecognitionResults] = useState<Array<{
    id: string;
    name: string;
    confidence: number;
    timestamp: string;
  }>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate camera feed
  useEffect(() => {
    if (isEnrolling || isRecognizing) {
      // In a real implementation, this would start the camera
      console.log("Camera would be activated");
    }
  }, [isEnrolling, isRecognizing]);

  // Simulate enrollment process
  useEffect(() => {
    if (!isEnrolling) return;

    const timeout = setTimeout(() => {
      if (currentStudent.name && currentStudent.studentId) {
        const newStudent: EnrolledStudent = {
          id: Date.now().toString(),
          name: currentStudent.name,
          studentId: currentStudent.studentId,
          enrollmentDate: new Date().toISOString().split('T')[0],
          imageCount: 10 + Math.floor(Math.random() * 10),
          status: "enrolled"
        };
        
        setEnrolledStudents(prev => [...prev, newStudent]);
        setCurrentStudent({ name: "", studentId: "" });
        setIsEnrolling(false);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isEnrolling, currentStudent]);

  // Simulate recognition process
  useEffect(() => {
    if (!isRecognizing) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomStudent = enrolledStudents[Math.floor(Math.random() * enrolledStudents.length)];
        if (randomStudent) {
          const result = {
            id: Date.now().toString(),
            name: randomStudent.name,
            confidence: 90 + Math.random() * 10,
            timestamp: new Date().toLocaleTimeString()
          };
          
          setRecognitionResults(prev => [result, ...prev].slice(0, 5));
          
          // Update student last seen
          setEnrolledStudents(prev => prev.map(student =>
            student.id === randomStudent.id
              ? { ...student, lastSeen: "Just now", confidence: result.confidence }
              : student
          ));
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isRecognizing, enrolledStudents]);

  const startEnrollment = () => {
    if (!currentStudent.name || !currentStudent.studentId) return;
    setIsEnrolling(true);
  };

  const toggleRecognition = () => {
    setIsRecognizing(!isRecognizing);
    if (isRecognizing) {
      setRecognitionResults([]);
    }
  };

  const removeStudent = (id: string) => {
    setEnrolledStudents(prev => prev.filter(student => student.id !== id));
  };

  const CameraView = () => (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {isEnrolling || isRecognizing ? (
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-white text-center"
          >
            <ScanFace className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">
              {isEnrolling ? "Position face in center" : "Scanning for faces..."}
            </p>
          </motion.div>
        ) : (
          <div className="text-gray-400 text-center">
            <Camera className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Camera inactive</p>
          </div>
        )}
      </div>
      
      {/* Face detection overlay */}
      {(isEnrolling || isRecognizing) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ 
                borderColor: ["#3b82f6", "#10b981", "#3b82f6"] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
              className="w-48 h-48 border-4 rounded-lg border-blue-500"
            />
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Face Recognition</h1>
          <p className="text-muted-foreground">Enroll and verify students using facial recognition</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera and Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Camera View
              </CardTitle>
              <CardDescription>Live camera feed for face recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <CameraView />
              
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={toggleRecognition}
                  className="flex-1"
                  variant={isRecognizing ? "destructive" : "default"}
                >
                  {isRecognizing ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Stop Recognition
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Start Recognition
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isEnrolling || isRecognizing}
                >
                  <Shield className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Student Enrollment
              </CardTitle>
              <CardDescription>Add new students to the face recognition database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input
                    id="student-name"
                    value={currentStudent.name}
                    onChange={(e) => setCurrentStudent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Alex Johnson"
                    disabled={isEnrolling}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input
                    id="student-id"
                    value={currentStudent.studentId}
                    onChange={(e) => setCurrentStudent(prev => ({ ...prev, studentId: e.target.value }))}
                    placeholder="ENG001"
                    disabled={isEnrolling}
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={startEnrollment}
                  className="w-full"
                  disabled={isEnrolling || !currentStudent.name || !currentStudent.studentId || isRecognizing}
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Start Enrollment
                    </>
                  )}
                </Button>
              </motion.div>

              {isEnrolling && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 text-blue-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Capturing facial features...</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Students and Results */}
        <div className="space-y-6">
          {/* Recognition Results */}
          {isRecognizing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Recognition Results
                </CardTitle>
                <CardDescription>Live recognition feed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {recognitionResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-2 border rounded-lg bg-green-50 border-green-200"
                      >
                        <div>
                          <p className="font-medium text-green-900">{result.name}</p>
                          <p className="text-xs text-green-700">{result.timestamp}</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {result.confidence.toFixed(1)}%
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {recognitionResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No faces recognized yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enrolled Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Enrolled Students ({enrolledStudents.length})
              </CardTitle>
              <CardDescription>Students registered in the face recognition system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrolledStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{student.name}</h3>
                          <Badge 
                            variant={student.status === "verified" ? "default" : 
                                   student.status === "enrolled" ? "secondary" : "outline"}
                          >
                            {student.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>ID: {student.studentId}</div>
                          <div>Enrolled: {student.enrollmentDate}</div>
                          {student.lastSeen && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              Last seen: {student.lastSeen}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            Images: {student.imageCount}
                          </span>
                          {student.confidence && (
                            <span className="font-medium text-green-600">
                              {student.confidence.toFixed(1)}% confidence
                            </span>
                          )}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeStudent(student.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}

                {enrolledStudents.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <ScanFace className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students enrolled yet.</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>All biometric data is encrypted and stored securely</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Students can request data deletion at any time</span>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>System complies with privacy regulations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}