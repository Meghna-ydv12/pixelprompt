"use client";

import { ClientChat } from "@/components/artifacts/chat";
import { Playground } from "@/components/artifacts/playground";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const initialCode = `
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-bold mb-2">My Form</h2>
      <Input className="mb-2" placeholder="Enter your name" />
      <Button>Submit</Button>
    </Card>
  );
}

export default MyComponent;
`;

import { useSession, signIn, signOut } from "next-auth/react";

export default function Page() {
  const [code, setCode] = React.useState(initialCode);
  const [isCodeLoading, setIsCodeLoading] = React.useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col h-screen">
      {/* SaaS Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-bold tracking-tight">PixelPrompt SaaS</h1>
        <div className="flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {session.user?.name}
                </span>
                <span className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-800 rounded-full">
                  {(session.user as any)?.credits} Credits
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("credentials", { email: "recruiter@gmail.com", password: "123" })}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign In (Demo)
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="overflow-auto h-full p-4">
              <ClientChat
                setArtifactContent={setCode}
                setIsCodeLoading={setIsCodeLoading}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="overflow-auto h-full p-4">
              <Playground initialCode={code} isCodeLoading={isCodeLoading} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
