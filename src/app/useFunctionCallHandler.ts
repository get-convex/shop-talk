import { useEffect } from "react";
import {
  FunctionCallParams,
  LLMHelper,
  RTVIClient,
} from "@pipecat-ai/client-js";
import { useLocation } from "react-router-dom";
import { FunctionNames } from "../../convex/rtviConfig";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const useFunctionCallHandler = (voiceClient: RTVIClient | null) => {
  const location = useLocation();
  const createList = useMutation(api.shoppingLists.mutations.createList);
  const addItem = useMutation(api.shoppingLists.mutations.addItem);
  const findItemByLabel = useMutation(
    api.shoppingLists.mutations.findItemByLabel
  );
  const updateItem = useMutation(api.shoppingLists.mutations.updateItem);
  const deleteItem = useMutation(api.shoppingLists.mutations.deleteItem);
  const getListItems = useMutation(api.shoppingLists.mutations.getListItems);

  useEffect(() => {
    if (!voiceClient) return;

    const llmHelper = voiceClient.registerHelper(
      "llm",
      new LLMHelper({
        callbacks: {},
      })
    ) as LLMHelper;

    llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
      const args = fn.arguments as any;
      const functionName = fn.functionName as FunctionNames;

      console.log("----- FUNCTION CALL", fn);
      console.log("Current route:", location.pathname);

      // Extract current list ID from URL if we're on a list page
      const currentListId = location.pathname.startsWith("/list/")
        ? (location.pathname.split("/")[2] as Id<"shoppingLists">)
        : null;

      if (!currentListId && functionName !== "create_shopping_list") {
        return { error: "No shopping list selected" };
      }

      switch (functionName) {
        case "create_shopping_list":
          if (!args.name) return { error: "name is required" };
          const listId = await createList({ name: args.name });
          return {
            success: true,
            message: `Created shopping list "${args.name}"`,
            listId,
          };

        case "add_item":
          if (!args.item) return { error: "item name is required" };
          const newItemId = await addItem({
            listId: currentListId!,
            label: args.item,
          });
          return {
            success: true,
            message: `Added ${args.item} to the list`,
            itemId: newItemId,
          };

        case "update_item":
          if (!args.item) return { error: "item name is required" };
          if (!args.newName) return { error: "new name is required" };

          const existingItem = await findItemByLabel({
            listId: currentListId!,
            label: args.item,
          });

          if (!existingItem)
            return { error: `Item "${args.item}" not found in the list` };

          await updateItem({
            id: existingItem._id,
            label: args.newName,
          });

          return {
            success: true,
            message: `Updated ${args.item} to ${args.newName}`,
          };

        case "update_item_by_index":
          if (!args.index) return { error: "index is required" };
          if (!args.newName) return { error: "new name is required" };
          if (args.index < 1) return { error: "index must be 1 or greater" };

          const items = await getListItems({ listId: currentListId! });
          const targetIndex = args.index - 1; // Convert to 0-based index

          if (targetIndex >= items.length)
            return { error: `List only has ${items.length} items` };

          const targetItem = items[targetIndex];
          await updateItem({
            id: targetItem._id,
            label: args.newName,
          });

          return {
            success: true,
            message: `Updated item #${args.index} to ${args.newName}`,
          };

        case "remove_item":
          if (!args.item) return { error: "item name is required" };

          const itemToRemove = await findItemByLabel({
            listId: currentListId!,
            label: args.item,
          });

          if (!itemToRemove)
            return { error: `Item "${args.item}" not found in the list` };

          await deleteItem({ id: itemToRemove._id });

          return {
            success: true,
            message: `Removed ${args.item} from the list`,
          };

        default:
          return { error: `Unknown function: ${functionName}` };
      }
    });

    // Cleanup
    return () => {
      voiceClient.unregisterHelper("llm");
    };
  }, [
    location.pathname,
    createList,
    addItem,
    updateItem,
    deleteItem,
    findItemByLabel,
    getListItems,
  ]);
};
