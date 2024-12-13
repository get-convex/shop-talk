import { mutation } from "../_generated/server"
import { v } from "convex/values"

export const createList = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("shoppingLists", { name: args.name })
    return id
  },
})

export const updateListName = mutation({
  args: { id: v.id("shoppingLists"), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name })
  },
})

export const deleteList = mutation({
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

export const addItem = mutation({
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

export const updateItem = mutation({
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

export const deleteItem = mutation({
  args: { id: v.id("shoppingListItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
}) 