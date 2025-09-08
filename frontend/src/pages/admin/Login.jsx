import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../lib/auth'

export default function Login() {
	const [email, setEmail] = useState('admin@cafe.com')
	const [password, setPassword] = useState('admin123')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		try {
			await login(email, password)
			navigate('/admin', { replace: true })
		} catch (e) {
			setError('Giriş başarısız')
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border rounded p-4 space-y-3">
				<h1 className="text-xl font-semibold">Yönetim Girişi</h1>
				{error && <div className="text-sm text-red-600">{error}</div>}
				<div>
					<label className="block text-sm mb-1">E-posta</label>
					<input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm mb-1">Şifre</label>
					<input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
				</div>
				<button className="w-full bg-black text-white py-2 rounded">Giriş Yap</button>
			</form>
		</div>
	)
}


