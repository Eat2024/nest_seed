import Flex from "@/components/ui/Flex";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const RoleManagementLayout = ({ children }: Props) => {
  return <Flex sx={{ flexFlow: "column nowrap", flex: 1 }}>{children}</Flex>;
};

export default RoleManagementLayout;
