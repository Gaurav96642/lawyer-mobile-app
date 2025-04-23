
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createVideoSession, joinVideoSession } from '@/services/videoService';
import { useAppointments } from '@/hooks/useAppointments';

const VideoConsultation = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { user, profile, isLawyer } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  
  // Video call controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // References for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // Get appointment data
  const { appointments } = useAppointments();
  
  useEffect(() => {
    if (!appointmentId || !user?.id || !appointments) return;
    
    // Find the appointment in the appointments list
    const foundAppointment = appointments.find(appt => appt.id === appointmentId);
    
    if (foundAppointment) {
      setAppointment(foundAppointment);
      initializeVideoSession();
    } else {
      setError('Appointment not found');
      setLoading(false);
    }
  }, [appointmentId, user, appointments]);
  
  const initializeVideoSession = async () => {
    if (!appointmentId || !user?.id) return;
    
    try {
      setLoading(true);
      
      // For a lawyer, create the session if it doesn't exist
      if (isLawyer) {
        const { data, error } = await createVideoSession(appointmentId);
        if (error) throw error;
        setSessionData(data);
      }
      
      // For both lawyers and clients, join the session
      const { data, error } = await joinVideoSession(
        appointmentId, 
        user.id, 
        isLawyer ? 'lawyer' : 'client'
      );
      
      if (error) throw error;
      setSessionData(data);
      
      // In a real implementation, we would initialize the video call here
      // using the session data from Twilio or another video provider
      
      // For this mock implementation, we'll simulate connecting by showing the local video
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error initializing video session:', err);
      setError(err.message || 'Failed to initialize video session');
      setLoading(false);
      
      toast({
        title: 'Error',
        description: 'Could not connect to the video consultation',
        variant: 'destructive',
      });
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // In a real implementation, we would mute/unmute the actual media stream
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // Toggle the current state
      });
    }
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    // In a real implementation, we would enable/disable the actual video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled; // Toggle the current state
      });
    }
  };
  
  const endCall = () => {
    // In a real implementation, we would disconnect from the video service
    
    // Navigate back to the dashboard
    if (isLawyer) {
      navigate('/lawyer-dashboard');
    } else {
      navigate('/client-dashboard');
    }
    
    toast({
      title: 'Call Ended',
      description: 'You have left the consultation',
    });
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4" />
        <p>Connecting to consultation...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-red-500/20 p-4 rounded-lg mb-4">
          <p className="text-red-300">{error}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(isLawyer ? '/lawyer-dashboard' : '/client-dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  const otherParty = isLawyer ? appointment?.client : appointment?.lawyer;
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video (Full Screen) */}
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          {/* This would be the remote video in a real implementation */}
          <div className="text-center">
            <Users size={64} className="mx-auto mb-4 text-gray-500" />
            <p className="text-xl">Waiting for {otherParty?.first_name} to join...</p>
          </div>
        </div>
        
        {/* Local Video (Small Overlay) */}
        <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-black rounded-lg overflow-hidden border-2 border-white shadow-lg">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
          />
          {!isVideoEnabled && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <VideoOff size={24} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
        <Button 
          variant={isMuted ? "destructive" : "secondary"}
          size="icon" 
          className="rounded-full w-12 h-12" 
          onClick={toggleMute}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>
        
        <Button 
          variant={isVideoEnabled ? "secondary" : "destructive"}
          size="icon" 
          className="rounded-full w-12 h-12" 
          onClick={toggleVideo}
        >
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </Button>
        
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-full w-12 h-12 bg-red-500 hover:bg-red-600" 
          onClick={endCall}
        >
          <Phone className="rotate-135" />
        </Button>
        
        <Button 
          variant="secondary"
          size="icon" 
          className="rounded-full w-12 h-12" 
        >
          <MessageSquare />
        </Button>
      </div>
    </div>
  );
};

export default VideoConsultation;
