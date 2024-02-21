"use client";

import { ReactNode, useEffect, useState } from "react";
import Spinner from "./Spinner";

const Hydrate = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return <>{isHydrated ? children : <Spinner />}</>;
};

export default Hydrate;
