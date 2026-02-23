import React from "react";
import { CopyIcon, RefreshCcw } from "lucide-react";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useUpdateJoinCode } from "@/features/workspace/[workspaceId]/actions/update-join-code";

import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface InviteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

const InviteModal = ({
  isOpen,
  setIsOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action will deactivate the current invite code and generate a new one.",
  );

  const { mutate, isPending } = useUpdateJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("New invite code generated");
        },
        onError: () => {
          toast.error("Unable to generate new invite code.");
        },
      },
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard."));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent aria-describedby={"invite modal"}>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link <CopyIcon className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant="outline"
            >
              New code <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
