"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel";

import { getWorkspace } from "./actions/get-workspace";
import { getCurrentMember } from "@/app/members/actions/get-current-member.actions";
import { getChannels } from "./channel/[channelId]/actions/get-channels";
import WorkspaceSidebar from "./_components/workspace-sidebar";

import { Loading } from "@/components/loading";

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

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Hook to monitor window size and adjust sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setIsSidebarVisible(false); // Hide sidebar on small screens
      } else {
        setIsSidebarVisible(true); // Show sidebar on larger screens
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    if (!isSidebarVisible) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

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

    if (!isOpen && isAdmin) {
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
    return <Loading style="flex-1 flex-col gap-y-2" />;
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

  return isSidebarVisible ? (
    <WorkspaceSidebar />
  ) : (
    <Loading style="flex-1 flex-col gap-y-2" />
  );
};

export default WorkspaceIdPage;
