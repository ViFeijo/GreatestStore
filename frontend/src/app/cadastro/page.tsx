"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function CadastroMain() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main
      className="relative flex items-center justify-center w-full h-[calc(100vh-theme(spacing.32))] overflow-hidden"
      style={{
        backgroundImage: "url('/cadastro.jpeg')",
        backgroundSize: "70%",
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
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-md px-10 py-10 w-full max-w-sm">
          <div className="flex flex-col  text-[#c8933a] text-sm mb-1">
            <span>Greatest</span>
            <span>Store</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Cadastro</h2>


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
            <a
              href="/esqueci-senha"
              className="text-sm text-[#c8933a] hover:underline"
            >
              Esqueceu a senha?
            </a>
          </div>


          <button
            type="button"
            className="w-full bg-[#7a1a2e] hover:bg-[#5e1224] text-white font-semibold rounded-lg py-2.5 transition duration-200 text-sm tracking-wide"
          >
            Entrar
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
        </div>
      </div>
    </main>
  );
}