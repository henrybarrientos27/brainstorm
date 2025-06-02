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

export default function ClientAuditLogPage() {
    const { email } = useParams();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch(`/api/client/${email}/audit-log`);
                const data = await res.json();
                setLogs(data);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
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
            <Heading mb={4}>Audit Log</Heading>
            <VStack align="start" spacing={4} divider={<Divider />}>
                {logs.length > 0 ? (
                    logs.map((log) => (
                        <Box key={log.id}>
                            <Text>{log.action} - {log.timestamp}</Text>
                        </Box>
                    ))
                ) : (
                    <Text>No audit log entries found.</Text>
                )}
            </VStack>
        </Box>
    );
}
