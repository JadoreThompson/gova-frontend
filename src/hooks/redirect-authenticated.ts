import { useMeStore } from "@/stores/me-store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useMeQuery } from "./queries/auth-hooks";

export const useRedirectAuthenticated = (props: { to: string }) => {
  const navigate = useNavigate();
  const meQuery = useMeQuery();
  const setMe = useMeStore((state) => state.setData);

  useEffect(() => {
    if (meQuery.data?.username) {
      setMe(meQuery.data);
      navigate(props.to);
    }
  }, [navigate, meQuery.data]);
};
