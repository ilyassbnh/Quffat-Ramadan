'use client';

import { KnowledgeUpload } from '@/components/knowledge-upload';

export default function TestUploadPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10">
            <h1 className="text-2xl font-bold mb-8 text-casa-night">Test Upload Component</h1>
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-casa-emerald/10">
                <KnowledgeUpload />
            </div>
        </div>
    );
}
