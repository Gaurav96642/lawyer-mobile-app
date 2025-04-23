
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Clock, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getLawyerAvailability, createLawyerAvailability } from "@/services/lawyerService";
import { LawyerAvailabilityType } from "@/lib/supabase";

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const LawyerAvailability = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [availabilities, setAvailabilities] = useState<LawyerAvailabilityType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // New availability form state
  const [dayOfWeek, setDayOfWeek] = useState("1"); // Default to Monday
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [isRecurring, setIsRecurring] = useState(true);
  const [specificDate, setSpecificDate] = useState("");
  
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await getLawyerAvailability(user.id);
        
        if (error) throw error;
        
        setAvailabilities(data || []);
      } catch (err: any) {
        setError(err);
        toast({
          title: "Error",
          description: "Failed to load availability slots",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [user]);
  
  const handleAddAvailability = async () => {
    if (!user?.id) return;
    
    try {
      // Form validation
      if (!isRecurring && !specificDate) {
        toast({
          title: "Validation Error",
          description: "Please select a specific date",
          variant: "destructive",
        });
        return;
      }
      
      // Check if end time is after start time
      if (startTime >= endTime) {
        toast({
          title: "Validation Error",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
      
      const newAvailability = {
        lawyer_id: user.id,
        day_of_week: parseInt(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
        is_recurring: isRecurring,
        specific_date: isRecurring ? null : specificDate,
      };
      
      const { data, error } = await createLawyerAvailability(newAvailability);
      
      if (error) throw error;
      
      // Add to local state
      setAvailabilities([...availabilities, data]);
      
      toast({
        title: "Success",
        description: "New availability slot added",
      });
      
      // Reset form
      setStartTime("09:00");
      setEndTime("17:00");
      setIsRecurring(true);
      setSpecificDate("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add availability",
        variant: "destructive",
      });
    }
  };
  
  const getDayName = (dayNum: number) => {
    return DAYS_OF_WEEK.find(day => parseInt(day.value) === dayNum)?.label || "Unknown";
  };
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-legal-dark">Your Availability</h1>
          <p className="text-gray-500">Set when you're available for consultations</p>
        </div>
        <Button 
          onClick={() => navigate('/lawyer-dashboard')} 
          variant="outline"
          className="mt-4 md:mt-0"
        >
          Back to Dashboard
        </Button>
      </div>

      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Availability</CardTitle>
              <CardDescription>
                These are the times you've set as available for client consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-legal-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <p className="text-red-500">Failed to load availability</p>
                </div>
              ) : availabilities.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">You haven't set any availability yet</p>
                  <p className="text-sm mt-2">Use the form to add your available time slots</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availabilities.map((slot) => (
                    <div key={slot.id} className="flex justify-between items-center border p-4 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          {slot.is_recurring ? (
                            <Calendar className="h-4 w-4 mr-2 text-legal-primary" />
                          ) : (
                            <Clock className="h-4 w-4 mr-2 text-legal-primary" />
                          )}
                          <span className="font-medium">
                            {slot.is_recurring 
                              ? `Every ${getDayName(slot.day_of_week)}`
                              : new Date(slot.specific_date!).toLocaleDateString()
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Add New Availability</CardTitle>
              <CardDescription>Set when you're available to meet with clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is-recurring">Recurring schedule</Label>
                  <Switch 
                    id="is-recurring" 
                    checked={isRecurring} 
                    onCheckedChange={setIsRecurring} 
                  />
                </div>
                
                {isRecurring ? (
                  <div className="space-y-2">
                    <Label htmlFor="day-select">Day of week</Label>
                    <Select 
                      value={dayOfWeek} 
                      onValueChange={setDayOfWeek}
                    >
                      <SelectTrigger id="day-select">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="specific-date">Specific date</Label>
                    <Input
                      id="specific-date"
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddAvailability} 
                  className="w-full bg-legal-primary hover:bg-legal-secondary"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerAvailability;
