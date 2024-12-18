import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAllWithSomeItems = query(async (ctx) => {
  const lists = await ctx.db.query("shoppingLists").order("desc").take(100);
  const listsWithItems = await Promise.all(
    lists.map(async (list) => {
      const items = await ctx.db
        .query("shoppingListItems")
        .withIndex("by_listId", (q) => q.eq("listId", list._id))
        .take(10);
      return { ...list, items };
    })
  );
  return listsWithItems;
});

export const findById = query({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const findByIdAndAllItems = query({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const list = await ctx.db.get(args.id);
    if (!list) return null;

    const items = await ctx.db
      .query("shoppingListItems")
      .withIndex("by_listId", (q) => q.eq("listId", args.id))
      .collect();

    return { ...list, items };
  },
});

export const findByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const list = await ctx.db
      .query("shoppingLists")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (!list) return null;

    return list;
  },
});
