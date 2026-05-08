"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, MapPin, Search, ShoppingCart, User, Menu, ChevronDown } from "lucide-react";
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
    
    // Estados do Menu de Categorias
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [menuCategoriasAberto, setMenuCategoriasAberto] = useState(false);

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== termoParam) {
            inputRef.current.value = termoParam;
        }
    }, [termoParam]);

    // Busca as categorias ao carregar o header
    useEffect(() => {
        async function fetchCategorias() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
                if (res.ok) {
                    setCategorias(await res.json());
                }
            } catch (error) {
                console.error("Erro ao carregar categorias no header", error);
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
        } catch (error: any) {
            if (error.name !== "AbortError") setSugestoes([]);
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
            {/* Barra Principal */}
            <div className="flex h-17.5 w-full items-stretch bg-[#7B1A1A]">
                <header className="flex flex-1 items-center gap-6 px-6">
                    <Link href="/" className="flex items-center gap-3 rounded-lg py-2">
                        <Image src={logo} alt="Greatest Store" width={45} height={45} className="w-auto h-auto object-contain" priority />
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white leading-none">Greatest</span>
                            <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#e8c37d] leading-none mt-1">STORE</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-2 whitespace-nowrap text-xs text-white cursor-pointer hover:bg-white/10 p-2 rounded transition">
                        <MapPin className="h-5 w-5 text-[#e8c37d]" aria-hidden="true" />
                        <div className="leading-tight">
                            <div className="text-gray-300">Enviar para</div>
                            <div className="font-bold text-sm">Insira o CEP</div>
                        </div>
                    </div>

                    <form className="relative flex-1 max-w-3xl" onSubmit={handleSearch}>
                        <div className="flex w-full items-center overflow-hidden rounded-md bg-white shadow-inner">
                            <input
                                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                type="text"
                                placeholder="Buscar produtos, marcas e muito mais..."
                                defaultValue={termoParam}
                                ref={inputRef}
                                onChange={(e) => agendarSugestoes(e.target.value)}
                                onFocus={() => sugestoes.length > 0 && setMostrarSugestoes(true)}
                                onBlur={() => window.setTimeout(() => setMostrarSugestoes(false), 200)}
                                autoComplete="off"
                            />
                            <button className="flex items-center px-4 py-2 text-gray-400 hover:text-[#7B1A1A] transition-colors" type="submit">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>

                        {mostrarSugestoes && (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[200] max-h-80 overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-2xl">
                                {carregandoSugestoes && <div className="px-4 py-3 text-sm text-gray-500">Buscando...</div>}
                                {!carregandoSugestoes && sugestoes.length === 0 && <div className="px-4 py-3 text-sm text-gray-500">Nenhum produto encontrado.</div>}
                                {!carregandoSugestoes && sugestoes.length > 0 && (
                                    <div className="py-2">
                                        {sugestoes.map((produto) => (
                                            <Link key={String(produto.id)} href={`/produtos/${produto.id}`} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition" onClick={() => setMostrarSugestoes(false)}>
                                                <img src={produto.imagem_url ?? "https://via.placeholder.com/40"} alt={produto.nome} className="h-10 w-10 shrink-0 rounded object-contain bg-white border border-gray-100" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800 line-clamp-1">{produto.nome}</span>
                                                    {produto.marca_nome && <span className="text-xs text-gray-500">{produto.marca_nome}</span>}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>

                    <div className="flex items-center gap-5">
                        <Link href="/fav" className="flex flex-col items-center justify-center text-white hover:text-[#e8c37d] transition-colors">
                            <Heart className="h-6 w-6" strokeWidth={1.5} />
                        </Link>
                        <Link href="/login" className="flex items-center gap-2 text-white hover:text-[#e8c37d] transition-colors">
                            <User className="h-6 w-6" strokeWidth={1.5} />
                            <div className="hidden lg:flex flex-col leading-none">
                                <span className="text-[0.65rem] text-gray-300">Bem-vindo</span>
                                <span className="text-sm font-bold">Entre ou Cadastre-se</span>
                            </div>
                        </Link>
                    </div>
                </header>
                
                <Link href="/cart" className="flex flex-col items-center justify-center bg-[#5e1313] hover:bg-[#4a0f0f] transition-colors px-6 text-white min-w-[100px]">
                    <ShoppingCart className="h-6 w-6 mb-1" />
                    <span className="text-xs font-bold">Carrinho</span>
                </Link>
            </div>

            {/* Barra Secundária (Categorias) */}
            <div className="bg-[#6b0e0e] px-6 py-1.5 flex items-center relative">
                <div 
                    className="relative"
                    onMouseEnter={() => setMenuCategoriasAberto(true)}
                    onMouseLeave={() => setMenuCategoriasAberto(false)}
                >
                    <button className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10">
                        <Menu size={18} />
                        Todos Departamentos
                        <ChevronDown size={14} className={`transition-transform ${menuCategoriasAberto ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown de Categorias */}
                    {menuCategoriasAberto && (
                        <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-b-lg overflow-hidden z-50 border-t-2 border-[#7B1A1A]">
                            {categorias.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500">Carregando...</div>
                            ) : (
                                <ul className="py-2">
                                    {categorias.map(cat => (
                                        <li key={cat.id}>
                                            <Link 
                                                href={`/busca?categoria_id=${cat.id}`} 
                                                className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#7B1A1A] font-medium transition-colors"
                                                onClick={() => setMenuCategoriasAberto(false)}
                                            >
                                                {cat.nome}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}