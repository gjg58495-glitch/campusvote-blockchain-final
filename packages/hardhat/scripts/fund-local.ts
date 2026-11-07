import { ethers } from "hardhat";

/** Пополнение тестового кошелька MetaMask только в локальной сети Hardhat. */
async function main() {
  const address = process.env.FUND_ADDRESS;
  if (!address || !ethers.isAddress(address)) {
    throw new Error("Задайте FUND_ADDRESS как корректный публичный адрес 0x...");
  }
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 31337n) {
    throw new Error("Этот скрипт работает только в локальной сети Hardhat с chain ID 31337");
  }
  const [sender] = await ethers.getSigners();
  const tx = await sender.sendTransaction({ to: address, value: ethers.parseEther("1") });
  await tx.wait();
  console.log(`Отправлен 1 тестовый ETH на адрес ${address}`);
  console.log(`Хеш транзакции: ${tx.hash}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
