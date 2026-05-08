"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function CadastroVendedor() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();


  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cnpj, setCnpj] = useState("");


  const [nomeFantasia, setNomeFantasia] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");


  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function validarStepAtual() {
    setErro("");
    if (step === 1) {
      if (!email.trim()) return setErro("Email é obrigatório."), false;
      if (!senha || senha.length < 6) return setErro("Senha precisa ter ao menos 6 caracteres."), false;
      if (!cnpj.trim()) return setErro("CNPJ é obrigatório."), false;
    }
    if (step === 2) {
      if (!nomeFantasia.trim()) return setErro("Nome fantasia é obrigatório."), false;
      if (!razaoSocial.trim()) return setErro("Razão social é obrigatória."), false;
    }
    if (step === 3) {
      if (!cep.trim()) return setErro("CEP é obrigatório."), false;
      if (!rua.trim()) return setErro("Rua é obrigatória."), false;
      if (!numero.trim()) return setErro("Número é obrigatório."), false;
      if (!bairro.trim()) return setErro("Bairro é obrigatório."), false;
      if (!cidade.trim()) return setErro("Cidade é obrigatória."), false;
      if (!estado.trim()) return setErro("Estado é obrigatório."), false;
    }
    return true;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    setSucesso("");


    const prevStep = step;
    for (let s = 1; s <= 3; s++) {
      if (s === 1) {
        if (!email.trim()) return setErro("Email é obrigatório."), setStep(1);
        if (!senha || senha.length < 6) return setErro("Senha precisa ter ao menos 6 caracteres."), setStep(1);
        if (!cnpj.trim()) return setErro("CNPJ é obrigatório."), setStep(1);
      }
      if (s === 2) {
        if (!nomeFantasia.trim()) return setErro("Nome fantasia é obrigatório."), setStep(2);
        if (!razaoSocial.trim()) return setErro("Razão social é obrigatória."), setStep(2);
      }
      if (s === 3) {
        if (!cep.trim()) return setErro("CEP é obrigatório."), setStep(3);
        if (!rua.trim()) return setErro("Rua é obrigatória."), setStep(3);
        if (!numero.trim()) return setErro("Número é obrigatório."), setStep(3);
        if (!bairro.trim()) return setErro("Bairro é obrigatório."), setStep(3);
        if (!cidade.trim()) return setErro("Cidade é obrigatória."), setStep(3);
        if (!estado.trim()) return setErro("Estado é obrigatório."), setStep(3);
      }
    }

    setStep(prevStep);

    setCarregando(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010";
      const response = await fetch(`${apiBaseUrl}/auth/registrar/vendedor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha,
          cnpj,
          nome_fantasia: nomeFantasia,
          razao_social: razaoSocial,
          foto_perfil_url: fotoPerfilUrl,
          banner_url: bannerUrl,
          endereco: {
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao criar cadastro de vendedor.");

      setSucesso("Cadastro de vendedor criado com sucesso.");

      setStep(1);
      setEmail("");
      setSenha("");
      setCnpj("");
      setNomeFantasia("");
      setRazaoSocial("");
      setFotoPerfilUrl("");
      setBannerUrl("");
      setCep("");
      setRua("");
      setNumero("");
      setComplemento("");
      setBairro("");
      setCidade("");
      setEstado("");
      router.push("/criarProduto");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar cadastro de vendedor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      className="relative flex items-center justify-center w-full h-[calc(100vh-theme(spacing.32))] overflow-hidden"
      style={{
        backgroundImage: "url('/cadastro.jpeg')",
        backgroundSize: "67%",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute left-8 md:left-16 top-10 select-none pointer-events-none z-0">
        <div className="absolute top-10 left-0">
          <h1 className="text-7xl md:text-8xl font-extrabold text-[#7a1a2e] leading-none tracking-tight">Greatest</h1>
          <p className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#c8933a] mt-1">STORE</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm ml-auto mr-16">
        <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-md px-10 py-10 w-full max-w-sm">
          <div className="flex flex-col  text-[#c893a] text-sm mb-1">
            <span>Greatest</span>
            <span>Store</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">Cadastro de Vendedor</h2>

          <p className="text-sm text-gray-600 mb-4">Passo {step} de 3</p>

          {step === 1 && (
            <div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input id="email" type="email" placeholder="username@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input id="senha" type={showPassword ? "text" : "password"} placeholder="Password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition pr-10" />
                  <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                <input id="cnpj" type="text" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="flex justify-between">
                <div />
                <button type="button" onClick={() => { if (validarStepAtual()) setStep(2); }} className="bg-[#7a1a2e] hover:bg-[#5e1224] text-white font-semibold rounded-lg py-2 px-4 transition text-sm">Próximo</button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-5">
                Já tem conta?{" "}
                <a
                  href="/login"
                  className="text-[#7a1a2e] font-semibold hover:underline"
                >
                  Entrar
                </a>
              </p>
            </div>

          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                <input id="nomeFantasia" type="text" placeholder="Nome fantasia" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                <input id="razaoSocial" type="text" placeholder="Razão social" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="fotoPerfilUrl" className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil (URL)</label>
                <input id="fotoPerfilUrl" type="url" placeholder="https://..." value={fotoPerfilUrl} onChange={(e) => setFotoPerfilUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-6">
                <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-1">Banner (URL)</label>
                <input id="bannerUrl" type="url" placeholder="https://..." value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="bg-white text-[#7a1a2e] font-semibold rounded-lg py-2 px-4 border border-gray-200 transition text-sm">Voltar</button>
                <button type="button" onClick={() => { if (validarStepAtual()) setStep(3); }} className="bg-[#7a1a2e] hover:bg-[#5e1224] text-white font-semibold rounded-lg py-2 px-4 transition text-sm">Próximo</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-4">
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input id="cep" type="text" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input id="rua" type="text" placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input id="numero" type="text" placeholder="123" value={numero} onChange={(e) => setNumero(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input id="complemento" type="text" placeholder="Opcional" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input id="bairro" type="text" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-4">
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input id="cidade" type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              <div className="mb-6">
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <input id="estado" type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} required className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition" />
              </div>

              {erro && <p className="mt-2 text-sm font-medium text-red-700">{erro}</p>}
              {sucesso && <p className="mt-2 text-sm font-medium text-green-700">{sucesso}</p>}

              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => setStep(2)} className="bg-white text-[#7a1a2e] font-semibold rounded-lg py-2 px-4 border border-gray-200 transition text-sm">Voltar</button>
                <button type="submit" disabled={carregando} className="bg-[#7a1a2e] hover:bg-[#5e1224] text-white font-semibold rounded-lg py-2 px-4 transition text-sm">{carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}</button>
              </div>
            </div>
          )}

        </form>
      </div>
    </main>
  );
}
