"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCartItems, saveCartItems, type CartItem } from "@/lib/cart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setItems(getCartItems());
    });
  }, []);

  function updateItems(nextItems: CartItem[]) {
    setItems(nextItems);
    saveCartItems(nextItems);
  }

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const shipping = items.length > 0 ? 29.9 : 0;
  const total = subtotal + shipping;

  function updateQuantity(id: string, change: number) {
    updateItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  }

  function removeItem(id: string) {
    updateItems(items.filter((item) => item.id !== id));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-[#7a1a2e]" />
        <h1 className="text-2xl font-bold text-slate-950">Carrinho</h1>
      </div>

      {items.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Seu carrinho está vazio</h2>
          <p className="mt-2 text-sm text-slate-600">
            Adicione produtos para continuar sua compra.
          </p>
          <Link
            href="/busca"
            className="mt-6 inline-flex rounded-md bg-[#7a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1224]"
          >
            Ver produtos
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto]"
              >
                <div className="flex h-36 w-36 items-center justify-center rounded-md bg-slate-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-24 max-w-24 object-contain"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">Vendido por {item.seller}</p>
                  <p className="mt-3 text-lg font-bold text-[#7a1a2e]">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex h-9 items-center rounded-md border border-slate-300 bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-slate-950">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Resumo</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Frete</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-base font-bold text-slate-950">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-md bg-[#7a1a2e] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#5e1224]"
            >
              Finalizar compra
            </Link>
            <Link
              href="/busca"
              className="mt-3 block text-center text-sm font-semibold text-[#7a1a2e] hover:underline"
            >
              Continuar comprando
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
