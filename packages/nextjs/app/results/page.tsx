"use client";

import Link from "next/link";
import { VoteNav } from "../components/VoteNav";
import { VoteSummary } from "../components/VoteSummary";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import styles from "../campus-vote.module.css";

export default function ResultsPage() {
  const { data: proposal } = useScaffoldReadContract({ contractName: "CampusVote", functionName: "proposal" });
  return (
    <main className={styles.shell}>
      <VoteNav />
      <header className={styles.subHero}>
        <p className={styles.eyebrow}>ПРОЗРАЧНЫЕ РЕЗУЛЬТАТЫ</p>
        <h1 className={styles.pageTitle}>Итоги голосования</h1>
        <p className={styles.lead}>{proposal || "Создать новую зону отдыха для студентов университета?"}</p>
      </header>
      <VoteSummary />
      <div className={styles.actions}>
        <Link href="/vote" className={styles.secondaryButton}>На страницу голосования</Link>
      </div>
      <p className={styles.footnote}>
        Данные читаются напрямую из смарт-контракта CampusVote. Нажмите «Обновить», чтобы загрузить актуальные числа.
      </p>
    </main>
  );
}
