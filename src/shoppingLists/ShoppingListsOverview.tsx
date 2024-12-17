import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { routes } from "../app/routes";
import { useState } from "react";
import { Input } from "../components/ui/input";
import { ShoppingListsOverviewSkeleton } from "@/components/ui/loading";

export default function ShoppingListsOverview() {
  const lists = useQuery(api.shoppingLists.queries.getAll);
  const createList = useMutation(api.shoppingLists.mutations.create);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  if (!lists) return <ShoppingListsOverviewSkeleton />;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-800">My Shopping Lists</h1>
        {isCreating ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (newListName.trim()) {
                const id = await createList({ name: newListName.trim() });
                setNewListName("");
                setIsCreating(false);
                routes.list({ id }).push();
              }
            }}
            className="flex gap-2"
          >
            <Input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="w-64"
              autoFocus
            />
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Create
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsCreating(false);
                setNewListName("");
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Plus className="mr-2" />
            New List
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <div
            key={list._id}
            onClick={() => routes.list({ id: list._id }).push()}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border-2 border-amber-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="text-amber-500" />
              <h2 className="text-xl font-semibold text-amber-800">
                {list.name}
              </h2>
            </div>

            <div className="space-y-2">
              {list.items.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="text-gray-600 flex items-center gap-2"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${item.completed ? "bg-green-500" : "bg-amber-500"}`}
                  />
                  <span
                    className={
                      item.completed ? "line-through text-gray-400" : ""
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
              {list.items.length > 3 && (
                <div className="text-gray-500 text-sm">
                  +{list.items.length - 3} more items
                </div>
              )}
              {list.items.length === 0 && (
                <div className="text-gray-500 italic">No items yet</div>
              )}
            </div>
          </div>
        ))}

        {lists.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-12 bg-amber-50 rounded-lg border-2 border-dashed border-amber-200">
            <ShoppingBag className="mx-auto text-amber-400 mb-4" size={48} />
            <h3 className="text-xl font-medium text-amber-800 mb-2">
              No Shopping Lists Yet
            </h3>
            <p className="text-amber-600 mb-4">
              Create your first shopping list to get started
            </p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="mr-2" />
              Create First List
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
