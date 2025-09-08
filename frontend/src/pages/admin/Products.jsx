import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import Toast from '../../components/Toast'

export default function Products(){
	const [items, setItems] = useState([])
	const [categories, setCategories] = useState([])
	const [form, setForm] = useState({ name:'', description:'', price: '', category:'', stock:'' })
    const [toast, setToast] = useState({ open:false, title:'', description:'', tone:'success' })

	async function load(){
		const [{ data: products }, { data: cats }] = await Promise.all([
			api.get('/admin/products'),
			api.get('/admin/categories'),
		])
		setItems(products)
		setCategories(cats)
	}

	useEffect(()=>{ load() },[])

	async function createProduct(e){
		e.preventDefault()
		const fd = new FormData()
		Object.entries(form).forEach(([k,v])=>fd.append(k, v))
		await api.post('/admin/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
		setForm({ name:'', description:'', price:'', category:'', stock:'' })
		await load()
        setToast({ open:true, title:'Ürün eklendi', description: form.name, tone:'success' })
	}

	async function remove(id){
		await api.delete(`/admin/products/${id}`)
		await load()
        setToast({ open:true, title:'Silindi', description:'Ürün kaldırıldı', tone:'warn' })
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Ürünler</h1>
			<Toast open={toast.open} title={toast.title} description={toast.description} tone={toast.tone} onClose={()=>setToast(t=>({...t, open:false}))} />
			<form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
				<input className="border rounded px-2 py-2 md:col-span-2" placeholder="İsim" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
				<input className="border rounded px-2 py-2 md:col-span-2" placeholder="Açıklama" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
				<input className="border rounded px-2 py-2" type="number" placeholder="Fiyat" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
				<select className="border rounded px-2 py-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
					<option value="">Kategori</option>
					{categories.map(c=>(<option key={c._id} value={c._id}>{c.name}</option>))}
				</select>
				<input className="border rounded px-2 py-2" type="number" placeholder="Stok" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} />
				<button className="bg-black text-white rounded px-3 py-2">Ekle</button>
			</form>

			<table className="w-full text-sm">
				<thead><tr className="text-left"><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th></th></tr></thead>
				<tbody>
					{items.map(p=> (
						<tr key={p._id} className="border-t">
							<td className="py-2">{p.name}</td>
							<td>{p.category?.name}</td>
							<td>₺{p.price}</td>
							<td>{p.stock}</td>
							<td><button className="text-red-600" onClick={()=>remove(p._id)}>Sil</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}


