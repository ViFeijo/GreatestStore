import { Suspense } from "react";
import { BuscaConteudo } from "./busca-content";

export default function BuscaPage() {
    return (
        <Suspense fallback={
            <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 pb-12 pt-4 min-h-screen items-start bg-slate-50">
                <div className="w-full md:w-72 shrink-0 h-96 bg-slate-200 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-4">
                    <div className="h-12 bg-slate-200 rounded-xl animate-pulse" />
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-slate-200 w-full h-[350px] rounded-xl" />)}
                    </div>
                </div>
            </main>
        }>
            <BuscaConteudo />
        </Suspense>
    );
}