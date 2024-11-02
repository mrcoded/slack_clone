import { useQuery } from "@/../convex/react";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface getUnreadStatusProps {
  memberId?: Id<"members">;
  channelId: Id<"channels">;
  conversationId?: Id<"conversations">;
  workspaceId: Id<"workspaces">;
}

export const getUnreadStatus = ({
  memberId,
  channelId,
  conversationId,
  workspaceId,
}: getUnreadStatusProps) => {
  const data = useQuery(api.unreadStatus.getUnreadStatus, {
    memberId,
    channelId,
    conversationId,
    workspaceId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
