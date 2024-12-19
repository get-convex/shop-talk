import { api } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const dailyReset = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    // Get all shopping lists
    const lists = await ctx.runMutation(
      api.shoppingLists.mutations.getAllLists
    );

    // Delete all existing lists (which will cascade delete their items)
    for (const list of lists) {
      await ctx.runMutation(api.shoppingLists.mutations.remove, {
        id: list._id,
      });
    }

    // Create new starter lists
    const groceriesId = await ctx.runMutation(
      api.shoppingLists.mutations.create,
      {
        name: "Weekly Groceries",
      }
    );
    await ctx.runMutation(api.shoppingListItems.mutations.addMany, {
      listId: groceriesId,
      items: [
        "Milk",
        "Eggs",
        "Bread",
        "Bananas",
        "Chicken breast",
        "Spinach",
        "Tomatoes",
        "Pasta",
        "Cheese",
      ],
    });

    const householdId = await ctx.runMutation(
      api.shoppingLists.mutations.create,
      {
        name: "Household Supplies",
      }
    );
    await ctx.runMutation(api.shoppingListItems.mutations.addMany, {
      listId: householdId,
      items: [
        "Paper towels",
        "Dish soap",
        "Laundry detergent",
        "Trash bags",
        "Hand soap",
        "Toilet paper",
      ],
    });

    const officeId = await ctx.runMutation(api.shoppingLists.mutations.create, {
      name: "Office Supplies",
    });
    await ctx.runMutation(api.shoppingListItems.mutations.addMany, {
      listId: officeId,
      items: [
        "Printer paper",
        "Sticky notes",
        "Pens",
        "Notebooks",
        "Paper clips",
      ],
    });
  },
});
