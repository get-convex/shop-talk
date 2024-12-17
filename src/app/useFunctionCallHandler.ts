import { useEffect } from "react";
import {
  FunctionCallParams,
  LLMHelper,
  RTVIClient,
} from "@pipecat-ai/client-js";
import { useRoute } from "./routes";
import { FunctionNames } from "../../convex/rtviConfig";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const useFunctionCallHandler = (voiceClient: RTVIClient | null) => {
  const route = useRoute();
  const createList = useMutation(api.shoppingLists.mutations.create);
  const addItem = useMutation(api.shoppingListItems.mutations.add);
  const findItemByLabel = useMutation(
    api.shoppingListItems.mutations.findByLabel
  );
  const updateItem = useMutation(api.shoppingListItems.mutations.update);
  const removeItem = useMutation(api.shoppingListItems.mutations.remove);

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
      console.log("Current route:", route.name);

      // Extract current list ID from route params if we're on a list page
      const currentListId = route.name === "list" ? route.params.id as Id<"shoppingLists"> : null;

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

        case "remove_item":
          if (!args.item) return { error: "item name is required" };

          const itemToRemove = await findItemByLabel({
            listId: currentListId!,
            label: args.item,
          });

          if (!itemToRemove)
            return { error: `Item "${args.item}" not found in the list` };

          await removeItem({ id: itemToRemove._id });

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
    route,
    createList,
    addItem,
    updateItem,
    removeItem,
    findItemByLabel,
  ]);
};
