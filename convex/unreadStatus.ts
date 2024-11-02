import { auth } from "./auth";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUnreadStatus = query({
  args: {
    channelId: v.optional(v.id("channels")),
    memberId: v.optional(v.id("members")),
    workspaceId: v.id("workspaces"),
    conversationId: v.optional(v.id("conversations")),
  },

  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const workspace = await ctx.db.get(args.workspaceId);

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

    const results = await ctx.db
      .query("unreadStatus")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    return results;
  },
});

export const markChannelStatus = mutation({
  args: {
    channelId: v.id("channels"),
  },

  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("No user found");
    }

    const channel = await ctx.db.get(args.channelId);

    if (!channel) {
      throw new Error("No channel found");
    }

    const workspace = await ctx.db.get(channel.workspaceId);

    if (!workspace) {
      throw new Error("No workspace found");
    }

    const messages = await ctx.db.get(channel._id);
    if (!messages) {
      throw new Error("No messages found");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspace._id).eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      throw new Error("No member found");
    }

    // Set unread to false for the specified user and channel
    const results = await ctx.db
      .query("unreadStatus")
      .withIndex("by_channel_id", (q) => q.eq("channelId", channel._id))
      .first();

    if (!results) {
      throw new Error("No results found");
    }

    // if (existingReadStatus) {
    //   // If record exists, set unread to true
    //   await ctx.db.patch(args.channelId, { ...status, unread: false });
    // } else {
    //   // If record doesn't exist, insert a new record with unread set to true
    //   await ctx.db.patch({ unread: true });
    // }

    await ctx.db.patch(results._id, {
      ...results,
      unread: false,
    });

    return results._id;
  },
});
