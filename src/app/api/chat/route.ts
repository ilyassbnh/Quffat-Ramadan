import { chatAction } from '@/actions/chat-action';

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        console.log('[API /chat] Received body:', JSON.stringify(body, null, 2));

        const { messages } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            console.error('[API /chat] Invalid messages format');
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get the last message
        const lastMessage = messages[messages.length - 1];
        console.log('[API /chat] Last message:', JSON.stringify(lastMessage, null, 2));

        // AI SDK v6 uses 'parts' array, but we also support legacy 'content' string
        let messageContent: string;

        if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
            // AI SDK v6 format: extract text from parts
            messageContent = lastMessage.parts
                .filter((part: { type: string; text?: string }) => part.type === 'text')
                .map((part: { text: string }) => part.text)
                .join('');
        } else if (typeof lastMessage.content === 'string') {
            // Legacy format or simple content
            messageContent = lastMessage.content;
        } else {
            messageContent = JSON.stringify(lastMessage.content || '');
        }

        console.log('[API /chat] Extracted message content:', messageContent);

        if (!messageContent || messageContent.trim() === '') {
            console.error('[API /chat] Empty message content');
            return new Response(JSON.stringify({ error: 'Empty message content' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Call the server action
        console.log('[API /chat] Calling chatAction...');
        const result = await chatAction(messageContent);
        console.log('[API /chat] chatAction completed successfully');
        return result;
    } catch (error) {
        console.error('[API /chat] Error:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error)
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
