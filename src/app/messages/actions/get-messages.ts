import { usePaginatedQuery } from "convex/react";
import { paginationOptsValidator } from "convex/server";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 5;

interface getMessagesProps {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

export type GetMessagesReturnType = (typeof api.messages.get._returnType)["page"];

export const getMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: getMessagesProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, parentMessageId, conversationId },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
