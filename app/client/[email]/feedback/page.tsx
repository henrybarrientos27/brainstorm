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
    Stack,
    Textarea,
    Button,
} from "@chakra-ui/react";

export default function ClientFeedbackPage() {
    const { email } = useParams();
    const [feedbackList, setFeedbackList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newFeedback, setNewFeedback] = useState("");

    const fetchFeedback = async () => {
        try {
            const res = await fetch(`/api/client/${email}/feedback`);
            const data = await res.json();
            setFeedbackList(data);
        } catch (err) {
            console.error("Failed to fetch feedback", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedback();
    }, [email]);

    const handleSubmit = async () => {
        try {
            await fetch(`/api/client/${email}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newFeedback }),
            });
            setNewFeedback("");
            fetchFeedback();
        } catch (err) {
            console.error("Failed to submit feedback", err);
        }
    };

    if (loading) {
        return (
            <Box p={6} textAlign="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={8} maxW="4xl" mx="auto">
            <Heading mb={4}>Client Feedback</Heading>

            <VStack align="start" spacing={6} divider={<Divider />}>
                {feedbackList.length > 0 ? (
                    feedbackList.map((f: any) => (
                        <Box key={f.id}>
                            <Text fontSize="sm" color="gray.500">
                                {new Date(f.createdAt).toLocaleString()}
                            </Text>
                            <Text>{f.content}</Text>
                        </Box>
                    ))
                ) : (
                    <Text>No feedback submitted yet.</Text>
                )}

                <Box w="100%">
                    <Heading size="sm" mb={2}>
                        Submit New Feedback
                    </Heading>
                    <Textarea
                        placeholder="Enter feedback here..."
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        mb={2}
                    />
                    <Button onClick={handleSubmit} colorScheme="teal">
                        Submit Feedback
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
}
