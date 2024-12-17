import { mutation } from "../_generated/server"
import { v } from "convex/values"

export const add = mutation({
  args: { 
    listId: v.id("shoppingLists"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("shoppingListItems", {
      listId: args.listId,
      label: args.label,
      completed: false,
    })
    return id
  },
})

export const update = mutation({
  args: {
    id: v.id("shoppingListItems"),
    label: v.optional(v.string()),
    completed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const updates: { label?: string; completed?: boolean } = {}
    if (args.label !== undefined) updates.label = args.label
    if (args.completed !== undefined) updates.completed = args.completed
    await ctx.db.patch(args.id, updates)
  },
})

export const remove = mutation({
  args: { id: v.id("shoppingListItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})

export const findByLabel = mutation({
  args: { 
    listId: v.id("shoppingLists"),
    label: v.string(),
  },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("shoppingListItems")
      .filter(q => 
        q.and(
          q.eq(q.field("listId"), args.listId),
          q.eq(q.field("label"), args.label)
        )
      )
      .collect()
    return items[0] || null
  },
}) 