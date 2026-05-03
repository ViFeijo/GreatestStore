"use client";

import { MOCK_PRODUTO } from "@/constants/mock-product"; // Nome corrigido
import { SideBarDir } from "@/components/SideBarDir"; // Nome e import corrigidos
import { Info, BookOpen } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
    const produto = MOCK_PRODUTO;

    return (
        <main className="container mx-auto px-4 py-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Coluna Esquerda - Imagem (1 coluna) */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 h-[500px] flex items-center justify-center relative">
                        <div className="absolute top-0 left-0 bg-red-600 text-white font-black text-3xl px-6 py-2 transform -rotate-12 translate-y-8 -translate-x-4 shadow-lg">
                            {produto.valores.porcentagemDesconto}% OFF
                        </div>

                        <img
                            src={produto.imagens[0]}
                            alt={produto.nomeProduto}
                            className="max-h-full object-contain"
                        />
                    </div>

                    <hr className="border-gray-200 my-6" />

                    {/* Descrição Detalhada */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen size={28} className="text-red-600" />
                            Descrição Do Produto
                        </h2>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {produto.descricaoCompleta}
                        </div>
                    </div>
                </div>

                {/* Coluna Meio - Título e Sobre (1 coluna) */}
                <div className="lg:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-6">
                        {produto.nomeProduto}
                    </h1>

                    <div className="space-y-4">
                        <h2 className="text-lg font-black text-red-600 flex items-center gap-2 uppercase tracking-tight">
                            <Info size={24} className="text-red-600" />
                            Sobre o Produto
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                            {produto.topicosSobreProduto.map((topico: string, index: number) => (
                                <li key={index} className="leading-relaxed">
                                    {topico}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Coluna Direita - Sidebar (1 coluna) */}
                <div className="lg:col-span-1">
                    <SideBarDir
                        valores={produto.valores}
                        vendedor={produto.vendedor}
                        emEstoque={produto.emEstoque}
                        textoPreviaFrete={produto.textoPreviaFrete}
                    />
                </div>

            </div>
        </main>
    );
}