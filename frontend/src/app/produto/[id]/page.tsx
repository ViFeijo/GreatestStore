"use client";

import { MOCK_PRODUTO } from "@/constants/mock-product";
import { SideBarDir } from "@/components/SideBarDir";
import { Info, BookOpen } from "lucide-react";
import { ProdutoFAQ } from "@/components/FAQ";
import { ProductGallery } from "@/components/fotosProduto";

export default function ProductPage({ params }: { params: { id: string } }) {
    const produto = MOCK_PRODUTO;

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Coluna Esquerda - Carrossel de Imagens (1 coluna) */}
                <div className="lg:col-span-1">
                    <div className="relative">
                        <div className="absolute top-0 left-0 bg-red-600 text-white font-black text-2xl px-4 py-2 transform -rotate-12 translate-y-4 -translate-x-2 shadow-lg z-10">
                            {produto.valores.porcentagemDesconto}% OFF
                        </div>
                        <ProductGallery 
                            images={produto.imagens} 
                            productName={produto.nomeProduto} 
                        />
                    </div>
                </div>

                {/* Coluna Meio - Título e Sobre (1 coluna) */}
                <div className="lg:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {produto.nomeProduto}
                    </h1>

                    <div className="space-y-4 mt-6">
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

                {/* Coluna Direita - Sidebar (1 coluna, ocupa 2 linhas) */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <SideBarDir
                        valores={produto.valores}
                        vendedor={produto.vendedor}
                        emEstoque={produto.emEstoque}
                        textoPreviaFrete={produto.textoPreviaFrete}
                    />
                </div>

                {/* Descrição + FAQ - 2 colunas na segunda linha */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen size={28} className="text-red-600" />
                            Descrição Do Produto
                        </h2>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {produto.descricaoCompleta}
                        </div>
                    </div>
                    <div className="space-y-4 mt-6">
                        <h2 className="text-lg font-black text-red-600 flex items-center gap-2 uppercase tracking-tight">
                            <Info size={24} className="text-red-600" />
                            Informações Tecnicas
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                            {Object.entries(produto.especificacoesTecnicas).map(([chave,valor], index) => (
                                <li key={index} className="leading-relaxed">
                                    <strong>{chave}:</strong> {valor}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="space-y-6">
                        <ProdutoFAQ faqs={produto.perguntasFrequentes} />
                    </div>
                </div>

            </div>
        </main>
    );
}