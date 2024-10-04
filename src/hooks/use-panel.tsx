import { useThreadId } from "@/store/use-thread-id";

export const usePanel = () => {
  const [threadId, setThreadId] = useThreadId();

  const onOpenMessage = (messageId: string) => {
    setThreadId(messageId);
  };

  const onClose = () => {
    setThreadId(null);
  };

  return {
    threadId,
    onOpenMessage,
    onClose,
  };
};
