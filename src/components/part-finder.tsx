"use client";

import { useState } from "react";
import { Wrench, Loader2, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompatibleParts } from "@/app/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "./ui/badge";

type PartFinderProps = {
  model: string;
};

export function PartFinder({ model }: PartFinderProps) {
  const [parts, setParts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindParts = async () => {
    setIsLoading(true);
    setError(null);
    setParts([]);
    
    const result = await getCompatibleParts({ applianceModel: model });

    if (result && result.length > 0) {
      setParts(result);
    } else {
      setError("Could not find any compatible parts for this model. Please check the model number or try again later.");
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Part Finder</CardTitle>
        <CardDescription>Find compatible replacement parts for model: <strong>{model}</strong></CardDescription>
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
                <div className="flex flex-wrap gap-2">
                    {parts.map((part, index) => (
                        <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                            {part}
                        </Badge>
                    ))}
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
