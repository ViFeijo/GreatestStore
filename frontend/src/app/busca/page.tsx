"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import type { ProdutoResumido } from "@/types";

const DEFAULT_MAX_PRECO = 1000000000;

type Ordenacao = "mais_recentes" | "menor_preco" | "maior_preco";

type BuscaFiltros = {
   termo?: string;
   categoria_id?: number | string;
   subcategoria_id?: number | string;
   marca_id?: number | string;
   preco_min?: number;
   preco_max?: number;
   apenas_oferta?: boolean;
   ordenar?: Ordenacao;
};

type ProdutoBusca = {
   id: string;
   nome: string;
   quantidade?: number | string | null;
   preco: number | string;
   preco_promocional?: number | string | null;
   desconto_ativo?: boolean | null;
   preco_final?: number | string | null;
   marca_nome?: string | null;
   vendedor_nome?: string | null;
   subcategoria_nome?: string | null;
   categoria_nome?: string | null;
   imagem_url?: string | null;
   media_avaliacoes?: number | string | null;
   total_avaliacoes?: number | string | null;
   total_resultados?: number | string | null;
};

type BuscaResultado = {
   produtos: ProdutoBusca[];
   total: number;
};

const ORDENACOES: Array<{ value: Ordenacao; label: string }> = [
   { value: "mais_recentes", label: "Mais recentes" },
   { value: "menor_preco", label: "Menor preco" },
   { value: "maior_preco", label: "Maior preco" },
];

const FALLBACK_IMAGE = "https://via.placeholder.com/600x600?text=Produto";

type MarcaOpcao = {
   id: string | number;
   nome: string;
};

type CategoriaApi = {
   id: string | number;
   nome: string;
};

type SubcategoriaApi = {
   id: string | number;
   categoria_id: string | number;
   nome: string;
};

type CategoriaOpcao = {
   id: string | number;
   nome: string;
   subcategorias: Array<{ id: string | number; nome: string }>;
};

function normalizeTexto(value: string | null | undefined) {
   return value?.trim().toLowerCase() ?? "";
}

function parseCategoriaSelecionada(value: string) {
   if (!value) {
      return { categoria_id: undefined, subcategoria_id: undefined };
   }

   const [tipo, idEnc] = value.split(":");

   if (tipo === "cat" && idEnc) {
      return { categoria_id: decodeURIComponent(idEnc), subcategoria_id: undefined };
   }

   if (tipo === "sub" && idEnc) {
      return { categoria_id: undefined, subcategoria_id: decodeURIComponent(idEnc) };
   }

   return { categoria_id: undefined, subcategoria_id: undefined };
}

function toNumber(value: string | number | null | undefined, fallback = 0) {
   const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
   return Number.isFinite(parsed) ? parsed : fallback;
}

function mapParaResumo(produto: ProdutoBusca): ProdutoResumido {
   const precoOriginal = toNumber(produto.preco, 0);
   const precoPromocional = toNumber(produto.preco_promocional, precoOriginal);
   const descontoAtivo = Boolean(produto.desconto_ativo);
   const precoAtual = descontoAtivo && precoPromocional > 0 ? precoPromocional : precoOriginal;
   const porcentagemDesconto =
      precoOriginal > 0 && precoAtual < precoOriginal
         ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100)
         : 0;
   const avaliacao = toNumber(produto.media_avaliacoes, 0);
   const emEstoque = toNumber(produto.quantidade, 0) > 0;
   const imagem = produto.imagem_url?.trim() || FALLBACK_IMAGE;

   return {
      id: produto.id,
      nome: produto.nome,
      precoAtual,
      precoOriginal,
      porcentagemDesconto,
      imagem,
      avaliacao,
      emEstoque,
   };
}

function obterPrecoFinal(produto: ProdutoBusca) {
   const precoFinal = toNumber(produto.preco_final, 0);

   if (precoFinal > 0) {
      return precoFinal;
   }

   const precoOriginal = toNumber(produto.preco, 0);
   const precoPromocional = toNumber(produto.preco_promocional, precoOriginal);
   return Boolean(produto.desconto_ativo) && precoPromocional > 0 ? precoPromocional : precoOriginal;
}

