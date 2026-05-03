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
        <section className="mt-12 w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
            <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
            >
                <CarouselContent>
                    {produtos.map((produto, index) => (
                        <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                            <div className="p-1">
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col p-4 h-full">
                                        {/* Imagem e Badge de Desconto */}
                                        <div className="relative mb-3">
                                            <img src={produto.imagem} alt={produto.nome} className="w-full h-40 object-contain" />
                                            {produto.porcentagemDesconto > 0 && (
                                                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                    -{produto.porcentagemDesconto}%
                                                </div>
                                            )}
                                            {!produto.emEstoque && (
                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                                    <span className="text-white font-bold">Fora de Estoque</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Avaliação */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < Math.floor(produto.avaliacao) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-600">{produto.avaliacao}</span>
                                        </div>

                                        {/* Nome do Produto */}
                                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 flex-grow">
                                            {produto.nome}
                                        </h3>

                                        {/* Preços */}
                                        <div className="flex flex-col gap-1 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-red-600">
                                                    R$ {produto.precoAtual.toFixed(2).replace('.', ',')}
                                                </span>
                                                {produto.precoOriginal > produto.precoAtual && (
                                                    <span className="text-xs text-gray-500 line-through">
                                                        R$ {produto.precoOriginal.toFixed(2).replace('.', ',')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status */}
                                        {produto.emEstoque ? (
                                            <span className="text-xs text-green-600 font-semibold">Em estoque</span>
                                        ) : (
                                            <span className="text-xs text-red-600 font-semibold">Indisponível</span>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel >
        </section >
    );
}