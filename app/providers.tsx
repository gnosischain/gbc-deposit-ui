"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/wagmi";
import { cacheExchange, createClient, fetchExchange, Provider } from "urql";

const queryClient = new QueryClient();

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;
if (!graphqlUrl) {
  throw new Error('Environment variable NEXT_PUBLIC_GRAPHQL_URL is not defined');
}

const client = createClient({
  url: graphqlUrl,
  exchanges: [cacheExchange, fetchExchange],
});

export function Providers(props: { children: ReactNode }) {

  return (
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Provider value={client}>{props.children}</Provider>
        </QueryClientProvider>
    </WagmiProvider>
  );
}
