import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5001/api';

export const api = axios.create({ baseURL });

export async function fetchMenu() {
	const { data } = await api.get('/menu');
	return data;
}

export async function submitOrder(order) {
	const { data } = await api.post('/orders', order);
	return data;
}


