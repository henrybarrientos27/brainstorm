"use client";

import {
    Button,
    Container,
    Heading,
    Select,
    Text,
    Textarea,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Client {
    email: string;
    name: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [transcript, setTranscript] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            const data = await res.json();
            setClients(data.clients);
            if (data.clients.length > 0) {
                setSelectedEmail(data.clients[0].email);
            }
        } catch (error) {
            console.error("Error loading clients", error);
        }
    };

    const handleCsvUpload = async () => {
        if (!csvFile) return;
        const formData = new FormData();
        formData.append("csvFile", csvFile);

        const res = await fetch("/api/clients/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            fetchClients();
        } else {
            console.error("Upload failed");
        }
    };

    const handleSummarize = async () => {
        if (!selectedEmail || !transcript) return;
        const res = await fetch(`/api/client/${selectedEmail}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript, clientEmail: selectedEmail }),
        });

        if (!res.ok) {
            console.error("Failed to summarize transcript");
        }
    };

    const handleTool = async (toolPath: string) => {
        const res = await fetch(`/api/client/${selectedEmail}/${toolPath}`, {
            method: "POST",
        });

        if (!res.ok) {
            console.error(`${toolPath} failed`);
        }
    };

    return (
        <Container py={10}>
            <Heading mb={4}>AdvisorBrain</Heading>
            <VStack spacing={4} align="stretch">
                <Text fontWeight="bold">Upload Client CSV</Text>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                />
                <Button colorScheme="blue" onClick={handleCsvUpload}>
                    Upload CSV
                </Button>

                <Text fontWeight="bold">Select Client</Text>
                <Select
                    value={selectedEmail}
                    onChange={(e) => setSelectedEmail(e.target.value)}
                >
                    {clients.map((client) => (
                        <option key={client.email} value={client.email}>
                            {client.name} ({client.email})
                        </option>
                    ))}
                </Select>

                <Text fontWeight="bold">Upload Transcript</Text>
                <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Paste transcript here..."
                />
                <Button colorScheme="green" onClick={handleSummarize}>
                    Summarize Transcript
                </Button>

                <Text fontWeight="bold">Tools</Text>
                {[
                    "coaching",
                    "trust-score",
                    "patterns",
                    "persona",
                    "timeline",
                    "feedback",
                    "forms/pull",
                ].map((tool) => (
                    <Button key={tool} onClick={() => handleTool(tool)}>
                        {tool.replace(/[-/]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Button>
                ))}

                <Button
                    colorScheme="purple"
                    onClick={() => router.push(`/client/${selectedEmail}`)}
                >
                    View Client Dashboard
                </Button>
            </VStack>
        </Container>
    );
}
