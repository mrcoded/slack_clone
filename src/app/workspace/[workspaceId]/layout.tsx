"use client";

import React from "react";
import { Loader } from "lucide-react";

import { Id } from "@/../convex/_generated/dataModel";
import { usePanel } from "@/hooks/use-panel";
import Toolbar from "../shared/toolbar";
import Sidebar from "../shared/sidebar";

import Thread from "@/components/thread";
import WorkspaceSidebar from "./_components/workspace-sidebar";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { threadId, onClose } = usePanel();

  const showPanel = !!threadId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-[#5E2C5F]"
          >
            <WorkspaceSidebar />
            <div>Channels Sidebar</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {threadId ? (
                  <Thread
                    messageId={threadId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <span className="flex h-full items-center justify-center">
                    <Loader className="size-4 animate-spin text-muted-foreground" />
                  </span>
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
