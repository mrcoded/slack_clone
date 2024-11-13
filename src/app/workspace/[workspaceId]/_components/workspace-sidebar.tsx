import React from "react";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizonal,
} from "lucide-react";

import { cn } from "@/lib/utils";

import useMemberId from "@/hooks/use-member";
import useChannelId from "@/hooks/use-channel-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/store/use-create-channel";

import { getMembers } from "@/app/members/actions/get-members.actions";
import { getChannels } from "../channel/[channelId]/actions/get-channels";
import { getWorkspace } from "@/app/workspace/[workspaceId]/actions/get-workspace";
import { getCurrentMember } from "@/app/members/actions/get-current-member.actions";

import UserItem from "./user-item";
import SidebarItems from "./sidebar-items";
import WorkspaceHeader from "./workspace-header";
import WorkspaceSection from "./workspace-section";

const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const pathname = usePathname();

  const isActiveChannel = pathname.includes(`/channel/${channelId}`);

  const [_isOpen, setIsOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = getCurrentMember({
    workspaceId,
  });

  const { data: workspace, isLoading: workspaceLoading } = getWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = getChannels({
    workspaceId,
  });

  const { data: members, isLoading: membersLoading } = getMembers({
    workspaceId,
  });

  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-black/75 md:bg-[#5E2C5F] h-full",
        isActiveChannel && "hidden md:flex"
      )}
    >
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />

      <div className="flex flex-col px-2 mt-3">
        <SidebarItems
          link={`/threads`}
          label="Threads"
          icon={MessageSquareText}
          id="threads"
        />
        <SidebarItems label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
      </div>

      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setIsOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItems
            link={`/channel/${item._id}`}
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>

      <WorkspaceSection
        label="Direct Messages"
        hint="New direct message"
        onNew={() => {}}
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
