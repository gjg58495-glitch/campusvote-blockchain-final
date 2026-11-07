"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { VoteNav } from "../components/VoteNav";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import styles from "../campus-vote.module.css";

type TxState = "idle" | "pending" | "success" | "error";

function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/reject|denied|отклони/i.test(message)) return "Подпись транзакции отменена в кошельке.";
  if (/Повторное голосование запрещено|Already voted/i.test(message)) return "С этого адреса уже был отправлен голос.";
  if (/insufficient funds/i.test(message)) return "Недостаточно тестового ETH для оплаты газа.";
  return "Ошибка транзакции. Проверьте сеть и попробуйте ещё раз.";
}

export default function VotePage() {
  const { address, isConnected } = useAccount();
  const [state, setState] = useState<TxState>("idle");
  const [message, setMessage] = useState("");
  const { data: proposal } = useScaffoldReadContract({ contractName: "CampusVote", functionName: "proposal" });
  const { data: alreadyVoted, refetch: refreshVoted } = useScaffoldReadContract({
    contractName: "CampusVote",
    functionName: "didVote",
    args: [address ?? zeroAddress],
  });
  const { refetch: refreshTotals } = useScaffoldReadContract({
    contractName: "CampusVote",
    functionName: "getTotals",
  });
  const { writeContractAsync, isPending } = useScaffoldWriteContract({ contractName: "CampusVote" });

  useEffect(() => {
    setState("idle");
    setMessage("");
  }, [address]);

  const isBlocked = !isConnected || Boolean(alreadyVoted) || isPending || state === "pending" || state === "success";

  async function submitVote(choice: boolean) {
    if (isBlocked) return;
    setState("pending");
    setMessage("Подтвердите действие в MetaMask. Ожидаем подтверждение в сети...");
    try {
      await writeContractAsync({ functionName: "castVote", args: [choice] });
      await Promise.all([refreshVoted(), refreshTotals()]);
      setState("success");
      setMessage(choice ? "Голос «За» записан в блокчейн." : "Голос «Против» записан в блокчейн.");
    } catch (error) {
      setState("error");
      setMessage(readableError(error));
    }
  }

  return (
    <main className={styles.shell}>
      <VoteNav />
      <section className={styles.panel}>
        <p className={styles.eyebrow}>УЧАСТИЕ В ОПРОСЕ</p>
        <h1 className={styles.pageTitle}>Ваш голос имеет значение</h1>
        <p className={styles.lead}>{proposal || "Создать новую зону отдыха для студентов университета?"}</p>
        <div className={styles.connectRow}>
          <div>
            <strong>1. Подключите кошелёк</strong>
            <p className={styles.hint}>Для демонстрации используйте MetaMask с сетью Hardhat Local (31337).</p>
          </div>
          <ConnectButton showBalance={false} />
        </div>
        <div className={styles.choiceSection}>
          <strong>2. Выберите ответ</strong>
          <div className={styles.choiceGrid}>
            <button className={styles.yesButton} type="button" disabled={isBlocked} onClick={() => void submitVote(true)}>
              За
            </button>
            <button className={styles.noButton} type="button" disabled={isBlocked} onClick={() => void submitVote(false)}>
              Против
            </button>
          </div>
        </div>
        {!isConnected && <p className={styles.notice}>Подключите MetaMask, чтобы кнопки голосования стали доступны.</p>}
        {isConnected && alreadyVoted && (
          <p className={styles.noticeSuccess}>Этот адрес уже проголосовал. Повторный голос не допускается.</p>
        )}
        {state !== "idle" && message && (
          <p role="status" aria-live="polite" className={state === "error" ? styles.noticeError : styles.noticeSuccess}>
            {message}
          </p>
        )}
        <p className={styles.hint}>
          Один голос = один адрес. Голосование публичное: адрес отправителя и выбранный вариант доступны в событии VoteCast.
        </p>
      </section>
    </main>
  );
}
