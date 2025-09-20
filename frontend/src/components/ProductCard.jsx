import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.title} className="rounded-xl object-cover h-48 w-full" />
      <h3 className="mt-3 font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold">{product.price.toLocaleString()} $</span>
        <div className="flex gap-2">
          <Link to={`/product/${product.id}`} className="px-3 py-2 text-sm border rounded-xl hover:bg-gray-50">Details</Link>
          <button onClick={() => onAdd(product)} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300" disabled={product.inventory === 0}>
            Add
          </button>
        </div>
      </div>
      {product.inventory === 0 && <span className="mt-2 text-xs text-red-600">unavailable</span>}
    </div>
  )
}
