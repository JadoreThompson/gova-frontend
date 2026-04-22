import type { FC } from "react";

import logoWhite from "@/assets/logo_white.png";
import { Link } from "react-router";

const SiteLogo: FC<{ className?: string }> = (props) => {
  return (
    <Link to="/" className="flex items-center justify-center">
      <img src={logoWhite} alt="Site Logo" className={props.className} />
    </Link>
  );
};

export default SiteLogo;
