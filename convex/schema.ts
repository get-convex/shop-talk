import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  shoppingLists: defineTable({
    name: v.string(),
  }).searchIndex("by_name", {
    searchField: "name",
  }),
  shoppingListItems: defineTable({
    listId: v.id("shoppingLists"),
    label: v.string(),
    completed: v.boolean(),
  })
    .searchIndex("by_label", {
      searchField: "label",
    })
    .index("by_listId", ["listId"]),
});
