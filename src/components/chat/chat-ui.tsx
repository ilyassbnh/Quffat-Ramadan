'use client';

import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ChatUI() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat', // Call backend API route (Standard in Next.js AI SDK)
        // OR we can pass the server action directly if using experimental support, 
        // BUT Vercel AI SDK generally prefers an API route handler for streaming.
        // Wait, the user asked for a Server Action: "Create src/actions/chat-action.ts... wrapper with generic stream?"
        // Actually, useChat supports `api` as a function or URL. 
        // If we want to use the Server Action `chatAction(message)`, we might need a custom `execute` logic or a route handler wrapper.
        // However, recent AI SDK versions support Server Actions directly if configured.
        // For simplicity with `useChat`, let's check if we can pass a mutate function or use `experimental_useObject`.
        // BUT, the standard efficient way is a Route Handler.
        // Let's re-read the prompt: "Elle envoie le tout à Gemini Flash... streamer la réponse textuelle vers le client."
        // And "Crée src/actions/chat-action.ts".
        // 
        // To use Server Action with `useChat`:
        // It's possible to use `streamText` result in a server action and consuming it in client.
        // Let's assume we need to fetch from the server action.
        // The `useChat` hook expects an endpoint by default.
        // 
        // Alternative: We can use a custom submit handler calling the server action.
    });

    // Wait, I implemented `chatAction` returning `result.toDataStreamResponse()`. This is for a Route Handler.
    // Server Actions typically return a `StreamableValue` in RSC or a raw stream.
    // `streamText` in Server Action returns a stream.
    // 
    // CORRECTION: `toDataStreamResponse()` returns a `Response` object (Web Standard), which is what a Route Handler returns.
    // A Server Action cannot return a `Response` object directly to the client in the same way an API route does for `useChat` to consume automatically via fetch.
    // 
    // HOWEVER, the user explicitly asked for a **Server Action** in the previous step.
    // And now specifically asks "create me that".
    // 
    // Let's implement a Route Handler to Wrap the Action OR use the Action directly if using React 19/Next 14+ Streaming.
    // BUT the easiest bridge for `useChat` (which is standard) is a Route Handler.
    // 
    // Let's check `src/actions/chat-action.ts` again. It returns `result.toDataStreamResponse()`.
    // This return type is for Route Handlers (POST).
    // 
    // If the user insisted on Server Action, they might try to call it from client. 
    // We can't return a Response object from a Server Action to the client easily to replace `fetch`.
    // 
    // WORKAROUND: I will create a Route Handler `src/app/api/chat/route.ts` that calls the logic, 
    // OR refactor the Server Action to return a `StreamableValue` (if using `ai/rsc`).
    // 
    // Given the previous step mandated `src/actions/chat-action.ts`, I will try to use it.
    // But strictly speaking, `toDataStreamResponse()` is for HTTP responses.
    // 
    // Let's assume for this step I will build the UI.
    // I will assume there is an API route or I will create one to wrap it, 
    // OR I will simply wire `useChat` to `/api/chat` and ensure that route exists.

    return (
        <Card className="flex h-full flex-col border-0 rounded-none shadow-none bg-transparent">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg font-medium">Casa AI</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{m.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
                                    {m.role !== 'user' && <AvatarImage src="/bot-avatar.png" />}
                                </Avatar>

                                <div
                                    className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${m.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                                    <span className="animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t mt-auto">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask about Ramadan 2026..."
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={isLoading}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
