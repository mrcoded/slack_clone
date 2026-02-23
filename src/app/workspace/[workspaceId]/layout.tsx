"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { useWindowSize } from "react-use";
import { Id } from "@/../convex/_generated/dataModel";

import { usePanel } from "@/hooks/use-panel";
import Thread from "@/components/thread";
import { Loading } from "@/components/loading";
import Toolbar from "@/app/workspace/shared/toolbar";
import Sidebar from "@/app/workspace/shared/sidebar";

import Profile from "@/features/members/_components/profile";
import WorkspaceSidebar from "@/features/workspace/[workspaceId]/_components/workspace-sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const params = useSearchParams();
  const { width } = useWindowSize();
  const isMobile = width < 556;

  const isActiveThread = params.get("threadId");
  const isActiveProfile = params.get("profileId");

  const { threadId, profileId, onClose } = usePanel();

  const showPanel = !!threadId || !!profileId;

  return (
    <div className="h-full flex flex-col">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          orientation="horizontal"
          autoSave="ca-workspace-layout"
        >
          {!isMobile && (
            <ResizablePanel
              defaultSize="20"
              minSize="11"
              className="bg-[#5E2C5F] hidden sm:flex"
            >
              <WorkspaceSidebar />
            </ResizablePanel>
          )}
          <ResizableHandle withHandle className="hidden sm:flex" />
          <ResizablePanel
            minSize="20"
            defaultSize="80"
            className={cn(
              isActiveThread && "hidden md:flex",
              isActiveProfile && "hidden md:flex",
            )}
          >
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle
                withHandle
                className={cn(
                  isActiveThread && "hidden md:flex",
                  isActiveProfile && "hidden md:flex",
                )}
              />
              <ResizablePanel minSize="20" defaultSize="29">
                {threadId ? (
                  <Thread
                    messageId={threadId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileId ? (
                  <Profile
                    memberId={profileId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <Loading />
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
