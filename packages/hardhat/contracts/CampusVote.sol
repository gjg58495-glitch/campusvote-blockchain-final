
 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.20;

 /**
  * @title CampusVote
  * @notice Один голос «За» или «Против» с одного адреса.
  */
 contract CampusVote {
     string public proposal;

     uint256 private yesVotes;
     uint256 private noVotes;
     mapping(address => bool) private voted;

     event VoteCast(address indexed voter, bool support);

     constructor(string memory proposalText) {
         require(
             bytes(proposalText).length > 0,
             unicode"Пустой вопрос"
         );
         proposal = proposalText;
     }

     function castVote(bool support) external {
         require(
             !voted[msg.sender],
             unicode"Повторное голосование запрещено"
         );

         voted[msg.sender] = true;

         if (support) {
             yesVotes += 1;
         } else {
             noVotes += 1;
         }

         emit VoteCast(msg.sender, support);
     }

     function getTotals() external view returns (uint256 yes, uint256 no) {
         return (yesVotes, noVotes);
     }

     function didVote(address account) external view returns (bool) {
         return voted[account];
     }
 }
