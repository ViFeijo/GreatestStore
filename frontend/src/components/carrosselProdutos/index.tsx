import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ProdutoResumido } from "@/types"

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
                                <Card>
                                    <CardContent className="flex flex-col items-center p-6 aspect-square justify-between">
                                        <img src={produto.image} alt={produto.name} className="h-32 object-contain" />
                                        <span className="text-sm font-semibold text-center mt-2">{produto.name}</span>
                                        <span className="text-red-600 font-bold mt-1">R$ {produto.price}</span>
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