"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
	const router = useRouter();
	const [nome, setNome] = useState("");


	useEffect(() => {
		// placeholder: you can load user profile here
	}, []);

	return (
		<main className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-2">Perfil</h1>
			<p className="text-sm text-gray-500">Gerencie suas informações de perfil aqui.</p>
		</main>
	);
}
