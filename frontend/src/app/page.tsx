"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProdutoCarrossel } from "@/components/carrosselProdutos";
import { Monitor, Smartphone, Cpu, Headphones, Gamepad, Tv, Watch, Speaker, ChevronRight, ChevronLeft } from "lucide-react";
// Importando o carrossel base que você já tem no projeto
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

type Evento = { id: string; nome: string; banner_url: string; };
type Categoria = { id: string; nome: string; };

const getCategoryIcon = (nome: string) => {
    const n = nome.toLowerCase();
    if (n.includes("smart") || n.includes("celular")) return <Smartphone size={28} />;
    if (n.includes("pc") || n.includes("computador") || n.includes("note")) return <Monitor size={28} />;
    if (n.includes("game") || n.includes("console")) return <Gamepad size={28} />;
    if (n.includes("tv") || n.includes("tele")) return <Tv size={28} />;
    if (n.includes("audio") || n.includes("som") || n.includes("fone")) return <Headphones size={28} />;
    if (n.includes("relogio") || n.includes("watch")) return <Watch size={28} />;
    if (n.includes("hardware") || n.includes("placa")) return <Cpu size={28} />;
    return <Speaker size={28} />;
};

export default function Home() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [recentes, setRecentes] = useState([]);
    const [ofertas, setOfertas] = useState([]);
    const [aleatorios, setAleatorios] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        async function loadHomeData() {
            const api = process.env.NEXT_PUBLIC_API_URL;
            
            try {
                const promessas = [
                    fetch(`${api}/eventos/carrossel`).then(r => r.ok ? r.json() : []),
                    fetch(`${api}/categorias`).then(r => r.ok ? r.json() : []),
                    fetch(`${api}/produtos/carrossel/oferta`).then(r => r.ok ? r.json() : []),
                    fetch(`${api}/produtos/carrossel/random`).then(r => r.ok ? r.json() : [])
                ];

                const [dadosEventos, dadosCats, dadosOfertas, dadosAleatorios] = await Promise.all(promessas);

                const mapProd = (p: any) => ({
                    id: p.id, nome: p.nome,
                    precoAtual: p.desconto_ativo && p.preco_promocional > 0 ? parseFloat(p.preco_promocional) : parseFloat(p.preco),
                    precoOriginal: parseFloat(p.preco),
                    porcentagemDesconto: p.desconto_ativo && p.preco_promocional > 0 ? Math.round(((p.preco - p.preco_promocional) / p.preco) * 100) : 0,
                    imagem: p.imagem_url || "https://via.placeholder.com/300",
                    avaliacao: parseFloat(p.media_avaliacoes) || 5,
                    emEstoque: parseInt(p.quantidade) > 0
                });

                setEventos(dadosEventos);
                setCategorias(dadosCats);
                setOfertas(dadosOfertas.map(mapProd));
                setAleatorios(dadosAleatorios.map(mapProd));
                setRecentes([]);

            } catch (error) {
                console.error("Erro ao carregar a Home", error);
            } finally {
                setLoading(false);
            }
        }
        loadHomeData();
    }, []);

    useEffect(() => {
        if (eventos.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % eventos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [eventos.length]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Montando vitrine...</div>;

    return (
        <main className="bg-slate-50 min-h-screen pb-20 overflow-x-hidden">
            
            {/* 1. CARROSSEL DE EVENTOS (HERO) */}
            {eventos.length > 0 && (
                <section className="relative w-full max-w-7xl mx-auto md:mt-6 overflow-hidden md:rounded-2xl shadow-lg bg-slate-900 aspect-[21/9] md:aspect-[21/7]">
                    <div 
                        className="flex h-full transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {eventos.map((evento) => (
                            <Link 
                                key={evento.id} 
                                href={`/busca?evento_id=${evento.id}`} 
                                className="min-w-full h-full relative group cursor-pointer block"
                            >
                                <img 
                                    src={evento.banner_url || "/eventos/evento-padrao.jpg"} 
                                    alt={evento.nome} 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-6 left-8 md:bottom-12 md:left-12">
                                    <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md">{evento.nome}</h2>
                                    <span className="inline-block mt-3 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg transform group-hover:scale-105 transition-transform">
                                        Aproveitar Ofertas
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {eventos.length > 1 && (
                        <>
                            <button onClick={() => setCurrentSlide(prev => prev === 0 ? eventos.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={() => setCurrentSlide(prev => (prev + 1) % eventos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/50 transition">
                                <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {eventos.map((_, i) => (
                                    <div key={i} onClick={() => setCurrentSlide(i)} className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${currentSlide === i ? 'bg-white scale-125' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            )}

            {/* 2. CARROSSEL DE CATEGORIAS (Bolas Vermelhas) */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 mt-12 relative">
                <h2 className="text-xl font-bold mb-6 text-slate-900 px-2 md:px-0">Navegue por Categorias</h2>
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {categorias.map(cat => (
                            // basis-1/3 para mobile, 1/6 tablet, 1/8 desktop
                            <CarouselItem key={cat.id} className="pl-2 md:pl-4 basis-[30%] sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]">
                                <Link 
                                    href={`/busca?categoria_id=${cat.id}`}
                                    className="flex flex-col items-center gap-3 group w-full h-full p-2"
                                >
                                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-[#7B1A1A] flex items-center justify-center text-white shadow-md group-hover:bg-[#5e1212] group-hover:-translate-y-2 transition-all duration-300">
                                        {getCategoryIcon(cat.nome)}
                                    </div>
                                    <span className="text-xs md:text-sm font-bold text-slate-800 text-center uppercase tracking-wide group-hover:text-[#7B1A1A] break-words line-clamp-2">
                                        {cat.nome}
                                    </span>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Setinhas Customizadas por fora das bolas */}
                    <CarouselPrevious className="hidden md:flex -left-4 md:-left-8 bg-white border-slate-200 shadow-sm hover:bg-slate-50" />
                    <CarouselNext className="hidden md:flex -right-4 md:-right-8 bg-white border-slate-200 shadow-sm hover:bg-slate-50" />
                </Carousel>
            </section>

            {/* 3. VITRINES DE PRODUTOS */}
            {recentes.length > 0 && (
                <div className="mt-12 border-t border-slate-200 pt-10 bg-white pb-8 shadow-sm">
                    <ProdutoCarrossel title="⏳ Vistos Recentemente" produtos={recentes} />
                </div>
            )}

            {ofertas.length > 0 && (
                <div className="mt-10">
                    <ProdutoCarrossel title="🔥 Principais Ofertas" produtos={ofertas} />
                </div>
            )}

            {aleatorios.length > 0 && (
                <div className="mt-10">
                    <ProdutoCarrossel title="✨ Recomendados para Você" produtos={aleatorios} />
                </div>
            )}

        </main>
    );
}