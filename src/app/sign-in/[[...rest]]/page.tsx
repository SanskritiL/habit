'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-0 px-4 sm:px-6 lg:px-8">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200',
              card: 'bg-transparent shadow-none',
              headerTitle: 'font-mono text-gray-900 dark:text-gray-100',
              headerSubtitle: 'font-mono text-gray-600 dark:text-gray-400',
              socialButtonsBlockButton:
                'font-mono border-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
              formFieldLabel: 'font-mono text-gray-700 dark:text-gray-300',
              formFieldInput:
                'font-mono border-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200',
              footerActionLink:
                'font-mono text-black dark:text-white hover:opacity-80',
              card__main: 'w-full',
            },
          }}
          routing="path"
          path="/sign-in"
        />
     </div>
  );
}
