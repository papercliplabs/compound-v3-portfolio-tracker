import { Button } from "@/components/ui/button";
import { testFetch } from "@/data/test";

export default async function Home() {
  await testFetch();
  return (
    <div className="flex h-full w-full grow flex-col items-start justify-start bg-green-200">
      <Button>TEST</Button>
    </div>
  );
}
