import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  AlertTriangle,
  ChevronDownIcon,
  MailIcon,
  XIcon,
} from "lucide-react";

import { Id } from "@/../convex/_generated/dataModel";
import { toast } from "sonner";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { getMember } from "@/app/members/actions/get-member";
import { removeMember } from "../actions/remove-member";
import { updateMember } from "../actions/update-member";
import { getCurrentMember } from "../actions/get-current-member.actions";

import { Loading } from "@/components/loading";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}
const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [UpdateDialog, confirmUpdate] = useConfirm(
    "Change role",
    "Are you sure you want to change this member's role?"
  );

  const [LeaveDialog, confirmLeave] = useConfirm(
    "Leave workspace",
    "Are you sure you want to leave this workspace?"
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    "Remove member",
    "Are you sure you want to remove this member?"
  );

  const { data: member, isLoading: isLoadingMember } = getMember({
    id: memberId,
  });

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    getCurrentMember({
      workspaceId,
    });

  const { mutate: updatingMember, isPending: isUpdatingMember } =
    updateMember();

  const { mutate: removingMember, isPending: isRemovingMember } =
    removeMember();

  const handleRoleChange = async (role: "admin" | "member") => {
    const ok = await confirmUpdate();

    if (!ok) return;

    updatingMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success("Member role changed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to change member role");
        },
      }
    );
  };

  const handleLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removingMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("You left the workspace");
          router.replace(`/`);
          onClose();
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removingMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success("Member removed");
          onClose();
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border borber-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <Loading style="gap-y-2 flex-col"/>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border borber-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() ?? "M";

  return (
    <>
      <RemoveDialog />
      <UpdateDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border borber-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[250px] max-h-[256px] size-full">
            <AvatarImage src={member.user.image} />
            <AvatarFallback className="aspect-square text-7xl text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">{member.user.name}</p>

          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      handleRoleChange(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleRemove}
                variant="outline"
                className="w-full"
              >
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            <div className="mt-4">
              <Button
                onClick={handleLeave}
                variant="outline"
                className="w-full"
              >
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
