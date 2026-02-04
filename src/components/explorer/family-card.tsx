'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FamilyCardProps {
    family: {
        id: string;
        name: string;
        location: string;
        description: string;
        status: 'urgent' | 'verified' | 'funded';
        funding: {
            current: number;
            goal: number;
            percentage: number;
        };
        avatarUrl?: string; // Optional avatar
    };
}

export function FamilyCard({ family }: FamilyCardProps) {
    return (
        <Card className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md h-full flex flex-col bg-white">
            {/* Zellige Header with Status Badge */}
            <div className="relative h-24 w-full bg-casa-emerald/10">
                {/* Zellige Pattern Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url('/zellige-header.png')`,
                        backgroundSize: '150px', // Adjust scale
                        backgroundRepeat: 'repeat'
                    }}
                />

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {family.status === 'verified' && (
                        <Badge variant="secondary" className="bg-white/90 text-casa-emerald backdrop-blur-sm shadow-sm gap-1 hover:bg-white">
                            <CheckCircle2 className="h-3 w-3" /> VERIFIED
                        </Badge>
                    )}
                    {family.status === 'urgent' && (
                        <Badge variant="destructive" className="bg-white/90 text-red-500 backdrop-blur-sm shadow-sm hover:bg-white">
                            Urgent
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content */}
            <CardHeader className="relative -mt-8 flex-row items-end gap-3 px-4 pb-2 pt-0">
                <Avatar className="h-16 w-16 border-4 border-white shadow-md bg-white">
                    <AvatarFallback className="bg-casa-terracotta text-white text-lg font-bold">
                        {family.name.substring(0, 1)}
                    </AvatarFallback>
                    {family.avatarUrl && <AvatarImage src={family.avatarUrl} alt={family.name} />}
                </Avatar>
                <div className="pb-1">
                    <h3 className="font-semibold text-lg text-casa-night leading-none">{family.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {family.location}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 py-3 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {family.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-casa-emerald">{family.funding.percentage}% Funded</span>
                        <span className="text-muted-foreground">${family.funding.current} / ${family.funding.goal}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full bg-casa-emerald transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${family.funding.percentage}%` }}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="px-4 pb-4 pt-0">
                {/* Action - placeholder for now */}
            </CardFooter>
        </Card>
    );
}

