'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { updateAppliance } from '@/lib/data';
import { getEnergyInsights } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, LineChart as LineChartIcon, Wand2, Info, Lightbulb, CheckCircle, ExternalLink } from 'lucide-react';
import type { Appliance, EnergyReading, EnergyInsight } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';

interface EnergyTrackerProps {
  appliance: Appliance;
}

export function EnergyTracker({ appliance }: EnergyTrackerProps) {
  const [readings, setReadings] = useState<EnergyReading[]>(appliance.energyReadings || []);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [consumption, setConsumption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insights, setInsights] = useState<EnergyInsight | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGetInsights = async () => {
    setIsLoadingInsights(true);
    setInsights(null);
    try {
      const result = await getEnergyInsights({
        applianceType: appliance.type,
        applianceBrand: appliance.brand,
        applianceModel: appliance.model,
      });
      setInsights(result);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Failed to get insights',
        description: e instanceof Error ? e.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const chartData = readings
    .map(r => ({ date: parseISO(r.date), consumption: r.consumption }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const chartConfig = {
    consumption: {
      label: "kWh",
      color: "hsl(var(--primary))",
    },
  };

  const handleAddReading = async () => {
    if (!date || !consumption) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please provide both date and consumption.' });
      return;
    }
    const consumptionValue = parseFloat(consumption);
    if (isNaN(consumptionValue) || consumptionValue < 0) {
        toast({ variant: 'destructive', title: 'Invalid Input', description: 'Consumption must be a positive number.' });
        return;
    }

    setIsSubmitting(true);
    const newReading: EnergyReading = { date: date.toISOString(), consumption: consumptionValue };
    const updatedReadings = [...readings, newReading];

    try {
      await updateAppliance(appliance.id, { energyReadings: updatedReadings });
      setReadings(updatedReadings);
      setDate(new Date());
      setConsumption('');
      toast({ title: 'Success', description: 'Energy reading added.' });
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add reading.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-6 w-6" />
            Energy Consumption
        </CardTitle>
        <CardDescription>Track and visualize the energy usage of this appliance over time. You can also get AI-powered insights.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Button onClick={handleGetInsights} disabled={isLoadingInsights}>
                {isLoadingInsights ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                )}
                Get AI Energy Insights
            </Button>
            <p className="text-sm text-muted-foreground">Estimate annual consumption, cost, and get savings tips.</p>
        </div>

        {isLoadingInsights && (
            <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Analyzing energy profile... Please wait.</p>
            </div>
        )}

        {insights && (
            <div className="space-y-6 rounded-lg border bg-secondary/50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-md border bg-background p-4">
                        <h4 className="font-semibold text-lg text-primary">{insights.estimatedAnnualKwh.toLocaleString()} kWh</h4>
                        <p className="text-sm text-muted-foreground">Estimated Annual Consumption</p>
                    </div>
                    <div className="rounded-md border bg-background p-4">
                        <h4 className="font-semibold text-lg text-primary">${insights.estimatedAnnualCost.toFixed(2)}</h4>
                        <p className="text-sm text-muted-foreground">Estimated Annual Cost (@ $0.17/kWh)</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" />Energy Saving Tips</h4>
                    <ul className="mt-2 space-y-3 pl-5 list-disc">
                        {insights.tips.map((tip, i) => (
                            <li key={i} className="ml-2">
                                <span className="font-semibold">{tip.title}:</span>
                                <p className="text-muted-foreground">{tip.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Data Sources</h4>
                    <div className="mt-2 space-y-1 text-sm">
                        {insights.sources.map((source, i) => (
                            <a key={i} href={source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink className="h-4 w-4" />
                                <span>{source}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        )}

        <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Manual Entry</h3>
            {chartData.length > 0 ? (
            <div className="aspect-video">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(tick) => format(tick, 'MMM yy')}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis strokeWidth={0} tickFormatter={(tick) => `${tick} kWh`} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Area
                            dataKey="consumption"
                            type="monotone"
                            fill="var(--color-consumption)"
                            stroke="var(--color-consumption)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </div>
            ) : (
            <div className="text-center text-muted-foreground py-12">
                <p>No energy data recorded yet.</p>
                <p className="text-sm">Add a reading below to get started.</p>
            </div>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 border-t pt-6 bg-secondary/50">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{format(date || new Date(), 'PPP')}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
        <Input
          type="number"
          placeholder="Consumption (kWh)"
          value={consumption}
          onChange={(e) => setConsumption(e.target.value)}
          className="max-w-[180px]"
        />
        <Button onClick={handleAddReading} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add Reading
        </Button>
      </CardFooter>
    </Card>
  );
}
