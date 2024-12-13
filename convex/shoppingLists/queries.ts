import { query } from "../_generated/server";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const lists = await ctx.db.query("shoppingLists").collect();
    return lists;
  },
});
