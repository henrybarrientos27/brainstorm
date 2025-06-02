// app/login/page.tsx
"use client";

import {
    Box,
    Button,
    Heading,
    VStack,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <Box maxW="md" mx="auto" mt={24} p={6} borderWidth={1} borderRadius="lg">
            <Heading mb={6} textAlign="center">
                AdvisorBrain Login
            </Heading>
            <VStack spacing={4}>
                <Button colorScheme="blue" width="full" onClick={handleGoogleLogin}>
                    Sign in with Google
                </Button>
            </VStack>
        </Box>
    );
}
