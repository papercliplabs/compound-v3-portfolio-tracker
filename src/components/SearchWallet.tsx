"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Address, getAddress, isAddress } from "viem";
import { useRef } from "react";
import { getAddressForEnsName } from "@/data/getEns";
import { useFormStatus } from "react-dom";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { Router } from "lucide-react";
import { useScreenBreakpoint } from "@/hooks/useScreenBreakpoint";

const ADDRESS_OR_ENS_FORM_NAME = "addressOrEns";

export function SearchWallet() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const addressOrEns = formData
      .get(ADDRESS_OR_ENS_FORM_NAME)!
      .valueOf() as string;

    let address: Address | null;

    const validAddress = isAddress(addressOrEns);
    if (validAddress) {
      address = getAddress(addressOrEns);
    } else {
      address = await getAddressForEnsName({
        ensName: addressOrEns,
      });
    }

    if (address) {
      // Search
      router.push(`/${address}`);
      formRef.current?.reset();
      inputRef.current?.blur(); // Clear focus
    } else {
      inputRef.current?.setCustomValidity("Invalid address or ENS");
      inputRef.current?.reportValidity();
    }
  }

  return (
    <form
      action={onSubmit}
      className="flex w-full flex-row items-center justify-center gap-2"
      ref={formRef}
    >
      <Input
        placeholder={"Search wallet address or ENS name"}
        className="max-w-[400px] grow"
        required
        type="text"
        name={ADDRESS_OR_ENS_FORM_NAME}
        onInput={(event) => event.currentTarget.setCustomValidity("")}
        ref={inputRef}
      />
      <SearchButton />
    </form>
  );
}

function SearchButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="hidden md:flex">
      {pending ? (
        <div className="flex w-[47px] items-center justify-center">
          <div className="h-fit w-fit animate-spin">
            <CircleNotch />
          </div>
        </div>
      ) : (
        "Search"
      )}
    </Button>
  );
}
