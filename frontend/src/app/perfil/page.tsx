"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Usuario = {
  id: string;
  nome: string | null;
  email: string;
  cpf?: string;
  role: string;
};

type Endereco = {
  id?: string;
  apelido: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
};

type ApiError = {
  error?: string;
};

const enderecoInicial: Endereco = {
  apelido: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
};

function mascararCpf(cpf?: string) {
  if (!cpf) return "Nao informado";

  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return "***.***.***-**";

  return `${numeros.slice(0, 3)}.***.***-${numeros.slice(9)}`;
}

export default function Perfil() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState<Endereco>(enderecoInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregarPerfil() {
      const tokenSalvo = localStorage.getItem("token");

      if (!tokenSalvo) {
        router.push("/login");
        return;
      }

      setToken(tokenSalvo);

      try {
        const [perfilResponse, enderecosResponse] = await Promise.all([
          fetch("http://localhost:3010/usuarios/perfil", {
            headers: {
              Authorization: `Bearer ${tokenSalvo}`,
            },
          }),
          fetch("http://localhost:3010/enderecos", {
            headers: {
              Authorization: `Bearer ${tokenSalvo}`,
            },
          }),
        ]);

        const perfilData = (await perfilResponse.json()) as Usuario & ApiError;

        if (!perfilResponse.ok) {
          throw new Error(perfilData.error || "Erro ao carregar perfil.");
        }

        const enderecosData = (await enderecosResponse.json()) as Endereco[] & ApiError;

        if (!enderecosResponse.ok) {
          throw new Error(enderecosData.error || "Erro ao carregar endereco.");
        }

        setUsuario(perfilData);
        setNome(perfilData.nome || "");
        setEmail(perfilData.email);
        localStorage.setItem("usuario", JSON.stringify({
          id: perfilData.id,
          nome: perfilData.nome,
          email: perfilData.email,
          role: perfilData.role,
        }));

        if (Array.isArray(enderecosData) && enderecosData.length > 0) {
          setEndereco({
            ...enderecoInicial,
            ...enderecosData[0],
          });
        }
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [router]);

  function atualizarEndereco(campo: keyof Endereco, valor: string) {
    setEndereco((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function salvarDados(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const perfilResponse = await fetch("http://localhost:3010/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          email,
        }),
      });

      const perfilData = (await perfilResponse.json()) as Usuario & ApiError;

      if (!perfilResponse.ok) {
        throw new Error(perfilData.error || "Erro ao salvar perfil.");
      }

      const enderecoUrl = endereco.id
        ? `http://localhost:3010/enderecos/${endereco.id}`
        : "http://localhost:3010/enderecos";

      const enderecoResponse = await fetch(enderecoUrl, {
        method: endereco.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          apelido: endereco.apelido,
          cep: endereco.cep,
          rua: endereco.rua,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          estado: endereco.estado,
        }),
      });

      const enderecoData = (await enderecoResponse.json()) as Endereco & ApiError;

      if (!enderecoResponse.ok) {
        throw new Error(enderecoData.error || "Erro ao salvar endereco.");
      }

      setUsuario(perfilData);
      setEndereco({
        ...enderecoInicial,
        ...enderecoData,
      });
      localStorage.setItem("usuario", JSON.stringify({
        id: perfilData.id,
        nome: perfilData.nome,
        email: perfilData.email,
        role: perfilData.role,
      }));
      window.dispatchEvent(new Event("auth:login"));
      window.dispatchEvent(new Event("auth:endereco"));
      setSucesso("Dados confirmados com sucesso.");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar dados.");
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.dispatchEvent(new Event("auth:login"));
    window.dispatchEvent(new Event("auth:endereco"));
    router.push("/login");
  }

  if (carregando) {
    return (
      <main className="min-h-[calc(100vh-theme(spacing.32))] bg-[#f7f1ed] px-6 py-10">
        <div className="mx-auto max-w-5xl text-sm font-medium text-[#7a1a2e]">
          Carregando seus dados...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-theme(spacing.32))] bg-[#f7f1ed] px-6 py-10">
      <form
        onSubmit={salvarDados}
        className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]"
      >
        <section className="rounded-lg border border-[#ead8cc] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#c8933a]">Greatest Store</p>
          <h1 className="mt-2 text-3xl font-bold text-[#7a1a2e]">Meus dados</h1>

          <div className="mt-6 space-y-4 text-sm text-gray-700">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Nome</p>
              <p className="mt-1 font-medium text-gray-900">{usuario?.nome || "Nao informado"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Email</p>
              <p className="mt-1 break-words font-medium text-gray-900">{usuario?.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">CPF</p>
              <p className="mt-1 font-medium text-gray-900">{mascararCpf(usuario?.cpf)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={sair}
            className="mt-8 w-full rounded-lg border border-[#7a1a2e] px-4 py-2 text-sm font-semibold text-[#7a1a2e] transition hover:bg-[#7a1a2e] hover:text-white"
          >
            Sair da conta
          </button>
        </section>

        <section className="rounded-lg border border-[#ead8cc] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Confirmar dados</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-gray-700">
              Nome completo
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Apelido do endereco
              <input
                type="text"
                value={endereco.apelido}
                onChange={(event) => atualizarEndereco("apelido", event.target.value)}
                placeholder="Casa, trabalho..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              CEP
              <input
                type="text"
                value={endereco.cep}
                onChange={(event) => atualizarEndereco("cep", event.target.value)}
                placeholder="00000-000"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700 md:col-span-2">
              Rua
              <input
                type="text"
                value={endereco.rua}
                onChange={(event) => atualizarEndereco("rua", event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Numero
              <input
                type="text"
                value={endereco.numero}
                onChange={(event) => atualizarEndereco("numero", event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Complemento
              <input
                type="text"
                value={endereco.complemento}
                onChange={(event) => atualizarEndereco("complemento", event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Bairro
              <input
                type="text"
                value={endereco.bairro}
                onChange={(event) => atualizarEndereco("bairro", event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Cidade
              <input
                type="text"
                value={endereco.cidade}
                onChange={(event) => atualizarEndereco("cidade", event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>

            <label className="block text-sm font-medium text-gray-700">
              Estado
              <input
                type="text"
                value={endereco.estado}
                onChange={(event) => atualizarEndereco("estado", event.target.value)}
                maxLength={2}
                placeholder="SP"
                className="mt-1 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm uppercase text-gray-700 outline-none transition focus:ring-2 focus:ring-[#7a1a2e]"
              />
            </label>
          </div>

          {erro && (
            <p className="mt-5 text-sm font-medium text-red-700">{erro}</p>
          )}

          {sucesso && (
            <p className="mt-5 text-sm font-medium text-green-700">{sucesso}</p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="mt-6 w-full rounded-lg bg-[#7a1a2e] py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1224] disabled:cursor-not-allowed disabled:bg-[#7a1a2e]/60"
          >
            {salvando ? "Salvando..." : "Confirmar dados"}
          </button>
        </section>
      </form>
    </main>
  );
}
