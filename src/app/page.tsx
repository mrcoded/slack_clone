"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useGetWorkspaces } from "@/features/workspace/actions/use-get-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace";

import { Loading } from "@/components/loading";

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
    return <Loading style="flex-col gap-y-2" />;
  }
}
