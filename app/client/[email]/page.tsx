"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Grid,
  GridItem,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

export default function ClientDashboardPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    async function fetchData() {
      if (!email) {
        setError("Missing email");
        return;
      }

      try {
        const [trust, coaching, insights, timeline] = await Promise.all([
          fetch(`/api/client/${email}/trust-score`).then(res => res.json()),
          fetch(`/api/client/${email}/coaching`).then(res => res.json()),
          fetch(`/api/client/${email}/insights`).then(res => res.json()),
          fetch(`/api/client/${email}/timeline`).then(res => res.json())
        ]);

        setClientData({
          trustScore: trust.trustScore,
          coachingPrompt: coaching.prompt,
          insights: insights.insights,
          timeline: timeline.timeline
        });
      } catch (err) {
        console.error(err);
        toast({ title: "Error fetching client data", status: "error" });
        setError("Failed to fetch client data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [email, toast]);

  if (loading) return <Spinner size="xl" mt={10} />;
  if (error) return <Text color="red.500" mt={10}>{error}</Text>;
  if (!clientData) return null;

  return (
    <Box p={8} maxW="1200px" mx="auto">
      <Heading size="xl" mb={6}>Client Dashboard</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Trust Score */}
        <Card>
          <CardHeader><Heading size="md">Trust Score</Heading></CardHeader>
          <CardBody>
            <Text fontSize="4xl" fontWeight="bold" color="green.500">
              {clientData.trustScore?.score ?? "N/A"}
            </Text>
            <Text mt={2}>{clientData.trustScore?.feedback}</Text>
          </CardBody>
        </Card>

        {/* Coaching Prompt */}
        <Card>
          <CardHeader><Heading size="md">Coaching Prompt</Heading></CardHeader>
          <CardBody>
            <Text>{clientData.coachingPrompt?.content || "No prompt available."}</Text>
          </CardBody>
        </Card>

        {/* Insights */}
        <GridItem colSpan={2}>
          <Card>
            <CardHeader><Heading size="md">Insights</Heading></CardHeader>
            <CardBody>
              <Stack spacing={3}>
                {clientData.insights?.length > 0 ? (
                  clientData.insights.map((insight: any, index: number) => (
                    <Box key={index}>
                      <Badge colorScheme="blue">#{index + 1}</Badge>
                      <Text ml={2} display="inline">{insight.content}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No insights found.</Text>
                )}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>

        {/* Memory Timeline */}
        <GridItem colSpan={2}>
          <Card>
            <CardHeader><Heading size="md">Memory Timeline</Heading></CardHeader>
            <CardBody>
              <Stack spacing={4}>
                {clientData.timeline?.length > 0 ? (
                  clientData.timeline.map((event: any, index: number) => (
                    <Box key={index}>
                      <Text fontSize="sm" color="gray.500">{new Date(event.createdAt).toLocaleString()}</Text>
                      <Text>{event.description}</Text>
                      <Divider my={2} />
                    </Box>
                  ))
                ) : (
                  <Text>No timeline events.</Text>
                )}
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
