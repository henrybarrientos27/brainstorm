// app/components/TrustScoreCircle.tsx
'use client';

import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

export default function TrustScoreCircle({ score }: { score: number }) {
  return (
    <CircularProgress
      value={score}
      max={100}
      size="150px"
      thickness="12px"
      color={score >= 80 ? 'green.400' : score >= 50 ? 'yellow.400' : 'red.400'}
    >
      <CircularProgressLabel>{score}%</CircularProgressLabel>
    </CircularProgress>
  );
}
