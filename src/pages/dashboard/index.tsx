import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { TextArea } from "@/components/textArea";

import Head from "next/head";

import styles from "./styles.module.scss";

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
