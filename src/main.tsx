
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

// Get your Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Function to render app without Clerk for development purposes
const renderAppWithoutClerk = () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Setup Required</h1>
        <p className="mb-6 max-w-md">
          You need to set up a valid Clerk publishable key to enable authentication.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 max-w-lg text-left">
          <h2 className="font-semibold mb-2">How to set up Clerk:</h2>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Create an account at <a href="https://clerk.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">clerk.com</a></li>
            <li>Create a new application in the Clerk dashboard</li>
            <li>Find your publishable key in the API Keys section</li>
            <li>Add it to your .env file as VITE_CLERK_PUBLISHABLE_KEY</li>
          </ol>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Reload page
        </button>
      </div>
    </React.StrictMode>
  );
};

// Check if we have a valid publishable key
if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === "pk_test_placeholder-key-for-dev") {
  console.error(
    "⚠️ Missing or invalid VITE_CLERK_PUBLISHABLE_KEY - Authentication will not work properly!\n" +
    "Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable to your Clerk publishable key."
  );
  
  // In development mode, render a helpful message instead of breaking the app
  if (import.meta.env.DEV) {
    renderAppWithoutClerk();
  } else {
    // In production, still try to render with a clear error state
    renderAppWithoutClerk();
  }
} else {
  // We have a valid key, render the app normally
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
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
}
