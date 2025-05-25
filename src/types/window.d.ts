interface Ethereum {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
  send?: (request: { method: string; params?: any[] }, callback: (error: any, response: any) => void) => void;
  sendAsync?: (request: { method: string; params?: any[] }, callback: (error: any, response: any) => void) => void;
  providers?: any[];
}

interface Window {
  ethereum?: Ethereum;
}
