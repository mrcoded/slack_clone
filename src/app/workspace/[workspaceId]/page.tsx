"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel";

import { useGetWorkspace } from "@/features/workspace/[workspaceId]/actions/get-workspace";
import { useGetCurrentMember } from "@/features/members/[memberId]/actions/get-current-member.actions";
import { useGetChannels } from "@/features/channels/[channelId]/actions/get-channels";
import WorkspaceSidebar from "@/features/workspace/[workspaceId]/_components/workspace-sidebar";

import { Loading } from "@/components/loading";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [isOpen, setIsOpen] = useCreateChannelModal();

  const [windowWidth, setWindowWidth] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const { data: member, isLoading: memberLoading } = useGetCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  // Hook to monitor window size and adjust sidebar visibility
  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== "undefined") {
      const handleResize = () => {
        const currentWidth = window.innerWidth;
        setWindowWidth(currentWidth);

        if (window.innerWidth > 640) {
          setIsSidebarVisible(false); // Hide sidebar on large screens
        } else {
          setIsSidebarVisible(true); // Show sidebar on small screens
        }
      };

      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);

      if (!isSidebarVisible && channelId) {
        router.push(`/workspace/${workspaceId}/channel/${channelId}`);
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [windowWidth, isSidebarVisible, channelId]);

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

  useEffect(() => {
    if (channelId) {
      setIsOpen(false);
    }
  }, [channelId, setIsOpen]);

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
