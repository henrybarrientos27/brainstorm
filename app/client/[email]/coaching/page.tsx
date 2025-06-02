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

export default function CoachingPromptPage() {
    const { email } = useParams();
    const [prompts, setPrompts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await fetch(`/api/client/${email}/coaching`);
                const data = await res.json();
                setPrompts(data);
            } catch (err) {
                console.error("Failed to fetch coaching prompts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
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
            <Heading mb={4}>Coaching Prompts</Heading>
            <VStack align="start" spacing={4} divider={<Divider />}>
                {prompts.length > 0 ? (
                    prompts.map((prompt) => (
                        <Text key={prompt.id}>{prompt.content}</Text>
                    ))
                ) : (
                    <Text>No coaching prompts available.</Text>
                )}
            </VStack>
        </Box>
    );
}
