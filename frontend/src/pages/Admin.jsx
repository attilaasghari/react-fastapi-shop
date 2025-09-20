import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Admin() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    id: null,
    title: '',
    description: '',
    price: 0,
    inventory: 0,
    image_url: ''
  })

  const fetchProducts = async () => {
    setLoading(true)
    const res = await api.get('/products/')
    setProducts(res.data)
    setLoading(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) navigate('/admin/login')
    else fetchProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, form)
      } else {
        await api.post('/products/', form)
      }
      setForm({ id: null, title:'', description:'', price:0, inventory:0, image_url:'' })
      setFile(null)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.detail || 'error in operation')
    }
  }

  const handleEdit = (p) => {
    setForm(p)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete it?')) return
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  const handleUploadImage = async () => {
    if (!file || !form.id) {
      alert('Create or select the product first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post(`/products/${form.id}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setForm(prev => ({ ...prev, image_url: res.data.image_url }))
      alert('Image uploaded successfully.')
      fetchProducts()
    } catch (err) {
      alert('Error uploading image')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products Admin Panel</h1>
        <div className='p-2 flex gap-2'>
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { localStorage.removeItem('admin_token'); navigate('/admin/login') }}>
            Exit
          </button>
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => navigate('/admin/orders')}>
            Orders
          </button>
        </div>
      </div>
      <h1 className="text-xl font-bold ">Add product</h1>
      <form onSubmit={handleSubmit} className="grid gap-2 mb-6 bg-white p-4 rounded-xl shadow">
        <input placeholder="title" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required className="border rounded px-2 py-1"/>
        <textarea placeholder="description" value={form.description} onChange={e => setForm({...form, description:e.target.value})} className="border rounded px-2 py-1 h-32"></textarea>
        <label>price</label>
        <input type="number" placeholder="price" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="border rounded px-2 py-1"/>
        <label>inventory</label>
        <input type="number" placeholder="inventory" value={form.inventory} onChange={e => setForm({...form, inventory: parseInt(e.target.value)})} className="border rounded px-2 py-1"/>
        <label>Upload image</label>
        {/*Upload Image*/}
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="border rounded px-2 py-1" />
        <button type="button" onClick={handleUploadImage} className="bg-green-500 text-white px-2 py-1 rounded">
           Upload image
        </button>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl">
          {form.id ? 'edit product' : 'create product'}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">title</th>
            <th className="border p-2">price</th>
            <th className="border p-2">inventory</th>
            <th className="border p-2">image</th>
            <th className="border p-2">operation</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">{p.price}</td>
              <td className="border p-2">{p.inventory}</td>
              <td className="border p-2">
                {p.image_url && <img src={`http://127.0.0.1:8000${p.image_url}`} alt={p.title} className="w-16 h-16 object-cover rounded"/>}
              </td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-yellow-400 rounded">edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-500 text-white rounded">delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
