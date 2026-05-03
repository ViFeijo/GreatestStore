"use client";

import { ProdutoDetalhado } from "@/types";
import { ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { SideBarDir } from "@/components/SideBarDir";

interface DescricaoProdutoProps {
  produto: ProdutoDetalhado;
}

export function DescricaoProduto({ produto }: DescricaoProdutoProps) {
  const [imagemSelecionada, setImagemSelecionada] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <nav className="bg-white px-4 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          {produto.caminhoNavegacao.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <a href={item.url} className="text-blue-600 hover:underline">
                {item.rotulo}
              </a>
              {index < produto.caminhoNavegacao.length - 1 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Banner Promocional */}
        {produto.urlBannerPromocional && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={produto.urlBannerPromocional}
              alt="Banner Promocional"
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Imagens e Descrição */}
          <div className="lg:col-span-2">
            {/* Marca */}
            <div className="flex items-center gap-3 mb-6">
              {produto.logoMarca && (
                <img
                  src={produto.logoMarca}
                  alt={produto.nomeMarca}
                  className="h-12 w-12 object-contain"
                />
              )}
              <div>
                <p className="text-sm text-gray-600">Marca</p>
                <p className="font-bold text-lg">{produto.nomeMarca}</p>
              </div>
            </div>

            {/* Título e Avaliação */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {produto.nomeProduto}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.floor(produto.avaliacoes.media)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {produto.avaliacoes.media} ({produto.avaliacoes.quantidadeTotal} avaliações)
              </span>
              {produto.avisoEstoque && (
                <span className="text-sm text-orange-600 font-semibold">
                  {produto.avisoEstoque}
                </span>
              )}
            </div>

            {/* Galeria de Imagens */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="mb-4">
                <img
                  src={produto.imagens[imagemSelecionada]}
                  alt={produto.nomeProduto}
                  className="w-full h-96 object-contain rounded"
                />
              </div>

              {produto.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {produto.imagens.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemSelecionada(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded overflow-hidden transition-all ${
                        imagemSelecionada === index
                          ? "border-red-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sobre o Produto */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Sobre o Produto</h2>
              <ul className="space-y-3">
                {produto.topicosSobreProduto.map((topico, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{topico}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Descrição Completa */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {produto.descricaoCompleta}
              </p>
            </div>

            {/* Especificações Técnicas */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Especificações Técnicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(produto.especificacoesTecnicas).map(
                  ([chave, valor]) => (
                    <div key={chave} className="border-b pb-3">
                      <p className="text-sm text-gray-600">{chave}</p>
                      <p className="font-semibold text-gray-900">{valor}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Sidebar Fixa */}
          <div className="lg:col-span-1">
            <SideBarDir
              valores={produto.valores}
              vendedor={produto.vendedor}
              emEstoque={produto.emEstoque}
              textoPreviaFrete={produto.textoPreviaFrete}
              urlBannerPromocional={produto.urlBannerPromocional}
            />
          </div>
        </div>
      </div>
    </div>
  );
}