// Sidebar.tsx
'use client';

import {
    Box,
    Flex,
    VStack,
    Link,
    Heading,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type SidebarProps = {
    selectedClient: string | null;
    onClientSelect: (email: string) => void;
    children?: ReactNode;
};

const Sidebar = ({ selectedClient, onClientSelect, children }: SidebarProps) => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', path: '/client/dashboard' },
        { name: 'Summary', path: '/client/summary' },
        { name: 'Trust Score', path: '/client/trustscore' },
        { name: 'Coaching Prompt', path: '/client/coaching' },
        { name: 'Insights', path: '/client/insights' },
        { name: 'Forms', path: '/client/forms' },
        { name: 'Timeline', path: '/client/timeline' },
        { name: 'Feedback', path: '/client/feedback' },
        { name: 'Upload', path: '/client/upload-any' },
    ];

    return (
        <Flex minW="180px" p={4} bg="gray.100" direction="column">
            <Heading size="md" mb={4}>
                BrAInstorm
            </Heading>
            <VStack align="stretch" spacing={2}>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        as={NextLink}
                        href={link.path}
                        fontWeight={pathname === link.path ? 'bold' : 'normal'}
                        color={pathname === link.path ? 'blue.500' : 'gray.700'}
                    >
                        {link.name}
                    </Link>
                ))}
            </VStack>
            <Box flex="1" mt={4} p={4} bg="gray.50">
                {children}
            </Box>
        </Flex>
    );
};

export default Sidebar;