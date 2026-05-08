"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart3, Package, DollarSign, TrendingUp,
    LayoutDashboard, Edit, Eye, Tag, AlertCircle, ShoppingBag, PlusCircle
} from "lucide-react";

// 1. Tipagens Precisas
type ProdutoVendidoAPI = {
    id: string | number;
    nome: string;
    modelo?: string;
    marca_nome?: string;
    total_unidades_vendidas?: number | string;
    faturamento_total_produto?: number | string;
    quantidade?: number | string;
    preco: number | string;
    imagem_url?: string;
};

type ProdutoDashboard = {
    id: string;
    nome: string;
    modelo: string;
    marca: string;
    vendas: number;
    faturamento: number;
    estoque: number;
    preco: number;
    imagem: string;
};

export default function DashboardVendedor() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [estatisticas, setEstatisticas] = useState({ faturamentoTotal: 0, totalVendas: 0 });
    const [produtos, setProdutos] = useState<ProdutoDashboard[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        async function carregarDashboard() {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Acesso negado. Faça login como vendedor.");

                const resProdutos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/meus`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });

                if (!resProdutos.ok) throw new Error("Não foi possível carregar os dados da loja.");
                
                const dadosAPI = await resProdutos.json() as ProdutoVendidoAPI[];

                let faturamentoAgg = 0;
                let vendasAgg = 0;

                const dadosFormatados: ProdutoDashboard[] = dadosAPI.map((p) => {
                    const vendasProd = Number(p.total_unidades_vendidas) || 0;
                    const fatProd = Number(p.faturamento_total_produto) || 0;

                    faturamentoAgg += fatProd;
                    vendasAgg += vendasProd;

                    return {
                        id: String(p.id),
                        nome: p.nome,
                        modelo: p.modelo || "N/A",
                        marca: p.marca_nome || "Diversos",
                        vendas: vendasProd,
                        faturamento: fatProd,
                        estoque: Number(p.quantidade) || 0,
                        preco: Number(p.preco) || 0,
                        imagem: p.imagem_url || "https://via.placeholder.com/150?text=Sem+Foto"
                    };
                });

                setProdutos(dadosFormatados);
                setEstatisticas({ faturamentoTotal: faturamentoAgg, totalVendas: vendasAgg });

            } catch (err: unknown) {
                if (!(err instanceof DOMException && err.name === "AbortError")) {
                    setErro(err instanceof Error ? err.message : "Erro desconhecido ao carregar painel.");
                }
            } finally {
                setLoading(false);
            }
        }

        carregarDashboard();
        return () => controller.abort();
    }, []);

    // ESTADO DE CARREGAMENTO (SKELETON)
    if (loading) {
        return (
            <div className="bg-slate-50 min-h-screen p-6 md:p-10 animate-pulse">
                <div className="h-10 w-64 bg-slate-200 rounded-lg mb-2"></div>
                <div className="h-4 w-96 bg-slate-200 rounded-lg mb-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl shadow-sm"></div>)}
                </div>
                <div className="h-96 bg-white border border-slate-200 rounded-2xl shadow-sm"></div>
            </div>
        );
    }

    // ESTADO DE ERRO
    if (erro) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-lg text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Ops! Algo deu errado.</h2>
                    <p className="text-slate-600 mb-6">{erro}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    // DASHBOARD PRINCIPAL
    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-10">
            {/* Header */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <LayoutDashboard className="text-red-600" size={32} /> Central do Vendedor
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Acompanhe o desempenho da sua loja em tempo real.
                    </p>
                </div>
                <Link 
                    href="/criarProduto" 
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2 w-fit transform active:scale-95"
                >
                    <PlusCircle size={20} /> Novo Anúncio
                </Link>
            </header>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Faturamento Bruto"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(estatisticas.faturamentoTotal)}
                    icon={<DollarSign size={24} />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Unidades Vendidas"
                    value={estatisticas.totalVendas.toLocaleString('pt-BR')}
                    icon={<TrendingUp size={24} />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Produtos no Catálogo"
                    value={produtos.length.toString()}
                    icon={<BarChart3 size={24} />}
                    color="bg-purple-500"
                />
            </div>

            {/* Tabela de Produtos */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                    <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <ShoppingBag size={20} className="text-slate-400" /> Desempenho por Produto
                    </h2>
                    <button className="text-sm font-bold text-red-600 hover:underline flex items-center gap-2">
                        <Tag size={16} /> Ver Cupons Ativos
                    </button>
                </div>

                {produtos.length === 0 ? (
                    // EMPTY STATE (Sem produtos)
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Package size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Sua vitrine está vazia</h3>
                        <p className="text-slate-500 max-w-sm mb-6">Você ainda não cadastrou nenhum produto. Comece a vender agora mesmo criando seu primeiro anúncio!</p>
                        <Link href="/criarProduto" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
                            Cadastrar Primeiro Produto
                        </Link>
                    </div>
                ) : (
                    // TABELA DE DADOS
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Produto</th>
                                    <th className="px-6 py-4 text-center">Estoque</th>
                                    <th className="px-6 py-4 text-center">Vendas</th>
                                    <th className="px-6 py-4 text-right">Faturamento</th>
                                    <th className="px-6 py-4 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {produtos.map(prod => (
                                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-white rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm p-1">
                                                    <img src={prod.imagem} className="w-full h-full object-contain" alt={prod.nome} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-red-600 transition-colors">{prod.nome}</p>
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">
                                                        {prod.marca} • Mod: {prod.modelo}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className={`font-bold text-sm ${prod.estoque === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
                                                    {prod.estoque} un.
                                                </span>
                                                {prod.estoque <= 5 && prod.estoque > 0 && (
                                                    <span title="Estoque baixo! Reponha em breve.">
                                                        <AlertCircle size={16} className="text-orange-500 cursor-help" />
                                                    </span>
                                                )}
                                                {prod.estoque === 0 && (
                                                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-md font-black uppercase tracking-wide">
                                                        Esgotado
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center font-semibold text-sm text-slate-700">
                                            <span className="bg-slate-100 px-3 py-1 rounded-full">{prod.vendas}</span>
                                        </td>

                                        <td className="px-6 py-4 text-right font-black text-sm text-green-600">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.faturamento)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link 
                                                    href={`/produtos/${prod.id}`} 
                                                    target="_blank" 
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                    title="Visualizar na loja"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link 
                                                    href={`/editarProduto/${prod.id}`} // Ajuste esta rota conforme sua estrutura
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                                    title="Editar Produto"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente Card Auxiliar
function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-shadow cursor-default">
            <div className={`p-4 rounded-xl text-white ${color} z-10 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
            <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transform scale-150 text-slate-900 group-hover:scale-[1.8] group-hover:rotate-12 transition-all duration-500`}>
                {icon}
            </div>
        </div>
    );
}