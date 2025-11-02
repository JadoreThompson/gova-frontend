import type { FC } from "react";
import { Toaster, type ToasterProps } from "sonner";

const CustomToaster: FC<ToasterProps> = (props) => (
  <Toaster
    toastOptions={{
      classNames: {
        toast: "!bg-background !text-primary",
      },
    }}
    {...props}
  />
);
export default CustomToaster;
