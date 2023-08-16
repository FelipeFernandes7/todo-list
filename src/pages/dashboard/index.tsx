import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { TextArea } from "@/components/textArea";

import Head from "next/head";

import styles from "./styles.module.scss";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { db } from "@/services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

interface DashboardProps {
  user: {
    email: string;
    name: string;
  };
}

interface TasksProps {
  id: string;
  created: Date;
  tasks: string;
  public: boolean;
  user: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(e: FormEvent) {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tasks"), {
        tasks: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });
      setInput("");
      setPublicTask(false);
      alert("tarefa cadastrada com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "tasks");
      const q = query(
        tasksRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );
      onSnapshot(q, (snapshot) => {
        let lists = [] as TasksProps[];
        snapshot.forEach((doc) => {
          lists.push({
            id: doc.id,
            created: doc.data().created.toDate(),
            tasks: doc.data().tasks,
            public: doc.data().public,
            user: doc.data().user,
          });
          setTasks(lists);
        });
      });
    }
    loadTasks();
  }, [user?.email]);

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/tasks/${id}`
    );
    alert("Url copiada para área de transferência");
  }
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);
    await deleteDoc(docRef);
    alert("Tarefa deletada com sucesso!");
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Digite sua tarefa"
              />
              <div className={styles.checkboxArea}>
                <input
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                  type="checkbox"
                  name=""
                  id=""
                />
                <label htmlFor="">Deixar tarefa pública</label>
              </div>
              <button
                disabled={!input ? true : false}
                className={styles.button}
                type="submit"
              >
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tasks.length > 0 &&
            tasks.map((task) => (
              <article key={task.id} className={styles.task}>
                {task.public && (
                  <div className={styles.tagContainer}>
                    <label className={styles.tag}>Pública</label>
                    <button
                      className={styles.shareButton}
                      onClick={() => handleShare(task.id)}
                    >
                      <FiShare2 size={22} color={"#3183ff"} />
                    </button>
                  </div>
                )}

                <div className={styles.taskContent}>
                  {task.public && (
                    <Link href={`/tasks/${task.id}`}>
                      <p>{task.tasks}</p>
                    </Link>
                  )}
                  {!task.public && <p>{task.tasks}</p>}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={styles.buttonTrash}
                  >
                    <FaTrash size={22} color={"#ea3140"} />
                  </button>
                </div>
              </article>
            ))}
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
    props: {
      user: {
        email: session.user.email,
        name: session.user.name,
      },
    },
  };
};
