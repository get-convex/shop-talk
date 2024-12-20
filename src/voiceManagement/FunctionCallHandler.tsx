import * as React from "react";
import { routes, useRoute } from "@/app/routes";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { assertNever, iife } from "../lib/utils";
import { FunctionCallParams } from "@pipecat-ai/client-js";
import { FunctionNames } from "../../convex/rtviConfig";
import { useLLMHelper } from "./LLMHelperProvider";

export const FunctionCallHandler: React.FC = () => {
  const route = useRoute();
  const convex = useConvex();
  const createList = useMutation(api.shoppingLists.mutations.create);
  const addItem = useMutation(api.shoppingListItems.mutations.add);
  const addItems = useMutation(api.shoppingListItems.mutations.addMany);
  const updateItem = useMutation(api.shoppingListItems.mutations.update);
  const removeItem = useMutation(api.shoppingListItems.mutations.remove);
  const llmHelper = useLLMHelper();

  React.useEffect(() => {
    if (!llmHelper) return;

    llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
      const args = fn.arguments as any;
      const functionName = fn.functionName as FunctionNames;

      console.log(`Function '${functionName}' called`, { args, route });

      // Extract current list ID from route params if we're on a list page
      const currentListId =
        route.name === "list" ? (route.params.id as Id<"shoppingLists">) : null;

      // Let handle each function all kind
      const result = await iife(async () => {
        const returnSuccess = (
          message?: string,
          data?: Record<string, any>
        ) => ({
          success: true,
          message,
          ...data,
        });

        const returnError = (error: string) => ({
          success: false,
          error,
        });

        if (functionName === "create_shopping_list") {
          if (!args.name) return returnError("name is required");
          const listId = await createList({ name: args.name });
          return returnSuccess(`Created shopping list "${args.name}"`, {
            listId,
          });
        }

        if (functionName === "add_item") {
          if (!args.item) return returnError("item name is required");
          if (!currentListId) return returnError("No list open");

          const newItemId = await addItem({
            listId: currentListId,
            label: args.item,
          });

          return returnSuccess(`Added ${args.item} to the list`, {
            itemId: newItemId,
          });
        }

        if (functionName === "update_item") {
          if (!args.item) return returnError("item name is required");
          if (!args.newName) return returnError("new name is required");
          if (!currentListId) return returnError("No list open");

          const existingItem = await convex.query(
            api.shoppingListItems.queries.searchByLabel,
            {
              listId: currentListId,
              label: args.item,
            }
          );

          if (!existingItem)
            return returnError(`Item "${args.item}" not found in the list`);

          await updateItem({
            id: existingItem._id,
            label: args.newName,
          });

          return returnSuccess(`Updated ${args.item} to ${args.newName}`);
        }

        if (functionName === "remove_item") {
          if (!args.item) return returnError("item name is required");
          if (!currentListId) return returnError("No list open");

          const itemToRemove = await convex.query(
            api.shoppingListItems.queries.searchByLabel,
            {
              listId: currentListId,
              label: args.item,
            }
          );

          if (!itemToRemove)
            return returnError(`Item "${args.item}" not found in the list`);

          await removeItem({ id: itemToRemove._id });

          return returnSuccess(`Removed ${args.item} from the list`);
        }

        if (functionName === "open_list") {
          const list = await convex.query(
            api.shoppingLists.queries.searchByName,
            {
              name: args.name,
            }
          );
          if (!list) return returnError(`List "${args.name}" not found`);
          routes.list({ id: list._id }).push();
          return returnSuccess();
        }

        if (functionName === "go_back_to_lists") {
          routes.home().push();
          return returnSuccess();
        }

        if (functionName === "get_current_route") {
          return returnSuccess(`The current route is '${route.name}'`, {
            route: JSON.stringify(route, null, 2),
          });
        }

        if (functionName === "get_current_list") {
          if (route.name !== "list")
            return returnError("No shopping list is currently open");

          const listId = route.params.id as Id<"shoppingLists">;
          const list = await convex.query(
            api.shoppingLists.queries.findByIdAndAllItems,
            {
              id: listId,
            }
          );

          if (!list)
            return returnError("Could not find the current shopping list");

          return returnSuccess(
            `Currently viewing shopping list "${list.name}"`,
            {
              list,
            }
          );
        }

        if (functionName === "add_items") {
          if (route.name != "list") return returnError("No list open");

          await addItems({
            listId: route.params.id as Id<"shoppingLists">,
            items: args.items,
          });

          return returnSuccess(`Added ${args.items.length} items to the list`);
        }

        return assertNever(functionName, `Unknown function`);
      });

      console.log(`Function '${functionName}' returning`, {
        args,
        route,
        result,
      });
      return result;
    });
  }, [
    llmHelper,
    route,
    convex,
    createList,
    addItem,
    addItems,
    updateItem,
    removeItem,
  ]);

  return null;
};
