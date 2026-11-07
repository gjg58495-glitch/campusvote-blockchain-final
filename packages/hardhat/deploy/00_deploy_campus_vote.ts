
import { deployScript, artifacts } from "../rocketh/deploy.js";

export default deployScript(
  async ({ deploy, namedAccounts }) => {
    const { deployer } = namedAccounts;

    await deploy("CampusVote", {
      account: deployer,
      artifact: artifacts.CampusVote,
      args: ["Создать новую зону отдыха для студентов университета"],
    });
  },
  {
    tags: ["CampusVote"],
  },
);
