"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Minus, Truck, ShieldCheck, X } from "lucide-react";
import { Button } from "../ui/button";
import { InformacoesPreco, InformacoesVendedor } from "@/types";
import { getCartItems } from "@/lib/cart";

interface CompraBoxProps {
    produtoId?: string | number;
    valores: InformacoesPreco;
    vendedor: InformacoesVendedor;
    emEstoque: boolean;
    textoPreviaFrete: string;
    onAddToCart?: (quantidade: number) => void;
}

export function CompraBox({
    produtoId,
    valores,
    vendedor,
    emEstoque,
    textoPreviaFrete,
    onAddToCart,
}: CompraBoxProps) {
    const [quantidade, setQuantidade] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);
    const itensCarrinho = modalAberto ? getCartItems() : [];
    const quantidadeTotal = itensCarrinho.reduce((total, item) => total + item.quantity, 0);
    const subtotal = itensCarrinho.reduce((total, item) => total + item.price * item.quantity, 0);

    const [favoritado, setFavoritado] = useState<boolean>(false);
    const [favLoading, setFavLoading] = useState(false);

    async function carregarFavorito() {
        const resolvedId = produtoId ?? (typeof window !== 'undefined' ? String(window.location.pathname.split('/').filter(Boolean).pop()) : null);
        if (!resolvedId) return;
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        if (!token) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoritos/${resolvedId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) return;
            const data = await res.json();
            setFavoritado(Boolean(data?.favoritado));
        } catch {
            // ignore
        }
    }

    async function toggleFavorito() {
        // resolve produto id from prop or URL path fallback
        const resolvedId = produtoId ?? (typeof window !== 'undefined' ? String(window.location.pathname.split('/').filter(Boolean).pop()) : null);
        if (!resolvedId) return alert("Produto inválido para favoritar.");
        const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
        if (!token) return alert("Faça login para favoritar.");

        setFavLoading(true);
        try {
            if (!favoritado) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoritos/${resolvedId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error();
                setFavoritado(true);
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favoritos/${resolvedId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error();
                setFavoritado(false);
            }
        } catch (err) {
            alert("Erro ao atualizar favorito.");
        } finally {
            setFavLoading(false);
        }
    }

    function handleAddToCart() {
        if (!emEstoque || !onAddToCart) return;

        onAddToCart(quantidade);
        setModalAberto(true);
    }

    // carrega estado do favorito ao montar
    useEffect(() => { carregarFavorito(); }, [produtoId]);

    return (
        <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm border border-gray-200">
            {/* Preço */}
            <div>

                <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded font-bold">
                        -{valores.porcentagemDesconto}%
                    </span>
                    {valores.descontoPix > 0 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                            PIX -{valores.descontoPix}%
                        </span>
                    )}
                </div>
                <div className="flex items-baseline gap-3 py-2">
                    <span className="text-3xl font-bold text-red-600">
                        R$ {valores.precoAtual.toFixed(2).replace(".", ",")}
                    </span>
                    {valores.precoOriginal > valores.precoAtual && (
                        <span className="text-lg text-gray-500 line-through">
                            R$ {valores.precoOriginal.toFixed(2).replace(".", ",")}
                        </span>
                    )}
                </div>
                
            </div>

            {/* Parcelamento */}
            <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                    {valores.quantidadeParcelas}x de{" "}
                    <span className="font-bold text-gray-900">
                        R$ {valores.valorParcela.toFixed(2).replace(".", ",")}
                    </span>
                </p>
            </div>

            {/* Quantidade */}
            <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">Quantidade</p>
                <div className="flex items-center border border-gray-300 rounded w-fit">
                    <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className="p-2 hover:bg-gray-100"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="px-4 font-semibold">{quantidade}</span>
                    <button
                        onClick={() => setQuantidade(quantidade + 1)}
                        className="p-2 hover:bg-gray-100"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="border-t pt-4 space-y-2">
                <Button
                    disabled={!emEstoque}
                    onClick={handleAddToCart}
                    className={`w-full py-6 text-lg font-bold ${emEstoque
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {emEstoque ? "Comprar" : "Fora de Estoque"}
                </Button>
                <button
                    type="button"
                    onClick={toggleFavorito}
                    disabled={favLoading}
                    className={`w-full py-4 text-lg font-bold rounded ${favoritado ? "bg-red-100 text-red-700" : "border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50"}`}
                >
                    {favoritado ? "❤️ Favoritado" : "🤍 Favoritar"}
                </button>
            </div>

            {/* Informações do Vendedor */}
            <div className="border-t pt-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-3">
                    <p className="font-semibold text-gray-900 mb-1">
                        {vendedor.nome}
                        {vendedor.lojaOficial && (
                            <span className="ml-2 text-blue-600">✓</span>
                        )}
                    </p>
                    <p className="text-sm text-gray-600">
                        {vendedor.textoQuantidadeVendas}
                    </p>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                        <ShieldCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{vendedor.garantia}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Truck size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-900">
                                {textoPreviaFrete}
                            </p>
                            <p className="text-gray-600">
                                Política de devolução: {vendedor.politicaDevolucao}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status de Estoque */}
            <div className="border-t pt-4">
                <div
                    className={`text-center py-2 rounded font-semibold ${emEstoque
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {emEstoque ? "Em Estoque" : "Indisponível"}
                </div>
            </div>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-950">
                                    Produto adicionado
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Seu carrinho tem {quantidadeTotal} item{quantidadeTotal === 1 ? "" : "s"}.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                aria-label="Fechar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-5 max-h-64 space-y-3 overflow-auto">
                            {itensCarrinho.map((item) => (
                                <div key={item.id} className="flex gap-3 rounded-md border border-gray-200 p-3">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-14 w-14 rounded bg-gray-50 object-contain"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-950">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Qtd. {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-red-600">
                                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                            <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                            <span className="text-base font-bold text-gray-950">
                                R$ {subtotal.toFixed(2).replace(".", ",")}
                            </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="rounded-md border border-gray-300 px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                            >
                                Continuar comprando
                            </button>
                            <Link
                                href="/cart"
                                className="rounded-md bg-red-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700"
                            >
                                Ir para o carrinho
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
