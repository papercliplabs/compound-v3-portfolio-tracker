import { Question } from "@phosphor-icons/react/dist/ssr";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function LearnMore() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="icon">
            <Question size={16} className="fill-black" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>TODO</PopoverContent>
      </Popover>
    </>
  );
}
