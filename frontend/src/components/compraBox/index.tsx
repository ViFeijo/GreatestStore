// src/components/compraBox.tsx
"use client";

import { useState } from "react";
import { Plus, Minus, Truck, ShieldCheck, ShoppingCart, Loader2 } from "lucide-react";
import { InformacoesPreco, InformacoesVendedor } from "@/types";

interface CompraBoxProps {
    produtoId?: string | number;
    valores: InformacoesPreco;
    vendedor: InformacoesVendedor;
    emEstoque: boolean;
    textoPreviaFrete: string;
    onAddToCart?: (quantidade: number) => void;
    adicionando?: boolean;
}

export function CompraBox({
    valores,
    vendedor,
    emEstoque,
    textoPreviaFrete,
    onAddToCart,
    adicionando
}: CompraBoxProps) {
    const [quantidade, setQuantidade] = useState(1);

    const handleAdicionar = () => {
        if (onAddToCart && emEstoque) {
            onAddToCart(quantidade);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 space-y-6 shadow-sm border border-slate-200">
            {/* Preços e Descontos */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    {valores.porcentagemDesconto > 0 && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-black tracking-wider uppercase">
                            -{valores.porcentagemDesconto}% OFF
                        </span>
                    )}
                    {valores.descontoPix > 0 && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-black tracking-wider uppercase">
                            PIX -{valores.descontoPix}%
                        </span>
                    )}
                </div>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-red-600">
                        R$ {valores.precoAtual.toFixed(2).replace(".", ",")}
                    </span>
                    {valores.precoOriginal > valores.precoAtual && (
                        <span className="text-lg text-slate-400 line-through font-medium">
                            R$ {valores.precoOriginal.toFixed(2).replace(".", ",")}
                        </span>
                    )}
                </div>
            </div>

            {/* Parcelamento */}
            <div className="border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-600">
                    Em até <span className="font-bold text-slate-900">{valores.quantidadeParcelas}x</span> de{" "}
                    <span className="font-bold text-slate-900">
                        R$ {valores.valorParcela.toFixed(2).replace(".", ",")}
                    </span> sem juros
                </p>
            </div>

            {/* Controle de Quantidade */}
            <div className="border-t border-slate-100 pt-4">
                <p className="text-sm font-bold text-slate-700 mb-3">Quantidade:</p>
                <div className="flex items-center border border-slate-300 rounded-lg w-fit overflow-hidden bg-slate-50">
                    <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className="p-3 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                        disabled={!emEstoque || adicionando}
                    >
                        <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-12 text-center font-bold text-slate-900">{quantidade}</span>
                    <button
                        onClick={() => setQuantidade(quantidade + 1)}
                        className="p-3 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                        disabled={!emEstoque || adicionando}
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
                <button
                    onClick={handleAdicionar}
                    disabled={!emEstoque || adicionando}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base font-black uppercase tracking-wider transition-all shadow-lg ${
                        !emEstoque
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-red-200 transform active:scale-95"
                    }`}
                >
                    {adicionando ? (
                        <><Loader2 size={20} className="animate-spin" /> Adicionando...</>
                    ) : !emEstoque ? (
                        "Fora de Estoque"
                    ) : (
                        <><ShoppingCart size={20} /> Adicionar ao Carrinho</>
                    )}
                </button>
            </div>

            {/* Informações de Frete e Garantia */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                    <Truck size={20} className="text-green-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold text-sm text-slate-900">{textoPreviaFrete}</p>
                        <p className="text-xs text-slate-500 mt-1">Política de devolução: {vendedor.politicaDevolucao}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <ShieldCheck size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="font-bold text-sm text-slate-900">Compra Garantida</p>
                        <p className="text-xs text-slate-500 mt-1">{vendedor.garantia}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}