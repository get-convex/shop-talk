import { useEffect } from "react";
import {
  FunctionCallParams,
  LLMHelper,
  RTVIClient,
} from "@pipecat-ai/client-js";
import { routes, useRoute } from "./routes";
import { FunctionNames } from "../../convex/rtviConfig";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { assertNever } from "../lib/utils";

export const useFunctionCallHandler = (voiceClient: RTVIClient | null) => {
  const route = useRoute();
  const convex = useConvex();
  const createList = useMutation(api.shoppingLists.mutations.create);
  const addItem = useMutation(api.shoppingListItems.mutations.add);
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
      const currentListId =
        route.name === "list" ? (route.params.id as Id<"shoppingLists">) : null;

      if (functionName === "create_shopping_list") {
        if (!args.name) return { error: "name is required" };
        const listId = await createList({ name: args.name });
        return {
          success: true,
          message: `Created shopping list "${args.name}"`,
          listId,
        };
      }

      if (functionName === "add_item") {
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
      }

      if (functionName === "update_item") {
        if (!args.item) return { error: "item name is required" };
        if (!args.newName) return { error: "new name is required" };

        const existingItem = await convex.query(
          api.shoppingListItems.queries.searchByLabel,
          {
            listId: currentListId!,
            label: args.item,
          }
        );

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
      }

      if (functionName === "remove_item") {
        if (!args.item) return { error: "item name is required" };

        const itemToRemove = await convex.query(
          api.shoppingListItems.queries.searchByLabel,
          {
            listId: currentListId!,
            label: args.item,
          }
        );

        if (!itemToRemove)
          return { error: `Item "${args.item}" not found in the list` };

        await removeItem({ id: itemToRemove._id });

        return {
          success: true,
          message: `Removed ${args.item} from the list`,
        };
      }

      if (functionName === "open_list") {
        const list = await convex.query(
          api.shoppingLists.queries.searchByName,
          {
            name: args.name,
          }
        );
        console.log("LIST", list);
        if (!list) return { error: `List "${args.name}" not found` };
        routes.list({ id: list._id }).push();
        return { success: true };
      }

      if (functionName === "go_back_to_lists") {
        routes.home().push();
        return { success: true };
      }

      return assertNever(functionName, `Unknown function`);
    });

    // Cleanup
    return () => {
      voiceClient.unregisterHelper("llm");
    };
  }, [route]);
};
