"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Id } from "@/../convex/_generated/dataModel";
import { toast } from "sonner";
import useMemberId from "@/hooks/use-member";
import useWorkspaceId from "@/hooks/use-workspace-id";

import { createOrGetConversation } from "@/api/conversations/create-or-get-conversation";
import Conversation from "./_components/conversation";

import { Loading } from "@/components/loading";

const MemberIdPage = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = createOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <Loading style="flex-col gap-y-2"/>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
