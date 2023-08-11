import Head from "next/head";
import heroImg from "../../public/assets/undraw_add_tasks_re_s5yj.svg";
import styles from "@/styles/home.module.scss";
import Image from "next/image";
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas | organize suas tarefas de forma fácil</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.heroImg}
            src={heroImg}
            alt="logo tarefas +"
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e tarefas
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+ 12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+ 90 comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}
