"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SideBarDir } from "@/components/SideBarDir";
import { BookOpen, Star, MessageCircle, User } from "lucide-react";
import { ProdutoFAQ } from "@/components/FAQ";
import { ProductGallery } from "@/components/fotosProduto";
<<<<<<< Updated upstream
import { ProdutoCarrossel } from "@/components/carrosselProdutos";
import type { ProdutoDetalhado, ProdutoResumido, PerguntaFrequente, ProdutoListagemApi, ProdutoDetalheApi, ProdutoImagemApi, ItemNavegacao, AvaliacaoApi } from "@/types";
=======
import type { ProdutoDetalhado } from "@/types";
import { addCartItem } from "@/lib/cart";
>>>>>>> Stashed changes

type ProdutoListagemApiComImagem = ProdutoListagemApi & {
    imagem?: string | null;
};

type DescricaoBloco = {
    conteudo?: string | null;
};

type ProdutoDetalheApiComBlocos = ProdutoDetalheApi & {
    descricao_blocos?: DescricaoBloco[];
};

type PerguntaApi = {
    id?: string | number;
    pergunta: string;
    resposta?: string | null;
};

type AvaliacoesResponse = {
    avaliacoes?: AvaliacaoApi[];
};

function toNumber(value: unknown, fallback = 0) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value.replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
}

function mapParaResumo(item: ProdutoListagemApiComImagem): ProdutoResumido {
    const pOrig = toNumber(item.preco, 0);
    const pProm = toNumber(item.preco_promocional, pOrig);
    const pAtual = Boolean(item.desconto_ativo) && pProm > 0 ? pProm : pOrig;

    return {
        id: String(item.id),
        nome: item.nome,
        precoAtual: pAtual,
        precoOriginal: pOrig,
        porcentagemDesconto: pOrig > 0 && pAtual < pOrig ? Math.round(((pOrig - pAtual) / pOrig) * 100) : 0,
        imagem: item.imagem_url || item.imagem || "https://via.placeholder.com/300x300?text=Sem+Imagem",
        avaliacao: toNumber(item.media_avaliacoes, 5),
        emEstoque: toNumber(item.quantidade) > 0
    };
}

    function mapProduto(data: ProdutoDetalheApiComBlocos): ProdutoDetalhado {
    const pOrig = toNumber(data.preco, 0);
    const pAtual = Boolean(data.desconto_ativo) && toNumber(data.preco_promocional) > 0 ? toNumber(data.preco_promocional) : pOrig;

    const imagens = (data.imagens ?? []).map((img: ProdutoImagemApi) => img.url).filter(Boolean) as string[];
    let textoFinal = "";
    if (Array.isArray(data.descricao_blocos) && data.descricao_blocos.length > 0) {
        textoFinal = data.descricao_blocos.map((b: DescricaoBloco) => b.conteudo || "").join("\n");
    } else if (typeof data.descricao === "string") {
        textoFinal = data.descricao;
    }

    const descLimpa = textoFinal.trim() || "Descrição não informada pelo vendedor.";

    return {
        id: String(data.id),
        caminhoNavegacao: [
            ...(data.categoria_id ? [{ rotulo: data.categoria_nome || "Categoria", url: `/busca?categoria_id=${data.categoria_id}` }] : []),
            ...(data.subcategoria_id ? [{ rotulo: data.subcategoria_nome || "Subcategoria", url: `/busca?subcategoria_id=${data.subcategoria_id}` }] : []),
        ],
        nomeMarca: data.marca_nome || "Marca Geral",
        logoMarca: "",
        nomeProduto: data.nome,
        imagens: imagens.length > 0 ? imagens : ["https://via.placeholder.com/600x600?text=Sem+Imagem"],
        avisoEstoque: toNumber(data.quantidade) <= 5 && toNumber(data.quantidade) > 0 ? `Restam apenas ${toNumber(data.quantidade)} un.` : undefined,
        avaliacoes: { media: toNumber(data.media_avaliacoes, 5), quantidadeTotal: toNumber(data.total_avaliacoes, 0) },
        topicosSobreProduto: descLimpa !== "Descrição não informada pelo vendedor." ? descLimpa.split(".").map((t: string) => t.trim()).filter((t: string) => t.length > 5) : ["Sem destaques técnicos cadastrados."],
        descricaoCompleta: descLimpa,
        especificacoesTecnicas: {},
        emEstoque: toNumber(data.quantidade) > 0,
        valores: {
            precoOriginal: pOrig, precoAtual: pAtual, porcentagemDesconto: pOrig > 0 && pAtual < pOrig ? Math.round(((pOrig - pAtual) / pOrig) * 100) : 0,
            descontoPix: 10, quantidadeParcelas: 10, valorParcela: pAtual / 10,
        },
        vendedor: {
            id: data.vendedor_id,
            nome: data.vendedor_nome || "Vendedor Parceiro",
            lojaOficial: true,
            textoQuantidadeVendas: "+500 vendas nos últimos 60 dias",
            politicaDevolucao: "Devolução em 7 dias",
            garantia: "Garantia do Vendedor",
            mesesGarantia: 12,
            fotoPerfil: data.vendedor_foto || null
        },
        textoPreviaFrete: "Chegará grátis e rápido",
        urlBannerPromocional: data.vendedor_banner || undefined,
        perguntasFrequentes: [], produtosRelacionados: [], vistosRecentemente: [],
    };
}

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [produto, setProduto] = useState<ProdutoDetalhado | null>(null);
    const [relacionados, setRelacionados] = useState<ProdutoResumido[]>([]);
    const [aleatorios, setAleatorios] = useState<ProdutoResumido[]>([]);
    
    // Novos Estados
    const [avaliacoesUsuarios, setAvaliacoesUsuarios] = useState<AvaliacaoApi[]>([]);
    const [perguntasFrequentes, setPerguntasFrequentes] = useState<PerguntaFrequente[]>([]);
    const [novaPergunta, setNovaPergunta] = useState("");

    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

