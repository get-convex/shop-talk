import { Loader2, ShoppingBag } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
    </div>
  )
}

export function ShoppingListSkeleton() {
  return (
    <div className="h-full flex flex-col p-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="w-32 h-10 bg-amber-100 rounded" />
        <div className="w-32 h-10 bg-amber-100 rounded" />
      </div>
      
      <div className="w-64 h-8 bg-amber-100 rounded mb-4" />
      
      <div className="flex-grow mb-4 bg-yellow-100 border-2 border-amber-200 rounded-lg p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center mb-2 bg-yellow-50/80 p-2 rounded">
            <div className="w-4 h-4 bg-amber-100 rounded-sm mr-2" />
            <div className="flex-grow h-6 bg-amber-100 rounded" />
            <div className="w-20 h-8 bg-amber-100 rounded ml-2" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-grow h-10 bg-amber-100 rounded" />
        <div className="w-20 h-10 bg-amber-100 rounded" />
      </div>
    </div>
  )
}

export function ShoppingListsOverviewSkeleton() {
  return (
    <div className="container mx-auto p-8 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="w-64 h-10 bg-amber-100 rounded" />
        <div className="w-32 h-10 bg-amber-100 rounded" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="text-amber-200" />
              <div className="w-48 h-6 bg-amber-100 rounded" />
            </div>

            <div className="space-y-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-200" />
                  <div className="w-full h-4 bg-amber-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 