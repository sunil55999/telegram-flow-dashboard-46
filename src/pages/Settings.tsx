import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FeatureLock } from "@/components/FeatureLock";
import { 
  User, 
  Bell, 
  Key, 
  Save, 
  Copy, 
  RefreshCw,
  Shield,
  Palette,
  Languages
} from "lucide-react";
import { MobileSettingsSection } from "@/components/MobileSettingsSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { usePlan } from "@/contexts/PlanContext";

export default function Settings() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { currentPlan, isFeatureAvailable } = usePlan();
  
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
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully",
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification settings have been updated",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to clipboard",
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "Your new API key is now active. Update your applications.",
    });
  };

  const ProfileContent = () => (
    <div className="mobile-form-spacing">
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
            placeholder="Enter current password"
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
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 pr-4">
          <Label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</Label>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
        <div className="space-y-0.5 pr-4">
          <Label htmlFor="pushNotifications" className="text-sm font-medium">Push Notifications</Label>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
        <div className="space-y-0.5 pr-4">
          <Label htmlFor="errorAlerts" className="text-sm font-medium">Error Alerts</Label>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
        <div className="space-y-0.5 pr-4">
          <Label htmlFor="weeklyReports" className="text-sm font-medium">Weekly Reports</Label>
          <p className="text-xs sm:text-sm text-muted-foreground">
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
    <div className="mobile-form-spacing">
      <div className="space-y-2">
        <Label>Your API Key</Label>
        <div className="flex gap-2">
          <Input
            value={apiKey}
            readOnly
            className="bg-muted border-border font-mono text-sm flex-1"
          />
          <Button variant="outline" size="icon" onClick={handleCopyApiKey} className="mobile-touch-target flex-shrink-0">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegenerateApiKey} className="mobile-button-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Key
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
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

  const WatermarkContent = () => (
    <div className="mobile-form-spacing">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="enableWatermark" className="text-sm font-medium">Enable Watermark</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Add watermark to forwarded messages
            </p>
          </div>
          <Switch id="enableWatermark" />
        </div>
        
        <div className="space-y-2">
          <Label>Watermark Text</Label>
          <Input
            placeholder="Via AutoForwardX"
            className="bg-input border-border"
          />
        </div>
      </div>
    </div>
  );

  const TranslateContent = () => (
    <div className="mobile-form-spacing">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="autoTranslate" className="text-sm font-medium">Auto Translate</Label>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Automatically translate messages
            </p>
          </div>
          <Switch id="autoTranslate" />
        </div>
        
        <div className="space-y-2">
          <Label>Target Language</Label>
          <select className="w-full px-3 py-2 rounded-md border border-input bg-background">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const AccountContent = () => (
    <div className="mobile-form-spacing">
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

      <div className="mobile-flex-stack justify-between items-start sm:items-center gap-4">
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
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
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

          {/* Pro Plan Features */}
          {isFeatureAvailable('watermark') ? (
            <MobileSettingsSection title="Watermark Settings" icon={Palette}>
              <WatermarkContent />
            </MobileSettingsSection>
          ) : (
            <MobileSettingsSection title="Watermark Settings" icon={Palette}>
              <FeatureLock
                requiredPlan="pro"
                title="Watermark Settings"
                description="Customize message watermarks with Pro plan"
                variant="inline"
              />
            </MobileSettingsSection>
          )}

          {isFeatureAvailable('translate') ? (
            <MobileSettingsSection title="Translation Settings" icon={Languages}>
              <TranslateContent />
            </MobileSettingsSection>
          ) : (
            <MobileSettingsSection title="Translation Settings" icon={Languages}>
              <FeatureLock
                requiredPlan="pro"
                title="Translation Settings"
                description="Auto-translate messages with Pro plan"
                variant="inline"
              />
            </MobileSettingsSection>
          )}

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

          {/* Pro Plan Features */}
          {isFeatureAvailable('watermark') ? (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Watermark Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WatermarkContent />
              </CardContent>
            </Card>
          ) : (
            <FeatureLock
              requiredPlan="pro"
              title="Watermark Settings"
              description="Customize message watermarks and branding with Pro plan"
            />
          )}

          {isFeatureAvailable('translate') ? (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5" />
                  Translation Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TranslateContent />
              </CardContent>
            </Card>
          ) : (
            <FeatureLock
              requiredPlan="pro"
              title="Translation Settings"  
              description="Auto-translate messages between languages with Pro plan"
            />
          )}

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
