import asyncio
import logging
import time
from multiprocessing import Process
from types import CoroutineType
from typing import Any, Callable

import uvicorn

from engine.deployment_listener import DeploymentListener


logger = logging.getLogger("main")


def run_sever():
    uvicorn.run("server.app:app", host="localhost", port=8000)


async def run_deployment_listener() -> None:
    listener = DeploymentListener()
    listener.listen()


def asyncio_run(func: Callable[[], CoroutineType[Any, Any, Any]]) -> None:
    asyncio.run(func())


def main() -> None:
    pargs = (
        (asyncio_run, (run_deployment_listener,), {}, "Deployment Listener"),
        (run_sever, (), {}, "Server"),
    )

    ps = [
        Process(target=target, args=args, kwargs=kw, name=name, daemon=True)
        for target, args, kw, name in pargs
    ]

    for p in ps:
        p.start()

    try:
        while True:
            for idx, p in enumerate(ps):
                if not p.is_alive():
                    logger.critical(f"Process {p.name} has died.")
                    p.kill()
                    p.join()

                    target, args, kw, name = pargs[idx]
                    ps[idx] = Process(target=target, args=args, kwargs=kw, name=name, daemon=True)
                    ps[idx].start()

                    logger.critical(f"Process {p.name} has been relaunced successfully.")

            time.sleep(0.5)
    except KeyboardInterrupt:
        pass
    finally:
        logger.info("Shutting down all processes.")

        for p in ps:
            logger.info(f"Process '{p.name}' is shutting down.")
            p.kill()
            p.join()
            logger.info(f"Process '{p.name}' shut down successfully.")
        
        logger.info("All processes shut down.")



async def test():
    from config import DISCORD_BOT_TOKEN
    from engine.discord.actions import BanActionDefinition, MuteActionDefinition
    from engine.discord.config import DiscordConfig
    from engine.discord.moderator import DiscordModerator

    mod = DiscordModerator(
        "61897ee1-c58d-48e8-98a4-51e67dab2cc0",
        "51387d42-f73a-4fbf-b9bf-c633afc3345d",
        DISCORD_BOT_TOKEN,
        DiscordConfig(
            guild_id=1334317047995432980,
            allowed_channels=[1334317050629460114],
            allowed_actions=[MuteActionDefinition(requires_approval=False)],
        ),
    )
    async with mod:
        await mod.moderate()


if __name__ == "__main__":
    import sys

    args = sys.argv

    if len(args) == 1 or args[1] == "0":
        uvicorn.run("server.app:app", host="localhost", port=8000, reload=True)
    elif args[1] == "1":
        asyncio.run(test())
    elif args[1] == "2":
        main()
