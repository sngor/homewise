"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApplianceById } from '@/lib/data';
import { getSinglePartDetails } from '@/app/actions';
import type { Appliance } from '@/lib/types';
import type { GetPartDetailsOutput } from '@/ai/flows/get-part-details';

import { ArrowLeft, ExternalLink, ShoppingCart, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export default function PartDetailPage() {
    const params = useParams();
    const router = useRouter();

    const applianceId = params.id as string;
    const partName = decodeURIComponent(params.partName as string);

    const [appliance, setAppliance] = useState<Appliance | null>(null);
    const [partDetails, setPartDetails] = useState<GetPartDetailsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!applianceId || !partName) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedAppliance = await getApplianceById(applianceId);
                if (!fetchedAppliance) {
                    throw new Error("Appliance not found.");
                }
                setAppliance(fetchedAppliance);

                const fetchedPartDetails = await getSinglePartDetails({
                    partName,
                    applianceModel: fetchedAppliance.model,
                });

                setPartDetails(fetchedPartDetails);

            } catch (e) {
                setError(e instanceof Error ? e.message : "An unknown error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [applianceId, partName]);


    if (isLoading) {
        return (
            <div className="p-4 md:p-6 animate-pulse">
                <div className="mb-4">
                    <Skeleton className="h-10 w-48" />
                </div>
                <header className="mb-6 space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </header>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-48" />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Alert variant="destructive" className="max-w-md">
                    <Wrench className="h-4 w-4" />
                    <AlertTitle>Error Loading Part Details</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" asChild className="mt-4">
                    <Link href={`/appliance/${applianceId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Appliance
                    </Link>
                </Button>
            </div>
        )
    }

    if (!appliance || !partDetails) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-2xl font-bold">Part Not Found</h2>
                <p className="text-muted-foreground mt-2 mb-4">
                    The part you are looking for does not exist.
                </p>
                <Button variant="outline" asChild>
                    <Link href={`/appliance/${applianceId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Appliance
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/appliance/${applianceId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {appliance.name}
                    </Link>
                </Button>
            </div>
            
            <header className="mb-6">
                <h1 className="text-3xl font-bold">{partDetails.partName}</h1>
                <p className="text-muted-foreground">For {appliance.brand} {appliance.model}</p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Part Details</CardTitle>
                    <CardDescription>
                        Information about the selected replacement part.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: partDetails.description.replace(/\n/g, '<br />') }} />
                    
                    <div>
                        <Button asChild>
                            <a href={partDetails.purchaseUrl} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Now
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                           Note: This is a sample link for demonstration purposes.
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
