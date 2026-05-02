import { BookOpen } from "lucide-react";

export function DescricaoProduto({ description }: { description: string }) {
  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <BookOpen size={24} />
        <h2 className="text-2xl font-bold">Descrição Do Produto</h2>
      </div>
      <div className="text-gray-700 space-y-4">
        <p>{description}</p>
      </div>
    </section>
  );
}