import { Link } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'

export default function Cart() {
  const { items, updateQty, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center">
        <p>The shopping cart is empty.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 border rounded-xl">Return to store</Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
          <img src={`http://127.0.0.1:8000${item.image_url}`} alt={item.title} className="w-24 h-24 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.price} $</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 border rounded" onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}>-</button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button className="px-2 border rounded" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
          </div>
          <button className="px-3 py-2 border rounded-xl" onClick={() => removeItem(item.id)}>delete</button>
        </div>
      ))}

      <div className="flex items-center justify-between mt-4">
        <span className="font-bold">Total amount: {totalPrice().toFixed(2)} $</span>
        <Link to="/checkout" className="px-4 py-2 bg-blue-600 text-white rounded-xl">Continue the purchase process</Link>
      </div>
    </div>
  )
}
