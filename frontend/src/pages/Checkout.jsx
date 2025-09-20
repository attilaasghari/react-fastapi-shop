import { useState } from 'react'
import api from '../api.js'
import { useCart } from '../state/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { items, clear } = useCart()
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    try {
      const payload = {
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity }))
      }
      await api.post('/orders/', payload)
      clear()
      alert('Order successfully placed!')
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.detail || 'Error in placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6 grid gap-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Order Information</h2>
      <label className="grid gap-1">
        <span>First and last name</span>
        <input className="border rounded-xl px-3 py-2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
      </label>
      <label className="grid gap-1">
        <span>Contact number</span>
        <input className="border rounded-xl px-3 py-2" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
      </label>
      <label className="grid gap-1">
        <span>Address</span>
        <textarea className="border rounded-xl px-3 py-2" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
      </label>
      <button disabled={loading || items.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:bg-gray-300">
       order registration
      </button>
    </form>
  )
}
