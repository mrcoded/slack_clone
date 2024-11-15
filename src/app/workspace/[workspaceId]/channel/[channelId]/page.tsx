"use client";

import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

import useChannelId from "@/hooks/use-channel-id";
import { useGetChannel } from "@/features/channels/[channelId]/actions/get-channel";
import { useGetMessages } from "@/features/messages/actions/get-messages";

import { Loading } from "@/components/loading";
import ChannelHeader from "@/features/channels/[channelId]/_components/channel-header";
import { ChatInput } from "@/features/channels/[channelId]/_components/chat-input";
import MessageList from "@/features/messages/_components/message-list";

const ChannelIdPage = () => {
  const params = useSearchParams();
  const channelId = useChannelId();

  const isActiveThread = params.get("threadId");
  const isActiveProfile = params.get("profileId");

  const { results, status, loadMore } = useGetMessages({ channelId });

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
    return <Loading style="flex-1" />;
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full",
        isActiveThread && "hidden md:flex",
        isActiveProfile && "hidden md:flex"
      )}
    >
      <ChannelHeader title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />

      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
