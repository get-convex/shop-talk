import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Check } from "lucide-react";
import { ShoppingItem, useShoppingList } from "@/useShoppingList";

export default function ShoppingList() {
  const {
    items,
    addItem,
    updateItem,
    removeItem,
    editItem,
    listName,
    setListName,
  } = useShoppingList();
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addItem(newItemName.trim());
      setNewItemName("");
    }
  };

  const handleStartEdit = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditingText(item.name);
  };

  const handleSaveEdit = () => {
    if (editingId !== null && editingText.trim()) {
      editItem(editingId, editingText.trim());
      setEditingId(null);
    }
  };

  const handleStartTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitleEdit = () => {
    setIsEditingTitle(false);
  };

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  return (
    <div className="h-full flex flex-col">
      {isEditingTitle ? (
        <Input
          ref={titleInputRef}
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onBlur={handleSaveTitleEdit}
          onKeyDown={(e) => e.key === "Enter" && handleSaveTitleEdit()}
          className="text-2xl font-bold mb-4 text-amber-800 bg-transparent border-none focus:ring-0"
        />
      ) : (
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-800 flex-grow">
            {listName}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleStartTitleEdit}
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
        {items.map((item: ShoppingItem) => (
          <div
            key={item.id}
            className="flex items-center mb-2 bg-yellow-50/80 p-2 rounded shadow"
          >
            <Checkbox
              checked={item.completed}
              onCheckedChange={(checked) =>
                updateItem(item.id, { completed: checked as boolean })
              }
              className="mr-2"
            />
            {editingId === item.id ? (
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-grow mr-2"
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
              />
            ) : (
              <span
                className={`flex-grow ${item.completed ? "line-through text-gray-500" : ""}`}
              >
                {item.name}
              </span>
            )}
            {editingId === item.id ? (
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
                onClick={() => handleStartEdit(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
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
          className="flex-grow"
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
