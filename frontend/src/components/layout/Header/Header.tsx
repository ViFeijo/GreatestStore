"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, MapPin, Search, ShoppingCart, User } from "lucide-react";
import logo from "./logo.png";

type ProdutoSugestao = {
    id: string | number;
    nome: string;
    marca_nome?: string | null;
    imagem_url?: string | null;
    preco?: number | string;
    preco_promocional?: number | string | null;
    desconto_ativo?: boolean | null;
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

    useEffect(() => {
        if (inputRef.current && inputRef.current.value !== termoParam) {
            inputRef.current.value = termoParam;
        }
    }, [termoParam]);

    useEffect(() => {
        return () => {
            if (debounceRef.current !== null) {
                window.clearTimeout(debounceRef.current);
            }
            if (abortRef.current) {
                abortRef.current.abort();
            }
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

        if (!apiBaseUrl) {
            setSugestoes([]);
            setCarregandoSugestoes(false);
            return;
        }

        abortarBusca();
        const controller = new AbortController();
        abortRef.current = controller;
        setCarregandoSugestoes(true);

        try {
            const response = await fetch(`${apiBaseUrl}/produtos/buscar?q=${encodeURIComponent(termo)}`, {
                signal: controller.signal,
            });

            if (!response.ok) {
                setSugestoes([]);
                return;
            }

            const data = await response.json();
            setSugestoes(Array.isArray(data) ? data.slice(0, 6) : []);
            setMostrarSugestoes(true);
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }
            setSugestoes([]);
        } finally {
            setCarregandoSugestoes(false);
        }
    };

    const agendarSugestoes = (valor: string) => {
        const termo = valor.trim();

        if (!termo) {
            limparDebounce();
            abortarBusca();
            setSugestoes([]);
            setMostrarSugestoes(false);
            setCarregandoSugestoes(false);
            return;
        }

        setMostrarSugestoes(true);

        if (debounceRef.current !== null) {
            window.clearTimeout(debounceRef.current);
        }

        if (termo.length < 2) {
            setSugestoes([]);
            setCarregandoSugestoes(false);
            return;
        }

        debounceRef.current = window.setTimeout(() => {
            buscarSugestoes(termo);
        }, 300);
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
        <div className="sticky top-0 z-50 w-full">
            <div className="flex h-16.75 w-full items-stretch bg-[#7B1A1A]">
                <header className="flex flex-1 items-center gap-6 px-6">
                    <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <Image
                            src={logo}
                            alt="Greatest Store"
                            width={50}
                            height={50}
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                        <span className="text-[1.3rem] font-extrabold text-white">Greatest</span>
                        <span className="text-[0.7rem] tracking-[3px] text-[#c8a96e]">STORE</span>
                    </Link>

                    <div className="flex items-center gap-2 whitespace-nowrap text-xs text-white">
                        <MapPin className="h-4 w-4 text-[#c8a96e]" aria-hidden="true" />
                        <div className="leading-tight">
                            <div>Enviar para</div>
                            <div>Insira o CEP:</div>
                        </div>
                    </div>

                    <form className="relative flex-1" onSubmit={handleSearch} role="search" aria-label="Buscar produtos e marcas">
                        <div className="flex min-w-0 items-center overflow-hidden rounded-lg bg-[#f9e8e8]">
                            <input
                                className="flex-1 bg-transparent px-4 py-2 text-sm text-[#333] outline-none placeholder:text-[#999]"
                                type="text"
                                placeholder="Buscar produtos, marcas e muito mais..."
                                defaultValue={termoParam}
                                ref={inputRef}
                                onChange={(event) => agendarSugestoes(event.target.value)}
                                onFocus={() => setMostrarSugestoes(true)}
                                onBlur={() => window.setTimeout(() => setMostrarSugestoes(false), 150)}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") {
                                        setMostrarSugestoes(false);
                                    }
                                }}
                                autoComplete="off"
                            />
                            <button className="flex items-center px-4 py-2 text-[#7a1010]" type="submit" aria-label="Buscar">
                                <Search className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        {mostrarSugestoes && (
                            <div
                                className="absolute left-0 right-0 top-[calc(100%+6px)] z-200 max-h-80 overflow-y-auto rounded-[10px] border border-[#ead6d6] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
                                role="listbox"
                                aria-label="Sugestoes de produtos"
                            >
                                {carregandoSugestoes && (
                                    <div className="px-4 py-3 text-sm text-[#666]">Carregando...</div>
                                )}
                                {!carregandoSugestoes && sugestoes.length === 0 && (
                                    <div className="px-4 py-3 text-sm text-[#666]">Nenhum produto encontrado.</div>
                                )}
                                {!carregandoSugestoes && sugestoes.length > 0 && (
                                    <div>
                                        {sugestoes.map((produto) => (
                                            <Link
                                                key={String(produto.id)}
                                                href={`/produtos/${produto.id}`}
                                                className="flex items-center gap-3 px-3 py-2 text-[#2f2f2f] hover:bg-[#f8ecec]"
                                                onMouseDown={() => setMostrarSugestoes(false)}
                                                role="option"
                                            >
                                                <img
                                                    src={produto.imagem_url ?? "https://via.placeholder.com/40x40?text=Img"}
                                                    alt={produto.nome}
                                                    className="h-10 w-10 shrink-0 rounded-md bg-[#f4f4f4] object-contain"
                                                />
                                                <span className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-[#2d2d2d]">{produto.nome}</span>
                                                    {produto.marca_nome && (
                                                        <span className="text-xs text-[#7a7a7a]">{produto.marca_nome}</span>
                                                    )}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                    <button className="rounded-full bg-[#e8940a] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#d4840a]">Anunciar</button>

                    <div className="flex items-center gap-4">
                        <Link href="/fav" className="flex flex-col items-center gap-1 text-white">
                            <Heart className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link href="/login" className="flex flex-col items-center gap-1 text-white">
                            <User className="h-5 w-5" aria-hidden="true" />
                            <span className="text-[0.65rem]">Criar Conta</span>
                        </Link>
                    </div>
                </header>
                <Link href="/cart" className="flex h-full flex-col items-center justify-center bg-[#f9e8e8] px-4 text-[#7a1010]">
                    <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    <span className="text-[0.7rem] font-bold">Carrinho</span>
                </Link>
            </div>
            <div className="bg-[#6b0e0e] px-6 py-2">
                <button className="flex items-center gap-2 rounded border border-white px-3 py-1 text-xs text-white transition hover:bg-white/10">
                    Todos Departamentos
                    <span aria-hidden="true">&#8595;</span>
                </button>
            </div>
        </div>
    );
}
