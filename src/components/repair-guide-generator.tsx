'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateRepairGuide } from '@/ai/flows/generate-repair-guide';
import { Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Wrench } from 'lucide-react';

interface RepairGuideGeneratorProps {
  applianceType: string;
  applianceModel: string;
}

export function RepairGuideGenerator({ applianceType, applianceModel }: RepairGuideGeneratorProps) {
  const [problem, setProblem] = useState('');
  const [guide, setGuide] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!problem) return;
    setIsLoading(true);
    setError(null);
    setGuide('');

    try {
      const result = await generateRepairGuide({
        applianceType,
        applianceModel,
        problemDescription: problem,
      });
      setGuide(result.guide);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate guide. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            DIY Repair Guide
        </CardTitle>
        <CardDescription>
            Describe the problem you&apos;re facing, and our AI assistant will generate a step-by-step repair guide for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Textarea
            placeholder={`e.g., "The ice maker is not making ice."`}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={3}
            className="resize-none"
            />
            <Button onClick={handleSubmit} disabled={isLoading || !problem} className="w-full sm:w-auto">
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Guide
            </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <Wrench className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {isLoading && !guide && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Generating your guide...</p>
            </div>
        )}

        {guide && (
          <div className="prose dark:prose-invert max-w-none p-4 border rounded-lg bg-secondary/50">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h2 className="text-xl font-bold" {...props} />,
                h2: ({node, ...props}) => <h3 className="text-lg font-semibold" {...props} />,
                h3: ({node, ...props}) => <h4 className="text-base font-semibold" {...props} />,
              }}
            >
                {guide}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
