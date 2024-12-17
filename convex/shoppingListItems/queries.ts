import { query } from "../_generated/server";
import { v } from "convex/values";

export const getByListId = query({
  args: { listId: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("shoppingListItems")
      .filter((q) => q.eq(q.field("listId"), args.listId))
      .collect();

    return items;
  },
});
