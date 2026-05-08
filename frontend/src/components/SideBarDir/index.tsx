// src/components/SideBarDir.tsx
"use client";

import { CompraBox } from "@/components/compraBox";
import { InformacoesPreco, InformacoesVendedor } from "@/types";

export interface SideBarDirProps {
  produtoId?: string | number;
  valores: InformacoesPreco;
  vendedor: InformacoesVendedor;
  emEstoque: boolean;
  textoPreviaFrete: string;
  urlBannerPromocional?: string;
  onAddToCart?: (quantidade: number) => void;
  adicionando?: boolean; // Propriedade adicionada!
}

export function SideBarDir({ 
    produtoId, 
    valores, 
    vendedor, 
    emEstoque, 
    textoPreviaFrete, 
    urlBannerPromocional, // Propriedade desestruturada!
    onAddToCart, 
    adicionando 
}: SideBarDirProps) {
  return (
    <aside className="w-full shrink-0 flex flex-col gap-4 z-40">
      
      {/* Banner Promocional do Topo da Sidebar (se existir) */}
      {urlBannerPromocional && (
        <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <img 
                src={urlBannerPromocional} 
                alt="Campanha Promocional" 
                className="w-full h-auto object-cover" 
            />
        </div>
      )}

      {/* Componente de Compra com todas as props repassadas */}
      <CompraBox 
        produtoId={produtoId}
        valores={valores}
        vendedor={vendedor}
        emEstoque={emEstoque}
        textoPreviaFrete={textoPreviaFrete}
        onAddToCart={onAddToCart}
        adicionando={adicionando}
      />
      
    </aside>
  );
}