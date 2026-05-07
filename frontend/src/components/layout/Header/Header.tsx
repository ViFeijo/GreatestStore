"use client";
import styles from './Header.module.css';
import Link from "next/link";
import Image from "next/image";
import logo from "./logo.png";
export default function Header() {
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

                    <div className={styles.searchBar}>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Buscar produtos, marcas e muito mais..."
                        />
                        <button className={styles.searchButton}>🔍</button>
                    </div>
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
