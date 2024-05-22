import Image from "next/image";
import { Card } from "./ui/card";
import { Info } from "@phosphor-icons/react/dist/ssr";
import ExternalLink from "./ExternalLink";

export function NoPositions() {
  return (
    <div className="m-auto flex h-full w-full max-w-[500px] flex-col items-center justify-between text-center">
      <div className="flex flex-col items-center gap-3 pt-[108px]">
        <Image src="/image/no-positions.png" width={480} height={80} alt="" />
        <h1>This account does not have any Compound v3 positions.</h1>
        <span className="text-caption-md text-content-secondary">
          Try searching for another account.
        </span>
      </div>
      <Card className="flex flex-row">
        <Info width={20} height={20} className="pr-2" />
        <div className=" flex-wrap items-start justify-start whitespace-pre-wrap text-start">
          If you believe this is a mistake, please{" "}
          <ExternalLink
            href="mailto:contact@paperclip.xyz"
            className="text-semantic-brand"
          >
            contract us
          </ExternalLink>
          .
        </div>
      </Card>
    </div>
  );
}
