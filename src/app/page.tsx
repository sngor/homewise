
"use client";

import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AddApplianceSheet } from '@/components/add-appliance-sheet';
import type { Appliance } from '@/lib/types';
import { getAppliances, addAppliance } from '@/lib/data';
import { ApplianceIcon } from '@/components/appliance-icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


export default function Home() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppliances = async () => {
        setIsLoading(true);
        try {
          const fetchedAppliances = await getAppliances();
          setAppliances(fetchedAppliances);
        } catch (e) {
          toast({
            variant: "destructive",
            title: "Failed to load appliances",
            description: e instanceof Error ? e.message : "An unknown error occurred.",
          });
        } finally {
          setIsLoading(false);
        }
    }
    fetchAppliances();
  }, [toast])

  const handleAddAppliance = async (newAppliance: Omit<Appliance, 'id'>) => {
    try {
      const addedAppliance = await addAppliance(newAppliance);
      setAppliances(prev => [addedAppliance, ...prev]);
      setIsSheetOpen(false);
      toast({
        title: "Appliance Added",
        description: `${addedAppliance.name} has been successfully added.`,
      })
    } catch(e) {
      toast({
        variant: "destructive",
        title: "Failed to Add Appliance",
        description: e instanceof Error ? e.message : "An unknown error occurred.",
      })
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AddApplianceSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onApplianceAdded={handleAddAppliance}
      />
      <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 p-4 md:p-6 border-b bg-secondary/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Home Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage all your home appliances in one place.</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Appliance
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({length: 4}).map((_, i) => (
                  <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="aspect-video w-full" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
              ))}
            </div>
        ) : appliances.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {appliances.map((appliance) => (
              <Link key={appliance.id} href={`/appliance/${appliance.id}`} className="block hover:shadow-lg transition-shadow rounded-lg">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-md">
                          <ApplianceIcon type={appliance.type} className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{appliance.name}</CardTitle>
                          <CardDescription>{appliance.brand} {appliance.model}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="relative aspect-video w-full">
                       <Image 
                         src={appliance.stickerImageUrl || "https://placehold.co/600x400.png"} 
                         alt={`${appliance.name} sticker`}
                         fill
                         className="rounded-md object-cover border"
                         data-ai-hint="appliance sticker"
                       />
                     </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">Purchased on {new Date(appliance.purchaseDate).toLocaleDateString()}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg bg-secondary/50">
            <h2 className="text-xl font-semibold">No Appliances Yet</h2>
            <p className="text-muted-foreground mt-2 mb-4 max-w-sm">
              Click the button below to add your first appliance and start managing your home inventory.
            </p>
            <Button onClick={() => setIsSheetOpen(true)} size="lg">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Appliance
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
