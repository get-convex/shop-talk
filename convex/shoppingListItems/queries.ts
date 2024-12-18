import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const getAllOnList = query({
  args: { listId: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_listId", (q) => q.eq("listId", args.listId))
      .collect();

    return items;
  },
});

export const findByLabel = query({
  args: {
    listId: v.id("shoppingLists"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("shoppingListItems")
      .withIndex("by_label", (q) => q.eq("label", args.label))
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .first();
  },
});
