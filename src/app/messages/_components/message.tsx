import React from "react";
import dynamic from "next/dynamic";

import { Doc, Id } from "@/../convex/_generated/dataModel";

import { format, isToday, isYesterday } from "date-fns";
import Hint from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Thumbnail from "@/components/thumbnail";

const Renderer = dynamic(() => import("@/app/messages/_components/renderer"), {
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
      memberId: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  updatedAt: Doc<"messages">["updatedAt"];
  createdAt: Doc<"messages">["_creationTime"];
  isEditing: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  isCompact?: boolean;
  hideRepliesButton?: boolean;
  repliesCount?: string;
  repliesImage?: string;
  repliesTimestamp?: number;
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
  hideRepliesButton,
  repliesCount,
  repliesImage,
  repliesTimestamp,
}: MessageProps) => {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          <Hint label="">
            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(Date.now(), "hh:mm")}
            </button>
          </Hint>
          <div className="flex flex-col w-full">
            <Renderer value={body} />
            <Thumbnail url={image} />

            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2">
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>
              {authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button className="font-bold text-primary hover:underline">
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
        </div>
      </div>
    </div>
  );
};

export default Message;
