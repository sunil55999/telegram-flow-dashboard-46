import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Bell, 
  Key, 
  Save, 
  Copy, 
  RefreshCw,
  Shield
} from "lucide-react";
import { MobileSettingsSection } from "@/components/MobileSettingsSection";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Settings() {
  const isMobile = useIsMobile();
  
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    errorAlerts: true,
    weeklyReports: true,
  });

  const [apiKey] = useState("afxp_sk_1234567890abcdef1234567890abcdef");

  const handleProfileSave = () => {
    console.log("Saving profile...", profile);
  };

  const handleNotificationSave = () => {
    console.log("Saving notifications...", notifications);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  const handleRegenerateApiKey = () => {
    console.log("Regenerating API key...");
  };

  const ProfileContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="bg-input border-border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="bg-input border-border"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Change Password</h4>
        
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={profile.currentPassword}
            onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
            className="bg-input border-border"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={profile.newPassword}
              onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
              className="bg-input border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={profile.confirmPassword}
              onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
              className="bg-input border-border"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleProfileSave} className="mobile-button-full">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );

  const NotificationContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="emailNotifications">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive email updates about your forwarding activity
          </p>
        </div>
        <Switch
          id="emailNotifications"
          checked={notifications.emailNotifications}
          onCheckedChange={(checked) => 
            setNotifications({...notifications, emailNotifications: checked})
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="pushNotifications">Push Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive browser notifications for important events
          </p>
        </div>
        <Switch
          id="pushNotifications"
          checked={notifications.pushNotifications}
          onCheckedChange={(checked) => 
            setNotifications({...notifications, pushNotifications: checked})
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="errorAlerts">Error Alerts</Label>
          <p className="text-sm text-muted-foreground">
            Get notified immediately when forwarding fails
          </p>
        </div>
        <Switch
          id="errorAlerts"
          checked={notifications.errorAlerts}
          onCheckedChange={(checked) => 
            setNotifications({...notifications, errorAlerts: checked})
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="weeklyReports">Weekly Reports</Label>
          <p className="text-sm text-muted-foreground">
            Receive weekly summary of your forwarding statistics
          </p>
        </div>
        <Switch
          id="weeklyReports"
          checked={notifications.weeklyReports}
          onCheckedChange={(checked) => 
            setNotifications({...notifications, weeklyReports: checked})
          }
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNotificationSave} className="mobile-button-full">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );

  const ApiKeyContent = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Your API Key</Label>
        <div className="flex gap-2">
          <Input
            value={apiKey}
            readOnly
            className="bg-muted border-border font-mono text-sm"
          />
          <Button variant="outline" size="icon" onClick={handleCopyApiKey} className="mobile-touch-target">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={handleRegenerateApiKey} className="mobile-button-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-yellow-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500">Security Warning</p>
            <p className="text-muted-foreground mt-1">
              Keep your API key secure and never share it publicly. 
              If compromised, regenerate it immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>API Documentation</Label>
        <p className="text-sm text-muted-foreground">
          Use this API key to integrate AutoForwardX with your applications.
        </p>
        <Button variant="outline" className="mobile-button-full">
          View API Documentation
        </Button>
      </div>
    </div>
  );

  const AccountContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm text-muted-foreground">Account ID</Label>
          <p className="font-mono text-sm">afxp_user_1234567890</p>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Account Created</Label>
          <p className="text-sm">January 1, 2024</p>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Current Plan</Label>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Free</Badge>
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-muted-foreground">Last Login</Label>
          <p className="text-sm">Today at 2:30 PM</p>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-medium text-red-500">Danger Zone</h4>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all data
          </p>
        </div>
        <Button variant="destructive" size="sm" className="mobile-button-full">
          Delete Account
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mobile-text-size">
          Manage your account settings and preferences
        </p>
      </div>

      {isMobile ? (
        /* Mobile Settings Sections */
        <>
          <MobileSettingsSection title="Profile Settings" icon={User} defaultOpen>
            <ProfileContent />
          </MobileSettingsSection>

          <MobileSettingsSection title="Notification Preferences" icon={Bell}>
            <NotificationContent />
          </MobileSettingsSection>

          <MobileSettingsSection title="API Key Management" icon={Key}>
            <ApiKeyContent />
          </MobileSettingsSection>

          <MobileSettingsSection title="Account Information" icon={Shield}>
            <AccountContent />
          </MobileSettingsSection>
        </>
      ) : (
        /* Desktop Settings Cards */
        <>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileContent />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationContent />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Key Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ApiKeyContent />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountContent />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}