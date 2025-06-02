// /app/upload/page.tsx
"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Heading,
    Input,
    Text,
    Textarea,
    VStack,
    Spinner,
    useToast,
} from "@chakra-ui/react";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleUpload = async () => {
        if (!file) return;
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Upload failed");

            setSummary(result.summary);
            toast({ title: "Upload successful", status: "success", duration: 3000 });
        } catch (err: any) {
            toast({ title: "Upload failed", description: err.message, status: "error", duration: 5000 });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VStack spacing={6} align="stretch" maxW="600px" mx="auto" mt={10}>
            <Heading size="lg">Upload a Document</Heading>
            <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                accept=".pdf,.docx,.txt,.csv"
                bg="white"
            />
            <Button onClick={handleUpload} colorScheme="blue" isLoading={isLoading}>
                Upload and Analyze
            </Button>

            {isLoading && <Spinner size="xl" />}

            {summary && (
                <Box bg="gray.700" p={4} rounded="md">
                    <Text fontWeight="bold" mb={2}>AI Summary</Text>
                    <Textarea value={summary} readOnly resize="vertical" minH="150px" bg="gray.800" color="white" />
                </Box>
            )}
        </VStack>
    );
}
