"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, MapPin, Search, ShoppingCart, User, Menu, ChevronDown, Store, LayoutDashboard, LogOut } from "lucide-react";
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

export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const termoParam = searchParams.get("termo") ?? "";
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const [sugestoes, setSugestoes] = useState<ProdutoSugestao[]>([]);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const [carregandoSugestoes, setCarregandoSugestoes] = useState(false);

    const [usuarioLogado, setUsuarioLogado] = useState<{ id: string, nome: string, role: string } | null>(null);
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

    // Estados do Menu de Categorias
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [menuCategoriasAberto, setMenuCategoriasAberto] = useState(false);

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== termoParam) {
            inputRef.current.value = termoParam;
        }
    }, [termoParam]);

    useEffect(() => {
        // Verifica se há alguém logado no localStorage ao carregar a página
        const userStr = localStorage.getItem("usuario");
        if (userStr) {
            try {
                setUsuarioLogado(JSON.parse(userStr));
            } catch (e) {
                console.error("Erro ao ler usuário do localStorage");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuarioLogado(null);
        router.push("/login");
    };

    const handleAnunciar = () => {
        if (usuarioLogado?.role === "vendedor") {
            router.push("/vendedor/produtos/novo");
        } else {
            // Se for cliente ou não estiver logado, manda para a landing page de vendedores
            router.push("/login?tipo=vendedor");
        }
    };

    // Busca as categorias ao carregar o header
    useEffect(() => {
        async function fetchCategorias() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
                if (res.ok) {
                    setCategorias(await res.json());
                }
            } catch (error: unknown) {
                console.error("Erro ao carregar categorias no header", error instanceof Error ? error.message : String(error));
            }
        }
        fetchCategorias();

        return () => {
            if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

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
            if ((error as any)?.name !== "AbortError") setSugestoes([]);
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

    return (
        <div className="sticky top-0 z-50 w-full shadow-md">
            <div className="flex h-[70px] w-full items-stretch bg-[#7B1A1A]">
                <header className="flex flex-1 items-center gap-6 px-6">
                    {/* ... LOGO E BUSCA (MANTENHA COMO ESTÁ) ... */}

                    {/* BOTÃO ANUNCIAR DINÂMICO */}
                    <button
                        onClick={handleAnunciar}
                        className="rounded-full bg-[#e8940a] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#d4840a] hidden md:block shrink-0 shadow-sm"
                    >
                        {usuarioLogado?.role === "vendedor" ? "Criar Anúncio" : "Venda na Greatest"}
                    </button>

                    <div className="flex items-center gap-5 shrink-0">
                        <Link href="/fav" className="flex flex-col items-center justify-center text-white hover:text-[#e8c37d] transition-colors relative">
                            <Heart className="h-6 w-6" strokeWidth={1.5} />
                        </Link>

                        {/* MENU DE USUÁRIO DINÂMICO */}
                        <div
                            className="relative flex items-center gap-2 text-white hover:text-[#e8c37d] transition-colors cursor-pointer"
                            onMouseEnter={() => setMenuUsuarioAberto(true)}
                            onMouseLeave={() => setMenuUsuarioAberto(false)}
                        >
                            <User className="h-6 w-6" strokeWidth={1.5} />
                            <div className="hidden lg:flex flex-col leading-none">
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

                            {/* DROPDOWN DO USUÁRIO LOGADO */}
                            {usuarioLogado && menuUsuarioAberto && (
                                <div className="absolute top-full right-0 mt-0 w-56 bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-slate-100 text-slate-800">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                                        <p className="font-bold text-sm truncate">{usuarioLogado.nome}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Conta {usuarioLogado.role}</p>
                                    </div>
                                    <div className="py-2">
                                        {/* Links exclusivos para Vendedor */}
                                        {usuarioLogado.role === "vendedor" && (
                                            <>
                                                <Link href="/vendedor/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <LayoutDashboard size={16} /> Painel de Vendas
                                                </Link>
                                                <Link href="/vendedor/perfil" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors">
                                                    <Store size={16} /> Perfil da Loja
                                                </Link>
                                                <div className="h-px bg-slate-100 my-2"></div>
                                            </>
                                        )}
                                        {/* Links comuns */}
                                        <Link href="/pedidos" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                                            Meus Pedidos
                                        </Link>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
                                            <LogOut size={16} /> Sair da conta
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* ... CARRINHO ... */}
            </div>
            {/* ... BARRA SECUNDÁRIA (CATEGORIAS) ... */}
        </div>
    );
}