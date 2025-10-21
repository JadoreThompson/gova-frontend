import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagePlatformImg from "@/components/message-platform-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMeQuery } from "@/hooks/auth-hooks";
import { MessagePlatformType } from "@/openapi";
import { CircleCheck } from "lucide-react";
import { useState, type FC } from "react";
import ReactDOM from "react-dom";

const RedirectingCard = () => {
  return (
    <Card>
      <CardContent>Redirecting ...</CardContent>
    </Card>
  );
};

const ConnectionsPage: FC = () => {
  const [showRedirecting, setShowRedirecting] = useState(false);
  const authMeQuery = useMeQuery();

  return (
    <>
      {document.body !== undefined &&
        showRedirecting &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-0 z-9 flex h-screen w-full items-center justify-center bg-black">
            <RedirectingCard />
          </div>,
          document.body,
        )}

      <DashboardLayout>
        <div className="flex h-auto w-full">
          {!authMeQuery.data && <span>Loading ...</span>}

          {authMeQuery.data &&
            Object.values(MessagePlatformType).map((pt) => (
              <Card className="relative h-50 w-50">
                <CardContent className="flex items-center justify-center">
                  {Object.keys(authMeQuery.data?.connections ?? {}).includes(
                    pt,
                  ) && (
                    <CircleCheck className="absolute top-2 right-2 text-green-500" />
                  )}
                  <MessagePlatformImg platform={pt} className="h-25 w-25" />
                </CardContent>
                {!Object.keys(authMeQuery.data?.connections ?? {}).includes(
                  pt,
                ) && (
                  <CardFooter>
                    <Button
                      onClick={() => setShowRedirecting(true)}
                      className="w-full"
                    >
                      Connect
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
        </div>
      </DashboardLayout>
    </>
  );
};
export default ConnectionsPage;
