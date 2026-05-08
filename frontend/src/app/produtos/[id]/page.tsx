"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SideBarDir } from "@/components/SideBarDir";
import { Info, BookOpen } from "lucide-react";
import { ProdutoFAQ } from "@/components/FAQ";
import { ProductGallery } from "@/components/fotosProduto";
import type { ProdutoDetalhado } from "@/types";

type BackendProduto = {
    id: string;
    nome: string;
    descricao: string | null;
    modelo?: string | null;
    preco: string | number;
    preco_promocional?: string | number | null;
    desconto_ativo?: boolean;
    quantidade?: number;
    vendedor_nome?: string | null;
    vendedor_foto?: string | null;
    vendedor_banner?: string | null;
    subcategoria_nome?: string | null;
    categoria_nome?: string | null;
    marca_nome?: string | null;
    media_avaliacoes?: string | number | null;
    total_avaliacoes?: string | number | null;
    imagens?: Array<{ url: string; ordem?: number; is_principal?: boolean }>;
};

function toNumber(value: string | number | null | undefined, fallback = 0) {
    const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
    return Number.isFinite(parsed) ? parsed : fallback;
}

function mapProduto(data: BackendProduto): ProdutoDetalhado {
    const precoOriginal = toNumber(data.preco, 0);
    const precoPromocional = toNumber(data.preco_promocional, precoOriginal);
    const descontoAtivo = Boolean(data.desconto_ativo);
    const precoAtual = descontoAtivo && precoPromocional > 0 ? precoPromocional : precoOriginal;
    const porcentagemDesconto =
        precoOriginal > 0 && precoAtual < precoOriginal
            ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100)
            : 0;
    const quantidade = data.quantidade ?? 0;
    const imagens = (data.imagens ?? []).map((img) => img.url).filter(Boolean);
    const imagensSeguras = imagens.length > 0
        ? imagens
        : ["https://via.placeholder.com/600x600?text=Produto"];

    // CORREÇÃO AQUI: Forçamos a conversão para String para evitar o erro .trim()
    const descricaoRaw = data.descricao;
    const descricao = typeof descricaoRaw === 'string' ? descricaoRaw.trim() : "";

    const topicos = descricao
        ? descricao
            .split(".")
            .map((texto) => texto.trim())
            .filter(Boolean)
        : ["Sem informacoes do produto."];

    return {
        id: data.id,
        caminhoNavegacao: [
            data.categoria_nome
                ? { rotulo: data.categoria_nome, url: "#" }
                : { rotulo: "Categoria", url: "#" },
            data.subcategoria_nome
                ? { rotulo: data.subcategoria_nome, url: "#" }
                : { rotulo: "Subcategoria", url: "#" },
        ],
        nomeMarca: data.marca_nome ?? "Marca nao informada",
        logoMarca: "",
        nomeProduto: data.nome,
        imagens: imagensSeguras,
        avisoEstoque: quantidade > 0 && quantidade <= 5 ? `Restam apenas ${quantidade} un.` : undefined,
        avaliacoes: {
            media: toNumber(data.media_avaliacoes, 0),
            quantidadeTotal: toNumber(data.total_avaliacoes, 0),
        },
        topicosSobreProduto: topicos,
        descricaoCompleta: descricao,
        especificacoesTecnicas: {},
        emEstoque: quantidade > 0,
        valores: {
            precoOriginal,
            precoAtual,
            porcentagemDesconto,
            descontoPix: 0,
            quantidadeParcelas: 10,
            valorParcela: precoAtual > 0 ? precoAtual / 10 : 0,
        },
        vendedor: {
            nome: data.vendedor_nome ?? "Vendedor",
            lojaOficial: false,
            textoQuantidadeVendas: "Sem dados de vendas",
            politicaDevolucao: "Consulte a politica de devolucao",
            garantia: "Garantia conforme a loja",
            mesesGarantia: 0,
        },
        textoPreviaFrete: "Consulte o frete no checkout",
        urlBannerPromocional: data.vendedor_banner ?? undefined,
        perguntasFrequentes: [],
        produtosRelacionados: [],
        vistosRecentemente: [],
    };
}
export default function ProductPage() {
    const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    // useEffect(() => {
    //     const controller = new AbortController();

    //     async function carregarProduto() {
    //         const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

    //         if (!apiBaseUrl) {
    //             setErro("API nao configurada. Tente novamente mais tarde.");
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             const response = await fetch(`${apiBaseUrl}/produtos/${id}`, {
    //                 signal: controller.signal,
    //             });

    //             if (!response.ok) {
    //                 throw new Error("Nao foi possivel carregar o produto.");
    //             }

    //             const data = (await response.json()) as BackendProduto;
    //             setProduto(mapProduto(data));
    //         } catch (error) {
    //             if (!controller.signal.aborted) {
    //                 setErro("Falha ao buscar o produto. Tente novamente.");
    //             }
    //         } finally {
    //             if (!controller.signal.aborted) {
    //                 setLoading(false);
    //             }
    //         }
    //     }

    //     carregarProduto();

    //     return () => {
    //         controller.abort();
    //     };
    // }, [id]);
    useEffect(() => {
        const controller = new AbortController();

        async function carregarProduto() {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiBaseUrl) {
                console.error("ERRO: NEXT_PUBLIC_API_URL não está definida no arquivo .env");
                setErro("Configuração da API ausente.");
                setLoading(false);
                return;
            }

            try {
                const url = `${apiBaseUrl.replace(/\/$/, "")}/produtos/${id}`;
                console.log("Tentando buscar produto em:", url);

                const response = await fetch(url, {
                    signal: controller.signal,
                });

                console.log("Status da resposta:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Resposta de erro do servidor:", errorText);
                    throw new Error(`Erro ${response.status}: Não foi possível carregar.`);
                }

                const data = (await response.json()) as BackendProduto;
                console.log("Dados recebidos com sucesso:", data);
                
                setProduto(mapProduto(data));
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Busca cancelada (componente desmontou)');
                    return;
                }
                
                console.error("Erro detalhado na requisição:", error);
                setErro(`Falha ao buscar o produto: ${error.message}`);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            carregarProduto();
        }

        return () => {
            controller.abort();
        };
    }, [id]);




    

    if (loading) {
        return (
            <main className="container mx-auto px py-8">
                <div className="text-gray-700">Carregando produto...</div>
            </main>
        );
    }

    if (erro) {
        return (
            <main className="container mx-auto px py-8">
                <div className="text-red-600 font-semibold">{erro}</div>
            </main>
        );
    }

    if (!produto) {
        return (
            <main className="container mx-auto px py-8">
                <div className="text-gray-700">Produto nao encontrado.</div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px py-8 ">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Coluna Esquerda - Carrossel de Imagens (1 coluna) */}
                <div className="lg:col-span-1">
                    <div className="relative">
                        <div className="absolute top-0 left-0 bg-red-600 text-white font-black text-2xl px-4 py-2 transform -rotate-12 translate-y-4 -translate-x-2 shadow-lg z-10">
                            {produto.valores.porcentagemDesconto}% OFF
                        </div>
                        <ProductGallery 
                            images={produto.imagens} 
                            productName={produto.nomeProduto} 
                        />
                    </div>
                </div>

                {/* Coluna Meio - Título e Sobre (1 coluna) */}
                <div className="lg:col-span-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {produto.nomeProduto}
                    </h1>

                    <div className="space-y-4 mt-6">
                        <h2 className="text-lg font-black text-red-600 flex items-center gap-2 uppercase tracking-tight">
                            <Info size={24} className="text-red-600" />
                            Sobre o Produto
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                            {produto.topicosSobreProduto.map((topico: string, index: number) => (
                                <li key={index} className="leading-relaxed">
                                    {topico}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Coluna Direita - Sidebar (1 coluna, ocupa 2 linhas) */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <SideBarDir
                        valores={produto.valores}
                        vendedor={produto.vendedor}
                        emEstoque={produto.emEstoque}
                        textoPreviaFrete={produto.textoPreviaFrete}
                    />
                </div>

                {/* Descrição + FAQ - 2 colunas na segunda linha */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen size={28} className="text-red-600" />
                            Descrição Do Produto
                        </h2>
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {produto.descricaoCompleta}
                        </div>
                    </div>
                    <div className="space-y-4 mt-6">
                        <h2 className="text-lg font-black text-red-600 flex items-center gap-2 uppercase tracking-tight">
                            <Info size={24} className="text-red-600" />
                            Informações Tecnicas
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
                            {Object.entries(produto.especificacoesTecnicas).map(([chave,valor], index) => (
                                <li key={index} className="leading-relaxed">
                                    <strong>{chave}:</strong> {valor}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <hr className="border-gray-200" />

                    <div className="space-y-6">
                        <ProdutoFAQ faqs={produto.perguntasFrequentes} />
                    </div>
                </div>

            </div>
        </main>
    );
}