export type CartItem = {
  id: string;
  name: string;
  seller: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_STORAGE_KEY = "greateststore:cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];

    const parsed = JSON.parse(storedCart);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addCartItem(item: CartItem) {
  const currentItems = getCartItems();
  const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

  const nextItems = existingItem
    ? currentItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      )
    : [...currentItems, item];

  saveCartItems(nextItems);
}
