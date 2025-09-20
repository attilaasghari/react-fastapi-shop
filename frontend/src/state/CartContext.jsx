import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('cart_items')
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(items))
  }, [items])

  const addToCart = (product) => {
    setItems(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const clear = () => setItems([])

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])

  const totalPrice = () => items.reduce((s, i) => s + (i.price * i.quantity), 0)

  const value = { items, addToCart, updateQty, removeItem, clear, totalCount, totalPrice }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
