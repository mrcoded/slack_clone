import {
  PaginatedQueryReference,
  UsePaginatedQueryResult,
  usePaginatedQuery,
} from "convex/react";
import { PaginationResult } from "convex/server";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 5;

interface GetMessagesProps {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

export type GetMessagesReturnType = PaginationResult<
  typeof api.messages.get._returnType
>;

export const getMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: GetMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get as PaginatedQueryReference,
    { channelId, parentMessageId, conversationId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
