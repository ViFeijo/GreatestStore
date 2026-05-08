"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";

type UsuarioLogado = {
  id: string;
  nome: string | null;
  email: string;
  role: string;
};

type LoginResponse = {
  token?: string;
  usuario?: UsuarioLogado;
  error?: string;
};

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [mostrarPopupSenha, setMostrarPopupSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function abrirPopupSenha() {
    setMostrarPopupSenha(true);

    const audio = new Audio("/faaah.mp3");
    audio.play().catch(() => {
      
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.token || !data.usuario) {
        throw new Error(data.error || "Erro ao fazer login.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.dispatchEvent(new Event("auth:login"));

      router.push("/");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao fazer login.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main
      className="relative flex items-center justify-center w-full h-[calc(100vh-theme(spacing.32))] overflow-hidden"
      style={{
        backgroundImage: "url('/login.jpeg')",
        backgroundSize: "67%",
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
          onSubmit={handleLogin}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-md px-10 py-10 w-full max-w-sm"
        >
          <div className="flex flex-col  text-[#c8933a] text-sm mb-1">
            <span>Greatest</span>
            <span>Store</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>


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
                autoComplete="current-password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
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


          <div className="flex justify-end mb-5">
            <button
              type="button"
              onClick={abrirPopupSenha}
              className="text-sm text-[#c8933a] hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          {erro && (
            <p className="mb-4 text-sm font-medium text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#7a1a2e] hover:bg-[#5e1224] disabled:cursor-not-allowed disabled:bg-[#7a1a2e]/60 text-white font-semibold rounded-lg py-2.5 transition duration-200 text-sm tracking-wide"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>


          <p className="text-center text-sm text-gray-500 mt-5">
            Não tem conta?{" "}
            <a
              href="/cadastro"
              className="text-[#7a1a2e] font-semibold hover:underline"
            >
              Cadastre-se Grátis
            </a>
          </p>
        </form>
      </div>

      {mostrarPopupSenha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#111] shadow-2xl">
            <button
              type="button"
              onClick={() => setMostrarPopupSenha(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
              aria-label="Fechar popup de recuperar senha"
            >
              <X className="h-4 w-4" />
            </button>

            <Image
              src="/recuperarasenha.jpeg"
              alt="Recuperacao de senha"
              width={1600}
              height={1200}
              className="block max-h-[70vh] w-full object-contain"
            />

            <div className="bg-white p-4">

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/cadastro";
                }}
                className="mt-4 w-full rounded-lg bg-[#7a1a2e] py-2 text-sm font-semibold text-white transition hover:bg-[#5e1224]"
              >
                eu sou um merdinha
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
