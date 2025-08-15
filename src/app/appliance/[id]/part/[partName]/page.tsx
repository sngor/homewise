"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getApplianceById } from '@/lib/data';
import { getSinglePartDetails } from '@/app/actions';
import type { Appliance } from '@/lib/types';
import type { GetPartDetailsOutput } from '@/ai/flows/get-part-details';

import { ArrowLeft, ExternalLink, ShoppingCart, Wrench, AlertTriangle, Info, Youtube, Video, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
                <div className="mb-6">
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <Skeleton className="aspect-square w-full rounded-lg" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                </div>
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
                    The part you are looking for does not exist for this appliance.
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
    
    const getYouTubeVideoId = (url: string) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                return urlObj.pathname.slice(1);
            }
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) return videoId;
            }
            return null;
        } catch (error) {
            console.error("Invalid URL for YouTube video", error);
            return null;
        }
    };
    
    const videoId = getYouTubeVideoId(partDetails.tutorialUrl);

    const renderMarkdownList = (text: string, ordered = false) => {
        const ListComponent = ordered ? 'ol' : 'ul';
        const listStyle = ordered ? 'list-decimal' : 'list-disc';
        
        return (
            <ListComponent className={`${listStyle} list-outside space-y-2 pl-5`}>
                {text.split('\n').map((line, index) => {
                     // Remove markdown list characters like '*' or '-' or '1.'
                    const cleanLine = line.replace(/^[\s*-]+\s*|^\d+\.\s*/, '');
                    if (cleanLine) {
                        return <li key={index}>{cleanLine}</li>;
                    }
                    return null;
                })}
            </ListComponent>
        )
    }


    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <Button variant="outline" asChild>
                    <Link href={`/appliance/${applianceId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to {appliance.name}
                    </Link>
                </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="md:sticky md:top-24 h-max">
                     <div className="relative aspect-square w-full">
                       <Image 
                         src="https://placehold.co/600x600.png"
                         alt={partDetails.partName}
                         fill
                         className="rounded-lg object-cover border"
                         data-ai-hint="appliance part"
                       />
                     </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold">{partDetails.partName}</h1>
                        <p className="text-muted-foreground mt-1">For {appliance.brand} {appliance.model}</p>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-2">
                               <CardTitle className="text-lg flex items-center gap-2"><Info className="h-5 w-5"/> Part Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{partDetails.description}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="pb-2">
                               <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> Common Failure Symptoms</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground text-sm">
                                {renderMarkdownList(partDetails.failureSymptoms)}
                                </div>
                            </CardContent>
                        </Card>
                        {partDetails.installationInstructions && (
                             <Card>
                                <CardHeader className="pb-2">
                                   <CardTitle className="text-lg flex items-center gap-2"><ListOrdered className="h-5 w-5"/> How-To Guide</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground text-sm">
                                    {renderMarkdownList(partDetails.installationInstructions, true)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {videoId && (
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg flex items-center gap-2"><Video className="h-5 w-5"/> Installation Tutorial</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video">
                                        <iframe
                                            key={videoId}
                                            className="w-full h-full rounded-lg"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <Separator />
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild size="lg" className="w-full">
                            <a href={partDetails.purchaseUrl} target="_blank" rel="noopener noreferrer">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Find at Online Store
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                           Note: Purchase and tutorial links are samples for demonstration purposes.
                        </p>

                </div>
            </div>
        </div>
    );
}
