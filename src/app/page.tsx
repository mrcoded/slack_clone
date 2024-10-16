"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetWorkspaces } from "@/lib/actions/use-get-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace";

export default function Home() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspacId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspacId) {
      router.replace(`/workspace/${workspacId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [workspacId, isLoading, isOpen, setIsOpen, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
}
