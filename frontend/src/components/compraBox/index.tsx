"use client";

import { useState } from "react";
import { Plus, Minus, Truck, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { InformacoesPreco, InformacoesVendedor } from "@/types";

interface CompraBoxProps {
    valores: InformacoesPreco;
    vendedor: InformacoesVendedor;
    emEstoque: boolean;
    textoPreviaFrete: string;
}

export function CompraBox({
    valores,
    vendedor,
    emEstoque,
    textoPreviaFrete,
}: CompraBoxProps) {
    const [quantidade, setQuantidade] = useState(1);

    return (
        <div className="bg-white rounded-lg p-6 sticky top-20 space-y-6 shadow-sm border border-gray-200">
            {/* Preço */}
            <div>
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-red-600">
                        R$ {valores.precoAtual.toFixed(2).replace(".", ",")}
                    </span>
                    {valores.precoOriginal > valores.precoAtual && (
                        <span className="text-lg text-gray-500 line-through">
                            R$ {valores.precoOriginal.toFixed(2).replace(".", ",")}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded font-bold">
                        -{valores.porcentagemDesconto}%
                    </span>
                    {valores.descontoPix > 0 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                            PIX -{valores.descontoPix}%
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
                    className={`w-full py-6 text-lg font-bold ${emEstoque
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    {emEstoque ? "Adicionar ao Carrinho" : "Fora de Estoque"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full py-6 text-lg font-bold border-2 border-gray-300"
                >
                    ❤️ Favoritar
                </Button>
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
        </div>
    );
}