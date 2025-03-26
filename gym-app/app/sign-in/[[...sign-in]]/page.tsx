import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded",
            formFieldInput: "border border-gray-300 p-2 rounded-lg",
          },
        }}
      />
    </div>
  );
}
