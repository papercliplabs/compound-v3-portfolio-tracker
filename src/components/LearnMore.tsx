import { Question } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";

export default function LearnMore() {
  return (
    <>
      <Button variant="secondary" size="icon">
        <Question size={16} className="fill-black" />
      </Button>
    </>
  );
}
