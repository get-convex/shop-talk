import { mutation } from "../_generated/server"
import { v } from "convex/values"

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("shoppingLists", { name: args.name })
    return id
  },
})

export const updateName = mutation({
  args: { id: v.id("shoppingLists"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name })
  },
})

export const remove = mutation({
  args: { id: v.id("shoppingLists") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("shoppingListItems")
      .filter(q => q.eq(q.field("listId"), args.id))
      .collect()
    
    // Delete all items in the list
    await Promise.all(
      items.map(item => ctx.db.delete(item._id))
    )
    
    // Delete the list itself
    await ctx.db.delete(args.id)
  },
})

export const getAllLists = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("shoppingLists").collect()
  },
}) 