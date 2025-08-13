import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Trash2, 
  Clock, 
  Filter, 
  MessageSquare, 
  Bell, 
  Users, 
  Settings,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Pair name is required"),
  sourceChannelId: z.string().min(1, "Source channel is required"),
  destinationChannelId: z.string().min(1, "Destination channel is required"),
  status: z.boolean(),
  // Message filtering
  includeKeywords: z.string().optional(),
  excludeKeywords: z.string().optional(),
  mediaTypes: z.object({
    text: z.boolean(),
    images: z.boolean(),
    videos: z.boolean(),
    documents: z.boolean(),
    audio: z.boolean(),
    stickers: z.boolean(),
    polls: z.boolean(),
  }),
  messageMinLength: z.number().min(0).optional(),
  messageMaxLength: z.number().min(0).optional(),
  senderWhitelist: z.string().optional(),
  senderBlacklist: z.string().optional(),
  // Advanced rules
  delaySeconds: z.number().min(0).max(86400).optional(),
  scheduleEnabled: z.boolean(),
  scheduleStart: z.string().optional(),
  scheduleEnd: z.string().optional(),
  timezone: z.string().optional(),
  requireLinks: z.boolean(),
  requireHashtags: z.boolean(),
  requireMentions: z.boolean(),
  requireMedia: z.boolean(),
  preventDuplicates: z.boolean(),
  autoRemoveSource: z.boolean(),
  // Message formatting
  preserveFormatting: z.boolean(),
  customPrefix: z.string().optional(),
  customSuffix: z.string().optional(),
  findReplace: z.string().optional(),
  editCaptions: z.boolean(),
  // Notifications
  emailNotifications: z.boolean(),
  logToTelegram: z.boolean(),
  logChatId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPair() {
  const { pairId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    filtering: false,
    advanced: false,
    formatting: false,
    notifications: false,
    permissions: false,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sourceChannelId: "",
      destinationChannelId: "",
      status: true,
      mediaTypes: {
        text: true,
        images: true,
        videos: true,
        documents: true,
        audio: true,
        stickers: true,
        polls: true,
      },
      scheduleEnabled: false,
      timezone: "UTC",
      requireLinks: false,
      requireHashtags: false,
      requireMentions: false,
      requireMedia: false,
      preventDuplicates: true,
      autoRemoveSource: false,
      preserveFormatting: true,
      editCaptions: false,
      emailNotifications: false,
      logToTelegram: false,
    },
  });

  // Mock data - in real app, this would fetch from API
  useEffect(() => {
    const mockPairData = {
      id: pairId,
      name: "News → Private",
      sourceChannelId: "@newschannel",
      destinationChannelId: "@privatechannel",
      status: true,
    };
    
    form.reset({
      ...form.getValues(),
      ...mockPairData,
    });
  }, [pairId, form]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (data: FormData) => {
    console.log("Saving pair:", data);
    toast({
      title: "Pair Updated",
      description: "Your forwarding pair has been successfully updated.",
    });
    navigate("/pairs");
  };

  const handleReset = () => {
    form.reset();
    toast({
      title: "Form Reset",
      description: "All changes have been reverted to the last saved state.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Pair Deleted",
      description: "The forwarding pair has been permanently deleted.",
      variant: "destructive",
    });
    navigate("/pairs");
  };

  const SectionCard = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    icon: React.ComponentType<any>; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <Card className="bg-card border-border">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection(sectionKey)}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {title}
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </CardTitle>
        </CardHeader>
        {isExpanded && <CardContent>{children}</CardContent>}
      </Card>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/pairs")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pairs
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Edit Forwarding Pair</h1>
            <p className="text-sm text-muted-foreground">
              {form.watch("sourceChannelId")} → {form.watch("destinationChannelId")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Badge variant={form.watch("status") ? "default" : "secondary"}>
            {form.watch("status") ? "Active" : "Paused"}
          </Badge>
          <Switch
            checked={form.watch("status")}
            onCheckedChange={(checked) => form.setValue("status", checked)}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Details */}
          <SectionCard title="Basic Pair Details" icon={Settings} sectionKey="basic">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pair Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pair name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceChannelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Channel/Group</FormLabel>
                      <FormControl>
                        <Input placeholder="@source_channel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationChannelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Channel/Group</FormLabel>
                      <FormControl>
                        <Input placeholder="@destination_channel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </SectionCard>

          {/* Message Filtering */}
          <SectionCard title="Message Filtering Options" icon={Filter} sectionKey="filtering">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="includeKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Include Keywords</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Comma-separated keywords to include"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Only forward messages containing these words
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excludeKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclude Keywords</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Comma-separated keywords to exclude"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Don't forward messages containing these words
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel className="text-base">Media Types to Forward</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {Object.entries({
                    text: "Text Messages",
                    images: "Images",
                    videos: "Videos", 
                    documents: "Documents",
                    audio: "Audio",
                    stickers: "Stickers",
                    polls: "Polls",
                  }).map(([key, label]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`mediaTypes.${key}` as any}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="messageMinLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Message Length</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messageMaxLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Message Length</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Unlimited"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="senderWhitelist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Whitelist</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="@username1, @username2, user_id"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Only forward from these users
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="senderBlacklist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Blacklist</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="@username1, @username2, user_id"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Don't forward from these users
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </SectionCard>

          {/* Advanced Rules */}
          <SectionCard title="Advanced Forwarding Rules" icon={Clock} sectionKey="advanced">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="delaySeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forwarding Delay (seconds)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Add delay before forwarding messages
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="scheduleEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Enable Schedule</FormLabel>
                    </FormItem>
                  )}
                />

                {form.watch("scheduleEnabled") && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                    <FormField
                      control={form.control}
                      name="scheduleStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="scheduleEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="EST">EST</SelectItem>
                              <SelectItem value="PST">PST</SelectItem>
                              <SelectItem value="CET">CET</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <FormLabel className="text-base">Content Requirements</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="requireLinks"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Require Links
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requireHashtags"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Require Hashtags
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requireMentions"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Require Mentions
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requireMedia"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Require Media
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <FormLabel className="text-base">Additional Options</FormLabel>
                <div className="space-y-2 mt-2">
                  <FormField
                    control={form.control}
                    name="preventDuplicates"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Prevent Duplicate Messages</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="autoRemoveSource"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Auto-remove Source Message</FormLabel>
                        <FormDescription>
                          Requires bot to have delete permissions
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Message Formatting */}
          <SectionCard title="Message Formatting Options" icon={MessageSquare} sectionKey="formatting">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="preserveFormatting"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Preserve Original Formatting</FormLabel>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customPrefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Message Prefix</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., [Forwarded]" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customSuffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Message Suffix</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., #forwarded" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="findReplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Find & Replace Rules</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="old_word:new_word, another_old:another_new"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Replace specific words/phrases (format: old:new, separated by commas)
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="editCaptions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Enable Caption Editing for Media</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          {/* Notifications */}
          <SectionCard title="Notification & Logging" icon={Bell} sectionKey="notifications">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Enable Email Notifications for Errors</FormLabel>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="logToTelegram"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Send Activity Logs to Telegram</FormLabel>
                    </FormItem>
                  )}
                />

                {form.watch("logToTelegram") && (
                  <FormField
                    control={form.control}
                    name="logChatId"
                    render={({ field }) => (
                      <FormItem className="pl-6">
                        <FormLabel>Log Chat ID</FormLabel>
                        <FormControl>
                          <Input placeholder="@log_channel or chat_id" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div>
                <FormLabel className="text-base">Recent Activity</FormLabel>
                <div className="mt-2 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Last 10 forwarding actions for this pair:
                  </div>
                  <div className="bg-muted/20 rounded-md p-3 text-sm">
                    <div className="space-y-1">
                      <div>• 2 minutes ago: Forwarded message from @source to @dest</div>
                      <div>• 5 minutes ago: Filtered out message (excluded keyword)</div>
                      <div>• 10 minutes ago: Forwarded message from @source to @dest</div>
                      <div className="text-muted-foreground">... and 7 more</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Access & Permissions */}
          <SectionCard title="Access & Permissions" icon={Users} sectionKey="permissions">
            <div className="space-y-4">
              <div>
                <FormLabel className="text-base">Team Member Access</FormLabel>
                <div className="mt-2 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Assign team members who can edit this pair
                  </div>
                  <Input placeholder="Enter email addresses (comma-separated)" />
                </div>
              </div>

              <div>
                <FormLabel className="text-base">Permission Level</FormLabel>
                <Select defaultValue="full">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read-only</SelectItem>
                    <SelectItem value="edit">Edit settings</SelectItem>
                    <SelectItem value="full">Full control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-4 md:relative md:bg-transparent md:border-t-0 md:p-0 md:mx-0">
            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <div className="flex flex-col gap-3 md:flex-row">
                <Button type="submit" className="flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset to Defaults
                </Button>
              </div>
              <Button 
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Pair
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}