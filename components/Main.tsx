"use client";

import { Result } from "./types";
import Card from "./Card";
import React from "react";
import styles from "./main.module.css";

export default ({ file }: { file: string }) => {
  const [inputValue, setInputValue] = React.useState("");

  const data = JSON.parse(file) as Result[];
  const [dataVal, setDataVal] = React.useState(data.slice(0, 50));

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value == "") {
      setDataVal(data.slice(0, 50));
    } else {
      const temp = data
        .filter((result) =>
          result.question.toLowerCase().includes(e.target.value.toLowerCase()),
        )
        .slice(0, 50);
      setDataVal(temp);
    }
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={inputValue}
        onChange={changeHandler}
      />
      <main className={styles.main}>
        {dataVal.map((result) => (
          <Card result={result} />
        ))}
      </main>
    </div>
  );
};
