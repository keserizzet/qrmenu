import { useEffect } from 'react'

export default function Toast({ open, onClose, title = '', description = '', tone = 'success', duration = 2500 }) {
	useEffect(() => {
		if (!open) return
		const t = setTimeout(() => onClose?.(), duration)
		return () => clearTimeout(t)
	}, [open, duration, onClose])

	if (!open) return null

	const palette = tone === 'error'
		? 'bg-rose-600 text-white'
		: tone === 'warn'
		? 'bg-amber-500 text-black'
		: 'bg-emerald-600 text-white'

	return (
		<div className="fixed inset-0 pointer-events-none flex items-end justify-center p-4">
			<div className={`pointer-events-auto ${palette} rounded-lg shadow-lg px-4 py-3 min-w-64 max-w-md w-full text-sm`}> 
				{title && <div className="font-semibold mb-0.5">{title}</div>}
				{description && <div className="opacity-90">{description}</div>}
			</div>
		</div>
	)
}


