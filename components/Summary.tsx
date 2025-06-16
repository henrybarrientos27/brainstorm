// app/components/Summary.tsx
import { Box, Text } from "@chakra-ui/react";
import type { Summary } from "@prisma/client";


export default function Summary({ summaries }: { summaries: Summary[] }) {
  return (
    <Box bg="gray.700" p={4} borderRadius="md" mt={4}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Summary
      </Text>
      {summaries.length > 0 ? (
        summaries.map((s, idx) => (
          <Text key={idx} mb={2}>
            {s.content}
          </Text>
        ))
      ) : (
        <Text color="gray.400">No summaries available.</Text>
      )}
    </Box>
  );
}
