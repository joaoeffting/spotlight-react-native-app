import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://honest-tadpole-30.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
