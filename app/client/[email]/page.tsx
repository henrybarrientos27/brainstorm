// app/client/[email]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Box,
    Heading,
    Text,
    Spinner,
    VStack,
    Divider,
    Flex,
    SimpleGrid,
    Badge,
    Card,
    CardHeader,
    CardBody,
} from '@chakra-ui/react';
import TrustScoreMeter from '@/components/TrustScoreMeter';
import ConnectCRMButton from '@/components/ConnectCRMButton';

export default function ClientDashboard({ params }: { params: { email: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [clientData, setClientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await fetch(`/api/client/${params.email}`);
                const data = await res.json();
                setClientData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [params.email]);

    if (status === 'loading' || loading) {
        return (
            <Box textAlign="center" mt="20">
                <Spinner size="xl" />
                <Text>Loading client dashboard...</Text>
            </Box>
        );
    }

    return (
        <Box maxW="6xl" mx="auto" p={6}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Heading size="lg">Client Dashboard</Heading>
                <ConnectCRMButton />
            </Flex>

            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Text fontSize="xl" mb={2}>
                        Trust Score
                    </Text>
                    <TrustScoreMeter trustScore={clientData?.trustScore || 0} />
                </Box>

                <Divider />

                <Box>
                    <Heading size="md">Client Info</Heading>
                    <Text><strong>Name:</strong> {clientData?.name}</Text>
                    <Text><strong>Email:</strong> {clientData?.email}</Text>
                </Box>

                <Divider />

                {clientData?.summaries?.length > 0 && (
                    <Box>
                        <Heading size="md" mb={2}>Summaries</Heading>
                        <VStack align="stretch" spacing={3}>
                            {clientData.summaries.map((summary: any) => (
                                <Box key={summary.id} p={3} borderWidth="1px" borderRadius="md">
                                    <Text fontSize="sm">{summary.content}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </Box>
                )}

                <Divider />

                {clientData?.insights?.length > 0 && (
                    <Box>
                        <Heading size="md" mb={2}>Insights</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {clientData.insights.map((insight: any) => (
                                <Card key={insight.id}>
                                    <CardHeader>
                                        <Badge colorScheme="blue">Insight</Badge>
                                    </CardHeader>
                                    <CardBody>
                                        <Text fontSize="sm">{insight.content}</Text>
                                        {insight.tags && <Text mt={2} fontSize="xs" color="gray.500">Tags: {insight.tags}</Text>}
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}

                <Divider />

                {clientData?.forms?.length > 0 && (
                    <Box>
                        <Heading size="md" mb={2}>Forms</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {clientData.forms.map((form: any) => (
                                <Card key={form.id}>
                                    <CardHeader>
                                        <Text fontWeight="bold">{form.name}</Text>
                                        <Badge mt={1} colorScheme="green">{form.provider}</Badge>
                                    </CardHeader>
                                    <CardBody>
                                        <Text fontSize="sm">Submitted on {new Date(form.createdAt).toLocaleDateString()}</Text>
                                    </CardBody>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}
            </VStack>
        </Box>
    );
}
