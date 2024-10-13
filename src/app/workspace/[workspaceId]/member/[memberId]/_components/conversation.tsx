import React from "react";
import { Loader } from "lucide-react";

import { Id } from "@/../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";
import useMemberId from "@/hooks/use-member";
import { getMember } from "@/app/members/actions/get-member";
import { getMessages } from "@/app/messages/actions/get-messages";

import MessageList from "@/app/messages/_components/message-list";
import ConversationHeader from "./conversation-header";
import { ConversationChatInput } from "./conversation-chat-input";

interface ConversationProps {
  id: Id<"conversations">;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = getMember({
    id: memberId,
  });

  const { results, status, loadMore } = getMessages({ conversationId: id });

  if (memberLoading) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
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
