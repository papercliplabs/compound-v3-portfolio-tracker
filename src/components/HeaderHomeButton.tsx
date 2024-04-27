"use client";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HeaderHomeButton() {
  const { address } = useAccount();

  return (
    <Link href={address ? `/${address}` : "/"}>
      <Button variant="ghost">LOGO</Button>
    </Link>
  );
}
