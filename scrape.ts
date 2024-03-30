import { writeFileSync, readFileSync } from "fs";
import he from "he";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.OTDBTOKEN;

type Result = {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type FetchResult = {
  response_code: number;
  results: Result[];
};

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchResults = async (
  amount?: number,
  token?: string,
): Promise<FetchResult> => {
  amount = amount ? amount : 10;
  let url = `https://opentdb.com/api.php?amount=${amount}`;
  if (token) {
    url = `https://opentdb.com/api.php?amount=${amount}&token=${token}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const readMap = (): { [question: string]: boolean } => {
  const results: Result[] = JSON.parse(readFileSync("questions.json", "utf8"));
  const map: Record<string, boolean> = {};
  for (const result of results) {
    map[result.question] = true;
  }
  return map;
};

const write = (results: Result[], filter: { [question: string]: boolean }) => {
  const old_results: Result[] = JSON.parse(
    readFileSync("questions.json", "utf8"),
  );
  for (const result of results) {
    const res: Record<string, string | string[]> = { ...result };
    for (const key of Object.keys(result)) {
      if (typeof res[key] == "string") {
        res[key] = he.decode(res[key] as string);
      } else {
        const temp = res[key] as string[];
        res[key] = temp.map((x) => he.decode(x));
      }
    }
    if (!(result["question"] in filter)) old_results.push(res as Result);
  }
  writeFileSync("questions.json", JSON.stringify(old_results, undefined, 4));
};

const fetchPersistent = async (token: string | undefined) => {
  console.log(`reading using token ${token}`);
  let fetchAmount = 50;
  let next_announce = 500;
  let numkeys = 0;
  let map = readMap();
  while (true) {
    const res = await fetchResults(fetchAmount, token);
    if (res.response_code == 0) {
      write(res["results"], map);
      map = readMap();
    } else if (res.response_code == 4) {
      if (fetchAmount == 0) {
        console.log(`Fetching done. Terminating at ${numkeys} questions`);
        return;
      }
      console.log(
        `decreasing fetch amount from ${fetchAmount} to ${Math.floor(fetchAmount / 2)}`,
      );
      fetchAmount = Math.floor(fetchAmount / 2);
    } else {
      console.log(`unknown response code: ${res.response_code}`);
    }
    numkeys = Object.keys(map).length;
    if (numkeys >= next_announce) {
      console.log(`reached ${numkeys} questions`);
      next_announce += 500;
    }
    await delay(5100);
  }
};

// console.log(token);
// fetchPersistent(undefined);
fetchPersistent(token as string);
