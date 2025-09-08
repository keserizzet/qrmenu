import { useMemo, useState } from 'react';

export function useCart() {
	const [items, setItems] = useState([]);

	function addItem(product, quantity = 1) {
		setItems((prev) => {
			const existing = prev.find((it) => it.productId === product._id);
			if (existing) {
				return prev.map((it) => it.productId === product._id ? { ...it, quantity: it.quantity + quantity } : it);
			}
			return [...prev, { productId: product._id, name: product.name, price: product.price, quantity }];
		});
	}

	function updateQuantity(productId, quantity) {
		setItems((prev) => prev.map((it) => it.productId === productId ? { ...it, quantity } : it));
	}

	function removeItem(productId) {
		setItems((prev) => prev.filter((it) => it.productId !== productId));
	}

	function clear() { setItems([]); }

	const total = useMemo(() => items.reduce((sum, it) => sum + it.price * it.quantity, 0), [items]);

	return { items, addItem, updateQuantity, removeItem, clear, total };
}


