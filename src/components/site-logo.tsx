import type { FC } from "react";

import logoWhite from "@/assets/logo_white.png";

const SiteLogo: FC<{ className?: string }> = (props) => {
  return <img src={logoWhite} alt="Site Logo" className={props.className} />;
};

export default SiteLogo;
