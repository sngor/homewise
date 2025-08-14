"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Upload, Scan, Loader2, Wand2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Appliance } from "@/lib/types"
import { getApplianceDetailsFromImage, getMaintenanceScedule } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum(['refrigerator', 'oven', 'washer', 'dishwasher', 'tv', 'ac', 'other']),
  model: z.string().min(2, "Model number is required."),
  serial: z.string().min(2, "Serial number is required."),
  purchaseDate: z.date({
    required_error: "A purchase date is required.",
  }),
  maintenanceSchedule: z.string().min(2, "Maintenance schedule is required."),
  stickerImageUrl: z.string().optional(),
})

type AddApplianceSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplianceAdded: (appliance: Omit<Appliance, 'id'>, stickerFile: File | null) => void;
}

export function AddApplianceSheet({ open, onOpenChange, onApplianceAdded }: AddApplianceSheetProps) {
  const [stickerFile, setStickerFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      serial: "",
      maintenanceSchedule: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const imageUrl = stickerFile ? URL.createObjectURL(stickerFile) : undefined;
    onApplianceAdded({
      ...values,
      type: values.type || 'other',
      purchaseDate: format(values.purchaseDate, "yyyy-MM-dd"),
      stickerImageUrl: imageUrl,
    }, stickerFile);
    form.reset();
    setStickerFile(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setStickerFile(e.target.files[0]);
    }
  }

  const handleExtractDetails = async () => {
    if (!stickerFile) return;

    setIsExtracting(true);

    const reader = new FileReader();
    reader.readAsDataURL(stickerFile);
    reader.onload = async () => {
        const photoDataUri = reader.result as string;
        try {
            const result = await getApplianceDetailsFromImage({ photoDataUri });
            form.setValue("name", result.name);
            form.setValue("type", result.type);
            form.setValue("model", result.model);
            form.setValue("serial", result.serial);
            toast({
                title: "Details Extracted",
                description: "Appliance details have been filled in from the image.",
            });
        } catch(e) {
             const error = e instanceof Error ? e.message : "Could not extract details from the image. Please enter them manually.";
             toast({
                variant: "destructive",
                title: "Extraction Failed",
                description: error,
            });
        } finally {
            setIsExtracting(false);
        }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error processing the image file.",
        });
        setIsExtracting(false);
    };
  }

  const handleSuggestSchedule = async () => {
      const applianceType = form.getValues("type");
      const applianceModel = form.getValues("model");

      if (!applianceType || !applianceModel) {
          toast({
              variant: "destructive",
              title: "Missing Information",
              description: "Please provide an appliance type and model number first.",
          });
          return;
      }

      setIsSuggesting(true);
      try {
          const result = await getMaintenanceScedule({ applianceType, applianceModel });
          form.setValue("maintenanceSchedule", result.schedule);
          toast({
              title: "Schedule Suggested",
              description: "An AI-powered maintenance schedule has been generated.",
          });
      } catch (e) {
          const error = e instanceof Error ? e.message : "Could not suggest a schedule.";
          toast({
              variant: "destructive",
              title: "Suggestion Failed",
              description: error,
          });
      } finally {
          setIsSuggesting(false);
      }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            form.reset();
            setStickerFile(null);
        }
    }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Appliance</SheetTitle>
          <SheetDescription>
            Upload a sticker image to auto-fill details, or enter them manually.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
            <FormItem>
              <FormLabel>Appliance Sticker</FormLabel>
              <FormControl>
                <Button variant="outline" className="w-full" asChild>
                  <label htmlFor="sticker-upload" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {stickerFile ? "Change Image" : "Upload Image"}
                    <Input id="sticker-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
                </Button>
              </FormControl>
              <FormDescription>Upload a picture of the appliance sticker.</FormDescription>
            </FormItem>

            {stickerFile && (
              <div className="space-y-2 rounded-md border p-4 bg-secondary/50">
                <p className="text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground">{stickerFile.name}</span></p>
                <Button type="button" variant="secondary" onClick={handleExtractDetails} className="w-full" disabled={isExtracting}>
                  {isExtracting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <Scan className="mr-2 h-4 w-4" />
                  )}
                  {isExtracting ? "Extracting..." : "Extract Details from Image"}
                </Button>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appliance Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Kitchen Fridge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appliance Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an appliance type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="refrigerator">Refrigerator</SelectItem>
                      <SelectItem value="oven">Oven</SelectItem>
                      <SelectItem value="washer">Washer</SelectItem>
                      <SelectItem value="dishwasher">Dishwasher</SelectItem>
                      <SelectItem value="tv">TV</SelectItem>
                      <SelectItem value="ac">Air Conditioner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Number</FormLabel>
                  <FormControl>
                    <Input placeholder="FRS6LF7JS3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="BA83451234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Purchase Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="maintenanceSchedule"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Maintenance Schedule</FormLabel>
                      <Button type="button" variant="ghost" size="sm" onClick={handleSuggestSchedule} disabled={isSuggesting}>
                        {isSuggesting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ): (
                          <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Suggest
                      </Button>
                    </div>
                    <FormControl>
                      <Input placeholder="e.g. Every 6 months" {...field} />
                    </FormControl>
                    <FormDescription>Describe the maintenance frequency, or let AI suggest one.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <Button type="submit" className="w-full">Save Appliance</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
