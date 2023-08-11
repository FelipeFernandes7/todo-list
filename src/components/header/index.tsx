import { useSession, signIn, signOut } from "next-auth/react";

import Link from "next/link";
import styles from "./styles.module.scss";
export function Header() {
  const { data: session, status } = useSession();
  
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={"/"}>
            <h1 className={styles.logo}>
              Web<span>Tasks</span>
            </h1>
          </Link>
          {session?.user && (
            <Link className={styles.links} href={"/dashboard"}>
              Meu Painel
            </Link>
          )}
        </nav>
        {status === "loading" ? (
          <></>
        ) : session ? (
          <button onClick={() => signOut()} className={styles.loginButton}>
            LogOut
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className={styles.loginButton}
          >
            Login
          </button>
        )}
      </section>
    </header>
  );
}
