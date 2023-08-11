import Link from "next/link";
import styles from "./styles.module.scss";
export function Header() {
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={"/"}>
            <h1 className={styles.logo}>
              Tarefas <span>+</span>
            </h1>
          </Link>
          <Link className={styles.links} href={"/dashboard"}>
            Meu Painel
          </Link>
        </nav>
        <button className={styles.loginButton}>Acessar</button>
      </section>
    </header>
  );
}
