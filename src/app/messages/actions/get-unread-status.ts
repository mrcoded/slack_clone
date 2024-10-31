import {
  PaginatedQueryReference,
  UsePaginatedQueryResult,
  usePaginatedQuery,
} from "convex/react";
import { PaginationResult } from "convex/server";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 5;

interface getUnreadStatusProps {
  channelId: Id<"channels">;
  memberId?: Id<"members">;
  conversationId?: Id<"conversations">;
  unreadStatusId?: Id<"unreadStatus">;
}

export type GetMessagesReturnType = PaginationResult<
  typeof api.messages.get._returnType
>;

export const getUnreadStatus = ({
  channelId,
  memberId,
  conversationId,
  unreadStatusId,
}: getUnreadStatusProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get as PaginatedQueryReference,
    { channelId, memberId, conversationId, unreadStatusId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
