import { useRef, useState } from "react";
import dynamic from "next/dynamic";

import { toast } from "sonner";
import Quill from "quill";

import { Id } from "@/../convex/_generated/dataModel";
import useWorkspaceId from "@/hooks/use-workspace-id";

import { createMessage } from "@/app/messages/actions/create-message";
import { generateUploadUrl } from "@/app/upload/actions/generate-upload-url";

const InputEditor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface ConversationChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}

type CreateMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

export const ConversationChatInput = ({
  placeholder,
  conversationId,
}: ConversationChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const inputEditorRef = useRef<Quill | null>(null);

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
        conversationId,
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
