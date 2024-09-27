import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import { toast } from "sonner";
import Quill from "quill";

import { Id } from "@/../convex/_generated/dataModel";
import useChannelId from "@/hooks/use-channel-id";
import useWorkspaceId from "@/hooks/use-workspace-id";

import { createMessage } from "@/app/messages/actions/create-message";
import { generateUploadUrl } from "@/app/upload/actions/generate-upload-url";

const InputEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const inputEditorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: creatingMessage } = createMessage();
  const { mutate: generatingUploadUrl } = generateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);

      inputEditorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generatingUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Url not found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("failed to upload image");
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await creatingMessage(values, { throwError: true });

      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Message failed");
    } finally {
      setIsPending(false);

      inputEditorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <InputEditor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={inputEditorRef}
      />
    </div>
  );
};
