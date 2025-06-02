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

export default function TrustScorePage() {
    const { email } = useParams();
    const [trustScores, setTrustScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrustScores = async () => {
            try {
                const res = await fetch(`/api/client/${email}/trust-score`);
                const data = await res.json();
                setTrustScores(data);
            } catch (err) {
                console.error("Failed to fetch trust scores", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrustScores();
    }, [email]);

    if (loading) {
        return (
            <Box p={6} textAlign="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={8} maxW="4xl" mx="auto">
            <Heading mb={4}>Trust Score History</Heading>
            <VStack align="start" spacing={4} divider={<Divider />}>
                {trustScores.length > 0 ? (
                    trustScores.map((score) => (
                        <Box key={score.id}>
                            <Text>Score: {score.score}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(score.createdAt).toLocaleString()}
                            </Text>
                        </Box>
                    ))
                ) : (
                    <Text>No trust scores found.</Text>
                )}
            </VStack>
        </Box>
    );
}
