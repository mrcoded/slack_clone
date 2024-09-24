"use client";

import { useEffect, useMemo } from "react";

import UserButton from "./auth/_components/user-button";

import { useGetWorkspaces } from "@/lib/actions/use-get-workspaces";
import { useCreateWorkspaceModal } from "../store/use-create-workspace";
import { useRouter } from "next/navigation";

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

  return (
    <div>
      Hello
      {/* <UserButton /> */}
    </div>
  );
}
