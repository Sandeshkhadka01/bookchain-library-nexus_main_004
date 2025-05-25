import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { isUser, register } from '@/services/blockchainService';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  balance: string;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isAdmin: boolean;
}

export const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  balance: '0',
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isAdmin: false,
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const hasAttemptedRegister = React.useRef<string | null>(null);
  
  const checkIfWalletIsConnected = async () => {
    try {
      // Check if window.ethereum is available
      const { ethereum } = window as any;
      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        toast.error("MetaMask is not installed. Please install MetaMask to use this app.");
        return;
      }
      
      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setAddress(account);
        setConnected(true);
        
        // Get chain ID
        const chainId = await ethereum.request({ method: "eth_chainId" });
        setChainId(chainId);
        
        // Get balance
        const balance = await ethereum.request({ 
          method: "eth_getBalance", 
          params: [account, "latest"]
        });
        setBalance(parseInt(balance, 16).toString());
        
        // For demo purposes, let's make the first connected account an admin
        // In a real app, this would come from the smart contract
        setIsAdmin(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      
      if (!ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask to use this app.");
        return;
      }
      
      // Request account access
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      setConnected(true);
      
      // Get chain ID
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setChainId(chainId);
      
      // Get balance
      const balance = await ethereum.request({ 
        method: "eth_getBalance", 
        params: [accounts[0], "latest"]
      });
      setBalance(parseInt(balance, 16).toString());
      
      // For demo purposes
      setIsAdmin(true);
      
      toast.success("Wallet connected successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to connect wallet");
    }
  };
  
  const disconnectWallet = () => {
    setConnected(false);
    setAddress(null);
    setBalance('0');
    setChainId(null);
    setIsAdmin(false);
    hasAttemptedRegister.current = null;
    toast.info("Wallet disconnected");
  };
  
  useEffect(() => {
    checkIfWalletIsConnected();
    
    const { ethereum } = window as any;
    if (ethereum) {
      ethereum.on('accountsChanged', async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setConnected(true);
          // Re-fetch chainId
          const chainId = await ethereum.request({ method: "eth_chainId" });
          setChainId(chainId);
          // Re-fetch balance
          const balance = await ethereum.request({ 
            method: "eth_getBalance", 
            params: [accounts[0], "latest"]
          });
          setBalance(parseInt(balance, 16).toString());
          // Optionally, reset isAdmin if you check it on-chain
          setIsAdmin(false);
        } else {
          setConnected(false);
          setAddress(null);
          setBalance('0');
          setChainId(null);
          setIsAdmin(false);
        }
      });
      
      ethereum.on('chainChanged', (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      });
    }
    
    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', () => {});
        ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);
  
  useEffect(() => {
    if (!connected || !address) {
      hasAttemptedRegister.current = null;
    }
  }, [connected, address]);
  
  useEffect(() => {
    if (connected && address) {
      if (hasAttemptedRegister.current === address) {
        console.log('Registration already attempted for:', address);
        return;
      }
      hasAttemptedRegister.current = address;
      (async () => {
        try {
          console.log('Checking if user is registered (provider):', address);
          const alreadyUser = await isUser(address);
          console.log('Already user? (provider)', alreadyUser);
          if (!alreadyUser) {
            toast.info('Registering your account on-chain...');
            await register();
            toast.success('You are now registered as a user!');
          }
        } catch (err: any) {
          toast.error('Failed to register user: ' + (err?.message || err));
          console.error('Auto-registration error (provider):', err);
          hasAttemptedRegister.current = null;
        }
      })();
    }
  }, [connected, address]);
  
  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        chainId,
        connectWallet,
        disconnectWallet,
        isAdmin
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
