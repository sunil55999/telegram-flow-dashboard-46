
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MobileFormWizard } from "@/components/MobileFormWizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePlan } from "@/contexts/PlanContext";
import { ArrowLeft, MessageSquare, Settings, Filter, Clock } from "lucide-react";

const basicFormSchema = z.object({
  name: z.string().min(1, "Pair name is required"),
  sourceChannelId: z.string().min(1, "Source channel is required"),
  destinationChannelId: z.string().min(1, "Destination channel is required"),
});

const filteringSchema = z.object({
  includeKeywords: z.string().optional(),
  excludeKeywords: z.string().optional(),
  forwardMedia: z.boolean(),
  forwardText: z.boolean(),
});

const schedulingSchema = z.object({
  enableSchedule: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  timezone: z.string().optional(),
});

type BasicFormData = z.infer<typeof basicFormSchema>;
type FilteringData = z.infer<typeof filteringSchema>;
type SchedulingData = z.infer<typeof schedulingSchema>;

interface StepData {
  basic?: BasicFormData;
  filtering?: FilteringData;
  scheduling?: SchedulingData;
}

export default function NewPair() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { currentPlan, canCreatePair } = usePlan();
  
  const [stepData, setStepData] = useState<StepData>({});
  const [isComplete, setIsComplete] = useState(false);

  const basicForm = useForm<BasicFormData>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      name: "",
      sourceChannelId: "",
      destinationChannelId: "",
    },
  });

  const filteringForm = useForm<FilteringData>({
    resolver: zodResolver(filteringSchema),
    defaultValues: {
      includeKeywords: "",
      excludeKeywords: "",
      forwardMedia: true,
      forwardText: true,
    },
  });

  const schedulingForm = useForm<SchedulingData>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      enableSchedule: false,
      startTime: "",
      endTime: "",
      timezone: "UTC",
    },
  });

  if (!canCreatePair()) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => navigate("/pairs")} />
              Pair Limit Reached
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You've reached your plan's pair limit. Upgrade to create more forwarding pairs.
            </p>
            <Button onClick={() => navigate("/subscription")}>
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const BasicDetailsStep = () => (
    <Form {...basicForm}>
      <div className="space-y-4">
        <FormField
          control={basicForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pair Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., News Channel → Private Group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={basicForm.control}
          name="sourceChannelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Channel/Group</FormLabel>
              <FormControl>
                <Input placeholder="@source_channel" {...field} />
              </FormControl>
              <FormDescription>
                The channel or group to forward messages from
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={basicForm.control}
          name="destinationChannelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Channel/Group</FormLabel>
              <FormControl>
                <Input placeholder="@destination_channel" {...field} />
              </FormControl>
              <FormDescription>
                Where messages will be forwarded to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Current Plan:</strong> {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          </p>
        </div>
      </div>
    </Form>
  );

  const FilteringStep = () => (
    <Form {...filteringForm}>
      <div className="space-y-4">
        {currentPlan === 'free' ? (
          <div className="p-4 bg-muted/50 border-l-4 border-primary rounded">
            <h3 className="font-medium mb-2">Advanced Filtering</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Basic plan or higher to access keyword filtering and advanced options.
            </p>
            <Badge variant="outline">Available in Basic+</Badge>
          </div>
        ) : (
          <>
            <FormField
              control={filteringForm.control}
              name="includeKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Include Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="keyword1, keyword2, keyword3"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Only forward messages containing these keywords
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={filteringForm.control}
              name="excludeKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exclude Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="spam, ads, promotion"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Don't forward messages containing these keywords
                  </FormDescription>
                </FormItem>
              )}
            />
          </>
        )}
        
        <div className="space-y-3">
          <FormLabel>Message Types to Forward</FormLabel>
          <FormField
            control={filteringForm.control}
            name="forwardText"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-normal">Text Messages</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={filteringForm.control}
            name="forwardMedia"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="text-sm font-normal">Media (Images, Videos, Documents)</FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );

  const SchedulingStep = () => (
    <Form {...schedulingForm}>
      <div className="space-y-4">
        {currentPlan === 'free' || currentPlan === 'basic' ? (
          <div className="p-4 bg-muted/50 border-l-4 border-primary rounded">
            <h3 className="font-medium mb-2">Scheduling & Advanced Features</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upgrade to Plus plan or higher to access message scheduling and delay features.
            </p>
            <Badge variant="outline">Available in Plus+</Badge>
          </div>
        ) : (
          <>
            <FormField
              control={schedulingForm.control}
              name="enableSchedule"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Enable Message Scheduling</FormLabel>
                </FormItem>
              )}
            />
            
            {schedulingForm.watch("enableSchedule") && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                <FormField
                  control={schedulingForm.control}
                  name="startTime"
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
                  control={schedulingForm.control}
                  name="endTime"
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
                  control={schedulingForm.control}
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
          </>
        )}
        
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            <strong>Ready to create:</strong> Your forwarding pair will be created and activated immediately.
          </p>
        </div>
      </div>
    </Form>
  );

  const steps = [
    {
      id: "basic",
      title: "Basic Setup",
      description: "Configure source and destination channels",
      component: <BasicDetailsStep />,
    },
    {
      id: "filtering",
      title: "Message Filtering",
      description: "Set up keyword filters and message types",
      component: <FilteringStep />,
      optional: true,
    },
    {
      id: "scheduling",
      title: "Advanced Options",
      description: "Configure scheduling and timing",
      component: <SchedulingStep />,
      optional: true,
    },
  ];

  const handleStepComplete = async (stepIndex: number) => {
    const currentStep = steps[stepIndex];
    
    if (currentStep.id === "basic") {
      const isValid = await basicForm.trigger();
      if (isValid) {
        setStepData(prev => ({ ...prev, basic: basicForm.getValues() }));
        return true;
      }
      return false;
    }
    
    if (currentStep.id === "filtering") {
      setStepData(prev => ({ ...prev, filtering: filteringForm.getValues() }));
      return true;
    }
    
    if (currentStep.id === "scheduling") {
      setStepData(prev => ({ ...prev, scheduling: schedulingForm.getValues() }));
      setIsComplete(true);
      return true;
    }
    
    return true;
  };

  const handleComplete = () => {
    const finalData = {
      ...stepData,
      filtering: filteringForm.getValues(),
      scheduling: schedulingForm.getValues(),
    };
    
    console.log("Creating pair with data:", finalData);
    
    toast({
      title: "Forwarding Pair Created",
      description: `"${finalData.basic?.name}" has been created and activated.`,
    });
    
    navigate("/pairs");
  };

  const handleCancel = () => {
    navigate("/pairs");
  };

  if (isMobile) {
    return (
      <MobileFormWizard
        steps={steps}
        onComplete={handleComplete}
        onCancel={handleCancel}
        completable={isComplete}
      />
    );
  }

  // Desktop version
  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-2xl font-bold">Create New Forwarding Pair</h1>
          <p className="text-muted-foreground">
            Set up a new message forwarding configuration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={step.id} className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {step.id === "basic" && <Settings className="w-4 h-4" />}
                {step.id === "filtering" && <Filter className="w-4 h-4" />}
                {step.id === "scheduling" && <Clock className="w-4 h-4" />}
                {step.title}
                {step.optional && <Badge variant="outline" className="text-xs">Optional</Badge>}
              </CardTitle>
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}
            </CardHeader>
            <CardContent>{step.component}</CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleComplete}>
          Create Pair
        </Button>
      </div>
    </div>
  );
}
