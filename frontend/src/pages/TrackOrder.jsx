import { useState } from "react"
import api from "../api.js"

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("")
  const [phone, setPhone] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!orderId && !phone) {
      alert("Please enter your order number or contact number.")
      return
    }

    setLoading(true)
    try {
      const res = await api.get("/orders/track/", { params: { order_id: orderId || undefined, phone: phone || undefined } })
      setOrders(res.data)
    } catch (err) {
      alert(err.response?.data?.detail || "Error receiving order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4"> Order tracking</h2>
      <div className="grid gap-2 mb-4">
        <input type="number" placeholder="order number" value={orderId} onChange={e => setOrderId(e.target.value)} className="border rounded px-2 py-1"/>
        <input type="text" placeholder="contact number" value={phone} onChange={e => setPhone(e.target.value)} className="border rounded px-2 py-1"/>
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-xl">search</button>
      </div>

      {loading && <p>Searching...</p>}

      {orders.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">customer name</th>
              <th className="border p-2">address</th>
              <th className="border p-2">Products</th>
              <th className="border p-2">Total price</th>
              <th className="border p-2">status</th>
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
                <td className="border p-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {orders.length === 0 && !loading && <p>No orders found</p>}
    </div>
  )
}
