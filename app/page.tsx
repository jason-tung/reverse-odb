import styles from "./page.module.css";
import React from "react";
import Main from "@/components/Main";
import { promises } from "fs";

export default async () => {
  const file = await promises.readFile(
    process.cwd() + "/questions.json",
    "utf8",
  );
  return (
    <main>
      <Main file={file}></Main>
    </main>
  );
};
