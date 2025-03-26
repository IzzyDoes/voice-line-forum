
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Get your Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in development and no key is provided
if (!PUBLISHABLE_KEY) {
  console.error(
    "⚠️ Missing VITE_CLERK_PUBLISHABLE_KEY - Authentication will not work properly!\n" +
    "Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable to your Clerk publishable key."
  );
  
  // Instead of throwing an error which blocks rendering completely,
  // we'll continue with a placeholder key in development mode only
  if (import.meta.env.DEV) {
    console.info("🔧 Using a placeholder key for development. Some auth features may not work correctly.");
  } else {
    throw new Error("Missing Clerk Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.");
  }
}

// Use the actual key or a placeholder in development
const clerkKey = PUBLISHABLE_KEY || (import.meta.env.DEV ? "pk_test_placeholder-key-for-dev" : "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkKey}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
