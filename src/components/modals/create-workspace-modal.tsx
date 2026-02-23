import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

import { useCreateWorkspaces } from "@/features/workspace/actions/use-create-workspaces";
import { useCreateWorkspaceModal } from "@/store/use-create-workspace";

const CreateWorkspaceModal = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();

  const { mutate, isPending, isSuccess, isError, data, error } =
    useCreateWorkspaces();

  const handleClose = () => {
    setIsOpen(false);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name },
      {
        onSuccess(id) {
          toast.success("Workspace created");
          router.push(`/workspace/${id}`);
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby={"create workspace modal"}>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
