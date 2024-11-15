import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import React from "react";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}
const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-14 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className="text-white text-2xl">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <p className="text-2xl font-bold"># {name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This conversation between you and <strong>{name}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
