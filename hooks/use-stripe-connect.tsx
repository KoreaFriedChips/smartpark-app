import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

interface FetchClientSecretResponse {
  client_secret: string;
  error?: string;
}

type StripeConnectInstance = ReturnType<typeof loadConnectAndInitialize> | undefined;

export const useStripeConnect = (connectedAccountId: string | undefined): StripeConnectInstance => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance>(undefined);

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async (): Promise<string> => {
        const response = await fetch("/account_session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            account: connectedAccountId,
          }),
        });

        if (!response.ok) {
          const { error }: FetchClientSecretResponse = await response.json();
          throw new Error(`An error occurred: ${error}`);
        } else {
          const { client_secret: clientSecret }: FetchClientSecretResponse = await response.json();
          return clientSecret;
        }
      };

      const initializeStripeConnect = async () => {
        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#f0f0f0",
            },
          },
        });
        setStripeConnectInstance(instance);
      };

      initializeStripeConnect();
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;
