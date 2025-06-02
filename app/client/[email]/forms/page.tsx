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
    Badge,
} from "@chakra-ui/react";

export default function ClientFormsPage() {
    const { email } = useParams();
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const res = await fetch(`/api/client/${email}/forms`);
                const data = await res.json();
                setForms(data);
            } catch (err) {
                console.error("Failed to fetch forms", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
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
            <Heading mb={6}>Client Forms</Heading>
            <VStack align="start" spacing={4} divider={<Divider />}>
                {forms.length === 0 ? (
                    <Text>No forms found.</Text>
                ) : (
                    forms.map((form: any) => (
                        <Box key={form.id} w="100%">
                            <Text fontWeight="bold">{form.type}</Text>
                            <Badge colorScheme={form.status === "Completed" ? "green" : "orange"}>
                                {form.status}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                                Submitted on: {new Date(form.createdAt).toLocaleString()}
                            </Text>
                        </Box>
                    ))
                )}
            </VStack>
        </Box>
    );
}
