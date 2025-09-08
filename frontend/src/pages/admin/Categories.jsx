import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function Categories(){
	const [items, setItems] = useState([])
	const [name, setName] = useState('')

	async function load(){
		const { data } = await api.get('/admin/categories')
		setItems(data)
	}
	useEffect(()=>{ load() },[])

	async function create(e){
		e.preventDefault()
		await api.post('/admin/categories', { name })
		setName('')
		await load()
	}

	async function remove(id){
		await api.delete(`/admin/categories/${id}`)
		await load()
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Kategoriler</h1>
			<form onSubmit={create} className="flex gap-2">
				<input className="border rounded px-2 py-2" placeholder="Kategori adı" value={name} onChange={e=>setName(e.target.value)} />
				<button className="bg-black text-white rounded px-3 py-2">Ekle</button>
			</form>
			<ul className="space-y-1">
				{items.map(c=> (
					<li key={c._id} className="flex items-center justify-between border rounded px-3 py-2">
						<div>{c.name}</div>
						<button className="text-red-600" onClick={()=>remove(c._id)}>Sil</button>
					</li>
				))}
			</ul>
		</div>
	)
}


