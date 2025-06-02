// components/TrustScoreMeter.tsx

import { Box, CircularProgress, CircularProgressLabel, Text, VStack } from '@chakra-ui/react';

interface TrustScoreMeterProps {
    score: number;
    explanation: string;
}

export default function TrustScoreMeter({ score, explanation }: TrustScoreMeterProps) {
    return (
        <Box bg="gray.700" p={4} borderRadius="md" mt={4}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
                Trust Score
            </Text>
            <VStack spacing={3}>
                <CircularProgress value={score} color={score >= 80 ? 'green.400' : score >= 60 ? 'yellow.400' : 'red.400'} size='120px' thickness='10px'>
                    <CircularProgressLabel>{score}%</CircularProgressLabel>
                </CircularProgress>
                <Text fontSize="sm" color="gray.300" textAlign="center">
                    {explanation}
                </Text>
            </VStack>
        </Box>
    );
}
