import { useState } from 'react'
import api from '../api.js'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/token', new URLSearchParams(form), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      localStorage.setItem('admin_token', res.data.access_token)
      navigate('/admin')
    } catch (err) {
      setError('The username or password is incorrect.')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow grid gap-4">
      <h1 className="text-xl font-bold text-center">Admin login</h1>
      <form onSubmit={handleSubmit} className="grid gap-2">
        <input placeholder="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} className="border rounded px-2 py-1"/>
        <input type="password" placeholder="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="border rounded px-2 py-1"/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl">login</button>
      </form>
    </div>
  )
}
