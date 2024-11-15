import { Doc, Id } from "@/../convex/_generated/dataModel";

import useWorkspaceId from "@/hooks/use-workspace-id";
import { useGetCurrentMember } from "@/features/members/[memberId]/actions/get-current-member.actions";
import { cn } from "@/lib/utils";
import Hint from "./hint";
import EmojiPopover from "./emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useGetCurrentMember({ workspaceId });

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-centr gap-1 my-1">
      {data.map((reaction) => {
        const currentMemberReaction =
          reaction.memberIds.includes(currentMemberId);

        const currentMemberCount = reaction.count - 1;

        return (
          <Hint
            key={reaction._id}
            label={`${currentMemberReaction ? "you" : ""} 
          ${
            currentMemberReaction
              ? `${currentMemberCount === 0 ? "" : reaction.count - 1}`
              : reaction.count
          } 
            ${currentMemberReaction && reaction.count === 1 ? "" : "person"} reacted with ${reaction.value}`}
          >
            <button
              onClick={() => onChange(reaction.value)}
              className={cn(
                "h-6 px-2 rounded-full flex items-center gap-x-1 bg-slate-200/70 border border-transparent text-slate-800",
                currentMemberReaction &&
                  "bg-blue-100/70 border-blue-500 text-white"
              )}
            >
              {reaction.value}
              <span
                className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  currentMemberReaction && "text-blue-500"
                )}
              >
                {reaction.count}
              </span>
            </button>
          </Hint>
        );
      })}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji)}
      >
        <button className="h-7 px-3 rounded-full flex items-center gap-x-1 bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
