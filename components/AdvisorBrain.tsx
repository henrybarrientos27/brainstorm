// components/AdvisorBrain.tsx
"use client";

import type { Session } from "next-auth/core/types";
import { useSession } from "next-auth/react";
import AppHome from "@/components/AppHome";

import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

const AdvisorBrain = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!session) {
    return (
      <Flex height="100vh" align="center" justify="center" direction="column">
        <Heading size="lg">Please log in to access AdvisorBrain</Heading>
        <Text mt={4} color="gray.500">You need an advisor account to continue.</Text>
      </Flex>
    );
  }

  return (
    <Box p={4} minH="100vh" bg="gray.50">
      <AppHome session={session} />
    </Box>
  );
};

export default AdvisorBrain;