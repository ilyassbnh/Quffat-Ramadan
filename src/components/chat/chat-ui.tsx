'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

// Zod Schema for chat input
const chatSchema = z.object({
    message: z.string().min(1, { message: "Message cannot be empty" }),
});

type ChatFormValues = z.infer<typeof chatSchema>;

export function ChatUI() {
    const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Form handling
    const form = useForm<ChatFormValues>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            message: "",
        },
    });

    // Sync React Hook Form with AI SDK input
    const handleFormSubmit = async (data: ChatFormValues) => {
        // Manually triggering the AI SDK submit
        // We set the input state first to ensure useChat picks it up if needed, 
        // although handleSubmit passes the event.
        // Ideally, we just pass a synthetic event or call the submit logic.
        // For simplicity with useChat + custom form, we can just call append() strictly or 
        // let useChat handle the input state binding.

        // Simplest way: useChat standard submit requires an event.
        // We can simulate it or just use append if we wanted to bypass 'input' state.
        // But since we want to "mock" for now as per instructions (but connected via Zod),
        // let's do the "Mock" alert but proceed with standard useChat for the future.

        // INSTRUCTION: "laisse la logique d'envoi vide pour l'instant (mock)"
        // I will currently NOT call the API.
        // I will mock adding a user message to the UI state if possible, 
        // OR just console log to satisfy the constraint.

        console.log("Mock Submit:", data.message);
        // setInput(data.message); // Sync with AI SDK
        // handleSubmit(); // This would trigger the real API call
        form.reset();
    };

    // Custom submit that bridges Zod and useChat (mocked for now)
    const onSubmit = (data: ChatFormValues) => {
        console.log("Zod Validated:", data);
        // NOTE: Actual send logic paused as requested.
        // To really "mock" the appearance, we could manually setMessages([...messages, ...])
        // but useChat controls that.
    };

    return (
        <div className="flex h-full flex-col bg-casa-white/50">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-casa-emerald/10 p-4 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-casa-emerald/10 text-casa-emerald">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-casa-night">Sadaqa Assistant</h2>
                    <p className="text-xs text-muted-foreground">Ask about donation opportunities</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden p-4">
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
                                        {/* {m.role !== 'user' && <AvatarImage src="/bot-avatar.png" />} */}
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
                                            {m.content}
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
            <div className="border-t border-casa-emerald/10 bg-white/60 p-4 backdrop-blur-md">
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
