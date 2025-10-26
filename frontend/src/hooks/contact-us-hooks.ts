import { handleApi } from "@/lib/utils/base";
import { contactUsPublicContactUsPost, type ContactForm } from "@/openapi";
import { useMutation } from "@tanstack/react-query";

export function useContactUsMutation() {
  return useMutation({
    mutationFn: async (params: ContactForm) =>
      handleApi(await contactUsPublicContactUsPost(params)),
  });
}
