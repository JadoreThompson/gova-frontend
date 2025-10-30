import { Toaster } from "sonner";

const CustomToaster = () => (
  <Toaster
    toastOptions={{
      classNames: {
        toast: "!bg-background !text-primary",
      },
    }}
  />
);
export default CustomToaster;
