"use client";

import { useState } from "react";
import { Wrench, Loader2, Search, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompatibleParts } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Part } from "@/ai/flows/find-compatible-parts";
import Link from "next/link";
import { useParams } from "next/navigation";

type PartFinderProps = {
  brand: string;
  model: string;
};

export function PartFinder({ brand, model }: PartFinderProps) {
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const applianceId = params.id as string;

  const handleFindParts = async () => {
    setIsLoading(true);
    setError(null);
    setParts([]);
    
    try {
      const result = await getCompatibleParts({ applianceBrand: brand, applianceModel: model });

      if (result.parts && result.parts.length > 0) {
        setParts(result.parts);
      } else {
        setError("Could not find any compatible parts for this model. Please check the model number or try again later.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Part Finder</CardTitle>
        <CardDescription>Find compatible replacement parts for <strong>{brand} {model}</strong></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleFindParts} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Find Compatible Parts
        </Button>

        {error && (
            <Alert variant="destructive">
                <Wrench className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {parts.length > 0 && (
            <div>
                <h3 className="font-semibold mb-2">Compatible Parts:</h3>
                 <ul className="divide-y border rounded-md">
                    {parts.map((part, index) => (
                       <li key={index}>
                         <Link href={`/appliance/${applianceId}/part/${encodeURIComponent(part.name)}`} className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                            <div>
                                <p className="font-medium">{part.name}</p>
                                <p className="text-sm text-muted-foreground">{part.description}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                         </Link>
                       </li>
                    ))}
                </ul>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
