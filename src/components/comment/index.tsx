import { ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import { FaTrash } from "react-icons/fa";
interface CommentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  comment: string;
  userName: string;
  isButtonVisible: boolean;
}
export function Comment({
  comment,
  userName,
  isButtonVisible,
  ...rest
}: CommentProps) {
  return (
    <article className={styles.comment}>
      <div className={styles.headComment}>
        <label className={styles.commentLabel}>{userName}</label>
        <button
          onClick={rest.onClick}
          style={{ display: !isButtonVisible ? "none" : "block" }}
          className={styles.buttonTrash}
        >
          <FaTrash size={18} color={"#ea3140"} />
        </button>
      </div>
      <p>{comment}</p>
    </article>
  );
}
