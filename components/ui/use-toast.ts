// components/ui/use-toast.ts

import { createStandaloneToast, UseToastOptions } from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export function useToast() {
  return (options: UseToastOptions) => {
    toast({
      position: 'top-right',
      duration: 4000,
      isClosable: true,
      variant: 'subtle',
      ...options,
    });
  };
}

// OPTIONAL: If you're using ChakraProvider globally, this can also go in _app.tsx or layout.tsx
// import { ChakraProvider } from '@chakra-ui/react';
// function MyApp({ Component, pageProps }) {
//   return (
//     <ChakraProvider>
//       <Component {...pageProps} />
//     </ChakraProvider>
//   );
// }
