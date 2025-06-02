// /components/FileUpload.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Select,
  Textarea,
  VStack,
  Input,
  useToast,
} from "@chakra-ui/react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [suggestedClient, setSuggestedClient] = useState("");
  const [clients, setClients] = useState<string[]>([]);
  const toast = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast({ title: "Upload failed", status: "error" });
      return;
    }

    const match = data.summary.match(/suggested.*client.*?:?\s*(.+?)\n/i);
    const guess = match?.[1]?.trim() || "";

    setSummary(data.summary);
    setSuggestedClient(guess);
    fetchClients();
  };

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data.map((c: any) => `${c.name} (${c.email})`));
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input type="file" onChange={handleFileChange} />
      <Button colorScheme="blue" onClick={uploadFile}>Upload File</Button>

      {summary && (
        <Box>
          <Text fontWeight="bold">AI Summary:</Text>
          <Textarea value={summary} isReadOnly height="200px" />

          <Text fontWeight="bold" mt={4}>Suggested Client:</Text>
          <Select value={suggestedClient} onChange={e => setSuggestedClient(e.target.value)}>
            <option value="">Select a client</option>
            {clients.map((client, idx) => (
              <option key={idx} value={client}>{client}</option>
            ))}
          </Select>
        </Box>
      )}
    </VStack>
  );
}