async function buscarComFiltros(filtros: BuscaFiltros, signal?: AbortSignal): Promise<BuscaResultado> {
   const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

   if (!apiBaseUrl) {
      throw new Error("API nao configurada. Tente novamente mais tarde.");
   }

   const params = new URLSearchParams();
   const termo = filtros.termo?.trim();

   if (termo) params.set("q", termo);
   if (filtros.categoria_id) params.set("categoria_id", String(filtros.categoria_id));
   if (filtros.subcategoria_id) params.set("subcategoria_id", String(filtros.subcategoria_id));
   if (filtros.marca_id) params.set("marca_id", String(filtros.marca_id));
   if (typeof filtros.preco_min === "number") params.set("preco_min", String(filtros.preco_min));
   if (typeof filtros.preco_max === "number") params.set("preco_max", String(filtros.preco_max));
   if (filtros.apenas_oferta) params.set("apenas_oferta", "true");
   if (filtros.ordenar) params.set("ordenar", filtros.ordenar);

   const queryString = params.toString();
   const url = `${apiBaseUrl}/produtos/filtrar${queryString ? `?${queryString}` : ""}`;

   const response = await fetch(url, { signal });

   if (!response.ok) {
      throw new Error("Falha ao buscar produtos. Tente novamente.");
   }

   const data = (await response.json()) as { total?: number | string | null; produtos?: ProdutoBusca[] } | ProdutoBusca[];

   if (Array.isArray(data)) {
      const total = toNumber(data[0]?.total_resultados, data.length);
      return { produtos: data, total: total > 0 ? total : data.length };
   }

   const produtos = Array.isArray(data.produtos) ? data.produtos : [];
   const total = toNumber(data.total, produtos.length);
   return { produtos, total: total > 0 ? total : produtos.length };
}

function ProdutoCard({ produto }: { produto: ProdutoResumido }) {
   return (
      <Link
         href={`/produtos/${produto.id}`}
         className="group block h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
         <div className="relative mb-3">
            <img src={produto.imagem} alt={produto.nome} className="w-full h-44 object-contain" />
            {produto.porcentagemDesconto > 0 && (
               <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                  -{produto.porcentagemDesconto}%
               </div>
            )}
            {!produto.emEstoque && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                  <span className="text-white font-bold">Fora de estoque</span>
               </div>
            )}
         </div>

         <div className="flex items-center gap-1 mb-2">
            <div className="flex">
               {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                     key={index}
                     size={14}
                     className={index < Math.floor(produto.avaliacao) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
               ))}
            </div>
            <span className="text-xs text-gray-600">{produto.avaliacao.toFixed(1)}</span>
         </div>

         <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 min-h-10">
            {produto.nome}
         </h3>

         <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-red-600">
               R$ {produto.precoAtual.toFixed(2).replace(".", ",")}
            </span>
            {produto.precoOriginal > produto.precoAtual && (
               <span className="text-xs text-gray-500 line-through">
                  R$ {produto.precoOriginal.toFixed(2).replace(".", ",")}
               </span>
            )}
         </div>

         <span className={produto.emEstoque ? "text-xs text-green-600 font-semibold" : "text-xs text-red-600 font-semibold"}>
            {produto.emEstoque ? "Em estoque" : "Indisponivel"}
         </span>
      </Link>
   );
}

