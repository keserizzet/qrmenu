import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function Tables(){
	const [items, setItems] = useState([])
	const [number, setNumber] = useState('')

	async function load(){
		const { data } = await api.get('/admin/tables')
		setItems(data)
	}
	useEffect(()=>{ load() },[])

	async function create(e){
		e.preventDefault()
		await api.post('/admin/tables', { number: Number(number) })
		setNumber('')
		await load()
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Masalar</h1>
			<form onSubmit={create} className="flex gap-2">
				<input className="border rounded px-2 py-2" type="number" placeholder="Masa no" value={number} onChange={e=>setNumber(e.target.value)} />
				<button className="bg-black text-white rounded px-3 py-2">Ekle</button>
			</form>
			<table className="w-full text-sm">
				<thead><tr className="text-left"><th>Masa</th><th>QR</th></tr></thead>
				<tbody>
					{items.map(t=> (
						<tr key={t._id} className="border-t">
							<td className="py-2">{t.number}</td>
							<td><a className="text-blue-600" href={`${import.meta.env.VITE_API_URL}/admin/tables/${t.number}/qrcode`} target="_blank">İndir</a></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}


