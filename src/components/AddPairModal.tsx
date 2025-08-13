import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Check, X, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EntityValidationResult {
  ok: boolean;
  type?: "channel" | "group" | "supergroup";
  title?: string;
  permissions?: {
    botCanRead: boolean;
    botCanWrite: boolean;
  };
  reason?: string;
}

interface AddPairModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pairData: any) => void;
}

export function AddPairModal({ open, onOpenChange, onSave }: AddPairModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    sourceType: "",
    sourceInput: "",
    destinationType: "",
    destinationInput: "",
    copyMedia: true,
    removeCaptions: false,
    enableFilters: false,
    forwardingMode: "copy",
    filters: [] as string[]
  });

  const [validationState, setValidationState] = useState({
    source: { loading: false, valid: false, result: null as EntityValidationResult | null },
    destination: { loading: false, valid: false, result: null as EntityValidationResult | null }
  });

  const [testResult, setTestResult] = useState<{ loading: boolean; result?: { ok: boolean; message: string } }>({
    loading: false
  });

  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Validate entity when input changes
  const validateEntity = async (input: string, type: "source" | "destination") => {
    if (!input.trim()) {
      setValidationState(prev => ({
        ...prev,
        [type]: { loading: false, valid: false, result: null }
      }));
      return;
    }

    setValidationState(prev => ({
      ...prev,
      [type]: { loading: true, valid: false, result: null }
    }));

    try {
      // Mock API call - replace with actual endpoint
      const response = await new Promise<EntityValidationResult>((resolve) => {
        setTimeout(() => {
          // Mock validation logic
          if (input.includes("@") || input.includes("t.me") || input.startsWith("-100")) {
            resolve({
              ok: true,
              type: "channel",
              title: `Mock Channel (${input})`,
              permissions: { botCanRead: true, botCanWrite: true }
            });
          } else {
            resolve({
              ok: false,
              reason: "Invalid format. Use @username, t.me link, or -100... ID"
            });
          }
        }, 1000);
      });

      setValidationState(prev => ({
        ...prev,
        [type]: { loading: false, valid: response.ok, result: response }
      }));
    } catch (error) {
      setValidationState(prev => ({
        ...prev,
        [type]: { loading: false, valid: false, result: { ok: false, reason: "Validation failed" } }
      }));
    }
  };

  // Debounced validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.sourceInput) {
        validateEntity(formData.sourceInput, "source");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.sourceInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.destinationInput) {
        validateEntity(formData.destinationInput, "destination");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.destinationInput]);

  const canSave = validationState.source.valid && validationState.destination.valid;

  const handleTest = async () => {
    setTestResult({ loading: true });
    
    try {
      // Mock test API call
      const result = await new Promise<{ ok: boolean; message: string }>((resolve) => {
        setTimeout(() => {
          resolve({ ok: true, message: "Test successful! Bot can access both channels." });
        }, 2000);
      });
      
      setTestResult({ loading: false, result });
      toast({
        title: result.ok ? "Test Successful" : "Test Failed",
        description: result.message,
        variant: result.ok ? "default" : "destructive"
      });
    } catch (error) {
      setTestResult({ loading: false, result: { ok: false, message: "Test failed due to network error" } });
    }
  };

  const handleSave = () => {
    if (!canSave) return;
    
    onSave({
      ...formData,
      sourceTitle: validationState.source.result?.title,
      destinationTitle: validationState.destination.result?.title
    });
    
    // Reset form
    setFormData({
      name: "",
      sourceType: "",
      sourceInput: "",
      destinationType: "",
      destinationInput: "",
      copyMedia: true,
      removeCaptions: false,
      enableFilters: false,
      forwardingMode: "copy",
      filters: []
    });
    setValidationState({
      source: { loading: false, valid: false, result: null },
      destination: { loading: false, valid: false, result: null }
    });
    setTestResult({ loading: false });
    
    onOpenChange(false);
  };

  const ValidationIcon = ({ state }: { state: typeof validationState.source }) => {
    if (state.loading) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (state.valid) return <Check className="w-4 h-4 text-green-500" />;
    if (state.result && !state.result.ok) return <X className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add Forwarding Pair</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Pair Name */}
          <div className="space-y-2">
            <Label htmlFor="pairName">Pair Name (optional)</Label>
            <Input
              id="pairName"
              placeholder="News → Private"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-input border-border"
            />
          </div>

          {/* Source Configuration */}
          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <h3 className="font-medium">Source Channel</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sourceType">Source Type</Label>
                <Select value={formData.sourceType} onValueChange={(value) => setFormData(prev => ({ ...prev, sourceType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="channel">Channel</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="supergroup">Supergroup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sourceInput">Source ID or Link</Label>
                <div className="relative">
                  <Input
                    id="sourceInput"
                    placeholder="@username, t.me/link, or -100..."
                    value={formData.sourceInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, sourceInput: e.target.value }))}
                    className="bg-input border-border pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ValidationIcon state={validationState.source} />
                  </div>
                </div>
                {validationState.source.result?.title && (
                  <p className="text-xs text-green-500">✓ {validationState.source.result.title}</p>
                )}
                {validationState.source.result && !validationState.source.result.ok && (
                  <p className="text-xs text-red-500">{validationState.source.result.reason}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Use @username for public channels; use -100... for private IDs or paste the invite link.
                </p>
              </div>
            </div>
          </div>

          {/* Destination Configuration */}
          <div className="space-y-4 p-4 rounded-lg bg-muted/50">
            <h3 className="font-medium">Destination Channel</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destinationType">Destination Type</Label>
                <Select value={formData.destinationType} onValueChange={(value) => setFormData(prev => ({ ...prev, destinationType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="channel">Channel</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="supergroup">Supergroup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destinationInput">Destination ID or Link</Label>
                <div className="relative">
                  <Input
                    id="destinationInput"
                    placeholder="@username, t.me/link, or -100..."
                    value={formData.destinationInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, destinationInput: e.target.value }))}
                    className="bg-input border-border pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <ValidationIcon state={validationState.destination} />
                  </div>
                </div>
                {validationState.destination.result?.title && (
                  <p className="text-xs text-green-500">✓ {validationState.destination.result.title}</p>
                )}
                {validationState.destination.result && !validationState.destination.result.ok && (
                  <p className="text-xs text-red-500">{validationState.destination.result.reason}</p>
                )}
              </div>
            </div>
          </div>

          {/* Forwarding Mode */}
          <div className="space-y-3">
            <Label>Forwarding Mode</Label>
            <RadioGroup 
              value={formData.forwardingMode} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, forwardingMode: value }))}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy" />
                <Label htmlFor="copy">Copy (recommended)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="forward" id="forward" />
                <Label htmlFor="forward">Forward</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Basic Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="copyMedia"
                checked={formData.copyMedia}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, copyMedia: !!checked }))}
              />
              <Label htmlFor="copyMedia">Copy Media</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="removeCaptions"
                checked={formData.removeCaptions}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, removeCaptions: !!checked }))}
              />
              <Label htmlFor="removeCaptions">Remove Captions</Label>
            </div>
          </div>

          {/* Optional Settings */}
          <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                Optional Settings
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableFilters"
                  checked={formData.enableFilters}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enableFilters: checked }))}
                />
                <Label htmlFor="enableFilters">Enable Filters</Label>
              </div>
              
              {formData.enableFilters && (
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-2">
                    Add simple text filters (one per line):
                  </p>
                  <textarea
                    className="w-full h-20 p-2 text-sm bg-input border border-border rounded-md resize-none"
                    placeholder="spam&#10;advertisement&#10;crypto"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      filters: e.target.value.split('\n').filter(f => f.trim()) 
                    }))}
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTest}
            disabled={!canSave || testResult.loading}
          >
            {testResult.loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              "Test"
            )}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!canSave}
            aria-label="Save new forwarding pair"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}