
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getApplianceById } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Wrench, Info, HardHat, Phone, Loader2 } from 'lucide-react';
import type { Appliance } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartFinder } from '@/components/part-finder';
import { ApplianceIcon } from '@/components/appliance-icon';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MaintenanceCard } from '@/components/maintenance-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApplianceDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [appliance, setAppliance] = useState<Appliance | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

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
    { label: "Model Number", value: appliance.model },
    { label: "Serial Number", value: appliance.serial },
    { label: "Purchase Date", value: new Date(appliance.purchaseDate).toLocaleDateString() },
    { label: "Maintenance Schedule", value: appliance.maintenanceSchedule },
  ];

  const repairServices = [
    { name: "Local Appliance Repair", phone: "123-456-7890", rating: 4.5 },
    { name: "FixIt Fast", phone: "987-654-3210", rating: 4.8 },
    { name: "ProLine Service", phone: "555-123-4567", rating: 4.2 },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
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
          <PartFinder model={appliance.model} />
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
                <MaintenanceCard appliance={appliance} />
                <Card>
                    <CardHeader>
                    <CardTitle>Nearby Repair Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            {repairServices.map(service => (
                                <li key={service.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 rounded-md hover:bg-secondary/50">
                                    <div className="flex items-center gap-3">
                                        <HardHat className="h-5 w-5 text-muted-foreground flex-shrink-0"/>
                                        <div>
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-xs text-muted-foreground">Rating: {service.rating} / 5</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                                        <a href={`tel:${service.phone}`}><Phone className="mr-2 h-3 w-3" /> Call</a>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
