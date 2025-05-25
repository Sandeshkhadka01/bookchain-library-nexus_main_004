import { useContext, useEffect, useRef } from 'react';
import { WalletContext } from '@/contexts/WalletContext';
import { isUser, register } from '@/services/blockchainService';
import { toast } from 'sonner';

export const useWallet = () => {
  const { connected, address } = useContext(WalletContext);
  const hasAttemptedRegister = useRef<string | null>(null);

  useEffect(() => {
    if (connected && address && hasAttemptedRegister.current !== address) {
      hasAttemptedRegister.current = address;
      (async () => {
        try {
          console.log('Checking if user is registered:', address);
          const alreadyUser = await isUser(address);
          console.log('Already user?', alreadyUser);
          if (!alreadyUser) {
            toast.info('Registering your account on-chain...');
            await register();
            toast.success('You are now registered as a user!');
          }
        } catch (err) {
          toast.error('Failed to register user');
          console.error('Auto-registration error:', err);
        }
      })();
    }
  }, [connected, address]);

  return useContext(WalletContext);
};