<<<<<<< Updated upstream
=======
    function handleAddToCart(quantidade: number) {
        if (!produto) return;

        addCartItem({
            id: produto.id,
            name: produto.nomeProduto,
            seller: produto.vendedor.nome,
            price: produto.valores.precoAtual,
            image: produto.imagens[0] ?? "https://via.placeholder.com/600x600?text=Produto",
            quantity: quantidade,
        });
    }

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
>>>>>>> Stashed changes
    useEffect(() => {
        if (!id) return;
        const controller = new AbortController();

        async function fetchTudo() {
            try {
                const api = process.env.NEXT_PUBLIC_API_URL;
                
                // 1. Busca o Produto Principal
                const res = await fetch(`${api}/produtos/${id}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Produto não encontrado.");
                const data = await res.json() as ProdutoDetalheApiComBlocos;
                setProduto(mapProduto(data));

                // 2. Busca Dados Paralelos (Carrosséis, Avaliações de Texto, Perguntas)
                const promessas = [
                    fetch(`${api}/produtos/carrossel/random`).then(r => r.ok ? r.json() : []),
                    fetch(`${api}/produtos/subcategoria/${data.subcategoria_id}`).then(r => r.ok ? r.json() : []),
                    fetch(`${api}/avaliacoes/produto/${id}`).then(r => r.ok ? r.json() : { avaliacoes: [] }),
                    fetch(`${api}/perguntas/produto/${id}`).then(r => r.ok ? r.json() : [])
                ];

                const [dadosAleatorios, dadosRelacionados, dadosAvals, dadosPerguntas] = await Promise.all(promessas);

                if (Array.isArray(dadosAleatorios)) setAleatorios((dadosAleatorios as ProdutoListagemApiComImagem[]).map((d) => mapParaResumo(d)).filter(p => p.id !== id));
                if (Array.isArray(dadosRelacionados)) setRelacionados((dadosRelacionados as ProdutoListagemApiComImagem[]).map((d) => mapParaResumo(d)).filter(p => p.id !== id));
                
                if (isAvaliacoesResponse(dadosAvals) && Array.isArray(dadosAvals.avaliacoes)) setAvaliacoesUsuarios(dadosAvals.avaliacoes);

                // Mapeia perguntas do BD para o formato que o Accordion espera
                if (Array.isArray(dadosPerguntas)) {
                    const faqsMapeadas = (dadosPerguntas as PerguntaApi[])
                        .filter((p) => p.resposta)
                        .map((p) => ({ id: String(p.id ?? Math.random()), pergunta: p.pergunta, resposta: p.resposta || "" }));
                    setPerguntasFrequentes(faqsMapeadas);
                }

                // 3. (Opcional) Registrar Histórico de Navegação
                const token = localStorage.getItem("token");
                if(token) {
                    fetch(`${api}/historico/registrar/${id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(()=>{});
                }

            } catch (err: unknown) {
                if (!(err instanceof DOMException && err.name === "AbortError")) setErro(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }

        fetchTudo();
        return () => controller.abort();
    }, [id]);

    const handleEnviarPergunta = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) return alert("Faça login para perguntar!");
        
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/perguntas/produto/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ pergunta: novaPergunta })
            });
            alert("Pergunta enviada ao vendedor!");
            setNovaPergunta("");
        } catch {
            alert("Erro ao enviar pergunta.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Carregando produto...</div>;
    if (erro || !produto) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{erro || "Erro 404"}</div>;

    const notaMedia = produto.avaliacoes.media || 5;

    return (
        <main className="bg-slate-50 min-h-screen pb-20">
            {/* Breadcrumbs - AGORA CLICÁVEIS */}
            <nav className="bg-white border-b px-4 py-3 mb-8">
                <div className="max-w-7xl mx-auto flex gap-2 text-sm text-slate-500 font-medium">
                    <Link href="/" className="hover:text-red-600 transition-colors">Home</Link> &gt; 
                    {produto.caminhoNavegacao.map((item: ItemNavegacao, index: number) => (
                        <span key={index}>
                            <Link href={item.url} className="hover:text-red-600 transition-colors">{item.rotulo}</Link>
                            {index < produto.caminhoNavegacao.length - 1 && " > "}
                        </span>
                    ))}
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* COLUNA ESQUERDA (Fotos e Título) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/2 relative">
                                    {produto.valores.porcentagemDesconto > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-black px-3 py-1 rounded z-20">
                                            {produto.valores.porcentagemDesconto}% OFF
                                        </div>
                                    )}
                                    <ProductGallery images={produto.imagens} productName={produto.nomeProduto} />
                                </div>

                                <div className="md:w-1/2 space-y-4">
                                    <p className="text-red-600 font-bold uppercase text-xs tracking-widest">{produto.nomeMarca}</p>
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{produto.nomeProduto}</h1>
                                    
                                    {/* Estrelas */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={18} className={i < Math.floor(notaMedia) ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium text-slate-600">
                                            {notaMedia.toFixed(1)} ({produto.avaliacoes.quantidadeTotal} avaliações)
                                        </span>
                                    </div>

                                    <hr className="border-slate-100" />
                                    
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-slate-900">Destaques:</h3>
                                        <ul className="space-y-2">
                                            {produto.topicosSobreProduto.slice(0, 5).map((t: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                    <span className="text-red-500 font-bold">•</span> {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESCRIÇÃO LONGA */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <BookOpen size={28} className="text-red-600" /> Detalhes do Produto
                            </h2>
                            <div className="prose max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                                {produto.descricaoCompleta}
                            </div>
                        </div>

                        {/* AVALIAÇÕES DE TEXTO (Comentários dos Clientes) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <Star size={28} className="text-red-600 fill-red-600" /> Opiniões dos Clientes
                            </h2>
                            {avaliacoesUsuarios.length === 0 ? (
                                <p className="text-slate-500 italic">Seja o primeiro a avaliar este produto!</p>
                            ) : (
                                <div className="space-y-6">
                                    {avaliacoesUsuarios.map((av: AvaliacaoApi, i: number) => (
                                        <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                                                    {av.usuario_nome?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900">{av.usuario_nome}</p>
                                                    <div className="flex">
                                                        {(() => {
                                                            const notaUsuario = toNumber(av.nota, 0);
                                                            return [...Array(5)].map((_, idx) => (
                                                                <Star key={idx} size={12} className={idx < notaUsuario ? "fill-yellow-400 text-yellow-400" : "fill-slate-200 text-slate-200"} />
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 mt-2">{av.comentario}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

<<<<<<< Updated upstream
                        {/* PERGUNTAS E RESPOSTAS (Usando o Accordion que você mandou e input novo) */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                <MessageCircle size={28} className="text-red-600" /> Perguntas ao Vendedor
                            </h2>
                            
                            <form onSubmit={handleEnviarPergunta} className="flex gap-3 mb-8">
                                <input 
                                    type="text" 
                                    required
                                    placeholder="O que você quer saber sobre este produto?" 
                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
                                    value={novaPergunta}
                                    onChange={e => setNovaPergunta(e.target.value)}
                                />
                                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 rounded-lg text-sm transition-colors">
                                    Perguntar
                                </button>
                            </form>
=======
                {/* Coluna Direita - Sidebar (1 coluna, ocupa 2 linhas) */}
                <div className="lg:col-span-1 lg:row-span-2">
                    <SideBarDir
                        valores={produto.valores}
                        vendedor={produto.vendedor}
                        emEstoque={produto.emEstoque}
                        textoPreviaFrete={produto.textoPreviaFrete}
                        onAddToCart={handleAddToCart}
                    />
                </div>
>>>>>>> Stashed changes

                            {perguntasFrequentes.length > 0 ? (
                                <ProdutoFAQ faqs={perguntasFrequentes} />
                            ) : (
                                <p className="text-slate-500 italic text-sm">Nenhuma pergunta respondida ainda.</p>
                            )}
                        </div>
                    </div>

                    {/* COLUNA DIREITA (Sidebar Compra & Info Vendedor) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24">
                            <SideBarDir
                                valores={produto.valores}
                                vendedor={produto.vendedor}
                                emEstoque={produto.emEstoque}
                                textoPreviaFrete={produto.textoPreviaFrete}
                            />

                            {/* CARD DE INFORMAÇÕES DO VENDEDOR (Logo Abaixo da Compra) */}
                            <div className="bg-white mt-6 p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Vendido e Entregue por</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {produto.vendedor.fotoPerfil ? (
                                            <img src={produto.vendedor.fotoPerfil} alt="Loja" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={24} className="text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 flex items-center gap-1">
                                            {produto.vendedor.nome} 
                                            {produto.vendedor.lojaOficial && <span className="text-blue-500" title="Loja Verificada">✓</span>}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">{produto.vendedor.textoQuantidadeVendas}</p>
                                        <Link href={`/loja/${produto.vendedor.id || ''}`} className="text-xs text-red-600 font-bold hover:underline mt-1 inline-block">
                                            Ver mais produtos da loja
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARROSSÉIS INFERIORES */}
                {relacionados.length > 0 && <ProdutoCarrossel title="Produtos Similares" produtos={relacionados} />}
                {aleatorios.length > 0 && <ProdutoCarrossel title="Você também pode gostar" produtos={aleatorios} />}
            </div>
        </main>
    );
}
<<<<<<< Updated upstream

function isAvaliacoesResponse(value: unknown): value is AvaliacoesResponse {
    return typeof value === "object" && value !== null && "avaliacoes" in value;
}
=======
>>>>>>> Stashed changes
