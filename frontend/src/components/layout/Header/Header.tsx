"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, User, ChevronDown, Store, LayoutDashboard, LogOut, Search, ShoppingCart, Menu } from "lucide-react";
import logo from "./logo.png";

type ProdutoSugestao = {
    id: string | number;
    nome: string;
    marca_nome?: string | null;
    imagem_url?: string | null;
};

type Categoria = {
    id: string | number;
    nome: string;
};

type Subcategoria = {
    id: string | number;
    categoria_id: string | number;
    nome: string;
};

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const termoParam = searchParams.get("termo") ?? "";
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const menuUsuarioTimeoutRef = useRef<number | null>(null);
    const isMountedRef = useRef(true);

    const [sugestoes, setSugestoes] = useState<ProdutoSugestao[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

    const [usuarioLogado, setUsuarioLogado] = useState<{ id: string | number; nome: string; role: string } | null>(null);
    const [favoritosCount, setFavoritosCount] = useState(0);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Carregar favoritos do localStorage
    useEffect(() => {
        const atualizarFavoritos = () => {
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('favoritos');
                if (saved) {
                    try {
                        const arr = JSON.parse(saved);
                        setFavoritosCount(Array.isArray(arr) ? arr.length : 0);
                    } catch {
                        setFavoritosCount(0);
                    }
                } else {
                    setFavoritosCount(0);
                }
            }
        };

        atualizarFavoritos();
        
        // Ouvir evento customizado
        window.addEventListener('favoritosChanged', atualizarFavoritos as EventListener);
        
        // Monitorar mudanças no localStorage (para outras abas)
        window.addEventListener('storage', atualizarFavoritos);
        
        return () => {
            window.removeEventListener('favoritosChanged', atualizarFavoritos as EventListener);
            window.removeEventListener('storage', atualizarFavoritos);
        };
    }, []);

    useEffect(() => {
        queueMicrotask(() => {
            if (typeof window === "undefined" || !isMountedRef.current) return;

            try {
                const userStr = window.localStorage.getItem("usuario");
                if (!userStr) return;

                const parsed = JSON.parse(userStr) as { id?: string | number; nome?: string; role?: string };
                if (isMountedRef.current) {
                    setUsuarioLogado({
                        id: parsed.id ?? "",
                        nome: parsed.nome ?? "",
                        role: parsed.role ?? "cliente",
                    });
                }
            } catch {
                // ignore
            }
        });
    }, []);
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [menuCategoriasAberto, setMenuCategoriasAberto] = useState(false);
    const [categoriaAbertaId, setCategoriaAbertaId] = useState<string | number | null>(null);

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== termoParam) {
            inputRef.current.value = termoParam;
        }
    }, [termoParam]);

    useEffect(() => {
        async function fetchCatalogos() {
            try {
                const [resCategorias, resSubcategorias] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategorias`),
                ]);

                if (resCategorias.ok) setCategorias(await resCategorias.json());
                if (resSubcategorias.ok) setSubcategorias(await resSubcategorias.json());
            } catch (error: unknown) {
                console.error("Erro ao carregar categorias no header", error instanceof Error ? error.message : String(error));
            }
        }

        fetchCatalogos();

        return () => {
            if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
            if (abortRef.current) abortRef.current.abort();
            if (menuUsuarioTimeoutRef.current !== null) window.clearTimeout(menuUsuarioTimeoutRef.current);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuarioLogado(null);
        router.push("/login");
    };

    const handleAnunciar = () => {
        if (usuarioLogado?.role === "vendedor") {
            router.push("criarProduto");
        } else {
            router.push("/cadastroVendedor");
        }
    };

    const abrirMenuUsuario = () => {
        if (menuUsuarioTimeoutRef.current !== null) {
            window.clearTimeout(menuUsuarioTimeoutRef.current);
            menuUsuarioTimeoutRef.current = null;
        }

        setMenuUsuarioAberto(true);
    };

    const agendarFechamentoMenuUsuario = () => {
        if (menuUsuarioTimeoutRef.current !== null) {
            window.clearTimeout(menuUsuarioTimeoutRef.current);
        }

        menuUsuarioTimeoutRef.current = window.setTimeout(() => {
            setMenuUsuarioAberto(false);
            menuUsuarioTimeoutRef.current = null;
        }, 180);
    };

    const limparDebounce = () => {
        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
    };

    const abortarBusca = () => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
    };

    const buscarSugestoes = async (termo: string) => {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiBaseUrl) return;

        abortarBusca();
        const controller = new AbortController();
        abortRef.current = controller;
        setCarregandoSugestoes(true);

        try {
            const response = await fetch(`${apiBaseUrl}/produtos/buscar?q=${encodeURIComponent(termo)}`, {
                signal: controller.signal,
            });

            if (!response.ok) throw new Error();
            const data = await response.json();
            setSugestoes(Array.isArray(data) ? data.slice(0, 6) : []);
            setMostrarSugestoes(true);
        } catch (error: unknown) {
            if (!(error instanceof DOMException && error.name === "AbortError")) setSugestoes([]);
        } finally {
            setCarregandoSugestoes(false);
        }
    };

    const agendarSugestoes = (valor: string) => {
        const termo = valor.trim();
        if (!termo || termo.length < 2) {
            limparDebounce();
            abortarBusca();
            setSugestoes([]);
            setMostrarSugestoes(false);
            setCarregandoSugestoes(false);
            return;
        }

        setMostrarSugestoes(true);
        limparDebounce();
        debounceRef.current = window.setTimeout(() => buscarSugestoes(termo), 300);
    };

    const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const termo = inputRef.current?.value.trim() ?? "";
        const destino = termo ? `/busca?termo=${encodeURIComponent(termo)}` : "/busca";

        limparDebounce();
        abortarBusca();
        setMostrarSugestoes(false);
        router.push(destino);
    };

    const abrirCategoria = (categoriaId: string | number) => {
        const possuiSubcategorias = subcategorias.some((sub) => sub.categoria_id === categoriaId);

        if (possuiSubcategorias) {
            setCategoriaAbertaId((current) => (current === categoriaId ? null : categoriaId));
            return;
        }

        setMenuCategoriasAberto(false);
        setCategoriaAbertaId(null);
        router.push(`/busca?categoria_id=${categoriaId}`);
    };

    const abrirSubcategoria = (subcategoriaId: string | number) => {
        setMenuCategoriasAberto(false);
        setCategoriaAbertaId(null);
        router.push(`/busca?subcategoria_id=${subcategoriaId}`);
    };

    return (
        <div className="sticky top-0 z-50 w-full shadow-md">
            <div className="flex h-14.5 w-full items-stretch bg-[#7B1A1A]">
                <header className="flex flex-1 items-center justify-between gap-3 px-4 md:px-6">
                    <Link href="/" className="shrink-0 flex items-center gap-3">
                        <Image src={logo} alt="GreatestStore" className="h-8 w-auto" priority />
                        <span className="hidden whitespace-nowrap text-base font-black tracking-wide text-white sm:inline-flex">
                            Greatest Store
                        </span>
                    </Link>

                    <form onSubmit={handleSearch} className="relative mx-4 flex-1 max-w-2xl">
                        <div className="flex items-center rounded-full bg-white/95 px-3 py-1.5 shadow-sm ring-1 ring-black/5">
                            <Search size={16} className="text-slate-400 shrink-0" />
                            <input
                                ref={inputRef}
                                type="search"
                                defaultValue={termoParam}
                                onChange={(event) => agendarSugestoes(event.target.value)}
                                placeholder="Buscar produtos, marcas e ofertas"
                                className="ml-2 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                            <button type="submit" className="ml-2 rounded-full bg-[#7B1A1A] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#641313]">
                                Buscar
                            </button>
                        </div>

                        {mostrarSugestoes && sugestoes.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                                {carregandoSugestoes ? (
                                    <div className="px-4 py-3 text-sm text-slate-500">Carregando sugestões...</div>
                                ) : (
                                    sugestoes.map((produto) => (
                                        <Link
                                            key={produto.id}
                                            href={`/produtos/${produto.id}`}
                                            className="flex items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                                            onClick={() => setMostrarSugestoes(false)}
                                        >
                                            <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                                                <Image
                                                    src={produto.imagem_url || "https://via.placeholder.com/80x80?text=Sem+Imagem"}
                                                    alt={produto.nome}
                                                    width={80}
                                                    height={80}
                                                    unoptimized
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-900">{produto.nome}</p>
                                                <p className="truncate text-xs text-slate-500">{produto.marca_nome || "Marca não informada"}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}
                    </form>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={handleAnunciar}
                            className="hidden rounded-full bg-[#e8940a] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#d4840a] md:block"
                        >
                            {usuarioLogado?.role === "vendedor" ? "Criar Anúncio" : "Venda na Greatest"}
                        </button>

                        <Link href="/fav" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 hover:text-[#e8c37d] relative">
                            <Heart className="h-6 w-6" strokeWidth={1.5} />
                            {favoritosCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                    {favoritosCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 hover:text-[#e8c37d] relative">
                            <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
                        </Link>

                        <div
                            className="relative cursor-pointer"
                            onMouseEnter={abrirMenuUsuario}
                            onMouseLeave={agendarFechamentoMenuUsuario}
                        >
                            <div className="flex items-center gap-2 rounded-full bg-[#5d1212] px-4 py-2 text-white transition hover:bg-[#4d1010]">
                                <User className="h-5 w-5" strokeWidth={1.5} />
                                <div className="hidden lg:flex flex-col leading-none text-left">
                                    {usuarioLogado ? (
                                        <>
                                            <span className="text-[0.65rem] text-gray-300">Olá, {usuarioLogado.nome.split(" ")[0]}</span>
                                            <span className="text-sm font-bold flex items-center gap-1">Minha Conta <ChevronDown size={12} /></span>
                                        </>
                                    ) : (
                                        <Link href="/login">
                                            <span className="text-[0.65rem] text-gray-300">Bem-vindo</span>
                                            <span className="text-sm font-bold block mt-0.5">Entre ou Cadastre-se</span>
                                        </Link>
                                    )}
                                </div>
                                <div className="lg:hidden text-sm font-bold">Minha Conta</div>
                            </div>

                            {usuarioLogado && menuUsuarioAberto && (
                                <div
                                    className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white text-slate-800 shadow-xl"
                                    onMouseEnter={abrirMenuUsuario}
                                    onMouseLeave={agendarFechamentoMenuUsuario}
                                >
                                    <div className="border-b border-slate-100 bg-slate-50 p-4">
                                        <p className="truncate text-sm font-bold">{usuarioLogado.nome}</p>
                                        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Conta {usuarioLogado.role}</p>
                                    </div>
                                    <div className="py-2">
                                        {usuarioLogado.role === "vendedor" && (
                                            <>
                                                <Link href="/vendedor/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600">
                                                    <LayoutDashboard size={16} /> Painel de Vendas
                                                </Link>
                                                <Link href="/vendedor/perfil" className="flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-50 hover:text-red-600">
                                                    <Store size={16} /> Perfil da Loja
                                                </Link>
                                                <div className="my-2 h-px bg-slate-100" />
                                            </>
                                        )}
                                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                                            <LogOut size={16} /> Sair da conta
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            <div className="flex min-h-10 items-center justify-start gap-2 border-b border-white/10 bg-[#5d1212] px-4 py-2 md:px-6 text-[11px] text-white">
                <div className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setMenuCategoriasAberto((current) => !current)}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-semibold transition hover:bg-white/15"
                    >
                        <Menu size={14} /> Todas as categorias
                    </button>

                    {menuCategoriasAberto && (
                        <div className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
                            <div className="max-h-96 overflow-y-auto p-2">
                                {categorias.map((categoria) => {
                                    const subcategoriasDaCategoria = subcategorias.filter((sub) => sub.categoria_id === categoria.id);
                                    const categoriaAberta = categoriaAbertaId === categoria.id && subcategoriasDaCategoria.length > 0;

                                    return (
                                        <div key={categoria.id} className="mb-1 last:mb-0">
                                            <button
                                                type="button"
                                                onClick={() => abrirCategoria(categoria.id)}
                                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                                            >
                                                <span>{categoria.nome}</span>
                                                {subcategoriasDaCategoria.length > 0 && (
                                                    <ChevronDown size={14} className={categoriaAberta ? "rotate-180 transition-transform" : "transition-transform"} />
                                                )}
                                            </button>

                                            {categoriaAberta && (
                                                <div className="mt-1 ml-2 space-y-1 border-l border-slate-200 pl-3">
                                                    {subcategoriasDaCategoria.map((subcategoria) => (
                                                        <button
                                                            key={subcategoria.id}
                                                            type="button"
                                                            onClick={() => abrirSubcategoria(subcategoria.id)}
                                                            className="block w-full rounded-full px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                                                        >
                                                            {subcategoria.nome}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/busca?ordenar=mais_recentes" className="rounded-full bg-white/10 px-3 py-1.5 font-medium transition hover:bg-white/15">
                    Novidades
                </Link>
                <Link href="/busca?apenas_oferta=true" className="rounded-full bg-white/10 px-3 py-1.5 font-medium transition hover:bg-white/15">
                    Ofertas
                </Link>
            </div>
        </div>
    );
}
