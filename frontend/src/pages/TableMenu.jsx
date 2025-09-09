import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { fetchMenu, submitOrder } from '../lib/api'
import { useCart } from '../hooks/useCart'

export default function TableMenu() {
  const { number } = useParams()
  const [search] = useSearchParams()
  const [data, setData] = useState({ categories: [], products: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const { items, addItem, updateQuantity, removeItem, clear, total } = useCart()

  useEffect(() => {
    fetchMenu()
      .then(setData)
      .catch(() => setError('Menü yüklenemedi'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return data.products
    return data.products.filter(
      (p) => p.category && p.category.name === activeCategory
    )
  }, [activeCategory, data.products])

  async function handleOrder() {
    if (!items.length) return
    const tableNumber = Number(number)
    try {
      await submitOrder({ tableNumber, items })
      clear()
      alert('Siparişiniz alındı!')
    } catch (e) {
      alert('Sipariş gönderilemedi')
    }
  }

  if (loading) return <div className="p-4">Yükleniyor...</div>
  if (error) return <div className="p-4 text-red-600">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <header className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shadow-2xl border border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Masa #{number}
          </h1>
          <p className="text-sm/6 opacity-90">
            Afiyet olsun! Kategorilerden seçim yapın.
          </p>
        </div>
        <div className="hidden md:block text-sm/6 opacity-90">
          {search.get('lang') || 'tr'}
        </div>
      </header>

      {/* KATEGORİLER */}
      <nav className="flex gap-2 overflow-x-auto pb-1">
        <button
          className={`px-4 py-2 rounded-full transition shadow-sm ${
            activeCategory === 'all'
              ? 'bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white'
              : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
          }`}
          onClick={() => setActiveCategory('all')}
        >
          Tümü
        </button>
        {data.categories.map((c) => (
          <button
            key={c._id}
            className={`px-4 py-2 rounded-full transition shadow-sm ${
              activeCategory === c.name
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
            }`}
            onClick={() => setActiveCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* ÜRÜNLER */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur border border-white/10 hover:shadow-2xl hover:-translate-y-1 transition duration-200"
          >
            {p.imageUrl ? (
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="h-40 bg-gray-100" />
            )}
            <div className="p-4 space-y-1">
              <div className="font-medium leading-tight">{p.name}</div>
              <div className="text-sm text-gray-300 line-clamp-2 min-h-10">
                {p.description}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-emerald-300">
                  ₺{p.price}
                </span>
                <button
                  className="px-3 py-1.5 rounded-md bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white hover:opacity-90"
                  onClick={() => addItem(p, 1)}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* SEPET */}
      <aside className="sticky bottom-0 bg-black/30 backdrop-blur border-t border-white/10 p-3 rounded-t-2xl shadow-[0_-6px_12px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-200">
            Sepet: {items.length} ürün
          </div>
          <div className="font-semibold text-emerald-300">Toplam: ₺{total}</div>
        </div>
        {items.length > 0 && (
          <div className="mt-3 space-y-2 max-h-60 overflow-auto">
            {items.map((it) => (
              <div
                key={it.productId}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-600">₺{it.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    className="w-16 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    value={it.quantity}
                    onChange={(e) =>
                      updateQuantity(it.productId, Number(e.target.value))
                    }
                  />
                  <button
                    className="text-red-600"
                    onClick={() => removeItem(it.productId)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          disabled={!items.length}
          className="mt-3 w-full py-2.5 rounded-md disabled:opacity-50 bg-gradient-to-r from-fuchsia-600 to-rose-600 text-white hover:opacity-90"
          onClick={handleOrder}
        >
          Siparişi Gönder
        </button>
      </aside>
    </div>
  )
}
