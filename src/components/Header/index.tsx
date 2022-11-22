import styles from "./styles.module.scss";
import Link from "next/link";


export function Header(){
    return(
        <div className={styles.container}>
            <div>
            <h1>Blog</h1>
            </div>

            <nav className={styles.nav}>
                <Link href="/">
                    Home
                </Link>
                <Link href="/posts">
                    Posts
                </Link>
                <Link href="/sobre">
                    Sobre
                </Link>
            </nav>
        </div>
    )
}