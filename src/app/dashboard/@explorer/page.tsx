import { FamilyCard } from '@/components/explorer/family-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KnowledgeUpload } from '@/components/knowledge-upload';

// Mock Data
const MOCK_FAMILIES = [
    {
        id: '1',
        name: 'The Amrani Family',
        location: 'Casablanca, Morocco',
        description: 'A family of 5 needing support for basic food supplies and school materials during Ramadan.',
        status: 'verified' as const,
        funding: { current: 340, goal: 400, percentage: 85 }
    },
    {
        id: '2',
        name: 'Widow Kadija',
        location: 'Rabat, Morocco',
        description: 'Seeking assistance for medical expenses and heating for her small apartment.',
        status: 'urgent' as const, // Showing urgent tag example
        funding: { current: 120, goal: 500, percentage: 24 }
    },
    {
        id: '3',
        name: 'The Benali Children',
        location: 'Tangier, Morocco',
        description: 'Orphans needing full support for Eid clothing and school fees next semester.',
        status: 'verified' as const,
        funding: { current: 80, goal: 800, percentage: 10 }
    },
    {
        id: '4',
        name: 'Family Hassan',
        location: 'Fes, Morocco',
        description: 'Elderly couple requiring food assistance and medication support.',
        status: 'verified' as const,
        funding: { current: 450, goal: 450, percentage: 100 }
    }
];

export default function ExplorerPage() {
    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-casa-emerald/10 p-4 bg-white/50 backdrop-blur-sm">
                <div>
                    <h2 className="text-lg font-bold text-casa-night">Family Explorer</h2>
                    <p className="text-xs text-muted-foreground">Find families to support</p>
                </div>
                <KnowledgeUpload />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 p-4 pb-2">
                <Badge className="bg-casa-emerald text-white hover:bg-casa-emerald/90 cursor-pointer">Urgent</Badge>
                <Badge variant="outline" className="cursor-pointer bg-white text-muted-foreground hover:bg-gray-50 border-gray-200">Casablanca</Badge>
                <Badge variant="outline" className="cursor-pointer bg-white text-muted-foreground hover:bg-gray-50 border-gray-200">Rabat</Badge>
            </div>

            {/* List */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-4 pb-4">
                    <div className="grid gap-4 pb-8">
                        {MOCK_FAMILIES.map((family) => (
                            <FamilyCard key={family.id} family={family} />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

