"use client";

import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AddApplianceSheet } from '@/components/add-appliance-sheet';
import type { Appliance } from '@/lib/types';
import { MOCK_APPLIANCES } from '@/lib/data';
import { ApplianceIcon } from '@/components/appliance-icon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Home() {
  const [appliances, setAppliances] = useState<Appliance[]>(MOCK_APPLIANCES);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddAppliance = (newAppliance: Omit<Appliance, 'id'>) => {
    const applianceWithId = { ...newAppliance, id: new Date().toISOString() };
    setAppliances(prev => [applianceWithId, ...prev]);
    setIsSheetOpen(false);
  };

  const handleDeleteAppliance = (id: string) => {
    setAppliances(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <AddApplianceSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onApplianceAdded={handleAddAppliance}
      />
      <header className="flex items-center justify-between p-4 md:p-6 border-b bg-secondary/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Home Inventory</h1>
          <p className="text-muted-foreground">Manage all your home appliances in one place.</p>
        </div>
        <Button onClick={() => setIsSheetOpen(true)}>
          <PlusCircle />
          Add Appliance
        </Button>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {appliances.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {appliances.map((appliance) => (
              <Card key={appliance.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary rounded-md">
                        <ApplianceIcon type={appliance.type} className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{appliance.name}</CardTitle>
                        <CardDescription>Model: {appliance.model}</CardDescription>
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
                       className="rounded-md object-cover"
                       data-ai-hint="appliance sticker"
                     />
                   </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          appliance and remove its data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAppliance(appliance.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button asChild size="sm">
                    <Link href={`/appliance/${appliance.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg bg-secondary/50">
            <h2 className="text-xl font-semibold">No Appliances Yet</h2>
            <p className="text-muted-foreground mt-2 mb-4">
              Click the button below to add your first appliance.
            </p>
            <Button onClick={() => setIsSheetOpen(true)}>
              <PlusCircle />
              Add Appliance
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
