import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  shoppingLists: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
  shoppingListItems: defineTable({
    listId: v.id("shoppingLists"),
    label: v.string(),
    completed: v.boolean(),
  })
    .index("by_label", ["label"])
    .index("by_listId", ["listId"]),
});
