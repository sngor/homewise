"use client";

import { useState, useMemo } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appliance } from '@/lib/types';
import { addMonths, addYears, format, formatDistanceToNow, parseISO } from 'date-fns';

interface MaintenanceCardProps {
    appliance: Appliance;
}

const calculateNextDueDate = (purchaseDateStr: string, schedule: string): Date | null => {
    const purchaseDate = parseISO(purchaseDateStr);
    const scheduleLower = schedule.toLowerCase();
    
    let monthsToAdd = 0;
    
    if (scheduleLower.includes("annually") || scheduleLower.includes("year")) {
        return addYears(purchaseDate, 1);
    }

    const monthMatch = scheduleLower.match(/every (\d+) months?/);
    if (monthMatch && monthMatch[1]) {
        monthsToAdd = parseInt(monthMatch[1], 10);
        let nextDueDate = addMonths(purchaseDate, monthsToAdd);
        // If the next due date is in the past, keep adding the interval until it's in the future
        while (nextDueDate < new Date()) {
            nextDueDate = addMonths(nextDueDate, monthsToAdd);
        }
        return nextDueDate;
    }

    return null; // Return null if schedule is not recognized
}


export function MaintenanceCard({ appliance }: MaintenanceCardProps) {
    const [reminderSet, setReminderSet] = useState(false);

    const nextDueDate = useMemo(() => 
        calculateNextDueDate(appliance.purchaseDate, appliance.maintenanceSchedule),
    [appliance.purchaseDate, appliance.maintenanceSchedule]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Maintenance Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <h4 className="font-medium">Schedule</h4>
                    <p className="text-muted-foreground">{appliance.maintenanceSchedule}</p>
                </div>
                <div className="space-y-2">
                     <h4 className="font-medium">Next Due Date</h4>
                     <p className="text-muted-foreground">
                        {nextDueDate ? 
                            `${format(nextDueDate, "MMMM dd, yyyy")} (${formatDistanceToNow(nextDueDate, { addSuffix: true })})` 
                            : "Could not determine next due date."}
                     </p>
                </div>
                <Button 
                    onClick={() => setReminderSet(true)} 
                    disabled={reminderSet || !nextDueDate}
                    className="w-full sm:w-auto"
                >
                    {reminderSet ? (
                        <>
                            <Check className="mr-2 h-4 w-4"/>
                            Reminder Set
                        </>
                    ) : (
                        <>
                            <Calendar className="mr-2 h-4 w-4"/>
                            Set Reminder
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
