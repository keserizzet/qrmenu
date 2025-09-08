import { useEffect, useState } from 'react'
import { api } from '../../lib/api'

export default function Dashboard() {
	const [summary, setSummary] = useState({ activeTables: 0, pendingOrders: 0, salesToday: 0 })

	useEffect(() => {
		async function load() {
			try {
				const orders = await api.get('/admin/orders')
				const pending = (orders.data || []).filter(o => o.status === 'pending').length
				setSummary({ activeTables: 0, pendingOrders: pending, salesToday: 0 })
			} catch {}
		}
		load()
	}, [])

	return (
		<div className="max-w-5xl mx-auto p-4">
			<h1 className="text-2xl font-semibold mb-4">Yönetim Paneli</h1>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Aktif Masa</div><div className="text-2xl font-semibold">{summary.activeTables}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Bekleyen Sipariş</div><div className="text-2xl font-semibold">{summary.pendingOrders}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Günlük Satış</div><div className="text-2xl font-semibold">₺{summary.salesToday}</div></div>
			</div>
		</div>
	)
}


