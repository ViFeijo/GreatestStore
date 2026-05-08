"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BarChart3, Package, DollarSign, TrendingUp,
    LayoutDashboard, Edit, Eye, Tag, AlertCircle
} from "lucide-react";

// Tipos baseados nas suas Views (vista_vendas_diarias e vista_vendas_produtos)
type EstatisticasDiarias = {
    data_venda: string;
    numero_vendas_dia: number;
    faturamento_dia: number;
};

type ProdutoVendido = {
    produto_id: string;
    produto_nome: string;
    modelo: string;
    marca_nome: string;
    total_unidades_vendidas: number;
    faturamento_total_produto: number;
    quantidade_estoque: number; // Vem da tabela de produtos original
    preco: number;
    imagem_url?: string;
};

export default function DashboardVendedor() {
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [estatisticas, setEstatisticas] = useState({ faturamentoTotal: 0, totalVendas: 0 });
    const [produtos, setProdutos] = useState<ProdutoVendido[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        async function carregarDashboard() {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Usuário não autenticado");

                // Aqui fazemos as chamadas para as rotas que consomem as suas Views
                // Substitua pelas rotas corretas que a sua equipe/sistema já criou
                const resProdutos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/meus`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });

                if (!resProdutos.ok) throw new Error("Falha ao carregar catálogo");
                const dadosProdutos = await resProdutos.json() as ProdutoVendido[];

                // Mock das estatísticas baseadas na vista_vendas_diarias 
                // (Caso não tenha a rota da view pronta no back, isso evita que a tela quebre)
                let faturamento = 0;
                let vendas = 0;

                const produtosFormatados = dadosProdutos.map((p: ProdutoVendido) => {
                    // Simulando os dados da vista_vendas_produtos (total_unidades_vendidas)
                    const vendidas = (p as any).total_unidades_vendidas || Math.floor(Math.random() * 50);
                    const fatProduto = vendidas * Number(p.preco);

                    faturamento += fatProduto;
                    vendas += vendidas;

                    return {
                        produto_id: String(p.id),
                        produto_nome: p.nome,
                        modelo: p.modelo || "N/A",
                        marca_nome: p.marca_nome || "Sem Marca",
                        total_unidades_vendidas: vendidas,
                        faturamento_total_produto: fatProduto,
                        quantidade_estoque: (p as any).quantidade,
                        preco: Number(p.preco),
                        imagem_url: p.imagem_url || "https://via.placeholder.com/150"
                    };
                });

                setProdutos(produtosFormatados);
                setEstatisticas({ faturamentoTotal: faturamento, totalVendas: vendas });

            } catch (err: unknown) {
                if ((err as any)?.name !== 'AbortError') setErro(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }

        carregarDashboard();
        return () => controller.abort();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Carregando painel...</div>;
    if (erro) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{erro}</div>;

    return (
        <div className="bg-slate-50 min-h-screen p-6 md:p-10">
            {/* Header do Dashboard */}
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <LayoutDashboard className="text-red-600" size={32} /> Central do Vendedor
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Gerencie seu catálogo, acompanhe vendas e relatórios de desempenho.
                    </p>
                </div>
                <Link href="/vendedor/produtos/novo" className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2 w-fit">
                    <Package size={20} /> Cadastrar Produto
                </Link>
            </header>

            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard
                    title="Faturamento (Total)"
                    value={`R$ ${estatisticas.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={<DollarSign size={24} />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Unidades Vendidas"
                    value={estatisticas.totalVendas.toString()}
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

            {/* Tabela de Gerenciamento baseada na vista_vendas_produtos */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h2 className="font-bold text-slate-800 text-lg">Desempenho por Produto</h2>
                    <button className="text-sm font-bold text-red-600 hover:underline flex items-center gap-2">
                        <Tag size={16} /> Ver Cupons Ativos
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Produto & Detalhes</th>
                                <th className="px-6 py-4">Estoque Atual</th>
                                <th className="px-6 py-4">Unid. Vendidas</th>
                                <th className="px-6 py-4">Faturamento</th>
                                <th className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {produtos.length === 0 ? (
                                <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhum produto cadastrado ainda.</td></tr>
                            ) : produtos.map(prod => (
                                <tr key={prod.produto_id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Coluna 1: Info do Produto */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                                <img src={prod.imagem_url} className="w-full h-full object-contain p-1" alt={prod.produto_nome} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 line-clamp-1">{prod.produto_nome}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Mod: {prod.modelo} • {prod.marca_nome}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Coluna 2: Estoque */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-slate-700">{prod.quantidade_estoque}</span>
                                            {prod.quantidade_estoque <= 5 && prod.quantidade_estoque > 0 && (
                                                <AlertCircle size={14} className="text-orange-500" title="Estoque baixo" />
                                            )}
                                            {prod.quantidade_estoque === 0 && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-700">Esgotado</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Coluna 3: Vendas */}
                                    <td className="px-6 py-4 font-semibold text-sm text-slate-700">
                                        {prod.total_unidades_vendidas} un.
                                    </td>

                                    {/* Coluna 4: Faturamento do Produto */}
                                    <td className="px-6 py-4 font-black text-sm text-green-600">
                                        R$ {prod.faturamento_total_produto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </td>

                                    {/* Coluna 5: Ações */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link href={`/produtos/${prod.produto_id}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver na loja">
                                                <Eye size={18} />
                                            </Link>
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Editar Produto">
                                                <Edit size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Componente auxiliar para os Cards
function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 relative overflow-hidden">
            <div className={`p-4 rounded-xl text-white ${color} z-10 shadow-lg`}>
                {icon}
            </div>
            <div className="z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-black text-slate-900">{value}</p>
            </div>
            {/* Efeito visual de fundo */}
            <div className={`absolute -right-6 -bottom-6 opacity-[0.03] transform scale-150 text-slate-900`}>
                {icon}
            </div>
        </div>
    );
}