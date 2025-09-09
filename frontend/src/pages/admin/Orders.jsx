import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { io } from 'socket.io-client'

export default function Orders(){
	const [items, setItems] = useState([])
	const [status, setStatus] = useState('')

	async function load(){
		const { data } = await api.get('/admin/orders', { params: status? { status } : {} })
		setItems(data)
	}

	useEffect(()=>{ load() },[status])
	useEffect(()=>{
		const socket = io((import.meta.env.VITE_API_URL || '').replace('/api','') || 'http://localhost:5001')
		socket.on('order:new', ()=> load())
		socket.on('order:updated', ()=> load())
		return ()=> socket.close()
	},[])

	async function update(id, next){
		await api.put(`/admin/orders/${id}/status`, { status: next })
		await load()
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Siparişler</h1>
			<div className="flex gap-2">
				<select className="border rounded px-2 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
					<option value="">Tümü</option>
					<option value="pending">Bekliyor</option>
					<option value="preparing">Hazırlanıyor</option>
					<option value="ready">Hazır</option>
					<option value="served">Servis Edildi</option>
				</select>
			</div>
			<table className="w-full text-sm">
				<thead><tr className="text-left"><th>Masa</th><th>Ürünler</th><th>Durum</th><th>Toplam</th><th></th></tr></thead>
				<tbody>
					{items.map(o=> (
						<tr key={o._id} className="border-t">
							<td className="py-2">#{o.tableNumber}</td>
							<td>{o.items.map(i=>`${i.name} x${i.quantity}`).join(', ')}</td>
							<td>
								<select className="border rounded px-2 py-1" value={o.status} onChange={(e)=>update(o._id, e.target.value)}>
									<option value="pending">Bekliyor</option>
									<option value="preparing">Hazırlanıyor</option>
									<option value="ready">Hazır</option>
									<option value="served">Servis Edildi</option>
								</select>
							</td>
							<td>₺{o.total}</td>
							<td></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}


