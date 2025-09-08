import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchMenu, submitOrder } from '../lib/api';
import { useCart } from '../hooks/useCart';

// Icons for a cleaner look
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function TableMenu() {
  const { number } = useParams();
  const [search] = useSearchParams();
  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  
  const { items, addItem, updateQuantity, removeItem, clear, total } = useCart();

  useEffect(() => {
    fetchMenu()
      .then(setData)
      .catch(() => setError('Menü yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return data.products;
    return data.products.filter(
      (p) => p.category && p.category.name === activeCategory
    );
  }, [activeCategory, data.products]);

  async function handleOrder() {
    if (!items.length) return;
    const tableNumber = Number(number);
    try {
      await submitOrder({ tableNumber, items });
      clear();
      alert('Siparişiniz alındı!');
    } catch (e) {
      alert('Sipariş gönderilemedi');
    }
  }

  function openProductModal(product) {
    setSelectedProduct(product);
  }

  function closeProductModal() {
    setSelectedProduct(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-orange-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-xl text-gray-700">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center text-lg bg-red-50 rounded-lg shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 font-sans bg-gray-100 min-h-screen">
      
      {/* HEADER */}
      <header className="rounded-3xl p-6 md:p-8 bg-white text-gray-800 flex flex-col md:flex-row items-center justify-between shadow-lg border border-gray-200">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-orange-600">
            🍽️ Masa #{number}
          </h1>
          <p className="text-base md:text-lg mt-2 text-gray-600">
            Afiyet olsun! Lezzet dolu menümüzden dilediğinizce seçim yapabilirsiniz.
          </p>
        </div>
        <div className="hidden md:block text-sm text-gray-400 mt-2 md:mt-0">
          Dil: {search.get('lang') || 'TR'}
        </div>
      </header>

      {/* KATEGORİLER */}
      <nav className="sticky top-0 z-10 bg-gray-100 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-orange-300">
        <div className="flex gap-3">
          <button
            className={`px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 transform hover:scale-105 ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => setActiveCategory('all')}
          >
            Tüm Lezzetler
          </button>
          {data.categories.map((c) => (
            <button
              key={c._id}
              className={`px-6 py-3 rounded-full whitespace-nowrap font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === c.name
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setActiveCategory(c.name)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ÜRÜNLER */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            onClick={() => openProductModal(p)}
          >
            {p.imageUrl && (
              <div className="relative">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            <div className="p-4 space-y-2 text-gray-800">
              <h3 className="font-semibold text-lg leading-snug">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 min-h-10">
                {p.description}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-orange-600">
                  ₺{p.price}
                </span>
                <button
                  className="p-2 rounded-full bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addItem(p, 1);
                  }}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={closeProductModal}>
              <CloseIcon />
            </button>
            <div className="text-center">
              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-2xl shadow-lg mb-4"
                />
              )}
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-orange-600">₺{selectedProduct.price}</span>
                <button
                  className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-colors"
                  onClick={() => {
                    addItem(selectedProduct, 1);
                    closeProductModal();
                  }}
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STICKY CART BUTTON */}
      {items.length > 0 && (
        <button 
          className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-full shadow-lg z-20 animate-bounce-in transition-all duration-300 hover:scale-110"
          onClick={() => setShowCart(!showCart)}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.706.707 1.706H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-semibold">{items.length} Ürün</span>
          </div>
        </button>
      )}

      {/* CART MODAL/DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white/95 backdrop-blur-xl z-30 shadow-2xl transform transition-transform duration-300 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Sipariş Sepeti</h2>
            <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowCart(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {items.length > 0 ? (
              items.map((it) => (
                <div
                  key={it.productId}
                  className="flex items-center justify-between gap-3 bg-gray-100 rounded-xl p-3"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{it.name}</div>
                    <div className="text-sm text-gray-500">₺{it.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(it.productId, Math.max(1, it.quantity - 1))} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"><MinusIcon /></button>
                    <span className="font-medium">{it.quantity}</span>
                    <button onClick={() => addItem(it, 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"><PlusIcon /></button>
                    <button
                      className="text-red-500 hover:text-red-600 ml-2"
                      onClick={() => removeItem(it.productId)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-10">Sepetiniz boş.</p>
            )}
          </div>
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Toplam Fiyat:</span>
              <span className="text-3xl font-extrabold text-orange-600">₺{total}</span>
            </div>
            <button
              disabled={!items.length}
              className="w-full py-4 rounded-xl disabled:opacity-50 bg-orange-500 text-white font-semibold shadow-md hover:bg-orange-600 transition-colors"
              onClick={handleOrder}
            >
              🚀 Siparişi Tamamla
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}