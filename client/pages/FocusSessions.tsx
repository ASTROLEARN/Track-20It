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
  RotateCcw,
  Clock,
  Brain,
  Book,
  Target,
  Coffee,
  CheckCircle2,
  Timer,
  Zap,
  Trophy,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FocusSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: "study" | "break" | "exercise" | "creative";
  icon: any;
  color: string;
}

interface SessionHistory {
  id: string;
  sessionId: string;
  title: string;
  completedAt: string;
  duration: number;
  rating?: number;
}

export default function FocusSessions() {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [streak, setStreak] = useState(5);
  const [totalMinutes, setTotalMinutes] = useState(127);
  
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([
    {
      id: "1",
      sessionId: "1",
      title: "Spaced Repetition",
      completedAt: "2 hours ago",
      duration: 10,
      rating: 5
    },
    {
      id: "2", 
      sessionId: "2",
      title: "Math Problem Solving",
      completedAt: "1 day ago",
      duration: 25,
      rating: 4
    }
  ]);

  const focusSessions: FocusSession[] = [
    {
      id: "1",
      title: "Spaced Repetition",
      description: "Review flashcards and concepts",
      duration: 10,
      category: "study",
      icon: Brain,
      color: "from-blue-500 to-purple-500"
    },
    {
      id: "2",
      title: "Deep Work Session", 
      description: "Focused study time",
      duration: 25,
      category: "study",
      icon: Book,
      color: "from-green-500 to-blue-500"
    },
    {
      id: "3",
      title: "Quick Review",
      description: "Review recent material",
      duration: 15,
      category: "study", 
      icon: Target,
      color: "from-yellow-500 to-orange-500"
    },
    {
      id: "4",
      title: "Active Break",
      description: "Short physical activity",
      duration: 5,
      category: "break",
      icon: Zap,
      color: "from-red-500 to-pink-500"
    },
    {
      id: "5",
      title: "Mindful Break",
      description: "Breathing and relaxation",
      duration: 10,
      category: "break",
      icon: Coffee,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            // Session completed
            setIsActive(false);
            setIsPaused(false);
            if (currentSession) {
              completeSession(currentSession);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft, currentSession]);

  const startSession = (session: FocusSession) => {
    setCurrentSession(session);
    setTimeLeft(session.duration * 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const resetSession = () => {
    if (currentSession) {
      setTimeLeft(currentSession.duration * 60);
      setIsActive(false);
      setIsPaused(false);
    }
  };

  const completeSession = (session: FocusSession) => {
    const newHistory: SessionHistory = {
      id: Date.now().toString(),
      sessionId: session.id,
      title: session.title,
      completedAt: "Just now",
      duration: session.duration,
      rating: 5
    };
    
    setSessionHistory(prev => [newHistory, ...prev]);
    setStreak(prev => prev + 1);
    setTotalMinutes(prev => prev + session.duration);
    setCurrentSession(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    const totalSeconds = currentSession.duration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
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
          <h1 className="text-2xl font-bold tracking-tight">Focus Sessions</h1>
          <p className="text-muted-foreground">Pomodoro-style focused study and break sessions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{streak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
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
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{totalMinutes}</p>
                  <p className="text-sm text-muted-foreground">Minutes Today</p>
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
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{sessionHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Session Timer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              {currentSession ? "Active Session" : "Session Timer"}
            </CardTitle>
            <CardDescription>
              {currentSession 
                ? `${currentSession.title} - ${currentSession.duration} minutes`
                : "Select a session to get started"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSession ? (
              <>
                <div className="text-center">
                  <motion.div
                    className="relative mx-auto w-48 h-48"
                    animate={{ 
                      scale: isActive && !isPaused ? [1, 1.02, 1] : 1
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isActive && !isPaused ? Infinity : 0 
                    }}
                  >
                    {/* Circular Progress */}
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={553}
                        animate={{
                          strokeDashoffset: 553 - (553 * getProgress()) / 100
                        }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </svg>
                    
                    {/* Timer Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div 
                        className="text-4xl font-bold"
                        animate={{ 
                          color: timeLeft < 60 ? "#ef4444" : "#000000"
                        }}
                      >
                        {formatTime(timeLeft)}
                      </motion.div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round(getProgress())}% complete
                      </p>
                    </div>
                  </motion.div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={pauseSession}
                    variant="outline"
                    className="flex-1"
                    disabled={!isActive}
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetSession}
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {timeLeft === 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-800">Session Complete!</p>
                    <p className="text-sm text-green-600">Great work on your focus session</p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Timer className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to focus?</p>
                <p className="text-sm">Choose a session type to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Session Types
            </CardTitle>
            <CardDescription>Choose your focus session duration and type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {focusSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      currentSession?.id === session.id && "ring-2 ring-primary"
                    )}
                    onClick={() => !isActive && startSession(session)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg bg-gradient-to-br text-white",
                            session.color
                          )}>
                            <session.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{session.duration}m</Badge>
                          <div className="text-xs text-muted-foreground mt-1 capitalize">
                            {session.category}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {isActive && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-700 text-center">
                  Session in progress - finish current session to start a new one
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Recent Sessions
          </CardTitle>
          <CardDescription>Your completed focus sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {sessionHistory.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.duration} minutes • {session.completedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < session.rating 
                                ? "text-yellow-500 fill-current" 
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <Badge variant="outline">{session.duration}m</Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sessionHistory.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed sessions yet. Start your first focus session!</p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}