import { handleApi } from "@/lib/utils/base";
import { contactUsPublicContactUsPost, type ContactForm } from "@/openapi";
import { useMutation } from "@tanstack/react-query";

/**
 * Handles the submission of the "Contact Us" form.
 */
export function useContactUsMutation() {
  return useMutation({
    mutationFn: async (data: ContactForm) =>
      handleApi(await contactUsPublicContactUsPost(data)),
  });
}