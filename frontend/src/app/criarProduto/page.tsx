"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info, BookOpen, Save, Plus, Trash2, Image as ImageIcon, Package, Tag, DollarSign, Layers } from "lucide-react";

export default function CriarProdutoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const [categorias, setCategorias] = useState<any[]>([]);
    const [subcategorias, setSubcategorias] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nome: "",
        modelo: "",
        preco: "",
        preco_promocional: "",
        quantidade: "1",
        descricao: "",
        subcategoria_id: "",
        marca_nome: "", 
        desconto_ativo: false
    });

    const [imagens, setImagens] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        async function carregarCategorias() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categorias`);
                if (res.ok) setCategorias(await res.json());
            } catch (err) {
                console.error("Erro ao carregar categorias");
            }
        }
        carregarCategorias();
    }, []);

    const handleCategoriaChange = async (catId: string) => {
        // Limpa a subcategoria atual ao trocar a categoria principal
        setFormData(prev => ({ ...prev, subcategoria_id: "" }));
        setSubcategorias([]); 

        if (!catId) return;

        try {
            // CORREÇÃO DO BUG: A rota correta do seu backend é /subcategorias/categoria/:id
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategorias/categoria/${catId}`);
            if (res.ok) setSubcategorias(await res.json());
        } catch (err) {
            console.error("Erro ao carregar subcategorias");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { name, value, type } = target;
        const newValue = type === "checkbox" ? (target as HTMLInputElement).checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImagens(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removerImagem = (index: number) => {
        setImagens(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        try {
            const payloadProduto = {
                ...formData,
                preco: parseFloat(formData.preco.replace(',', '.')),
                quantidade: parseInt(formData.quantidade, 10),
                preco_promocional: formData.desconto_ativo && formData.preco_promocional 
                    ? parseFloat(formData.preco_promocional.replace(',', '.')) 
                    : null
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify(payloadProduto)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao criar produto");

            if (imagens.length > 0) {
                const uploadPromises = imagens.map((img, index) => {
                    const imgFormData = new FormData();
                    imgFormData.append("imagem", img); 
                    imgFormData.append("ordem", index.toString());
                    imgFormData.append("is_principal", index === 0 ? "true" : "false"); 

                    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/produto/${data.id}`, {
                        method: "POST",
                        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
                        body: imgFormData
                    });
                });
                await Promise.all(uploadPromises);
            }

            router.push(`/produtos/${data.id}`);
        } catch (err: any) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl bg-gray-50/50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <Package className="text-red-600" size={32} /> 
                    Novo Produto
                </h1>
                <p className="text-sm text-gray-500 mt-1 ml-11">Preencha os detalhes para cadastrar um novo item no catálogo.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Coluna Esquerda: Fotos */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-8">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider mb-6">
                            <ImageIcon size={18} className="text-red-500" /> Galeria de Fotos
                        </h2>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                    <img src={src} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <button 
                                        type="button" 
                                        onClick={() => removerImagem(index)}
                                        className="absolute top-2 right-2 bg-white/90 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 shadow-sm hover:bg-red-600 hover:text-white transition-all transform hover:scale-105"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                            Principal
                                        </span>
                                    )}
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-red-50/50 hover:border-red-400 hover:text-red-500 transition-all text-gray-400 group">
                                <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-semibold uppercase tracking-wide">Adicionar</span>
                                <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium text-center">Formatos suportados: JPG, PNG, WEBP.</p>
                    </div>
                </div>

                {/* Coluna Central: Dados do Produto */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                        
                        {/* Título Principal */}
                        <div>
                            <input 
                                    required
                                    name="nome"
                                    value={formData.nome}
                                    placeholder="Nome do Produto (Ex: Smartphone Samsung Galaxy S23)"
                                    className="w-full text-2xl font-black text-gray-900 placeholder:text-gray-300 border-0 border-b-2 border-gray-100 focus:border-red-600 focus:ring-0 px-0 py-2 transition-colors outline-none bg-transparent"
                                    onChange={handleInputChange}
                                />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Tag size={14} className="text-gray-400" /> Marca
                                </label>
                                <input name="marca_nome" value={formData.marca_nome} placeholder="Ex: Samsung" className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 p-3 rounded-xl text-sm font-semibold text-gray-900 transition-all outline-none" onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Info size={14} className="text-gray-400" /> Modelo
                                </label>
                                <input name="modelo" value={formData.modelo} placeholder="Ex: SM-S911B" className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 p-3 rounded-xl text-sm font-semibold text-gray-900 transition-all outline-none" onChange={handleInputChange} />
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Preços e Estoque */}
                        <div className="space-y-5">
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                                <DollarSign size={18} className="text-green-500" /> Valores e Estoque
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preço Original</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                        <input required type="number" step="0.01" name="preco" value={formData.preco} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 p-3 pl-10 rounded-xl font-black text-gray-900 outline-none transition-all" placeholder="0.00" onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estoque Atual</label>
                                    <input required type="number" name="quantidade" value={formData.quantidade} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 p-3 rounded-xl font-black text-gray-900 outline-none transition-all" placeholder="1" onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <input type="checkbox" name="desconto_ativo" id="desc" checked={formData.desconto_ativo} className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer" onChange={handleInputChange} />
                                <label htmlFor="desc" className="text-sm font-bold text-gray-700 cursor-pointer select-none">Habilitar Preço Promocional</label>
                            </div>

                            {formData.desconto_ativo && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Novo Preço (Com Desconto)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 font-bold">R$</span>
                                        <input type="number" step="0.01" name="preco_promocional" value={formData.preco_promocional} className="w-full border-2 border-red-200 bg-red-50/30 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 p-4 pl-10 rounded-xl font-black text-xl text-red-700 outline-none transition-all placeholder:text-red-300" placeholder="0.00" onChange={handleInputChange} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Categorização e Publish */}
                <div className="lg:col-span-3">
                    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl shadow-gray-900/10 space-y-6 sticky top-8">
                        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                            <Layers size={18} className="text-red-500" /> Classificação
                        </h2>
                        
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Categoria Principal</label>
                                <select 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white font-semibold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer"
                                    onChange={(e) => handleCategoriaChange(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subcategoria</label>
                                <select 
                                    required
                                    name="subcategoria_id"
                                    value={formData.subcategoria_id}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white font-semibold outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={handleInputChange}
                                    disabled={subcategorias.length === 0}
                                >
                                    <option value="">{subcategorias.length === 0 ? "Escolha a categoria antes" : "Selecione..."}</option>
                                    {subcategorias.map(sub => <option key={sub.id} value={sub.id}>{sub.nome}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-800">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-red-600/20"
                            >
                                {loading ? "Processando..." : (
                                    <>
                                        <Save size={20} /> Publicar Produto
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {erro && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
                                {erro}
                            </div>
                        )}
                    </div>
                </div>

                {/* Linha Inferior: Descrição Detalhada */}
                <div className="lg:col-span-12">
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                            <BookOpen size={18} className="text-blue-500" /> Descrição Completa
                        </h2>
                        <div className="relative">
                            <textarea 
                                required
                                name="descricao"
                                value={formData.descricao}
                                rows={8}
                                placeholder="Descreva o produto com clareza. Dica: Separe características técnicas com pontos finais (.). Cada frase virará um tópico organizado na página do produto."
                                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-gray-700 text-sm leading-relaxed transition-all resize-y"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

            </form>
        </main>
    );
}