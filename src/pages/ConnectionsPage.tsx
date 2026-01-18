import DashboardLayout from "@/components/layouts/dashboard-layout";
import MessagePlatformImg from "@/components/message-platform-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMeQuery } from "@/hooks/queries/auth-hooks";
import { useDeleteConnectionMutation } from "@/hooks/queries/connections-hooks";
import { OAUTH2_URLS } from "@/lib/utils/utils";
import { MessagePlatform, type UserConnection } from "@/openapi";
import { Trash } from "lucide-react";
import { type FC } from "react";

const UnconnectedCard: FC<{ platform: MessagePlatform }> = (props) => {
  return (
    <Card className="relative h-50 w-50">
      <CardContent className="flex items-center justify-center">
        <MessagePlatformImg platform={props.platform} className="h-25 w-25" />
      </CardContent>
      <CardFooter>
        <a
          href={OAUTH2_URLS[props.platform]}
          target="_blank"
          type="button"
          className="w-full rounded-sm bg-white p-1 text-center text-black"
        >
          Connect
        </a>
      </CardFooter>
    </Card>
  );
};

const ConnectedCard: FC<{
  platform: MessagePlatform;
  conn: UserConnection;
  onDelete: (platform: MessagePlatform) => void;
}> = (props) => {
  return (
    <Card className="relative h-50 w-50">
      <MessagePlatformImg
        platform={props.platform}
        className="absolute top-1 left-1 h-7 w-7 p-1"
      />

      <Trash
        size={25}
        onClick={() => props.onDelete(props.platform)}
        className="absolute top-1 right-1 cursor-pointer fill-red-400 p-1 text-red-400"
      />

      <CardContent className="flex items-center justify-center">
        <div className="shadow-secondary flex h-25 w-25 items-center justify-center overflow-hidden rounded-full shadow-md">
          <img src={props.conn.avatar} className="" />
        </div>
      </CardContent>
      <CardFooter className="">
        <Button variant={"secondary"} className="pointer-events-none w-full">
          {/* Connected */}
          {props.conn.username}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ConnectionsPage: FC = () => {
  const authMeQuery = useMeQuery();
  const deleteConnetionMutation = useDeleteConnectionMutation();

  const handleOnDelete = async (platform: MessagePlatform) => {
    deleteConnetionMutation
      .mutateAsync(platform)
      .then(() => authMeQuery.refetch());
  };

  return (
    <>
      <DashboardLayout>
        <div className="flex h-auto w-full">
          {!authMeQuery.data ? (
            <span>Loading ...</span>
          ) : (
            Object.values(MessagePlatform).map((pType) => (
              <>
                {Object.keys(authMeQuery.data?.connections ?? {}).includes(
                  pType,
                ) ? (
                  <ConnectedCard
                    platform={pType}
                    conn={
                      authMeQuery.data?.connections![pType] as UserConnection
                    }
                    onDelete={handleOnDelete}
                  />
                ) : (
                  <UnconnectedCard platform={pType} />
                )}
              </>
            ))
          )}
        </div>
      </DashboardLayout>
    </>
  );
};
export default ConnectionsPage;
