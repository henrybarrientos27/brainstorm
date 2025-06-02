'use client';

import { Button, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

export default function ConnectCRMButton() {
  const { data: session } = useSession();
  const toast = useToast();

  const handleConnect = async () => {
    toast({
      title: 'CRM Integration',
      description: 'CRM connection is coming soon.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

    await fetch(`/api/client/${session?.user?.email}/audit-log`, {
      method: 'POST',
      body: JSON.stringify({
        email: session?.user?.email,
        action: 'Clicked Connect CRM',
        metadata: { source: 'dashboard' },
      }),
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      colorScheme="blue"
      onClick={handleConnect}
    >
      Connect CRM
    </Button>
  );
}
