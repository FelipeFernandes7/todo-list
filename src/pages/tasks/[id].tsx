import { useSession } from "next-auth/react";
import Head from "next/head";

import { GetServerSideProps } from "next";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

import styles from "./styles.module.scss";
import { TextArea } from "@/components/textArea";
import { ChangeEvent, FormEvent, useState } from "react";
import { Comment } from "@/components/comment";
import { Message } from "@/components/message";

interface TaskProps {
  item: {
    taskId: string;
    tasks: string;
    public: boolean;
    created: string;
    user: string;
  };
  allComments: CommentProps[];
}
export default function Tasks({ item, allComments }: TaskProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComments || []);

  async function handleComment(e: FormEvent) {
    e.preventDefault();
    if (!session?.user?.email || !session?.user?.name) return;
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created_at: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item.taskId,
      });
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };
      setComments((oldState) => [...oldState, data]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      const deletedComment = comments.filter((item) => item.id !== id);
      setComments(deletedComment);
      alert("Comentário deletado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item?.tasks}</p>
        </article>
      </main>
      {session?.user && (
        <section className={styles.commentsContainer}>
          <h2>Fazer Comentário</h2>
          <form onSubmit={handleComment}>
            <TextArea
              value={input}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
              placeholder="Digite aqui"
            />
            <button
              disabled={!session?.user || !input}
              className={styles.button}
              type="submit"
            >
              Enviar Comentário
            </button>
          </form>
        </section>
      )}
      {!session?.user && (
        <Message message={"Faça Login com o Google para poder comentar :)"} />
      )}

      <section className={styles.commentContainer}>
        <h2>Todos os Comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum Comentário foi encontrado...</span>
        )}
        {comments.length > 0 &&
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment.comment}
              userName={comment.name}
              isButtonVisible={comment.user === session?.user?.email}
              onClick={() => handleDeleteComment(comment.id)}
            />
          ))}
      </section>
    </div>
  );
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tasks", id);
  const q = query(collection(db, "comments"), where("taskId", "==", id));

  const docSnap = await getDoc(docRef);
  const snapshotComments = await getDocs(q);

  let allComments = [] as CommentProps[];

  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      taskId: doc.data().taskId,
      user: doc.data().user,
      name: doc.data().name,
    });
  });

  if (docSnap.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!docSnap.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliSeconds = docSnap.data()?.created?.seconds * 1000;

  const task = {
    taskId: id,
    tasks: docSnap.data()?.tasks,
    public: docSnap.data()?.public,
    created: new Date(miliSeconds).toLocaleDateString(),
    user: docSnap.data()?.user,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};
