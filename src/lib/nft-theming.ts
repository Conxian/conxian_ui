import { logger } from "./logger";
import { userSession } from "@/lib/wallet";
import { STACKS_MAINNET } from "@stacks/network";
import { fetchCallReadOnlyFunction } from "@stacks/transactions";

const MONKEY_CONTRACT_ADDRESS = "SP2KAF9RF86PVX3NEE27DFV1CQX0T4WGR41X3S45C";
const MONKEY_CONTRACT_NAME = "bitcoin-monkeys";

export async function hasBitcoinMonkeyNft(): Promise<boolean> {
  if (!userSession.isUserSignedIn()) {
    return false;
  }

  const userData = userSession.loadUserData();
  const userAddress = userData?.profile?.stxAddress?.mainnet;

  if (!userAddress) {
    return false;
  }

  try {
    const result = await fetchCallReadOnlyFunction({
      contractAddress: MONKEY_CONTRACT_ADDRESS,
      contractName: MONKEY_CONTRACT_NAME,
      functionName: "get-owner",
      functionArgs: [], // No arguments needed for this function
      network: STACKS_MAINNET,
      senderAddress: userAddress,
    });

    // Check if the user's address is in the list of owners
    // This is a simplified example. The actual logic will depend on the contract's response.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result && (result as any).value.some((owner: any) => owner.value === userAddress);
  } catch (error) {
    logger.error("Error checking for Bitcoin Monkey NFT", { module: "NFTTheming", error: error });
    return false;
  }
}
