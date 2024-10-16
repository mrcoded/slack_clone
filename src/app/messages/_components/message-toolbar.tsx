import EmojiPopover from "@/components/emoji-popover";
import Hint from "@/components/hint";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import React from "react";

interface MessageToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThreads: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadsButton?: boolean;
}

const MessageToolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThreads,
  handleDelete,
  handleReaction,
  hideThreadsButton,
}: MessageToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>

        {!hideThreadsButton && (
          <Hint label="Reply">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleThreads}
              disabled={isPending}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Edit message">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleEdit}
              disabled={isPending}
            >
              <Pencil className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label="Delete message">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash className="size-4" />
            </Button>
          </Hint>
        )}
      </div>
    </div>
  );
};

export default MessageToolbar;
