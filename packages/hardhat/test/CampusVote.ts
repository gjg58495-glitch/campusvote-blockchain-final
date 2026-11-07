
import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.create();

const PROPOSAL = "Создать новую зону отдыха для студентов университета";

async function deployFixture() {
  const [owner, voter1, voter2] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("CampusVote");
  const campusVote = await Factory.deploy(PROPOSAL);

  await campusVote.waitForDeployment();

  return { campusVote, owner, voter1, voter2 };
}

describe("CampusVote", function () {
  it("сохраняет вопрос и начинает с нуля", async function () {
    const { campusVote } = await deployFixture();
    const [yes, no] = await campusVote.getTotals();

    expect(await campusVote.proposal()).to.equal(PROPOSAL);
    expect(yes).to.equal(0n);
    expect(no).to.equal(0n);
  });

  it("учитывает голос «За» (тест записи)", async function () {
    const { campusVote, voter1 } = await deployFixture();

    await campusVote.connect(voter1).castVote(true);

    const [yes, no] = await campusVote.getTotals();

    expect(yes).to.equal(1n);
    expect(no).to.equal(0n);
    expect(await campusVote.didVote(voter1.address)).to.equal(true);
  });

  it("учитывает голос «Против»", async function () {
    const { campusVote, voter2 } = await deployFixture();

    await campusVote.connect(voter2).castVote(false);

    const [yes, no] = await campusVote.getTotals();

    expect(yes).to.equal(0n);
    expect(no).to.equal(1n);
  });

  it("создаёт событие VoteCast при голосовании", async function () {
    const { campusVote, voter1 } = await deployFixture();

    await expect(campusVote.connect(voter1).castVote(true))
      .to.emit(campusVote, "VoteCast")
      .withArgs(voter1.address, true);
  });

  it("не разрешает повторное голосование (require)", async function () {
    const { campusVote, voter1 } = await deployFixture();

    await campusVote.connect(voter1).castVote(true);

    await expect(
      campusVote.connect(voter1).castVote(false)
    ).to.be.revertedWith("Повторное голосование запрещено");
  });

  it("разрешает двум разным адресам голосовать", async function () {
    const { campusVote, voter1, voter2 } = await deployFixture();

    await campusVote.connect(voter1).castVote(true);
    await campusVote.connect(voter2).castVote(false);

    const [yes, no] = await campusVote.getTotals();

    expect(yes).to.equal(1n);
    expect(no).to.equal(1n);
  });

  it("правильно показывает статус каждого адреса", async function () {
    const { campusVote, voter1, voter2 } = await deployFixture();

    expect(await campusVote.didVote(voter1.address)).to.equal(false);

    await campusVote.connect(voter1).castVote(true);

    expect(await campusVote.didVote(voter1.address)).to.equal(true);
    expect(await campusVote.didVote(voter2.address)).to.equal(false);
  });

  it("отклоняет пустой вопрос", async function () {
    const Factory = await ethers.getContractFactory("CampusVote");

    await expect(
      Factory.deploy("")
    ).to.be.revertedWith("Пустой вопрос");
  });
});
