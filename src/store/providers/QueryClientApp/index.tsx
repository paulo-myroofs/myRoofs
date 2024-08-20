/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { persister, queryClient } from "../queryClient";

export default function QueryClientProviderApp({ children }: any) {
  // const [client] = useState(
  //   new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  // );
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
