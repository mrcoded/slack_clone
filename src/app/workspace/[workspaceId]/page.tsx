"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel";

import { getWorkspace } from "./actions/get-workspace";
import { getCurrentMember } from "@/app/members/actions/get-current-member.actions";
import { getChannels } from "./channel/[channelId]/actions/get-channels";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = getCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = getWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = getChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelsLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!isOpen && isAdmin) {
      setIsOpen(true);
    }
  }, [
    memberLoading,
    member,
    isAdmin,
    workspaceLoading,
    channelsLoading,
    channelId,
    workspace,
    isOpen,
    setIsOpen,
    router,
    workspaceId,
  ]);

  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
