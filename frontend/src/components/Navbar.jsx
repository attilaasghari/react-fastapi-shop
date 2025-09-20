import { Link } from 'react-router-dom'
import { useCart } from '../state/CartContext.jsx'

export default function Navbar() {
  const { totalCount } = useCart()
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">Fast API + React Shop</Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/track-order" className="hover:text-blue-600">Track orders</Link>
          <Link to="/cart" className="relative hover:text-blue-600">
            cart
            <span className="absolute -top-3 -left-4 bg-blue-600 text-white text-xs rounded-full w-6 h-6 grid place-items-center">{totalCount}</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
