// layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import Sidebar from '@/components/Sidebar';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: ReactNode }) {
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const storedClient = localStorage.getItem('selectedClient');
        if (storedClient) {
            setSelectedClient(storedClient);
        }
    }, []);

    const handleClientSelect = (email: string) => {
        localStorage.setItem('selectedClient', email);
        setSelectedClient(email);
        toast({
            title: `Selected client: ${email}`,
            status: 'success',
            duration: 2000,
        });
    };

    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <ChakraProvider>
                        <div style={{ display: 'flex', minHeight: '100vh' }}>
                            <Sidebar
                                selectedClient={selectedClient}
                                onClientSelect={handleClientSelect}
                            >
                                {/* Optional children */}
                            </Sidebar>
                            <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
                        </div>
                    </ChakraProvider>
                </SessionProvider>
            </body>
        </html>
    );
}