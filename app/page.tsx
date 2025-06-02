// app/page.tsx
"use client";

import {
    Box,
    Heading,
    Text,
    VStack,
    Divider,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Client {
    name: string;
    email: string;
    totalAssets: number;
    recentTransfers: number;
}

export default function HomePage() {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        // Replace this mock data with a real API call later
        setClients([
            {
                name: "Ava Thompson",
                email: "ava@example.com",
                totalAssets: 850000,
                recentTransfers: 4,
            },
            {
                name: "Liam Walker",
                email: "liam@example.com",
                totalAssets: 620000,
                recentTransfers: 3,
            },
        ]);
    }, []);

    return (
        <Box ml="220px" px={8} py={6} bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
            <Heading size="lg" mb={6}>Welcome to BrAInstorm</Heading>
            <Text fontSize="md" mb={6} color="gray.400">
                Overview of top clients, asset balances, and recent activity.
            </Text>
            <VStack spacing={8} align="stretch">
                {clients.map((client) => (
                    <Box
                        key={client.email}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        bg="gray.800"
                        color="white"
                    >
                        <Heading size="md" mb={2}>{client.name}</Heading>
                        <Text fontSize="sm" color="gray.300">{client.email}</Text>
                        <Divider my={4} />
                        <Flex justify="space-between">
                            <Stat>
                                <StatLabel>Total Assets</StatLabel>
                                <StatNumber>${client.totalAssets.toLocaleString()}</StatNumber>
                                <StatHelpText>from Redtail sync</StatHelpText>
                            </Stat>
                            <Stat>
                                <StatLabel>Recent Transfers</StatLabel>
                                <StatNumber>{client.recentTransfers}</StatNumber>
                                <StatHelpText>last 30 days</StatHelpText>
                            </Stat>
                        </Flex>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
