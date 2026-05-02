
import Image from "next/image";
import style from "global.css";
import { PRODUTO_MOCK } from "@/constants/mock-product";
import { ProdutoFAQ } from "@/components/FAQ"
import { ProdutoCarrossel } from "@/components/carrosselProdutos";
import { DescricaoProduto } from "@/components/descProduto";
import { ProdutoDescricao } from "@/types";


export default async function PaginaProduto({ params }: { params: { id: string } }) {
    async function getProdutoData(id: string) {
        //simula um delay 
        await new Promise((resolve) => setTimeout(resolve, 500));
        return PRODUTO_MOCK;
    }
    const product = await getProdutoData(params.id);

    return (
        <main className="container mx-auto px-4 py-8 space-y-12">
            <DescricaoProduto description={product.description} />
            <ProdutoFAQ faqs={product.faqs} />
            <ProdutoCarrossel
                title="Produtos relacionados"
                produtos={product.produtosRelacionados}
            />

            <ProdutoCarrossel
                title="Récem vistos"
                produtos={product.recemVistos}
            />
        </main>
    );
}
