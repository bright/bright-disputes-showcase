import { useLocation, useSubmit } from "@remix-run/react";

export const useAccountChange = () => {
  const submit = useSubmit();
  const formData = new FormData();
  const location = useLocation();

  return (pubKey: string) => {
    formData.append('userPubKey', pubKey);
    formData.append('redirectTo', location.pathname);
    submit(formData, { method: "post", action: "/" });
  }
}
