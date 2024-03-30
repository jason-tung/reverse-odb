import { Result } from "./types";
import styles from "./card.module.css";

const typeToColor = (type: string) => {
  if (type == "multiple") {
    return styles.multi;
  } else {
    return styles.bool;
  }
};

const diffToColor = (type: string) => {
  if (type == "easy") {
    return { backgroundColor: "#ff375f" };
  } else if (type == "medium") {
    return { backgroundColor: "#FBBE1F" };
  } else {
    return { backgroundColor: "#00B8A2" };
  }
};

export default ({ result }: { result: Result }) => {
  let { type, difficulty, category, question, correct_answer } = { ...result };
  return (
    <div className={styles.card}>
      <div className={styles.question}>{question}</div>
      <div className={styles.answer}>{correct_answer}</div>
      <div className={styles.tags}>
        <div className={typeToColor(type)}>{type}</div>
        <div style={diffToColor(difficulty)}>{difficulty}</div>
        <div style={{ backgroundColor: "#5C946E" }}>{category}</div>
      </div>
    </div>
  );
};
