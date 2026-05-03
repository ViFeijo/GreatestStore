// src/components/SideBarDir.tsx
"use client";

import { CompraBox } from "@/components/compraBox";
import { InformacoesPreco, InformacoesVendedor } from "@/types";

interface SideBarDirProps {
  valores: InformacoesPreco;
  vendedor: InformacoesVendedor;
  emEstoque: boolean;
  textoPreviaFrete: string;
  urlBannerPromocional?: string;
}

export function SideBarDir({
  valores,
  vendedor,
  emEstoque,
  textoPreviaFrete,
  urlBannerPromocional
}: SideBarDirProps) {
  return (
    // A classe sticky faz ela ficar fixa ao rolar a página
    <aside className="w-full lg:max-w-[400px] shrink-0 sticky top-[160px] flex flex-col gap-4 z-40">
      
      {/* Banner Promocional do Topo da Sidebar (se existir) */}
      {urlBannerPromocional && (
        <div className="w-full bg-gradient-to-r from-gray-900 to-black text-white h-[80px] rounded-lg flex items-center justify-center font-black text-3xl italic shadow-md overflow-hidden relative">
          <span className="text-yellow-500 z-10">MEGA</span> <span className="z-10 ml-2">MAIO</span>
          <div className="absolute inset-0 bg-yellow-500/10" />
        </div>
      )}

      {/* O seu componente de compra entra aqui dentro! */}
      <CompraBox 
        valores={valores}
        vendedor={vendedor}
        emEstoque={emEstoque}
        textoPreviaFrete={textoPreviaFrete}
      />
      
    </aside>
  );
}