import { useQuery } from "@/../convex/react";

import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface getMembersProps {
  workspaceId: Id<"workspaces">;
}

export const getMembers = ({ workspaceId }: getMembersProps) => {
  const data = useQuery(api.members.get, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
