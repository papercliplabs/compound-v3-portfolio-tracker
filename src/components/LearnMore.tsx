import { Question } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ExternalLink from "./ExternalLink";
import { Separator } from "./ui/separator";

export default function LearnMore() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon">
            <Question size={16} className="fill-black" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-w-[1000px]">
          <div className="flex flex-col gap-3">
            <span className="text-body text-content-primary font-semibold">
              Ollio: Compound v3 Multichain Portfolio Tracker
            </span>
            <span className="text-body text-content-secondary whitespace-pre-wrap">
              This app is an{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://github.com/papercliplabs/compound-v3-portfolio-tracker"
              >
                open-source
              </ExternalLink>{" "}
              standalone multichain portfolio tracker for the Compound v3
              protocol. This was built as part of the{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://questbook.app/dashboard/?grantId=0xeb047900b28a9f90f3c0e65768b23e7542a65163&chainId=10&role=builder&proposalId=0x5c7&isRenderingProposalBody=true"
              >
                Compound Grants Program
              </ExternalLink>{" "}
              to empower users to gain valuable insights into their portfolio
              growth and health.
            </span>
            <span className="text-caption-md text-content-secondary">
              Build by{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://paperclip.xyz"
              >
                Paperclip Labs
              </ExternalLink>
              , powered by{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://thegraph.com"
              >
                The Graph
              </ExternalLink>{" "}
              via the{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://github.com/papercliplabs/compound-v3-subgraph"
              >
                Compound v3 Community Subgraphs
              </ExternalLink>{" "}
              .
            </span>
            <Separator />
            <span className="text-caption-md text-content-secondary">
              Questions or UX Feedbacks?{" "}
              <ExternalLink
                className="text-semantic-brand"
                href="https://github.com/papercliplabs/compound-v3-portfolio-tracker/issues"
              >
                Open issue on Github
              </ExternalLink>
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