export default function PaginaBusca() {
   const searchParams = useSearchParams();
   const termoParam = searchParams.get("termo") ?? "";
   const [selectedBrandId, setSelectedBrandId] = useState<string | number | null>(null);
   const [priceRange, setPriceRange] = useState({ min: 0, max: DEFAULT_MAX_PRECO });
   const [maxPreco, setMaxPreco] = useState(DEFAULT_MAX_PRECO);
   const searchTerm = termoParam;
   const [brandSearchTerm, setBrandSearchTerm] = useState("");
   const [categorySearchTerm, setCategorySearchTerm] = useState("");
   const [categorySelection, setCategorySelection] = useState("");
   const [ordenar, setOrdenar] = useState<Ordenacao>("mais_recentes");
   const [apenasOferta, setApenasOferta] = useState(false);
   const [produtosApi, setProdutosApi] = useState<ProdutoBusca[]>([]);
   const [totalResultados, setTotalResultados] = useState(0);
   const [loading, setLoading] = useState(false);
   const [erro, setErro] = useState<string | null>(null);
   const [marcasCatalogo, setMarcasCatalogo] = useState<MarcaOpcao[]>([]);
   const [categoriasCatalogo, setCategoriasCatalogo] = useState<CategoriaApi[]>([]);
   const [subcategoriasCatalogo, setSubcategoriasCatalogo] = useState<SubcategoriaApi[]>([]);

   const handleClearAll = () => {
      const maxDisponivel = maxPreco > 0 ? maxPreco : DEFAULT_MAX_PRECO;

      setSelectedBrandId(null);
      setPriceRange({ min: 0, max: maxDisponivel });
      setBrandSearchTerm("");
      setCategorySearchTerm("");
      setCategorySelection("");
      setOrdenar("mais_recentes");
      setApenasOferta(false);
      setFiltrosAplicados({
         termo: termoParam.trim() || undefined,
         ordenar: "mais_recentes",
         apenas_oferta: false,
         preco_min: undefined,
         preco_max: undefined,
         marca_id: undefined,
         categoria_id: undefined,
         subcategoria_id: undefined,
      });
   };

   const categoriaSelecionada = useMemo(() => parseCategoriaSelecionada(categorySelection), [categorySelection]);

   const filtros = useMemo<BuscaFiltros>(
      () => ({
         termo: searchTerm.trim() || undefined,
         categoria_id: categoriaSelecionada.categoria_id,
         subcategoria_id: categoriaSelecionada.subcategoria_id,
         marca_id: selectedBrandId ?? undefined,
         preco_min: priceRange.min > 0 ? priceRange.min : undefined,
         preco_max: priceRange.max < maxPreco ? priceRange.max : undefined,
         apenas_oferta: apenasOferta,
         ordenar,
      }),
      [
         searchTerm,
         categoriaSelecionada.categoria_id,
         categoriaSelecionada.subcategoria_id,
         selectedBrandId,
         priceRange,
         apenasOferta,
         ordenar,
         maxPreco,
      ]
   );

   const [filtrosAplicados, setFiltrosAplicados] = useState<BuscaFiltros>(filtros);

   const maxParaSlider = maxPreco > 0 ? maxPreco : DEFAULT_MAX_PRECO;

   useEffect(() => {
      setFiltrosAplicados((prev) => ({
         ...prev,
         termo: termoParam.trim() || undefined,
      }));
   }, [termoParam]);

   useEffect(() => {
      const controller = new AbortController();
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiBaseUrl) {
         return () => controller.abort();
      }

      async function carregarCatalogos() {
         try {
            const [marcasResponse, categoriasResponse, subcategoriasResponse] = await Promise.all([
               fetch(`${apiBaseUrl}/marcas`, { signal: controller.signal }),
               fetch(`${apiBaseUrl}/categorias`, { signal: controller.signal }),
               fetch(`${apiBaseUrl}/subcategorias`, { signal: controller.signal }),
            ]);

            if (!marcasResponse.ok || !categoriasResponse.ok || !subcategoriasResponse.ok) {
               return;
            }

            const [marcasData, categoriasData, subcategoriasData] = await Promise.all([
               marcasResponse.json(),
               categoriasResponse.json(),
               subcategoriasResponse.json(),
            ]);

            if (!controller.signal.aborted) {
               setMarcasCatalogo(Array.isArray(marcasData) ? marcasData : []);
               setCategoriasCatalogo(Array.isArray(categoriasData) ? categoriasData : []);
               setSubcategoriasCatalogo(Array.isArray(subcategoriasData) ? subcategoriasData : []);
            }
         } catch {
            if (!controller.signal.aborted) {
               setMarcasCatalogo([]);
               setCategoriasCatalogo([]);
               setSubcategoriasCatalogo([]);
            }
         }
      }

      carregarCatalogos();

      return () => controller.abort();
   }, []);

   const marcasDisponiveis = useMemo<MarcaOpcao[]>(() => {
      if (marcasCatalogo.length === 0) {
         return [];
      }

      const marcasPresentes = new Set(
         produtosApi
            .map((produto) => normalizeTexto(produto.marca_nome))
            .filter((nome) => nome.length > 0)
      );

      return marcasCatalogo
         .filter((marca) => marcasPresentes.has(normalizeTexto(marca.nome)))
         .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
   }, [marcasCatalogo, produtosApi]);

   const marcasFiltradas = useMemo(() => {
      const termo = brandSearchTerm.trim().toLowerCase();

      if (!termo) {
         return marcasDisponiveis;
      }

      return marcasDisponiveis.filter((brand) => brand.nome.toLowerCase().includes(termo));
   }, [brandSearchTerm, marcasDisponiveis]);

   const categoriasDisponiveis = useMemo<CategoriaOpcao[]>(() => {
      if (categoriasCatalogo.length === 0 || subcategoriasCatalogo.length === 0) {
         return [];
      }

      const categoriasPresentes = new Set(
         produtosApi
            .map((produto) => normalizeTexto(produto.categoria_nome))
            .filter((nome) => nome.length > 0)
      );
      const subcategoriasPresentes = new Set(
         produtosApi
            .map((produto) => normalizeTexto(produto.subcategoria_nome))
            .filter((nome) => nome.length > 0)
      );

      const categoriasMap = new Map<string, CategoriaOpcao>();

      categoriasCatalogo.forEach((categoria) => {
         if (!categoriasPresentes.has(normalizeTexto(categoria.nome))) {
            return;
         }

         const key = String(categoria.id);
         categoriasMap.set(key, {
            id: categoria.id,
            nome: categoria.nome,
            subcategorias: [],
         });
      });

      subcategoriasCatalogo.forEach((subcategoria) => {
         const categoria = categoriasMap.get(String(subcategoria.categoria_id));
         if (!categoria) {
            return;
         }

         if (!subcategoriasPresentes.has(normalizeTexto(subcategoria.nome))) {
            return;
         }

         if (!categoria.subcategorias.some((item) => item.id === subcategoria.id)) {
            categoria.subcategorias.push({ id: subcategoria.id, nome: subcategoria.nome });
         }
      });

      return Array.from(categoriasMap.values())
         .map((categoria) => ({
            ...categoria,
            subcategorias: categoria.subcategorias.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
         }))
         .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
   }, [categoriasCatalogo, produtosApi, subcategoriasCatalogo]);

   const categoriasFiltradas = useMemo(() => {
      const termo = categorySearchTerm.trim().toLowerCase();

      if (!termo) {
         return categoriasDisponiveis;
      }

      return categoriasDisponiveis.filter((grupo) => {
         if (grupo.nome.toLowerCase().includes(termo)) {
            return true;
         }

         return grupo.subcategorias.some((subcategoria) => subcategoria.nome.toLowerCase().includes(termo));
      });
   }, [categorySearchTerm, categoriasDisponiveis]);

   const produtosResumo = useMemo(() => produtosApi.map(mapParaResumo), [produtosApi]);

   const handleAplicarFiltros = () => {
      setFiltrosAplicados(filtros);
   };

   useEffect(() => {
      const controller = new AbortController();

      async function carregarProdutos() {
         setLoading(true);
         setErro(null);

         try {
            const resultado = await buscarComFiltros(filtrosAplicados, controller.signal);
            const maiorPreco = resultado.produtos.reduce((maximo, item) => Math.max(maximo, obterPrecoFinal(item)), 0);
            const novoMaximo = maiorPreco > 0 ? Math.ceil(maiorPreco) : DEFAULT_MAX_PRECO;

            setProdutosApi(resultado.produtos);
            setTotalResultados(resultado.total);
            setMaxPreco(novoMaximo);
            setPriceRange((prev) => {
               const maxAjustado =
                  filtrosAplicados.preco_max === undefined
                     ? novoMaximo
                     : Math.min(prev.max, novoMaximo);
               return {
                  min: Math.min(prev.min, maxAjustado),
                  max: maxAjustado,
               };
            });
         } catch (error) {
            if (!controller.signal.aborted) {
               const message = error instanceof Error ? error.message : "Falha ao buscar produtos. Tente novamente.";
               setErro(message);
               setProdutosApi([]);
               setTotalResultados(0);
            }
         } finally {
            if (!controller.signal.aborted) {
               setLoading(false);
            }
         }
      }

      carregarProdutos();

      return () => controller.abort();
   }, [filtrosAplicados]);

   return (
      <aside className="flex" aria-label="Product filters and results">
         <div
            className="w-full max-w-70 shrink-0 border-r border-slate-300 px-4 md:px-6 min-h-screen py-6"
            role="region"
            aria-labelledby="filter-heading"
         >
            {/* Header */}
            <div className="flex items-center border-b border-slate-300 pb-2 mb-6">
               <h2 id="filter-heading" className="text-slate-900 text-lg font-semibold">Filter</h2>
               <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-sm text-red-500 font-semibold ml-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  aria-label="Clear all filters"
               >
                  Clear all
               </button>
            </div>

            {/* Brand Section */}
            <fieldset>
               <legend className="text-slate-900 text-sm font-semibold">Brand</legend>
               <form
                  className="mt-2"
                  role="search"
                  aria-label="Search brand"
                  onSubmit={(e) => {
                     e.preventDefault();
                     handleAplicarFiltros();
                  }}
               >
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
                     <label htmlFor="brand-search" className="sr-only">Search brand</label>
                     <input
                        type="search"
                        id="brand-search"
                        placeholder="Search brand"
                        value={brandSearchTerm}
                        onChange={(e) => setBrandSearchTerm(e.target.value)}
                        className="text-sm text-slate-900 w-full outline-none bg-transparent"
                     />
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" className="size-4 fill-slate-400 ml-auto" aria-hidden="true">
                        <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM81.191 15c36.495 0 66.191 29.696 66.191 66.193 0 36.496-29.696 66.187-66.191 66.187-36.494 0-66.191-29.691-66.191-66.187C15 44.696 44.697 15 81.191 15z" />
                     </svg>
                  </div>
               </form>

               {marcasFiltradas.length === 0 ? (
                  <p className="mt-6 text-sm text-slate-500">Nenhuma marca encontrada.</p>
               ) : (
                  <div className="mt-4">
                     <label htmlFor="brand-select" className="sr-only">Selecionar marca</label>
                     <select
                        id="brand-select"
                        value={selectedBrandId ? String(selectedBrandId) : ""}
                        onChange={(e) => setSelectedBrandId(e.target.value ? e.target.value : null)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                     >
                        <option value="">Todas as marcas</option>
                        {marcasFiltradas.map((brand) => (
                           <option key={String(brand.id)} value={String(brand.id)}>
                              {brand.nome}
                           </option>
                        ))}
                     </select>
                  </div>
               )}
            </fieldset>

            {/* Category Section */}
            <fieldset>
               <legend className="text-slate-900 text-sm font-semibold">Categoria</legend>
               <form
                  className="mt-2"
                  role="search"
                  aria-label="Buscar categoria"
                  onSubmit={(e) => {
                     e.preventDefault();
                     handleAplicarFiltros();
                  }}
               >
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white outline-1 -outline-offset-1 outline-slate-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-blue-600">
                     <label htmlFor="category-search" className="sr-only">Buscar categoria</label>
                     <input
                        type="search"
                        id="category-search"
                        placeholder="Buscar categoria"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                        className="text-sm text-slate-900 w-full outline-none bg-transparent"
                     />
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" className="size-4 fill-slate-400 ml-auto" aria-hidden="true">
                        <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM81.191 15c36.495 0 66.191 29.696 66.191 66.193 0 36.496-29.696 66.187-66.191 66.187-36.494 0-66.191-29.691-66.191-66.187C15 44.696 44.697 15 81.191 15z" />
                     </svg>
                  </div>
               </form>

               {categoriasFiltradas.length === 0 ? (
                  <p className="mt-6 text-sm text-slate-500">Nenhuma categoria encontrada.</p>
               ) : (
                  <div className="mt-4">
                     <label htmlFor="category-select" className="sr-only">Selecionar categoria</label>
                     <select
                        id="category-select"
                        value={categorySelection}
                        onChange={(e) => setCategorySelection(e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                     >
                        <option value="">Todas as categorias</option>
                        {categoriasFiltradas.map((grupo) => (
                           <optgroup key={grupo.id ? String(grupo.id) : grupo.nome} label={grupo.nome}>
                              <option value={`cat:${encodeURIComponent(String(grupo.id))}`}>
                                 Todas em {grupo.nome}
                              </option>
                              {grupo.subcategorias.map((subcategoria) => (
                                 <option
                                    key={`${grupo.id ? String(grupo.id) : grupo.nome}:${subcategoria.id ? String(subcategoria.id) : subcategoria.nome}`}
                                    value={`sub:${encodeURIComponent(String(subcategoria.id))}`}
                                 >
                                    {subcategoria.nome}
                                 </option>
                              ))}
                           </optgroup>
                        ))}
                     </select>
                  </div>
               )}
            </fieldset>

            {/* Price Section */}
            <fieldset>
               <legend className="text-slate-900 text-sm font-semibold">Price</legend>
               <div className="relative mt-6">
                  <div className="h-1.5 bg-gray-300 relative">
                     <div
                        className="absolute h-1.5 bg-blue-600 rounded-full"
                        style={{
                           left: `${(priceRange.min / maxParaSlider) * 100}%`,
                           right: `${100 - (priceRange.max / maxParaSlider) * 100}%`
                        }}
                     ></div>
                  </div>

                  <label htmlFor="minRange" className="sr-only">Minimum price</label>
                  <input
                     type="range"
                     id="minRange"
                     min="0"
                     max={maxParaSlider}
                     value={priceRange.min}
                     onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                     className="absolute top-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  />

                  <label htmlFor="maxRange" className="sr-only">Maximum price</label>
                  <input
                     type="range"
                     id="maxRange"
                     min="0"
                     max={maxParaSlider}
                     value={priceRange.max}
                     onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                     className="absolute top-0 w-full h-1.5 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                  />

                  <div className="flex justify-between text-slate-600 font-medium text-sm mt-4">
                     <span aria-live="polite">${priceRange.min}</span>
                     <span aria-live="polite">${priceRange.max}</span>
                  </div>
               </div>
            </fieldset>


            <fieldset>
               <legend className="text-slate-900 text-sm font-semibold">Oferta</legend>
               <label className="mt-4 inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                     type="checkbox"
                     className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                     checked={apenasOferta}
                     onChange={(event) => setApenasOferta(event.target.checked)}
                  />
                  Apenas produtos em oferta
               </label>
            </fieldset>

            <div className="mt-6">
               <button
                  type="button"
                  onClick={handleAplicarFiltros}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
               >
                  Aplicar filtros
               </button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="w-full p-6" role="main" aria-label="Product results">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
               <div>
                  <h2 className="text-slate-900 text-lg font-semibold">Resultados</h2>
                  <p className="text-sm text-slate-600" aria-live="polite">
                     {totalResultados} resultado{totalResultados === 1 ? "" : "s"}
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <label htmlFor="ordenar" className="text-sm font-semibold text-slate-700">
                     Ordenar
                  </label>
                  <select
                     id="ordenar"
                     value={ordenar}
                     onChange={(event) => setOrdenar(event.target.value as Ordenacao)}
                     className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                     {ORDENACOES.map((opcao) => (
                        <option key={opcao.value} value={opcao.value}>
                           {opcao.label}
                        </option>
                     ))}
                  </select>
               </div>
            </div>

            {erro && (
               <div className="mb-4 text-red-600 font-semibold" role="alert">
                  {erro}
               </div>
            )}

            {loading ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                     <div
                        key={i}
                        className="bg-gray-100 w-full h-56 rounded-md animate-pulse"
                        role="img"
                        aria-label="Product Placeholder"
                     ></div>
                  ))}
               </div>
            ) : produtosResumo.length === 0 ? (
               <div className="text-slate-700">Nenhum produto encontrado com os filtros atuais.</div>
            ) : (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produtosResumo.map((produto) => (
                     <ProdutoCard key={produto.id} produto={produto} />
                  ))}
               </div>
            )}
         </div>
      </aside>
   );
}