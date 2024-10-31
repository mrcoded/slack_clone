import { auth } from "./auth";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

import { paginationOptsValidator } from "convex/server";

export const getUnreadStatus = query({
  args: {
    channelId: v.id("channels"),
    memberId: v.optional(v.id("members")),
    workspaceId: v.optional(v.id("workspaces")),
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const channel = await ctx.db.get(args.channelId);

    if (!channel) {
      return [];
    }

    const workspace = await ctx.db.get(channel.workspaceId);

    if (!workspace) {
      return [];
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspace._id).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      return [];
    }

    // return unreadStatusId;
    const results = await ctx.db
      .query("unreadStatus")
      .withIndex("by_member_id_channel_id_conversation_id", (q) =>
        q
          .eq("memberId", currentMember._id)
          .eq("channelId", args.channelId)
          .eq("conversationId", args.conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);
    console.log(results);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (status) => {
            return {
              ...status,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };

    // return statusId;
  },
});
