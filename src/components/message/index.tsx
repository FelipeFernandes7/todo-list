
interface MessageProps {
  message: string;
}
import styles from './styles.module.scss'
export function Message({ message, }: MessageProps) {
  return (
    <div className={styles.container}>
      <h1>{message}</h1>
    </div>
  );
}
