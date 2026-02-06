'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useMemo } from 'react';

// Zod Schema for chat input
const chatSchema = z.object({
    message: z.string().min(1, { message: "Message cannot be empty" }),
});

type ChatFormValues = z.infer<typeof chatSchema>;

// Helper to extract text content from AI SDK v6 message parts
function getMessageContent(message: { role: string; parts?: Array<{ type: string; text?: string }> }): string {
    if (!message.parts) return '';
    return message.parts
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text' && !!part.text)
        .map(part => part.text)
        .join('');
}

export function ChatUI() {
    // AI SDK v6: Create transport with API endpoint
    const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), []);

    const { messages, sendMessage, status } = useChat({
        transport,
    });

    const isLoading = status === 'streaming' || status === 'submitted';
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Form handling with Zod validation
    const form = useForm<ChatFormValues>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: "",
        },
    });

    // Submit handler using sendMessage from AI SDK v6
    const onSubmit = async (data: ChatFormValues) => {
        if (!data.message.trim()) return;

        try {
            // AI SDK v6: sendMessage takes { text: string } format
            await sendMessage({ text: data.message });
            form.reset();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="flex h-full flex-col bg-casa-white/50">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-casa-emerald/10 p-4 backdrop-blur-sm shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-casa-emerald/10 text-casa-emerald">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-casa-night">Sadaqa Assistant</h2>
                    <p className="text-xs text-muted-foreground">Ask about donation opportunities</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden p-4 min-h-0">
                <ScrollArea className="h-full pr-4">
                    <div className="flex flex-col gap-6">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <div className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            )}
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    <Avatar className="h-8 w-8 mt-1 border border-white shadow-sm">
                                        <AvatarFallback className={cn(
                                            "text-xs font-bold",
                                            m.role === 'user' ? "bg-casa-emerald text-white" : "bg-casa-gold text-white"
                                        )}>
                                            {m.role === 'user' ? 'ME' : 'AI'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col gap-1 max-w-[80%]">
                                        <span className="text-[10px] text-muted-foreground ml-1">
                                            {m.role === 'user' ? 'You' : 'Sadaqa Pulse'}
                                        </span>
                                        <div
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                                m.role === 'user'
                                                    ? "bg-casa-emerald text-white rounded-tr-sm"
                                                    : "bg-white text-casa-night border border-gray-100 rounded-tl-sm"
                                            )}
                                        >
                                            {getMessageContent(m)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <Avatar className="h-8 w-8 border border-white shadow-sm">
                                    <AvatarFallback className="bg-casa-gold text-white text-xs">AI</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 shadow-sm">
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-casa-emerald"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-casa-emerald delay-75"></div>
                                    <div className="h-2 w-2 animate-bounce rounded-full bg-casa-emerald delay-150"></div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="border-t border-casa-emerald/10 bg-white/60 p-4 backdrop-blur-md shrink-0">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="relative flex items-center gap-2"
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Type a message..."
                                            className="h-12 rounded-full border-gray-200 bg-white pl-4 pr-12 shadow-sm focus-visible:border-casa-emerald focus-visible:ring-casa-emerald/20"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-2 top-1.5 h-9 w-9 rounded-full bg-casa-emerald hover:bg-casa-emerald/90 text-white shadow-md transition-all hover:scale-105"
                            disabled={isLoading || !form.formState.isValid}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
