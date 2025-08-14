"use client";

import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Appliance } from '@/lib/types';

interface MaintenanceCardProps {
    appliance: Appliance;
}

export function MaintenanceCard({ appliance }: MaintenanceCardProps) {
    const [reminderSet, setReminderSet] = useState(false);

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
                     <p className="text-muted-foreground">August 30, 2024 (in 2 months)</p>
                </div>
                <Button 
                    onClick={() => setReminderSet(true)} 
                    disabled={reminderSet}
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
