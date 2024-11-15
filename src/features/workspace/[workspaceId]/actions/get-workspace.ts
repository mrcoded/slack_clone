import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";

interface getWorkspaceProps {
  id: Id<"workspaces">;
}

export const useGetWorkspace = ({ id }: getWorkspaceProps) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
