"use client";
import { useAccount } from "wagmi";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export default function HeaderHomeButton() {
  const { address } = useAccount();

  return (
    <Link href={address ? `/${address}` : "/"}>
      <Image src="/image/logo.png" width={65.74} height={20} alt="Ollio" />
    </Link>
  );
}
