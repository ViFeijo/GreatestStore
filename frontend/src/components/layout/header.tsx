"use client";
import Link from "next/link";
import Image from "next/image";

function Header() {
    return (
        <header>
            <nav>
                <Link href="/" className="text-2xl font-bold">
                    Greatest
                    Store
                </Link>
                <ul className="flex items-center gap-6">

                    <li>
                        <Link href="/" className="hover:text-yellow-300">
                            Início
                        </Link>
                    </li>

                    <li>
                        <Link href="/products" className="hover:text-yellow-300">
                            Produtos
                        </Link>
                    </li>

                    <li>
                        <Link href="/contact" className="hover:text-yellow-300">
                            Contato
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-5">

                    <Link href="/login" className="hover:text-yellow-300">
                        Conta
                    </Link>

                </div>
            </nav>
            <div id="barra">
                <button>todos departamentos</button>
            </div>
        </header>
    );
}

export default Header;