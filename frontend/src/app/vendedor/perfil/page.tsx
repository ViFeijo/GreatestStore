"use client";

import { useEffect, useState, useRef } from "react";
import { Store, Save, UploadCloud, Building2, UserCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PerfilVendedor() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
    
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const [perfil, setPerfil] = useState({
        nome_fantasia: "",
        razao_social: "",
        cnpj: "",
        foto_perfil_url: "",
        banner_url: "",
    });

    useEffect(() => {
        async function fetchPerfil() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendedores/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setPerfil({
                        nome_fantasia: data.nome_fantasia || "",
                        razao_social: data.razao_social || "",
                        cnpj: data.cnpj || "",
                        foto_perfil_url: data.foto_perfil_url || "",
                        banner_url: data.banner_url || "",
                    });
                } else {
                    throw new Error("Não foi possível carregar o perfil.");
                }
            } catch (err: any) {
                setMensagem({ tipo: "erro", texto: err.message });
            } finally {
                setLoading(false);
            }
        }
        fetchPerfil();
    }, [router]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'perfil' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limpa o valor para permitir subir o mesmo arquivo se o usuário errar
        e.target.value = "";

        const formData = new FormData();
        formData.append(tipo === 'perfil' ? 'foto' : 'banner', file);

        setMensagem({ tipo: "info", texto: `Enviando ${tipo}...` });

        try {
            const token = localStorage.getItem("token");
            const endpoint = tipo === 'perfil' 
                ? `${process.env.NEXT_PUBLIC_API_URL}/upload/vendedor/perfil` 
                : `${process.env.NEXT_PUBLIC_API_URL}/upload/vendedor/banner`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (tipo === 'perfil') setPerfil(prev => ({ ...prev, foto_perfil_url: data.url }));
                else setPerfil(prev => ({ ...prev, banner_url: data.url }));
                setMensagem({ tipo: "sucesso", texto: "Imagem carregada com sucesso!" });
            }
        } catch (err) {
            setMensagem({ tipo: "erro", texto: "Falha ao subir imagem." });
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendedores/perfil`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    nome_fantasia: perfil.nome_fantasia,
                    razao_social: perfil.razao_social,
                    foto_perfil_url: perfil.foto_perfil_url,
                    banner_url: perfil.banner_url
                })
            });

            if (!res.ok) throw new Error("Erro ao salvar as informações.");
            
            setMensagem({ tipo: "sucesso", texto: "Perfil da loja atualizado com sucesso!" });
            setTimeout(() => setMensagem({ tipo: "", texto: "" }), 3000);
        } catch (err: any) {
            setMensagem({ tipo: "erro", texto: err.message });
        } finally {
            setSalvando(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 bg-slate-50">Carregando Perfil...</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-white border-b border-slate-200 px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Store className="text-red-600" size={32}/> Identidade da Loja
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Configure sua marca no marketplace.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8 px-4">
                {mensagem.texto && (
                    <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 ${
                        mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700 border border-green-200' :
                        mensagem.tipo === 'erro' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                        {mensagem.tipo === 'sucesso' && <CheckCircle2 size={20} />}
                        {mensagem.texto}
                    </div>
                )}

                <form onSubmit={handleSalvar} className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
                        <div className="h-64 bg-slate-200 relative group flex items-center justify-center">
                            {perfil.banner_url ? (
                                <img src={perfil.banner_url} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-sm">Sem Banner</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button type="button" onClick={() => bannerInputRef.current?.click()} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                    <UploadCloud size={18} /> Alterar Banner
                                </button>
                                <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleUpload(e, 'banner')} />
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-8">
                            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg relative group">
                                <div className="w-full h-full rounded-full bg-slate-100 border-2 border-slate-100 overflow-hidden flex items-center justify-center">
                                    {perfil.foto_perfil_url ? (
                                        <img src={perfil.foto_perfil_url} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={40} className="text-slate-300" />
                                    )}
                                </div>
                                <button type="button" onClick={() => logoInputRef.current?.click()} className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <UploadCloud size={16} />
                                </button>
                                <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => handleUpload(e, 'perfil')} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Building2 size={24} className="text-slate-400" /> Dados da Loja
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Nome Fantasia</label>
                                <input type="text" required value={perfil.nome_fantasia} onChange={(e) => setPerfil({...perfil, nome_fantasia: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Razão Social</label>
                                <input type="text" required value={perfil.razao_social} onChange={(e) => setPerfil({...perfil, razao_social: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-bold text-slate-700">CNPJ</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 font-medium">
                                    <UserCircle size={18} /> {perfil.cnpj}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={salvando} className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all disabled:opacity-50">
                            {salvando ? 'Salvando...' : 'Salvar Configurações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}