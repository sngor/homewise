import { getApplianceById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Wrench, Info, HardHat, Phone } from 'lucide-react';
import { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartFinder } from '@/components/part-finder';
import { ApplianceIcon } from '@/components/appliance-icon';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MaintenanceCard } from '@/components/maintenance-card';

// This is a server component, so we can fetch data directly.
// However, since we are using local state for now, we'll fetch on the client
// in a real app with a db, we'd use this commented-out function.
// export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
//   const appliance = await getApplianceById(params.id);
//   if (!appliance) {
//     return { title: 'Appliance Not Found' };
//   }
//   return { title: `${appliance.name} Details` };
// }

export default async function ApplianceDetailPage({ params }: { params: { id: string } }) {
  const appliance = await getApplianceById(params.id);

  if (!appliance) {
    notFound();
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
