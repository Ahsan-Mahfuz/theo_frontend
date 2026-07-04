'use client';

import { useRouter } from 'next/navigation';
import { useStartConversationMutation } from '@/store/api/chatApi';

/**
 * Starts (or reuses) a conversation with a user and navigates to the message
 * page with that conversation already open. Use for "Message" buttons that
 * should take the user straight into the chat with a specific person.
 */
export function useOpenChat() {
  const router = useRouter();
  const [startConversation, { isLoading }] = useStartConversationMutation();

  const openChat = async (receiverId?: string | null) => {
    if (!receiverId) return;
    try {
      const conversation = await startConversation({ receiverId }).unwrap();
      router.push(`/dashboard/message?conversationId=${conversation._id}`);
    } catch {
      // Fall back to the inbox if the conversation could not be created.
      router.push('/dashboard/message');
    }
  };

  return { openChat, isOpening: isLoading };
}
