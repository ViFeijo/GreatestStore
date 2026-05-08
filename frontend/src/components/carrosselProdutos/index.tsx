import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ProdutoResumido } from "@/types"
import { Star } from "lucide-react"

export function ProdutoCarrossel({ title, produtos = [] }: { title: string, produtos?: ProdutoResumido[] }) {
    if (!produtos || produtos.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 w-full max-w-6xl mx-auto px-4 md:px-0">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">{title}</h2>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                    {produtos.map((produto, index) => {
                        const nota = produto.avaliacao || 5; // Fallback visual

                        return (
                            <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <div className="p-2 h-full">
                                    {/* Link englobando o card inteiro */}
                                    <Link href={`/produtos/${produto.id}`} className="block h-full">
                                        <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 cursor-pointer">
                                            <CardContent className="flex flex-col p-4 h-full bg-white rounded-xl">
                                                
                                                {/* Imagem e Badge */}
                                                <div className="relative mb-4 aspect-square bg-slate-50 rounded-lg flex items-center justify-center p-2">
                                                    <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-contain mix-blend-multiply" />
                                                    {produto.porcentagemDesconto > 0 && (
                                                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded shadow-sm text-xs font-black">
                                                            -{produto.porcentagemDesconto}%
                                                        </div>
                                                    )}
                                                    {!produto.emEstoque && (
                                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
                                                            <span className="bg-slate-900 text-white px-3 py-1 text-xs font-bold rounded">Esgotado</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Avaliação com estrelas PINTADAS */}
                                                <div className="flex items-center gap-1 mb-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                className={i < Math.floor(nota) 
                                                                    ? "fill-yellow-400 text-yellow-400" 
                                                                    : "fill-slate-200 text-slate-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-slate-500 font-medium">{nota.toFixed(1)}</span>
                                                </div>

                                                <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-3 h-10">
                                                    {produto.nome}
                                                </h3>

                                                {/* Preços */}
                                                <div className="flex flex-col gap-1 mt-auto">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-xl font-black text-red-600">
                                                            R$ {produto.precoAtual.toFixed(2).replace('.', ',')}
                                                        </span>
                                                        {produto.precoOriginal > produto.precoAtual && (
                                                            <span className="text-xs text-slate-400 line-through">
                                                                R$ {produto.precoOriginal.toFixed(2).replace('.', ',')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-wider ${produto.emEstoque ? 'text-green-600' : 'text-red-600'}`}>
                                                        {produto.emEstoque ? 'Em estoque' : 'Indisponível'}
                                                    </span>
                                                </div>
                                                
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4" />
                <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
        </section>
    );
}