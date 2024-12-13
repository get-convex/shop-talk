import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  shoppingLists: defineTable({
    name: v.string(),
  }),
  shoppingListItems: defineTable({
    listId: v.id("shoppingLists"),
    label: v.string(),
    completed: v.boolean(),
    quantity: v.optional(v.number()),
  }),
});
