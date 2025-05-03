import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        {children}
      </body>
    </html>
  );
}
