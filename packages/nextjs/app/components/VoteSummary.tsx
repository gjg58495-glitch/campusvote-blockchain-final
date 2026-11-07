"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import styles from "../campus-vote.module.css";

export function VoteSummary() {
  const { data: totals, isLoading, refetch } = useScaffoldReadContract({
    contractName: "CampusVote",
    functionName: "getTotals",
  });

  const yes = totals?.[0] ?? 0n;
  const no = totals?.[1] ?? 0n;
  const total = yes + no;
  const percent = total > 0n ? Number((yes * 100n) / total) : 0;
  const noPercent = total > 0n ? 100 - percent : 0;

  return (
    <section className={styles.panel} aria-label="Итоги голосования">
      <div className={styles.sectionTop}>
        <div>
          <p className={styles.eyebrow}>ТЕКУЩИЕ РЕЗУЛЬТАТЫ</p>
          <h2 className={styles.heading}>Как голосуют студенты</h2>
        </div>
        <button type="button" onClick={() => void refetch()} className={styles.ghostButton}>
          Обновить
        </button>
      </div>
      <div className={styles.statGrid}>
        <div className={styles.stat}><span>За</span><strong>{yes.toString()}</strong></div>
        <div className={styles.stat}><span>Против</span><strong>{no.toString()}</strong></div>
        <div className={styles.stat}><span>Всего голосов</span><strong>{total.toString()}</strong></div>
      </div>
      <div className={styles.barTrack} role="img" aria-label={`За: ${percent}%`}>
        <div className={styles.barYes} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.legend}><span>За — {percent}%</span><span>Против — {noPercent}%</span></div>
      {isLoading && <p className={styles.hint}>Чтение данных из блокчейна...</p>}
      {!isLoading && totals === undefined && (
        <p className={styles.hint}>Данные пока недоступны. Проверьте, что запущены yarn chain и yarn deploy.</p>
      )}
    </section>
  );
}
