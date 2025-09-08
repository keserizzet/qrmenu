export default function Modal({ open, title, children, confirmText = 'Onayla', cancelText = 'Vazgeç', onConfirm, onCancel }) {
	if (!open) return null
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/40" onClick={onCancel} />
			<div className="relative w-full max-w-md bg-white rounded-xl border shadow-xl p-5 space-y-3">
				<div className="text-lg font-semibold">{title}</div>
				<div className="text-sm text-gray-700">{children}</div>
				<div className="flex justify-end gap-2 pt-2">
					<button className="px-3 py-2 border rounded-md" onClick={onCancel}>{cancelText}</button>
					<button className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-emerald-600 text-white" onClick={onConfirm}>{confirmText}</button>
				</div>
			</div>
		</div>
	)
}


