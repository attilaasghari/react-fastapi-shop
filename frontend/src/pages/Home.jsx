import { useEffect, useState } from 'react'
import api from '../api.js'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../state/CartContext.jsx'
import HomeSlider from "../components/Slider";


export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/products/').then(res => setProducts(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <HomeSlider />
      {
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      }
    </div>
    
  )
}
