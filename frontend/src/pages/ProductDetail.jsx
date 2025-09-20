import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api.js'
import { useCart } from '../state/CartContext.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!product) return <p>No product found.</p>

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.title} className="rounded-2xl w-full object-cover" />
      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-xl font-bold">{product.price} $</span>
          <button onClick={() => addToCart(product)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300" disabled={product.inventory === 0}>
            add to cart
          </button>
        </div>
        {product.inventory === 0 && <p className="mt-2 text-sm text-red-600">Unavailable</p>}
      </div>
    </div>
  )
}
