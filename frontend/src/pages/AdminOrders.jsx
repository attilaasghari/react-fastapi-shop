import { useEffect, useState } from 'react'
import api from '../api.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders/')
      setOrders(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Error receiving orders')
    } finally {
      setLoading(false)
    }
  }
  

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (id, status) => {
    await api.put(`/orders/${id}`, { status })
    fetchOrders()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete it?')) return
    await api.delete(`/orders/${id}`)
    fetchOrders()
  }

  if (loading) return <p> loading ...</p>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer name</th>
            <th className="border p-2">address</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Total price</th>
            <th className="border p-2">status</th>
            <th className="border p-2">Operation</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className="border p-2">{o.id}</td>
              <td className="border p-2">{o.customer_name}</td>
              <td className="border p-2">{o.customer_address}</td>
              <td className="border p-2">{o.items}</td>
              <td className="border p-2">{o.total_price}</td>
              <td className="border p-2">
                <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)} className="border rounded px-2 py-1">
                  <option value="pending">pending</option>
                  <option value="sent">sent</option>
                  <option value="delivered">delivered</option>
                </select>
              </td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => handleDelete(o.id)} className="px-2 py-1 bg-red-500 text-white rounded">delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
