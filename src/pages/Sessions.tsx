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
import { Plus, Pause, Play, Trash2, Smartphone } from "lucide-react";

interface TelegramSession {
  id: string;
  name: string;
  phoneNumber: string;
  status: "connected" | "disconnected" | "paused";
  lastActive: string;
}

export default function Sessions() {
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
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected";
      case "paused":
        return "Paused";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Telegram Sessions</h1>
          <p className="text-muted-foreground">
            Manage your telegram account sessions for forwarding
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSession}>
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Add New Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              
              <div className="text-sm text-muted-foreground">
                <p>You'll be asked to enter the verification code sent to this number.</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Add Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{session.name}</h3>
                    <p className="text-muted-foreground">{session.phoneNumber}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
                      <span className="text-sm text-muted-foreground">
                        {getStatusText(session.status)} • Last active: {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={session.status === "connected" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {session.status}
                  </Badge>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleSession(session.id)}
                    disabled={session.status === "disconnected"}
                  >
                    {session.status === "paused" ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sessions.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Sessions</h3>
              <p className="text-muted-foreground mb-4">
                Add your first Telegram session to start forwarding messages
              </p>
              <Button onClick={handleAddSession}>
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