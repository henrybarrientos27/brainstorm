'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Heading,
    Text,
    VStack,
    Spinner,
} from '@chakra-ui/react';
import { useEffect } from 'react';

export default function SetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <Box textAlign="center" mt="20">
                <Spinner size="xl" />
                <Text>Loading session...</Text>
            </Box>
        );
    }

    const handleConnectCRM = async () => {
        // Placeholder logic
        alert('CRM connection coming soon!');
        await fetch('/api/client/' + session?.user?.email + '/audit-log', {
            method: 'POST',
            body: JSON.stringify({
                email: session?.user?.email,
                action: 'Clicked Connect CRM',
                metadata: { page: 'setup' },
            }),
        });
    };

    const handleSkip = () => {
        router.push('/');
    };

    return (
        <Box maxW="lg" mx="auto" mt="16" p="8" borderWidth="1px" borderRadius="lg">
            <VStack spacing={6}>
                <Heading size="lg">Welcome to BrAInstorm</Heading>
                <Text fontSize="md">
                    Signed in as: <strong>{session?.user?.email}</strong>
                </Text>

                <Text>Let’s get your CRM connected so we can import your clients.</Text>

                <Button colorScheme="blue" onClick={handleConnectCRM} w="full">
                    Connect CRM
                </Button>

                <Button variant="ghost" onClick={handleSkip} w="full">
                    Skip Setup
                </Button>
            </VStack>
        </Box>
    );
}
