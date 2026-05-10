"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Filter, Search, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { ProdutoResumido, ProdutoListagemApi, MarcaApi, CategoriaApi, SubcategoriaApi } from "@/types";

type Ordenacao = "mais_recentes" | "menor_preco" | "maior_preco";
const DEFAULT_MAX_PRECO = 10000;

function toNumber(value: unknown, fallback = 0) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value.replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
}

function mapParaResumo(p: ProdutoListagemApi): ProdutoResumido {
    const precoOriginal = toNumber(p.preco, 0);
    const precoPromocional = toNumber(p.preco_promocional, precoOriginal);
    const precoAtual = Boolean(p.desconto_ativo) && precoPromocional > 0 ? precoPromocional : precoOriginal;

    return {
        id: String(p.id),
        nome: p.nome,
        precoAtual,
        precoOriginal,
        porcentagemDesconto: precoOriginal > 0 && precoAtual < precoOriginal ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100) : 0,
        imagem: p.imagem_url || "https://via.placeholder.com/600x600?text=Sem+Imagem",
        avaliacao: toNumber(p.media_avaliacoes, 0),
        emEstoque: toNumber(p.quantidade, 0) > 0,
    };
}

export function BuscaConteudo() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const termoParam = searchParams.get("q") || searchParams.get("termo") || "";
    const catParam = searchParams.get("categoria_id") || "";
    const subParam = searchParams.get("subcategoria_id") || "";
    const apenasOfertaParam = searchParams.get("apenas_oferta") === "true";
    const ordenarParam = searchParams.get("ordenar") as Ordenacao | null;
    
    const [marcasCatalogo, setMarcasCatalogo] = useState<MarcaApi[]>([]);
    const [categoriasCatalogo, setCategoriasCatalogo] = useState<CategoriaApi[]>([]);
    const [subcategoriasCatalogo, setSubcategoriasCatalogo] = useState<SubcategoriaApi[]>([]);

    const [brandSearchTerm, setBrandSearchTerm] = useState("");
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [selectedBrandId, setSelectedBrandId] = useState<string>("");
    const [categorySelection, setCategorySelection] = useState<string>(() =>
        subParam ? `sub:${subParam}` : (catParam ? `cat:${catParam}` : "")
    );

    const [priceRange, setPriceRange] = useState({ min: 0, max: DEFAULT_MAX_PRECO });
    const [maxPrecoHistorico, setMaxPrecoHistorico] = useState(DEFAULT_MAX_PRECO);
    const [apenasOferta, setApenasOferta] = useState(apenasOfertaParam);
    const [ordenar, setOrdenar] = useState<Ordenacao>(ordenarParam || "mais_recentes");

    const [filtrosAplicados, setFiltrosAplicados] = useState({ trigger: 0 });
    const [produtosApi, setProdutosApi] = useState<ProdutoListagemApi[]>([]);
    const [totalResultados, setTotalResultados] = useState(0);
    const [loading, setLoading] = useState(true);
    const [favoritos, setFavoritos] = useState<Set<string | number>>(new Set());

    // Carregar favoritos do localStorage ao montar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('favoritos');
            if (saved) {
                try {
                    setFavoritos(new Set(JSON.parse(saved)));
                } catch {
                    setFavoritos(new Set());
                }
            }
        }
    }, []);

    // Sincronizar estado com URL quando mudar
    useEffect(() => {
        setApenasOferta(apenasOfertaParam);
        setOrdenar(ordenarParam || "mais_recentes");
        setCategorySelection(subParam ? `sub:${subParam}` : (catParam ? `cat:${catParam}` : ""));
        // Aplicar filtros automaticamente quando URL mudar
        setFiltrosAplicados(prev => ({ trigger: prev.trigger + 1 }));
    }, [apenasOfertaParam, ordenarParam, catParam, subParam]);

    useEffect(() => {
        async function fetchCatalogos() {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
                const [resMarcas, resCat, resSub] = await Promise.all([
                    fetch(`${apiBaseUrl}/marcas`),
                    fetch(`${apiBaseUrl}/categorias`),
                    fetch(`${apiBaseUrl}/subcategorias`)
                ]);
                if (resMarcas.ok) setMarcasCatalogo(await resMarcas.json());
                if (resCat.ok) setCategoriasCatalogo(await resCat.json());
                if (resSub.ok) setSubcategoriasCatalogo(await resSub.json());
            } catch (err) {
                console.error("Erro ao carregar filtros", err);
            }
        }
        fetchCatalogos();
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        async function carregarProdutos() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (termoParam) params.set("q", termoParam);

                const currentCat = filtrosAplicados.trigger === 0
                    ? (subParam ? `sub:${subParam}` : (catParam ? `cat:${catParam}` : ""))
                    : categorySelection;

                if (currentCat.startsWith("cat:")) params.set("categoria_id", currentCat.replace("cat:", ""));
                else if (currentCat.startsWith("sub:")) params.set("subcategoria_id", currentCat.replace("sub:", ""));

                if (selectedBrandId) params.set("marca_id", selectedBrandId);
                if (priceRange.max < maxPrecoHistorico) params.set("preco_max", String(priceRange.max));
                if (apenasOferta) params.set("apenas_oferta", "true");
                params.set("ordenar", ordenar);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/filtrar?${params.toString()}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Erro na busca");

                const data = await res.json();
                const lista = Array.isArray(data) ? data as ProdutoListagemApi[] : (data.produtos || []) as ProdutoListagemApi[];
                setProdutosApi(lista);
                setTotalResultados(Array.isArray(data) ? (lista[0]?.total_resultados || lista.length) : (data.total || lista.length));

                if (lista.length > 0 && maxPrecoHistorico === DEFAULT_MAX_PRECO) {
                    const maior = Math.max(...lista.map((p: ProdutoListagemApi) => toNumber(p.preco)));
                    if (maior > 0) {
                        setMaxPrecoHistorico(Math.ceil(maior));
                        setPriceRange(prev => ({ ...prev, max: Math.ceil(maior) }));
                    }
                }
            } catch (e: unknown) {
                if (!(e instanceof DOMException && e.name === "AbortError")) console.error(e);
            } finally {
                setLoading(false);
            }
        }

        carregarProdutos();
        return () => controller.abort();
    }, [
        filtrosAplicados.trigger,
        ordenar,
        termoParam,
        catParam,
        subParam,
        apenasOferta,
        categorySelection,
        maxPrecoHistorico,
        priceRange.max,
        selectedBrandId,
    ]);

    const handleAplicarFiltros = () => setFiltrosAplicados(prev => ({ trigger: prev.trigger + 1 }));

    const handleClearAll = () => {
        setSelectedBrandId("");
        setCategorySelection("");
        setApenasOferta(false);
        setPriceRange({ min: 0, max: maxPrecoHistorico });
        setBrandSearchTerm("");
        setCategorySearchTerm("");
        router.push("/busca");
    };

    const toggleFavorito = (e: React.MouseEvent, produtoId: string | number) => {
        e.preventDefault();
        e.stopPropagation();
        
        const novosFavoritos = new Set(favoritos);
        if (novosFavoritos.has(produtoId)) {
            novosFavoritos.delete(produtoId);
        } else {
            novosFavoritos.add(produtoId);
        }
        setFavoritos(novosFavoritos);
        if (typeof window !== 'undefined') {
            localStorage.setItem('favoritos', JSON.stringify(Array.from(novosFavoritos)));
            // Disparar evento customizado para sincronizar em toda a aba
            window.dispatchEvent(new CustomEvent('favoritosChanged', { detail: Array.from(novosFavoritos) }));
        }
    };

    const marcasExibidas = marcasCatalogo.filter(m => m.nome.toLowerCase().includes(brandSearchTerm.toLowerCase()));
    const categoriasExibidas = categoriasCatalogo.filter(c => c.nome.toLowerCase().includes(categorySearchTerm.toLowerCase()));

    return (
        <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 pb-12 pt-4 min-h-screen items-start bg-slate-50">

            {/* SIDEBAR DE FILTROS - OTIMIZADA PARA SCROLL INDEPENDENTE */}
            <aside 
                className="w-full md:w-72 shrink-0 flex flex-col gap-6 bg-white p-6 rounded-xl border border-slate-200 sticky top-6 self-start overflow-y-auto max-h-[calc(100vh-2rem)]
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-slate-200
                [&::-webkit-scrollbar-thumb]:rounded-full shadow-sm"
            >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="font-black uppercase text-xs tracking-widest flex items-center gap-2 text-slate-900">
                        <Filter size={16} className="text-red-600" /> Filtros
                    </h2>
                    <button onClick={handleClearAll} className="text-[10px] text-red-600 font-black uppercase hover:underline">
                        Limpar
                    </button>
                </div>

                <fieldset className="space-y-3">
                    <legend className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Marca</legend>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                        <Search size={14} className="text-slate-400" />
                        <input type="search" placeholder="Buscar..." value={brandSearchTerm} onChange={(e) => setBrandSearchTerm(e.target.value)} className="text-xs bg-transparent outline-none w-full" />
                    </div>
                    <select value={selectedBrandId} onChange={(e) => setSelectedBrandId(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none">
                        <option value="">Todas as marcas</option>
                        {marcasExibidas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
                    </select>
                </fieldset>

                <fieldset className="space-y-3">
                    <legend className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Categoria</legend>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
                        <Search size={14} className="text-slate-400" />
                        <input type="search" placeholder="Filtrar..." value={categorySearchTerm} onChange={(e) => setCategorySearchTerm(e.target.value)} className="text-xs bg-transparent outline-none w-full" />
                    </div>
                    <select value={categorySelection} onChange={(e) => setCategorySelection(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-red-500 outline-none">
                        <option value="">Todas as categorias</option>
                        {categoriasExibidas.map((cat) => (
                            <optgroup key={cat.id} label={cat.nome.toUpperCase()}>
                                <option value={`cat:${cat.id}`}>TUDO EM {cat.nome.toUpperCase()}</option>
                                {subcategoriasCatalogo.filter(sub => sub.categoria_id === cat.id).map(sub => (
                                    <option key={sub.id} value={`sub:${sub.id}`}>{sub.nome}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </fieldset>
                                    
                <fieldset className="space-y-4">
                    <legend className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Até: <span className="text-slate-900">R$ {priceRange.max}</span>
                    </legend>
                    <input type="range" min="0" max={maxPrecoHistorico} value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600" />
                </fieldset>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={apenasOferta} onChange={e => setApenasOferta(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                        <span className="text-xs font-black uppercase text-slate-700">Ofertas</span>
                    </label>

                    <button onClick={handleAplicarFiltros} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl shadow-lg shadow-red-200 transition-all uppercase text-[10px] tracking-widest">
                        Aplicar Filtros
                    </button>
                </div>
            </aside>

            {/* ÁREA DE RESULTADOS */}
            <section className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            {termoParam ? `Resultados para "${termoParam}"` : "Explorar Produtos"}
                        </h1>
                        <p className="text-sm text-slate-500">{totalResultados} itens</p>
                    </div>
                    <select id="ordenar" value={ordenar} onChange={(e) => setOrdenar(e.target.value as Ordenacao)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none cursor-pointer">
                        <option value="mais_recentes">Mais recentes</option>
                        <option value="menor_preco">Menor preço</option>
                        <option value="maior_preco">Maior preço</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-slate-200 w-full h-[350px] rounded-xl"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {produtosApi.map(p => {
                            const item = mapParaResumo(p);
                            const nota = item.avaliacao || 5;

                            return (
                                <Link key={item.id} href={`/produtos/${item.id}`} className="group block bg-white p-4 rounded-xl border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="relative mb-4 aspect-square bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
                                        <img src={item.imagem} alt={item.nome} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                                        
                                        {/* Botão Favorito */}
                                        <button
                                            onClick={(e) => toggleFavorito(e, item.id)}
                                            className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-slate-100 transition"
                                        >
                                            <Heart 
                                                size={18} 
                                                className={favoritos.has(item.id) ? "fill-red-600 text-red-600" : "text-slate-400"}
                                            />
                                        </button>

                                        {item.porcentagemDesconto > 0 && (
                                            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded shadow-sm">-{item.porcentagemDesconto}%</span>
                                        )}
                                        {!item.emEstoque && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                                                <span className="bg-slate-900 text-white px-3 py-1 text-xs font-bold rounded">Esgotado</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} className={i < Math.floor(nota) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} />
                                        ))}
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 h-10 mb-3">{item.nome}</h3>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-red-600">R$ {item.precoAtual.toFixed(2).replace('.', ',')}</span>
                                        </div>
                                        <p className={`text-[10px] font-black uppercase tracking-wider ${item.emEstoque ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.emEstoque ? 'Ativo' : 'Esgotado'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
