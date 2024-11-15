import React from "react";

import { Id } from "@/../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";
import useMemberId from "@/hooks/use-member";
import { useGetMember } from "@/features/members/[memberId]/actions/get-member";
import { useGetMessages } from "@/features/messages/actions/get-messages";

import MessageList from "@/features/messages/_components/message-list";
import ConversationHeader from "./conversation-header";
import { ConversationChatInput } from "./conversation-chat-input";
import { Loading } from "@/components/loading";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  if (memberLoading) {
    return <Loading style="flex-col gap-y-2" />;
  }

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ConversationChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};

export default Conversation;
