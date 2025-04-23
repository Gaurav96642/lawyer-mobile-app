
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Lawyers from "./pages/Lawyers";
import Consultations from "./pages/Consultations";
import Profile from "./pages/Profile";
import ClientDashboard from "./pages/ClientDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import LawyerAvailability from "./pages/LawyerAvailability";
import VideoConsultation from "./pages/VideoConsultation";
import Messages from "./pages/Messages";
import Navigation from "./components/Navigation";
import AppHeader from "./components/AppHeader";
import { useMobilePlatform } from "./hooks/useMobilePlatform";
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { isVercel } from './lib/environment';

// Import these only when not on Vercel to avoid build issues
let SplashScreen: any = null;
let PushNotifications: any = null;
let useRegisterPushNotifications = () => {};

// Only import Capacitor plugins if we're not in a Vercel environment and in browser
if (typeof window !== 'undefined' && typeof window.Capacitor !== 'undefined' && !isVercel()) {
  // Dynamic imports to prevent Vercel build issues
  import('@capacitor/splash-screen').then(module => {
    SplashScreen = module.SplashScreen;
  }).catch(err => console.error('Error importing SplashScreen:', err));
  
  import('@capacitor/push-notifications').then(module => {
    PushNotifications = module.PushNotifications;
  }).catch(err => console.error('Error importing PushNotifications:', err));
  
  import('./hooks/useRegisterPushNotifications').then(module => {
    useRegisterPushNotifications = module.useRegisterPushNotifications;
  }).catch(err => console.error('Error importing useRegisterPushNotifications:', err));
}

const queryClient = new QueryClient();

const App = () => {
  const { isMobile, isNative } = useMobilePlatform();
  
  useEffect(() => {
    // Initialize Capacitor plugins when running on native platforms
    if (isNative && SplashScreen) {
      // Hide splash screen with a fade animation
      SplashScreen.hide({
        fadeOutDuration: 500
      });
    }
  }, [isNative]);
  
  // Only register push notifications in native environment
  if (isNative && typeof useRegisterPushNotifications === 'function') {
    useRegisterPushNotifications();
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className={`${isNative ? 'pt-safe-top pb-safe-bottom' : ''} min-h-screen flex flex-col`}>
              <AppHeader />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/lawyers" element={<Lawyers />} />
                  <Route 
                    path="/consultations" 
                    element={
                      
                        <Consultations />
                     
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      
                        <Profile />
                     
                    } 
                  />
                  <Route 
                    path="/client-dashboard" 
                    element={
                      
                        <ClientDashboard />
                     
                    } 
                  />
                  <Route 
                    path="/lawyer-dashboard" 
                    element={
                      
                        <LawyerDashboard />
                     
                    } 
                  />
                  <Route 
                    path="/availability" 
                    element={
                      
                        <LawyerAvailability />
                     
                    } 
                  />
                  <Route 
                    path="/consultation/:appointmentId" 
                    element={
                      
                        <VideoConsultation />
                     
                    } 
                  />
                  <Route 
                    path="/messages" 
                    element={
                      
                        <Messages />
                     
                    } 
                  />
                  <Route 
                    path="/consultations" 
                    element={
                      <ProtectedRoute>
                        <Consultations />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/client-dashboard" 
                    element={
                      <ProtectedRoute>
                        <ClientDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/lawyer-dashboard" 
                    element={
                      <ProtectedRoute>
                        <LawyerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/availability" 
                    element={
                      <ProtectedRoute>
                        <LawyerAvailability />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/consultation/:appointmentId" 
                    element={
                      <ProtectedRoute>
                        <VideoConsultation />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/messages" 
                    element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              {isMobile && <Navigation />}
            </div>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
