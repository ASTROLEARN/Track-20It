import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Setup = lazy(() => import("./pages/Setup"));
const Streaks = lazy(() => import("./pages/Streaks"));
const Teacher = lazy(() => import("./pages/Teacher"));
const Notifications = lazy(() => import("./pages/Notifications"));

// New pages for enhanced functionality
const AttendanceScreen = lazy(() => import("./pages/AttendanceScreen"));
const QRGenerator = lazy(() => import("./pages/QRGenerator"));
const BluetoothSetup = lazy(() => import("./pages/BluetoothSetup"));
const WifiController = lazy(() => import("./pages/WifiController"));
const FaceRecognition = lazy(() => import("./pages/FaceRecognition"));
const FocusSessions = lazy(() => import("./pages/FocusSessions"));
const DemoMode = lazy(() => import("./pages/DemoMode"));

import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { ScheduleProvider } from "@/store/schedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ScheduleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Suspense
                fallback={
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading…
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/streaks" element={<Streaks />} />
                  <Route path="/teacher" element={<Teacher />} />
                  <Route path="/notifications" element={<Notifications />} />
                  
                  {/* New enhanced pages */}
                  <Route path="/attendance-screen" element={<AttendanceScreen />} />
                  <Route path="/qr-generator" element={<QRGenerator />} />
                  <Route path="/bluetooth-setup" element={<BluetoothSetup />} />
                  <Route path="/wifi-controller" element={<WifiController />} />
                  <Route path="/face-recognition" element={<FaceRecognition />} />
                  <Route path="/focus-sessions" element={<FocusSessions />} />
                  <Route path="/demo-mode" element={<DemoMode />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </ScheduleProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

import { registerSW } from "@/pwa";

createRoot(document.getElementById("root")!).render(<App />);
registerSW();