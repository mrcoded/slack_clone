import React from "react";
import Link from "next/link";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import useWorkspaceId from "@/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";

const sidebarItemVariants = cva(
  "flex justify-start items-center gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  link?: string;
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

const SidebarItems = ({
  link,
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant: variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/${link}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItems;
