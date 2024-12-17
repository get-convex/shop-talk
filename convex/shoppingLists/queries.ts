import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";
import { v } from "convex/values";

export const getAll = query(async ctx => {
  const lists = await ctx.db.query("shoppingLists").collect();
  const listsWithItems = await Promise.all(
    lists.map(async list => {
      const items = await ctx.db
        .query("shoppingListItems")
        .filter(q => q.eq(q.field("listId"), list._id))
        .collect();
      return { ...list, items };
    })
  );
  return listsWithItems;
});

export const getById = query({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.id);
    if (!list) return null;
    
    const items = await ctx.db
      .query("shoppingListItems")
      .filter(q => q.eq(q.field("listId"), args.id))
      .collect();
    
    return { ...list, items };
  },
});
