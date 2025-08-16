'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { updateAppliance } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, LineChart as LineChartIcon } from 'lucide-react';
import type { Appliance, EnergyReading } from '@/lib/types';
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
  const { toast } = useToast();
  const router = useRouter();

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
        <CardDescription>Track and visualize the energy usage of this appliance over time.</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex flex-wrap gap-4 border-t pt-6">
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
