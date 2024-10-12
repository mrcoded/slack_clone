import React from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";
import { updateMessage } from "../actions/update-message";
import { removeMessage } from "../actions/remove-message";
import { toggleReaction } from "@/app/reactions/actions/toggle-reaction";

import MessageToolbar from "./message-toolbar";
import Hint from "@/components/hint";
import Thumbnail from "@/components/thumbnail";
import Reactions from "@/components/reactions";
import { ThreadBar } from "@/components/thread-bar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Renderer = dynamic(() => import("@/app/messages/_components/renderer"), {
  ssr: false,
});

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"messages">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideThreadsButton?: boolean;
  threadsCount?: number;
  threadsImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
  // const date = new Date(dateStr);
  console.log(date);
  // if (isToday(date)) return "Today";
  // if (isYesterday(date)) return "Yesterday";
  // return format(date, "EEEE, MMMM d");
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  updatedAt,
  createdAt,
  isEditing,
  setEditingId,
  isCompact,
  hideThreadsButton,
  threadsCount,
  threadsImage,
  threadName,
  threadTimestamp,
}: MessageProps) => {
  const { threadId, onOpenMessage, onOpenProfile, onClose } = usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );

  const { mutate: updatingMessage, isPending: isUpdatingMessage } =
    updateMessage();
  const { mutate: removingMessage, isPending: isRemovingMessage } =
    removeMessage();
  const { mutate: togglingReaction, isPending: isTogglingReaction } =
    toggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleReaction = (value: string) => {
    togglingReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Unable to toggle reaction");
        },
      }
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updatingMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removingMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");

          if (threadId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label="">
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(Date.now(), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />

                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}

                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadsCount}
                  name={threadName}
                  image={threadsImage}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>

          {!isEditing && (
            <MessageToolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThreads={() => onOpenMessage(id)}
              handleDelete={handleDelete}
              handleReaction={handleReaction}
              hideThreadsButton={hideThreadsButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback className="text-white">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </button>

          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfile(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label="">
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(Date.now(), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}

              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadsCount}
                image={threadsImage}
                name={threadName}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThreads={() => onOpenMessage(id)}
            handleDelete={handleDelete}
            handleReaction={handleReaction}
            hideThreadsButton={hideThreadsButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
