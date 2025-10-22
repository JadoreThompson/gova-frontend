from aiohttp import BasicAuth, ClientError, ClientSession

from config import DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI
from server.typing import Identity


class DiscordService:
    _http_sess: ClientSession | None = None

    @classmethod
    def start(cls) -> None:
        cls._http_sess = ClientSession()

    @classmethod
    async def stop(cls):
        await cls._http_sess.close()

    @classmethod
    async def fetch_identity(cls, data: dict) -> Identity:
        try:
            rsp = await cls._http_sess.get(
                "https://discord.com/api/users/@me",
                headers={"Authorization": f"Bearer {data['access_token']}"},
            )
            rsp.raise_for_status()
            rsp_body = await rsp.json()
            return Identity(
                username=rsp_body["username"],
                avatar=f"https://cdn.discordapp.com/avatars/{rsp_body['id']}/{rsp_body['avatar']}.png",
                success=True,
            )
        except ClientError:
            return Identity(username=None, avatar=None, success=False)

    @classmethod
    async def fetch_discord_access_token(cls, auth_code: str) -> None:
        data = {
            "grant_type": "authorization_code",
            "code": auth_code,
            "redirect_uri": DISCORD_REDIRECT_URI,
        }

        rsp = await cls._http_sess.post(
            "https://discord.com/api/oauth2/token",
            auth=BasicAuth(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data=data,
        )
        data = await rsp.json()
        return data
