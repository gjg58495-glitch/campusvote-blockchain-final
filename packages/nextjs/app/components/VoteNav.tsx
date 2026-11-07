"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../campus-vote.module.css";

const items = [
  { href: "/", label: "Главная" },
  { href: "/vote", label: "Голосовать" },
  { href: "/results", label: "Результаты" },
];

export function VoteNav() {
  const pathname = usePathname();
  return (
    <nav className={styles.localNav} aria-label="Навигация по голосованию">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
          className={`${styles.navLink} ${pathname === item.href ? styles.activeNav : ""}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
