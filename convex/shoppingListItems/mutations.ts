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

export const addMany = mutation({
  args: {
    listId: v.id("shoppingLists"),
    items: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const itemIds = await Promise.all(
      args.items.map(label => 
        ctx.db.insert("shoppingListItems", {
          listId: args.listId,
          label,
          completed: false,
        })
      )
    )
    return itemIds
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

