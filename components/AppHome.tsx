// components/AppHome.tsx
import type { Session } from "next-auth/core/types";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Button,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaUser, FaChartLine, FaFileAlt, FaRegLightbulb } from "react-icons/fa";

interface AppHomeProps {
  session: Session;
}

const AppHome = ({ session }: AppHomeProps) => {
  const bg = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("md", "dark-lg");

  return (
    <Flex direction="column" align="center" p={8} bg="gray.50" minH="100vh">
      <Box
        bg={bg}
        p={6}
        rounded="2xl"
        shadow={boxShadow}
        w={{ base: "100%", md: "90%", lg: "60%" }}
        mb={8}
      >
        <Heading size="xl" mb={2} textAlign="center">
          Welcome, {session.user?.name || "Advisor"}!
        </Heading>
        <Text fontSize="md" color="gray.600" textAlign="center">
          You are logged in as <strong>{session.user?.email}</strong>
        </Text>
      </Box>

      <VStack spacing={6} align="stretch" w={{ base: "100%", md: "90%", lg: "60%" }}>
        <Box p={5} shadow="base" bg={bg} rounded="xl">
          <HStack spacing={4}>
            <Icon as={FaChartLine} boxSize={6} color="blue.500" />
            <Box>
              <Heading size="md">Client Analytics</Heading>
              <Text color="gray.600">Summaries, insights, and trust metrics.</Text>
            </Box>
          </HStack>
        </Box>

        <Box p={5} shadow="base" bg={bg} rounded="xl">
          <HStack spacing={4}>
            <Icon as={FaRegLightbulb} boxSize={6} color="yellow.500" />
            <Box>
              <Heading size="md">Coaching Prompts</Heading>
              <Text color="gray.600">Tailored suggestions for each meeting.</Text>
            </Box>
          </HStack>
        </Box>

        <Box p={5} shadow="base" bg={bg} rounded="xl">
          <HStack spacing={4}>
            <Icon as={FaFileAlt} boxSize={6} color="green.500" />
            <Box>
              <Heading size="md">Uploaded Files</Heading>
              <Text color="gray.600">Compliance-reviewed transcripts and forms.</Text>
            </Box>
          </HStack>
        </Box>

        <Box p={5} shadow="base" bg={bg} rounded="xl">
          <HStack spacing={4}>
            <Icon as={FaUser} boxSize={6} color="purple.500" />
            <Box>
              <Heading size="md">Client Profile</Heading>
              <Text color="gray.600">Preferences, goals, timeline, and reminders.</Text>
            </Box>
          </HStack>
        </Box>
      </VStack>

      <Divider my={10} />

      <Text fontSize="sm" color="gray.400">
        Powered by BrAInstorm — Secure AI for Financial Advisors
      </Text>
    </Flex>
  );
};

export default AppHome;
