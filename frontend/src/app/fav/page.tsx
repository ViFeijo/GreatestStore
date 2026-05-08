"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { addCartItem } from "@/lib/cart";
import { useRouter } from "next/navigation";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

type FavItem = {
  id: string;
  name: string;
  seller?: string;
  price: number;
  image?: string;
};

export default function favPage() {
  const [items, setItems] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function carregar() {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
      if (!token) {
        setErro('Faça login para ver seus favoritos.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoritos`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Erro ao carregar favoritos');
        const data = await res.json();
        const mapped: FavItem[] = (data || []).map((p: any) => ({
          id: String(p.id),
          name: p.nome,
          seller: p.marca_nome || p.vendedor_nome || '',
          price: Number(p.preco_final ?? p.preco ?? 0),
          image: p.imagem_url || 'https://via.placeholder.com/300x300?text=Sem+Imagem',
        }));
        setItems(mapped);
      } catch (err: any) {
        setErro(err?.message || 'Erro ao carregar favoritos');
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + (it.price || 0), 0), [items]);

  async function removeItem(id: string) {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    if (!token) return alert('Faça login para remover favorito.');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoritos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Erro ao remover favorito');
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert('Erro ao remover favorito');
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Carregando favoritos...</div>;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-7 w-7 text-[#7a1a2e]" />
        <h1 className="text-2xl font-bold text-slate-950">Lista de Favoritos</h1>
      </div>

      {erro ? (
        <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">{erro}</h2>
          <p className="mt-2 text-sm text-slate-600">Faça login para gerenciar seus favoritos.</p>
          <Link href="/login" className="mt-6 inline-flex rounded-md bg-[#7a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1224]">Entrar</Link>
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Sua lista de favoritos está vazia</h2>
          <p className="mt-2 text-sm text-slate-600">Adicione produtos que você gostou para continuar.</p>
          <Link href="/busca" className="mt-6 inline-flex rounded-md bg-[#7a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1224]">Ver produtos</Link>
        </section>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="relative grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[140px_1fr_auto]">
                <button type="button" onClick={() => removeItem(item.id)} className="absolute bottom-3 right-3 text-red-600 hover:text-red-700 p-1 rounded" aria-label="Remover">
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex h-36 w-36 items-center justify-center rounded-md bg-slate-50">
                  <img src={item.image} alt={item.name} className="max-h-32 max-w-32 object-contain" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-950">{item.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">Vendido por {item.seller}</p>
                  <p className="mt-3 text-lg font-bold text-[#7a1a2e]">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex flex-col items-end justify-between gap-3">
                  <button type="button" onClick={() => {
                    addCartItem({ id: item.id, name: item.name, seller: item.seller || '', price: item.price, image: item.image || '', quantity: 1 });
                    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
                    if (token) {
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/carrinho`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ produto_id: item.id, quantidade: 1 }) }).catch(() => {});
                    }
                    router.push('/cart');
                  }} className="rounded-md bg-[#7a1a2e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#5e1224]">Adicionar ao carrinho</button>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Resumo</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Itens</span>
                <span>{items.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-base font-bold text-slate-950">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
