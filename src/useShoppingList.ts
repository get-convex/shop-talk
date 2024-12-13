import { useState } from 'react'

export type ShoppingItem = {
  id: number
  name: string
  completed: boolean
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [listName, setListName] = useState("My Shopping List")

  const addItem = (name: string) => {
    setItems([...items, { id: Date.now(), name, completed: false }])
  }

  const updateItem = (id: number, updates: Partial<ShoppingItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const editItem = (id: number, newName: string) => {
    setItems(items.map(item => item.id === id ? { ...item, name: newName } : item))
  }

  return { items, addItem, updateItem, removeItem, editItem, listName, setListName }
}

