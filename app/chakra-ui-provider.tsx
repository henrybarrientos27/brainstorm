"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "white",
      },
    },
  },
});

export function ChakraUIProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
