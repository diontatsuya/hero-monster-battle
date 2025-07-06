export const contractAddress = "0x7eb0e397fb22958d80d44725f9dc1d2ffd1aac26";

export const contractABI = [
  "function attack() external",
  "function getStatus(address) public view returns (uint256 heroHP, uint256 monsterHP)",
  "event Attacked(address indexed player, uint256 heroHP, uint256 monsterHP)",
  "event MonsterDefeated(address indexed player)"
];
