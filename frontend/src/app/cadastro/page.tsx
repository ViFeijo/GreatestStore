"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (email.trim().toLowerCase() !== confirmarEmail.trim().toLowerCase()) {
      setErro("Meu Deus cara tu ta vendo o email e ainda consegue errar.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas são diferentes, para de ser burro.");
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch("http://localhost:3001/auth/registrar/cliente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar cadastro.");
      }

      setSucesso("Cadastro criado com sucesso.");
      setNome("");
      setCpf("");
      setEmail("");
      setConfirmarEmail("");
      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      className="relative flex items-center justify-center w-full h-[calc(100vh-theme(spacing.32))] overflow-hidden"
      style={{
        backgroundImage: "url('/cadastro.jpeg')",
        backgroundSize: "67%", // eu falo six ela fa seven
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute left-8 md:left-16 top-10 select-none pointer-events-none z-0">
        <div className="absolute top-10 left-0">
          <h1 className="text-7xl md:text-8xl font-extrabold text-[#7a1a2e] leading-none tracking-tight">
            Greatest
          </h1>
          <p className="text-5xl md:text-6xl font-light tracking-[0.3em] text-[#c8933a] mt-1">
            STORE
          </p>
        </div>

      </div>


      <div className="relative z-10 w-full max-w-sm ml-auto mr-16">
        <form
          onSubmit={handleCadastro}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-md px-10 py-10 w-full max-w-sm"
        >
          <div className="flex flex-col  text-[#c8933a] text-sm mb-1">
            <span>Greatest</span>
            <span>Store</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Cadastro</h2>

          <div className="mb-4">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Nome completo"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              autoComplete="off"
              value={cpf}
              onChange={(event) => setCpf(event.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="username@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmar-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Email
            </label>
            <input
              id="confirmar-email"
              type="email"
              placeholder="username@gmail.com"
              autoComplete="email"
              value={confirmarEmail}
              onChange={(event) => setConfirmarEmail(event.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label
              htmlFor="confirmar-senha"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                id="confirmar-senha"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a1a2e] focus:border-transparent transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {erro && (
            <p className="mt-4 text-sm font-medium text-red-700">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="mt-4 text-sm font-medium text-green-700">
              {sucesso}
            </p>
          )}


          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#7a1a2e] hover:bg-[#5e1224] text-white font-semibold rounded-lg py-2.5 transition duration-200 text-sm tracking-wide"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>


          <p className="text-center text-sm text-gray-500 mt-5">
            Já tem conta?{" "}
            <a
              href="/login"
              className="text-[#7a1a2e] font-semibold hover:underline"
            >
              Entrar
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
