import ConnectWallet from "@/components/ConnectWallet";
import ExternalLink from "@/components/ExternalLink";
import { SearchWallet } from "@/components/SearchWallet";
import Image from "next/image";
import Link from "next/link";

const DEMO_ADDRESS = "0x3c9ea5c4fec2a77e23dd82539f4414266fe8f757"; // TODO: get a better one

export default function NoAddressPage() {
  return (
    <div className="m-auto flex h-full w-full max-w-[450px] flex-col items-center justify-between px-4 pb-[30px] pt-[20dvh] text-center">
      <div className="flex flex-col gap-10">
        <h1>Track your Compound v3 portfolio in one place.</h1>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <SearchWallet />
          <span className="text-caption-md text-content-secondary">or</span>
          <ConnectWallet />
          <span className="text-caption-md text-content-secondary">
            Not sure what to expect?{" "}
            <Link href={`/${DEMO_ADDRESS}`} className="text-semantic-brand">
              View Demo
            </Link>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/image/chains.png" width={131} height={22} alt="" />
        <span className="text-caption-md text-content-secondary">
          Built for a multichain world by{" "}
          <ExternalLink
            href="https://paperclip.xyz"
            className="text-content-primary"
          >
            Paperclip Labs
          </ExternalLink>
        </span>
      </div>
    </div>
  );
}
