"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { handleAuthError } from "@/lib/auth/handle-auth-error";

function createSessionReadySignal() {
  let resolve: () => void = () => {};
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const sessionRef = useRef<Session | null>(null);
  const [sessionReady] = useState(createSessionReadySignal);

  useEffect(() => {
    sessionRef.current = session ?? null;
    if (status !== "loading") sessionReady.resolve();
  }, [session, status, sessionReady]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Send the user to login when their session expires (see handleAuthError).
        queryCache: new QueryCache({ onError: handleAuthError }),
        mutationCache: new MutationCache({ onError: handleAuthError }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  const [trpcClient] = useState(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const trpcUrl = baseUrl.endsWith("/trpc") ? baseUrl : `${baseUrl}/trpc`;

    return trpc.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: trpcUrl,
          async headers() {
            // the session is fetched in the browser, so requests made before it
            // loads would otherwise go out without a token and be treated as
            // an expired session
            await sessionReady.promise;
            const token = sessionRef.current?.accessToken;
            if (token) {
              return {
                authorization: `Bearer ${token}`,
              };
            }
            return {};
          },
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
