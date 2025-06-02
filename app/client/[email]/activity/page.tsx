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

export default function ClientActivityPage() {
    const { email } = useParams();
    const [activityData, setActivityData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/client/${email}/activity`);
                const data = await res.json();
                setActivityData(data);
            } catch (err) {
                console.error("Failed to fetch activity", err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
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
            <Heading mb={4}>Client Activity</Heading>
            <Stack spacing={6} divider={<Divider />}>
                {activityData.length > 0 ? (
                    activityData.map((activity: any) => (
                        <VStack key={activity.id} align="start">
                            <Text fontWeight="bold">{new Date(activity.createdAt).toLocaleString()}</Text>
                            <Text>{activity.details}</Text>
                        </VStack>
                    ))
                ) : (
                    <Text>No activity records found.</Text>
                )}
            </Stack>
        </Box>
    );
}
