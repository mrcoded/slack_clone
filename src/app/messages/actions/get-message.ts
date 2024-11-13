import { useQuery } from "@/../convex/react";

import { api } from "@/../convex/_generated/api";
import { Id, Doc } from "@/../convex/_generated/dataModel";

interface getMessageProps {
  id: Id<"messages">;
}

type Message = {
  id: Id<"messages">;
  _id: Id<"messages">;
  memberId: any;
  _creationTime: number;
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
};

export const getMessage = ({ id }: getMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  const isLoading = data === undefined;

  return { data: data as unknown as Message, isLoading };
};
