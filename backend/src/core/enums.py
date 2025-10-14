from enum import Enum


class ActionType(Enum):
    BAN = 'ban'
    MUTE = 'mute'

class ChatPlatformType(Enum):
    DISCORD = 'discord'