import { useAuth } from "@/lib/auth-context";
import LoginPage from "./LoginPage";
import VendorPage from "./VendorPage";
import ManagerPage from "./ManagerPage";
import OwnerPage from "./OwnerPage";

const Index = () => {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  switch (user.role) {
    case "vendedor":
      return <VendorPage />;
    case "gerente":
      return <ManagerPage />;
    case "dono":
      return <OwnerPage />;
    default:
      return <LoginPage />;
  }
};

export default Index;
