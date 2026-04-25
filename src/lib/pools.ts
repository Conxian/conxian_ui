import { BASE_PRINCIPAL } from "./contracts";

export interface DexPool {
  id: string;
  label: string;
  tokenA: string;
  tokenB: string;
}

export const DexPools: DexPool[] = [
  {
    id: `${BASE_PRINCIPAL}.pool-v2-stx-cxd`,
    label: "STX / CXD",
    tokenA: "STX",
    tokenB: `${BASE_PRINCIPAL}.cxd-token`
  },
  {
    id: `${BASE_PRINCIPAL}.pool-v2-stx-cxlp`,
    label: "STX / CXLP",
    tokenA: "STX",
    tokenB: `${BASE_PRINCIPAL}.cxlp-token`
  },
  {
    id: `${BASE_PRINCIPAL}.pool-v2-cxd-cxvg`,
    label: "CXD / CXVG",
    tokenA: `${BASE_PRINCIPAL}.cxd-token`,
    tokenB: `${BASE_PRINCIPAL}.cxvg-token`
  },
];
