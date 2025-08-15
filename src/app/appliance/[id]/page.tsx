
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getApplianceById, deleteAppliance } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Wrench, Info, HardHat, Phone, Loader2, Trash2, LocateFixed, Building, MapPin } from 'lucide-react';
import type { Appliance } from '@/lib/types';
import { getRepairServices } from '@/app/actions';
import type { FindRepairServicesOutput } from '@/ai/flows/find-repair-services';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartFinder } from '@/components/part-finder';
import { ApplianceIcon } from '@/components/appliance-icon';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MaintenanceCard } from '@/components/maintenance-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type RepairService = FindRepairServicesOutput['services'][0];

export default function ApplianceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const [appliance, setAppliance] = useState<Appliance | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [repairServices, setRepairServices] = useState<RepairService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceError, setServiceError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchAppliance = async () => {
      setIsLoading(true);
      const fetchedAppliance = await getApplianceById(id);
      setAppliance(fetchedAppliance);
      setIsLoading(false);
    };

    fetchAppliance();
  }, [id]);

  const handleDelete = async () => {
    if (!appliance) return;

    try {
      await deleteAppliance(appliance.id);
      toast({
        title: "Appliance Deleted",
        description: `${appliance.name} has been removed.`,
      });
      router.push('/');
    } catch(e) {
      toast({
        variant: "destructive",
        title: "Failed to Delete Appliance",
        description: e instanceof Error ? e.message : "An unknown error occurred.",
      });
    } finally {
        setIsDeleting(false);
    }
  };

  const handleFindServices = useCallback(() => {
    if (!appliance || repairServices.length > 0) return;

    setIsLoadingServices(true);
    setServiceError(null);
    setRepairServices([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await getRepairServices({
            applianceType: appliance.type,
            latitude,
            longitude,
          });
          setRepairServices(result.services);
        } catch (e) {
          const error = e instanceof Error ? e.message : "Could not find services.";
          setServiceError(error);
        } finally {
          setIsLoadingServices(false);
        }
      },
      (error) => {
        setServiceError(`Geolocation error: ${error.message}. Please enable location services.`);
        setIsLoadingServices(false);
      }
    );
  }, [appliance, repairServices]);


  if (isLoading || appliance === undefined) {
    return (
        <div className="p-4 md:p-6 animate-pulse">
            <div className="mb-4">
                <Skeleton className="h-10 w-40" />
            </div>
            <header className="mb-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
            </header>
            <Skeleton className="h-10 w-full mb-4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-48" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (appliance === null) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold">Appliance Not Found</h2>
            <p className="text-muted-foreground mt-2 mb-4">
                The appliance you are looking for does not exist.
            </p>
            <Button variant="outline" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Inventory
                </Link>
            </Button>
        </div>
    );
  }


  const detailItems = [
    { label: "Brand", value: appliance.brand },
    { label: "Model Number", value: appliance.model },
    { label: "Serial Number", value: appliance.serial },
    { label: "Purchase Date", value: new Date(appliance.purchaseDate).toLocaleDateString() },
    { label: "Installation Date", value: new Date(appliance.installationDate).toLocaleDateString() },
    { label: "Maintenance Schedule", value: appliance.maintenanceSchedule },
  ];

  return (
    <>
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
        <Button variant="destructive" onClick={() => setIsDeleting(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
        </Button>
      </div>

      <header className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
           <div className="p-3 bg-secondary rounded-lg">
             <ApplianceIcon type={appliance.type} className="h-8 w-8 text-muted-foreground" />
           </div>
           <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{appliance.name}</h1>
            <Badge variant="secondary" className="capitalize mt-1">{appliance.type}</Badge>
           </div>
        </div>
      </header>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="details"><Info className="mr-2 h-4 w-4" />Details</TabsTrigger>
          <TabsTrigger value="parts"><Wrench className="mr-2 h-4 w-4" />Parts</TabsTrigger>
          <TabsTrigger value="maintenance"><Calendar className="mr-2 h-4 w-4" />Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Appliance Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {detailItems.map(item => (
                  <div key={item.label} className="grid grid-cols-[150px_1fr] sm:grid-cols-2 gap-2 p-2 rounded-md hover:bg-secondary/50 items-center">
                    <dt className="font-medium text-muted-foreground">{item.label}</dt>
                    <dd className="break-words">{item.value}</dd>
                  </div>
                ))}
              </div>
               <Separator/>
               <div className="space-y-2">
                 <h4 className="font-medium">Appliance Sticker</h4>
                 <div className="relative aspect-video max-w-full sm:max-w-md">
                   <Image 
                     src={appliance.stickerImageUrl || "https://placehold.co/600x400.png"} 
                     alt={`${appliance.name} sticker`} 
                     fill
                     className="rounded-lg object-cover border"
                     data-ai-hint="appliance sticker"
                   />
                 </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="parts" className="mt-4">
          <PartFinder model={appliance.model} brand={appliance.brand} type={appliance.type} />
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
                <MaintenanceCard appliance={appliance} />
                <Card>
                    <CardHeader>
                        <CardTitle>Nearby Repair Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleFindServices} disabled={isLoadingServices} className="w-full">
                            {isLoadingServices ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <LocateFixed className="mr-2 h-4 w-4" />
                            )}
                            Find Services Near Me
                        </Button>

                        {serviceError && (
                            <Alert variant="destructive">
                                <Wrench className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{serviceError}</AlertDescription>
                            </Alert>
                        )}

                        {!isLoadingServices && !serviceError && repairServices.length > 0 && (
                            <div className="space-y-4">
                                {repairServices.map(service => (
                                    <div key={service.name} className="flex items-start justify-between gap-4 p-4 border rounded-lg">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-secondary rounded-md">
                                                <Building className="h-6 w-6 text-muted-foreground"/>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-semibold">{service.name}</p>
                                                <p className="text-sm text-muted-foreground">Rating: {service.rating.toFixed(1)} / 5</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{service.address}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`tel:${service.phone}`}><Phone className="mr-2 h-3 w-3" /> Call</a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!isLoadingServices && !serviceError && repairServices.length === 0 && (
                            <p className="text-sm text-center text-muted-foreground pt-4">Click the button above to find repair services using your current location.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
    <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            appliance &quot;{appliance?.name}&quot;.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
            Continue
            </AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
