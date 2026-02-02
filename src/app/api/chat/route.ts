import { chatAction } from '@/actions/chat-action';

export const POST = async (req: Request) => {
    const { messages } = await req.json();
    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Call the server action directly (since it returns a Response for data stream)
    // We can just return the result of chatAction
    return chatAction(lastMessage.content);
};
