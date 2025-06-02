"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Box,
    Heading,
    Text,
    VStack,
    Spinner,
    Divider,
} from "@chakra-ui/react";

export default function InsightsPage() {
    const { email } = useParams();
    const [insights, setInsights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await fetch(`/api/client/${email}/insights`);
                const data = await res.json();
                setInsights(data);
            } catch (err) {
                console.error("Failed to fetch insights", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [email]);

    if (loading) {
        return (
            <Box p={6} textAlign="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={8} maxW="6xl" mx="auto">
            <Heading mb={6}>Client Insights</Heading>
            <VStack spacing={4} align="start" divider={<Divider />}>
                {insights.length > 0 ? (
                    insights.map((insight) => (
                        <Box key={insight.id}>
                            <Text fontWeight="bold">Insight:</Text>
                            <Text>{insight.message}</Text>
                            <Text fontSize="sm" color="gray.500">
                                Tags: {insight.tags?.join(", ") || "None"}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text>No insights found.</Text>
                )}
            </VStack>
        </Box>
    );
}
