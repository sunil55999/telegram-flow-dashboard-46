
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pause, Play, Trash2, Smartphone, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

interface TelegramSession {
  id: string;
  name: string;
  phoneNumber: string;
  status: "connected" | "disconnected" | "paused";
  lastActive: string;
}

export default function Sessions() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<TelegramSession[]>([
    {
      id: "1",
      name: "Main Account",
      phoneNumber: "+1234567890",
      status: "connected",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Secondary Account",
      phoneNumber: "+1234567891",
      status: "connected",
      lastActive: "5 minutes ago",
    },
    {
      id: "3",
      name: "Backup Account",
      phoneNumber: "+1234567892",
      status: "paused",
      lastActive: "1 hour ago",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });

  const handleAddSession = () => {
    setFormData({ name: "", phoneNumber: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newSession: TelegramSession = {
      id: Date.now().toString(),
      ...formData,
      status: "disconnected",
      lastActive: "Never",
    };
    setSessions([...sessions, newSession]);
    setIsModalOpen(false);
    toast({
      title: "Session Added",
      description: `${formData.name} has been added successfully`,
    });
  };

  const handleToggleSession = (id: string) => {
    setSessions(sessions.map(session => 
      session.id === id 
        ? { 
            ...session, 
            status: session.status === "paused" ? "connected" : "paused",
            lastActive: session.status === "paused" ? "Just now" : session.lastActive
          }
        : session
    ));
    
    const session = sessions.find(s => s.id === id);
    toast({
      title: session?.status === "paused" ? "Session Resumed" : "Session Paused",
      description: `${session?.name} is now ${session?.status === "paused" ? "connected" : "paused"}`,
    });
  };

  const handleDeleteSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    setSessions(sessions.filter(session => session.id !== id));
    toast({
      title: "Session Deleted",
      description: `${session?.name} has been removed`,
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "connected":
        return { 
          color: "text-green-500", 
          bgColor: "bg-green-500", 
          label: "Connected",
          icon: Wifi
        };
      case "paused":
        return { 
          color: "text-yellow-500", 
          bgColor: "bg-yellow-500", 
          label: "Paused",
          icon: Pause
        };
      case "disconnected":
        return { 
          color: "text-red-500", 
          bgColor: "bg-red-500", 
          label: "Disconnected",
          icon: WifiOff
        };
      default:
        return { 
          color: "text-gray-500", 
          bgColor: "bg-gray-500", 
          label: "Unknown",
          icon: AlertCircle
        };
    }
  };

  const SessionCard = ({ session }: { session: TelegramSession }) => {
    const statusInfo = getStatusInfo(session.status);
    const StatusIcon = statusInfo.icon;
    
    return (
      <Card className="bg-card border-border">
        <CardContent className="mobile-card-padding">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base truncate">{session.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{session.phoneNumber}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}></div>
                <StatusIcon className="w-3 h-3" />
                <span className="text-xs text-muted-foreground">
                  {statusInfo.label} • {session.lastActive}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
              <Badge 
                variant={session.status === "connected" ? "default" : "secondary"}
                className="text-xs"
              >
                {session.status}
              </Badge>
              
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleSession(session.id)}
                  disabled={session.status === "disconnected"}
                  className="h-8 w-8 p-0"
                >
                  {session.status === "paused" ? (
                    <Play className="w-3 h-3" />
                  ) : (
                    <Pause className="w-3 h-3" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSession(session.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mobile-flex-stack items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Telegram Sessions</h1>
          <p className="text-muted-foreground mobile-text-size">
            Manage your telegram account sessions for forwarding
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSession} className="mobile-button-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>Add New Session</DialogTitle>
            </DialogHeader>
            <div className="mobile-form-spacing py-4">
              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name</Label>
                <Input
                  id="sessionName"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter a descriptive name"
                  className="bg-input border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-input border-border"
                />
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p>You'll be asked to enter the verification code sent to this number.</p>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="mobile-button-full">
                Cancel
              </Button>
              <Button onClick={handleSave} className="mobile-button-full">
                Add Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Session Stats */}
      {isMobile && (
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-card border-border">
            <CardContent className="mobile-card-padding text-center">
              <div className="text-lg font-bold text-green-500">
                {sessions.filter(s => s.status === "connected").length}
              </div>
              <div className="text-xs text-muted-foreground">Connected</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="mobile-card-padding text-center">
              <div className="text-lg font-bold text-yellow-500">
                {sessions.filter(s => s.status === "paused").length}
              </div>
              <div className="text-xs text-muted-foreground">Paused</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="mobile-card-padding text-center">
              <div className="text-lg font-bold text-red-500">
                {sessions.filter(s => s.status === "disconnected").length}
              </div>
              <div className="text-xs text-muted-foreground">Offline</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
        
        {sessions.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-8 sm:p-12 text-center">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sessions</h3>
              <p className="text-muted-foreground mb-4 mobile-text-size">
                Add your first Telegram session to start forwarding messages
              </p>
              <Button onClick={handleAddSession} className="mobile-button-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
