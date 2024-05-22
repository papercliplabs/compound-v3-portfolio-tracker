import { AnchorHTMLAttributes, forwardRef } from "react";

export interface ExternalLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const ExternalLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href, children, ...props }, ref) => {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  );
});
ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
