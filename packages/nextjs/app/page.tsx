"use client";

import Link from "next/link";
import { VoteNav } from "./components/VoteNav";
import { VoteSummary } from "./components/VoteSummary";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import styles from "./campus-vote.module.css";

export default function Home() {
  const { data: proposal } = useScaffoldReadContract({
    contractName: "CampusVote",
    functionName: "proposal",
  });

  return (
    <main className={styles.shell}>
      <VoteNav />
      <section className={styles.hero}>
        <p className={styles.eyebrow}>CAMPUSVOTE · ГОЛОСОВАНИЕ НА БЛОКЧЕЙНЕ</p>
        <h1>{proposal || "Создать новую зону отдыха для студентов университета?"}</h1>
        <p className={styles.lead}>
          Каждый адрес может проголосовать только один раз. Голоса записываются в смарт-контракт,
          а результат можно проверить в любое время.
        </p>
        <div className={styles.actions}>
          <Link href="/vote" className={styles.primaryButton}>Проголосовать</Link>
          <Link href="/results" className={styles.secondaryButton}>Посмотреть результаты</Link>
        </div>
      </section>
      <VoteSummary />
      <p className={styles.footnote}>
        Учебное приложение. Для работы используется тестовая локальная сеть Hardhat; настоящие деньги не нужны.
      </p>
    </main>
  );
}
