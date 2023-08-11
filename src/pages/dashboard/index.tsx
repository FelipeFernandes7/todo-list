import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { TextArea } from "@/components/textArea";

import Head from "next/head";

import styles from "./styles.module.scss";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form>
              <TextArea placeholder="Digite sua tarefa" />
              <div className={styles.checkboxArea}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  name=""
                  id=""
                />
                <label htmlFor="">Deixar tarefa pública</label>
              </div>
              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PÚBLICO</label>
              <button className={styles.shareButton}>
                <FiShare2 size={22} color={"#3183ff"} />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>exemplo show de mais</p>
              <button className={styles.buttonTrash}>
                <FaTrash size={22} color={"#ea3140"} />
              </button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
