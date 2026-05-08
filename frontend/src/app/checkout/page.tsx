"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, MapPin, PackageCheck, QrCode } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getCartItems, saveCartItems, type CartItem } from "@/lib/cart";
import type { EnderecoUsuarioApi } from "@/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [enderecos, setEnderecos] = useState<EnderecoUsuarioApi[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>("");
  const [enderecosLoading, setEnderecosLoading] = useState(true);
  const [enderecosErro, setEnderecosErro] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [payment, setPayment] = useState("pix");

  // Estados para adicionar endereço
  const [showAddModal, setShowAddModal] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    apelido: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    is_principal: false,
  });

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarEnderecos() {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = window.localStorage.getItem("token");

      if (!apiBaseUrl) {
        setEnderecosErro("API não configurada.");
        setEnderecosLoading(false);
        return;
      }

      if (!token) {
        setEnderecosErro("Faça login para carregar seus endereços.");
        setEnderecosLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/enderecos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Não foi possível carregar seus endereços.");
        }

        const data = (await response.json()) as EnderecoUsuarioApi[];
        setEnderecos(data);
        setEnderecoSelecionado(String(data.find((endereco) => endereco.is_principal)?.id ?? data[0]?.id ?? ""));
      } catch (error) {
        if (!controller.signal.aborted) {
          setEnderecosErro(error instanceof Error ? error.message : "Erro ao carregar endereços.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setEnderecosLoading(false);
        }
      }
    }

    carregarEnderecos();

    return () => controller.abort();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const shipping = items.length > 0 ? 29.9 : 0;
  const total = subtotal + shipping;

  async function handleCreateEndereco(event: FormEvent) {
    event.preventDefault();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = window.localStorage.getItem("token");

    if (!apiBaseUrl) return alert("API não configurada.");
    if (!token) return alert("Faça login para adicionar endereço.");

    try {
      const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/enderecos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoEndereco),
      });

      if (!res.ok) throw new Error();

      const created = await res.json();
      // atualiza lista localmente
      setEnderecos((prev) => [created, ...prev]);
      setEnderecoSelecionado(String(created.id));
      setShowAddModal(false);
      setNovoEndereco({ apelido: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", cep: "", is_principal: false });
    } catch (err) {
      alert("Erro ao criar endereço.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enderecoSelecionado) return alert("Selecione um endereço.");

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = window.localStorage.getItem("token");

    if (!apiBaseUrl) return alert("API não configurada.");
    if (!token) return alert("Faça login para finalizar a compra.");

    try {
      const res = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endereco_id: enderecoSelecionado, metodo_pagamento: payment }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || "Erro ao finalizar pedido.");
      }



      saveCartItems([]);
      setItems([]);
      setFinished(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao finalizar pedido.");
    }
  }

  if (finished) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-10">
        <section className="w-full rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950">Compra aprovada</h1>
          <p className="mt-2 text-sm text-slate-600">
            Pedido criado com sucesso. O caminhão saiu para entrega.
          </p>
          <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm text-slate-700">
            Código do pedido: <strong>GS-{Date.now().toString().slice(-6)}</strong>
          </div>
          <Link
            href="/busca"
            className="mt-6 inline-flex rounded-md bg-[#7a1a2e] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#5e1224]"
          >
            Comprar mais
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <PackageCheck className="h-7 w-7 text-[#7a1a2e]" />
        <h1 className="text-2xl font-bold text-slate-950">Finalizar compra</h1>
      </div>

      {items.length === 0 ? (
        <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Seu carrinho está vazio</h2>
          <p className="mt-2 text-sm text-slate-600">
            Adicione algum produto antes de finalizar.
          </p>
          <Link
            href="/busca"
            className="mt-6 inline-flex rounded-md bg-[#7a1a2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5e1224]"
          >
            Ver produtos
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#7a1a2e]" />
                  <h2 className="font-bold text-slate-950">Entrega</h2>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-[#7a1a2e] hover:bg-slate-50"
                  >
                    + Adicionar endereço
                  </button>
                </div>
              </div>

              {enderecosLoading ? (
                <p className="text-sm text-slate-600">Carregando endereços...</p>
              ) : enderecosErro ? (
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {enderecosErro}
                </div>
              ) : enderecos.length === 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Nenhum endereço cadastrado no banco para este usuário.
                </div>
              ) : (
                <div className="space-y-3">
                  {enderecos.map((endereco) => {
                    const id = String(endereco.id);
                    const selected = enderecoSelecionado === id;

                    return (
                      <label
                        key={id}
                        className={`block cursor-pointer rounded-md border p-4 transition ${selected
                            ? "border-[#7a1a2e] bg-red-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                      >
                        <input
                          type="radio"
                          name="endereco_id"
                          value={id}
                          checked={selected}
                          onChange={(event) => setEnderecoSelecionado(event.target.value)}
                          className="sr-only"
                          required
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-950">
                              {endereco.apelido || "Endereço"}
                              {endereco.is_principal && (
                                <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                  Principal
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {endereco.rua}, {endereco.numero}
                              {endereco.complemento ? ` - ${endereco.complemento}` : ""}
                            </p>
                            <p className="text-sm text-slate-600">
                              {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                            </p>
                            <p className="text-sm font-semibold text-slate-700">
                              CEP {endereco.cep}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}



            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#7a1a2e]" />
                <h2 className="font-bold text-slate-950">Pagamento hiper blaster ultra mega real</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "pix", label: "Pix", icon: QrCode }
                ].map((option) => {
                  const Icon = option.icon;
                  const selected = payment === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm font-bold transition ${selected
                          ? "border-[#7a1a2e] bg-red-50 text-[#7a1a2e]"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={selected}
                        onChange={(event) => setPayment(event.target.value)}
                        className="sr-only"
                      />
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </label>
                  );
                })}
              </div>

              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Observação
                <textarea
                  defaultValue="Pode entregar no horário comercial."
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 font-normal text-slate-950 outline-none focus:border-[#7a1a2e]"
                />
              </label>
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Resumo do pedido</h2>

            <div className="mt-4 max-h-64 space-y-3 overflow-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded bg-slate-50 object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-500">Qtd. {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-950">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Frete</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!enderecoSelecionado}
              className="mt-6 w-full rounded-md bg-[#7a1a2e] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5e1224]"
            >
              Finalizar compra
            </button>
          </aside>
        </form>
      )}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-950">Adicionar endereço</h2>
                <p className="mt-1 text-sm text-gray-600">Preencha os dados abaixo.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEndereco} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Apelido (Ex: Casa)"
                value={novoEndereco.apelido}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, apelido: e.target.value }))}
                className="col-span-2 rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="Rua"
                value={novoEndereco.rua}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, rua: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="Número"
                value={novoEndereco.numero}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, numero: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                placeholder="Complemento"
                value={novoEndereco.complemento}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, complemento: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="Bairro"
                value={novoEndereco.bairro}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, bairro: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="Cidade"
                value={novoEndereco.cidade}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, cidade: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="Estado"
                value={novoEndereco.estado}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, estado: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />
              <input
                required
                placeholder="CEP"
                value={novoEndereco.cep}
                onChange={(e) => setNovoEndereco((s) => ({ ...s, cep: e.target.value }))}
                className="rounded-md border border-slate-300 px-3 py-2 outline-none"
              />

              <label className="col-span-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(novoEndereco.is_principal)}
                  onChange={(e) => setNovoEndereco((s) => ({ ...s, is_principal: e.target.checked }))}
                />
                Tornar este o endereço principal
              </label>

              <div className="col-span-2 mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#7a1a2e] px-4 py-2 text-sm font-bold text-white"
                  onClick={handleCreateEndereco}
                >
                  Salvar endereço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
