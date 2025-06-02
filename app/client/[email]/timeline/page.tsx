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
} from "@chakra-ui/react";

export default function ClientTimelinePage() {
    const { email } = useParams();
    const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const res = await fetch(`/api/client/${email}/timeline`);
                const data = await res.json();
                setTimelineEvents(data);
            } catch (err) {
                console.error("Failed to fetch timeline", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTimeline();
    }, [email]);

    if (loading) {
        return (
            <Box p={6} textAlign="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={8} maxW="7xl" mx="auto">
            <Heading mb={4}>Memory Timeline</Heading>
            <Stack spacing={4} divider={<Divider />}>
                {timelineEvents.length > 0 ? (
                    timelineEvents.map((event) => (
                        <Box key={event.id} p={4} bg="gray.50" rounded="md">
                            <Text fontWeight="bold">{new Date(event.createdAt).toLocaleString()}</Text>
                            <Text>{event.content}</Text>
                        </Box>
                    ))
                ) : (
                    <Text>No timeline events available.</Text>
                )}
            </Stack>
        </Box>
    );
}
