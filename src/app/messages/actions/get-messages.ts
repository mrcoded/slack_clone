import {
  PaginatedQueryReference,
  UsePaginatedQueryResult,
  usePaginatedQuery,
} from "convex/react";
import { PaginationResult } from "convex/server";

import { api } from "@/../convex/_generated/api";
import { Id, Doc } from "@/../convex/_generated/dataModel";

const BATCH_SIZE = 5;

interface GetMessagesProps {
  channelId?: Id<"channels">;
  parentMessageId?: Id<"messages">;
  conversationId?: Id<"conversations">;
}

interface Message {
  id: Id<"messages">;
  _id: Id<"messages">;
  _creationTime: number;
  memberId: any;
  user: {
    _id: string;
    name: string;
    image: string;
  };
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadsButton?: boolean;
  threadsCount?: number;
  threadsImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

export type GetMessagesReturnType = Message[];

export const getMessages = ({
  channelId,
  parentMessageId,
  conversationId,
}: GetMessagesProps): {
  results: GetMessagesReturnType;
  status: UsePaginatedQueryResult<GetMessagesReturnType>["status"];
  loadMore: () => void;
} => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get as PaginatedQueryReference,
    { channelId, parentMessageId, conversationId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results: results as GetMessagesReturnType,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
