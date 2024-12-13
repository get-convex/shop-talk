import { query } from "../_generated/server";
import { Doc } from "../_generated/dataModel";

export const getAllLists = query(async ctx => {
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
