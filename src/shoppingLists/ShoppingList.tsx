import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Check, ArrowLeft } from "lucide-react";
import { routes } from "../app/routes";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { ShoppingListSkeleton } from "@/components/ui/loading";

interface ShoppingListProps {
  id: string;
}

export default function ShoppingListRoute({ id }: ShoppingListProps) {
  const list = useQuery(api.shoppingLists.queries.findByIdAndAllItems, {
    id: id as Id<"shoppingLists">,
  });

  const updateListName = useMutation(api.shoppingLists.mutations.updateName);
  const addItem = useMutation(api.shoppingListItems.mutations.add);
  const updateItem = useMutation(api.shoppingListItems.mutations.update);
  const removeItem = useMutation(api.shoppingListItems.mutations.remove);
  const removeList = useMutation(api.shoppingLists.mutations.remove);

  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<Id<"shoppingListItems"> | null>(
    null
  );
  const [editingText, setEditingText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  if (!list) return <ShoppingListSkeleton />;

  const handleSaveTitle = () => {
    if (isEditingTitle && list) {
      updateListName({ id: list._id, name: list.name });
      setIsEditingTitle(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim() && list) {
      addItem({ listId: list._id, label: newItemName.trim() });
      setNewItemName("");
    }
  };

  const handleSaveEdit = () => {
    if (editingId && editingText.trim()) {
      updateItem({ id: editingId, label: editingText.trim() });
      setEditingId(null);
    }
  };

  const handleDeleteList = async () => {
    if (list) {
      await removeList({ id: list._id });
      routes.home().push();
    }
  };

  return (
    <div className="h-full flex flex-col p-8">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          className="text-amber-600 hover:text-amber-800"
          onClick={() => routes.home().push()}
        >
          <ArrowLeft className="mr-2" />
          Back to Lists
        </Button>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          onClick={handleDeleteList}
        >
          <Trash2 className="mr-2" />
          Delete List
        </Button>
      </div>

      {isEditingTitle ? (
        <Input
          ref={titleInputRef}
          value={list.name}
          onChange={(e) =>
            updateListName({ id: list._id, name: e.target.value })
          }
          onBlur={handleSaveTitle}
          onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
          className="text-2xl font-bold mb-4 text-amber-800 bg-transparent border-none focus:ring-0"
        />
      ) : (
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-800 flex-grow">
            {list.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditingTitle(true)}
            className="text-amber-600 hover:text-amber-800"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        className="flex-grow overflow-auto mb-4 bg-yellow-100 border-2 border-amber-200 rounded-lg p-4 shadow-inner"
        style={{
          backgroundImage: `repeating-linear-gradient(#F0F0F0 0px, #F0F0F0 1px, transparent 1px, transparent 20px)`,
          backgroundSize: "100% 20px",
          backgroundPosition: "0 1px",
        }}
      >
        {list.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center mb-2 bg-yellow-50/80 p-2 rounded shadow"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) =>
                updateItem({ id: item._id, completed: checked as boolean })
              }
              className="mr-2"
            />
            {editingId === item._id ? (
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-grow mr-2"
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
            ) : (
              <span
                className={`flex-grow ${
                  item.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {item.label}
              </span>
            )}
            {editingId === item._id ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveEdit}
                className="text-green-500 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingId(item._id);
                  setEditingText(item.label);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem({ id: item._id })}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddItem} className="flex gap-2">
        <Input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add new item"
          className="flex-grow bg-yellow-50/80 border-amber-200 focus-visible:ring-amber-400 placeholder:text-amber-400/50"
        />
        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Add
        </Button>
      </form>
    </div>
  );
}
