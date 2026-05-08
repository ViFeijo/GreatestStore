"use client";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "./logo.png";
export default function Header() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const termoParam = searchParams.get("termo") ?? "";
    const [searchTerm, setSearchTerm] = useState(termoParam);

    useEffect(() => {
        setSearchTerm(termoParam);
    }, [termoParam]);

    const handleSearch = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        const termo = searchTerm.trim();
        const destino = termo ? `/busca?termo=${encodeURIComponent(termo)}` : "/busca";

        router.push(destino);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.topBar}>
                <header className={styles.header}>
                    <Link href="/" className={styles.logo}>
                        <Image
                            src={logo}
                            alt="Greatest Store"
                            width={50}
                            height={50}
                            style={{ width: "auto", height: "auto" }}
                            priority
                        />
                        <span className={styles.logoGrestest}>Greatest</span>
                        <span className={styles.logoStore}>STORE</span>
                    </Link>

                    <div className={styles.cep}>
                        <span className={styles.cepIcon}>📍</span>
                        <div>
                            <div>Enviar para</div>
                            <div>Insira o CEP:</div>
                        </div>
                    </div>

                    <form className={styles.searchBar} onSubmit={handleSearch} role="search" aria-label="Buscar produtos e marcas">
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Buscar produtos, marcas e muito mais..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <button className={styles.searchButton} type="submit" aria-label="Buscar">🔍</button>
                    </form>
                    <button className={styles.anunciarButton}>Anunciar</button>

                    <div className={styles.actions}>
                        <Link href="/fav" className={styles.iconButton}>
                            <span>🤍</span>
                        </Link>
                        <Link href="/login" className={styles.iconButton}>
                            <span>👤</span>
                            <span className={styles.iconLabel}>Criar Conta</span>
                        </Link>
                    </div>
                </header>
                <Link href="/cart" className={styles.carrinhoButton}>
                    <span>🛒</span>
                    <span className={styles.carrinhoLabel}>Carrinho</span>
                </Link>
            </div>
            <div className={styles.subHeader}>
                <button className={styles.todosDepartaments}>
                    Todos Departamentos &#8595;
                </button>
            </div>
        </div>
    );
}
