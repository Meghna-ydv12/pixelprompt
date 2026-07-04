export async function POST(req: Request) {
  // Parse the incoming request to read the prompt
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";

  // 1. Pricing Template
  const pricingComponent = [
    "import React from 'react';",
    "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';",
    "import { Button } from '@/components/ui/button';",
    "",
    "function PricingTable() {",
    "  return (",
    "    <div className=\"flex gap-4 p-8 items-center justify-center bg-slate-50 min-h-[400px]\">",
    "      <Card className=\"w-80 shadow-lg border-t-4 border-t-blue-500\">",
    "        <CardHeader>",
    "          <CardTitle className=\"text-2xl text-center\">Pro Plan</CardTitle>",
    "          <p className=\"text-4xl font-bold text-center mt-4\">$29<span className=\"text-sm font-normal text-slate-500\">/mo</span></p>",
    "        </CardHeader>",
    "        <CardContent className=\"flex flex-col gap-4\">",
    "          <ul className=\"space-y-2 text-sm text-slate-600\">",
    "            <li>✓ 100 AI Generations</li>",
    "            <li>✓ Priority Support</li>",
    "            <li>✓ Custom Components</li>",
    "          </ul>",
    "          <Button className=\"w-full mt-4 bg-blue-500 hover:bg-blue-600\">Upgrade Now</Button>",
    "        </CardContent>",
    "      </Card>",
    "    </div>",
    "  );",
    "}",
    "",
    "export default PricingTable;"
  ].join("\n");

  // 2. Login Template
  const loginComponent = [
    "import React from 'react';",
    "import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';",
    "import { Button } from '@/components/ui/button';",
    "import { Input } from '@/components/ui/input';",
    "",
    "function LoginForm() {",
    "  return (",
    "    <div className=\"flex items-center justify-center p-8 bg-slate-100 min-h-[400px]\">",
    "      <Card className=\"w-96 shadow-xl\">",
    "        <CardHeader className=\"space-y-1\">",
    "          <CardTitle className=\"text-2xl font-bold tracking-tight\">Sign in</CardTitle>",
    "          <p className=\"text-sm text-slate-500\">Enter your email and password to access your account</p>",
    "        </CardHeader>",
    "        <CardContent className=\"grid gap-4\">",
    "          <div className=\"grid gap-2\">",
    "            <label className=\"text-sm font-medium\">Email</label>",
    "            <Input type=\"email\" placeholder=\"m@example.com\" />",
    "          </div>",
    "          <div className=\"grid gap-2\">",
    "            <label className=\"text-sm font-medium\">Password</label>",
    "            <Input type=\"password\" />",
    "          </div>",
    "        </CardContent>",
    "        <CardFooter>",
    "          <Button className=\"w-full bg-slate-900 text-white hover:bg-slate-800\">Sign in</Button>",
    "        </CardFooter>",
    "      </Card>",
    "    </div>",
    "  );",
    "}",
    "",
    "export default LoginForm;"
  ].join("\n");

  // 3. Dashboard Template (Default)
  const dashboardComponent = [
    "import React from 'react';",
    "import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';",
    "",
    "function Dashboard() {",
    "  return (",
    "    <div className=\"p-8 bg-slate-50 min-h-[400px]\">",
    "      <h2 className=\"text-3xl font-bold tracking-tight mb-4\">Dashboard</h2>",
    "      <div className=\"grid gap-4 md:grid-cols-2 lg:grid-cols-4\">",
    "        <Card>",
    "          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">",
    "            <CardTitle className=\"text-sm font-medium\">Total Revenue</CardTitle>",
    "          </CardHeader>",
    "          <CardContent>",
    "            <div className=\"text-2xl font-bold\">$45,231.89</div>",
    "            <p className=\"text-xs text-slate-500\">+20.1% from last month</p>",
    "          </CardContent>",
    "        </Card>",
    "        <Card>",
    "          <CardHeader className=\"flex flex-row items-center justify-between space-y-0 pb-2\">",
    "            <CardTitle className=\"text-sm font-medium\">Active Users</CardTitle>",
    "          </CardHeader>",
    "          <CardContent>",
    "            <div className=\"text-2xl font-bold\">+2350</div>",
    "            <p className=\"text-xs text-slate-500\">+180.1% from last month</p>",
    "          </CardContent>",
    "        </Card>",
    "      </div>",
    "    </div>",
    "  );",
    "}",
    "",
    "export default Dashboard;"
  ].join("\n");

  // Select component based on keyword
  let mockComponent = dashboardComponent;
  let componentName = "Dashboard";
  
  // Create a combined string of all previous messages to remember context
  const fullHistory = messages.map((m: any) => m.content.toLowerCase()).join(" ");

  if (fullHistory.includes("price") || fullHistory.includes("pricing")) {
    mockComponent = pricingComponent;
    componentName = "Pricing Component";
  } else if (fullHistory.includes("login") || fullHistory.includes("sign") || fullHistory.includes("form")) {
    mockComponent = loginComponent;
    componentName = "Login Component";
  } else {
    mockComponent = dashboardComponent;
    componentName = "Dashboard";
  }

  const responseText = "I have generated the UI for you based on your prompt!\n\n<antartifact title=\"" + componentName + "\">\n" + mockComponent + "\n</antartifact>\n";

  // Create a ReadableStream that mimics Vercel AI SDK format (0:"chunk"\n)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Split into chunks of 4 characters to stream smoothly without regex bugs
      for (let i = 0; i < responseText.length; i += 4) {
        const chunk = responseText.slice(i, i + 4);
        const formattedChunk = `0:${JSON.stringify(chunk)}\n`;
        controller.enqueue(encoder.encode(formattedChunk));
        await new Promise(resolve => setTimeout(resolve, 10)); // tiny delay
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Vercel-AI-Data-Stream': 'v1'
    }
  });
}
