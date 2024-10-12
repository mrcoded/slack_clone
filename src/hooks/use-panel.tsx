import { useProfileId } from "@/store/use-profile-id";
import { useThreadId } from "@/store/use-thread-id";

export const usePanel = () => {
  const [threadId, setThreadId] = useThreadId();
  const [profileId, setProfileId] = useProfileId();

  const onOpenProfile = (memberId: string) => {
    setProfileId(memberId);
    setThreadId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setThreadId(messageId);
    setProfileId(null);
  };

  const onClose = () => {
    setThreadId(null);
    setProfileId(null);
  };

  return {
    threadId,
    profileId,
    onOpenMessage,
    onOpenProfile,
    onClose,
  };
};
