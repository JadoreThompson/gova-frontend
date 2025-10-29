import type { FC, ReactNode } from "react";
import { Button } from "../ui/button";

export interface DeployModeratorLayoutProps {
  name: string;
  description: string;
  stage: number;
  maxStages: number;
  onBack: () => void;
  onNext: () => void;
  children: ReactNode;
}

const DeployModeratorLayout: FC<DeployModeratorLayoutProps> = (props) => {
  return (
    <>
      <div className="mb-3">
        <h4 className="font-semibold">Deploy {props.name}</h4>
        <p className="text-muted-foreground">{props.description}</p>
      </div>
      
      <main className="mb-3">{props.children}</main>

      <div className="flex w-full items-center justify-start gap-2">
        <Button variant={"secondary"} type="button" onClick={props.onBack}>
          Back
        </Button>
        <Button type="button" onClick={props.onNext}>
          Next
        </Button>
      </div>
    </>
  );
};
export default DeployModeratorLayout;
