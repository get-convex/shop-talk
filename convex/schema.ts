import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  shoppingLists: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
  shoppingListItems: defineTable({
    listId: v.id("shoppingLists"),
    name: v.string(),
    completed: v.boolean(),
  }),
});
