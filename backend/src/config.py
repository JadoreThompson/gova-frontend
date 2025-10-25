import logging
import os
import sys
from datetime import timedelta
from urllib.parse import quote

import stripe
from dotenv import load_dotenv
from redis.asyncio import Redis as AsyncRedis
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine


BASE_PATH = os.path.dirname(__file__)
RESOURCES_PATH = os.path.join(BASE_PATH, "resources")
PROMPTS_PATH = os.path.join(RESOURCES_PATH, "prompts")


load_dotenv(os.path.join(BASE_PATH, ".env"))


PRODUCTION = False


# DB
DB_HOST_CREDS = f"{os.getenv("DB_HOST", "localhost")}:{os.getenv("DB_PORT", 5132)}"
DB_USER_CREDS = (
    f"{os.getenv("DB_USER", "postgres")}:{quote(os.getenv("PASSWORD", "password"))}"
)
DB_NAME = os.getenv("DB_NAME")
DB_ENGINE = create_async_engine(
    f"postgresql+asyncpg://{DB_USER_CREDS}@{DB_HOST_CREDS}/{DB_NAME}"
)
DB_ENGINE_SYNC = create_engine(
    f"postgresql+psycopg2://{DB_USER_CREDS}@{DB_HOST_CREDS}/{DB_NAME}"
)


# Kafka
KAFKA_HOST = os.getenv("KAFKA_HOST")
KAFKA_PORT = int(os.getenv("KAFKA_PORT"))
KAFKA_BOOTSTRAP_SERVER = f"{KAFKA_HOST}:{KAFKA_PORT}"
KAFKA_DEPLOYMENT_EVENTS_TOPIC = os.getenv("KAFKA_DEPLOYMENT_EVENTS_TOPIC")


# Redis
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_CLIENT = AsyncRedis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    encoding="utf-8",
    decode_responses=True,
)
REDIS_STRIPE_INVOICE_METADATA_KEY = os.getenv("REDIS_STRIPE_INVOICE_METADATA_KEY")


# Auth
COOKIE_ALIAS = "app-cookie"
JWT_ALGO = os.getenv("JWT_ALGO", "HS256")
JWT_SECRET = os.getenv("JWT_SECRET", "secret")
JWT_EXPIRY = timedelta(days=1000)


# LLM
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_AGENT_ID = os.getenv("LLM_AGENT_ID")
LLM_BASE_URL = "https://api.mistral.ai/v1/"
LLM_MODEL_NAME = "open-mixtral-8x22b"


# Prompts
with open(os.path.join(PROMPTS_PATH, "security-system-prompt.txt")) as f:
    SECURITY_SYSTEM_PROMPT = f.read()
with open(os.path.join(PROMPTS_PATH, "topic-system-prompt.txt")) as f:
    TOPICS_SYSTEM_PROMPT = f.read()
with open(os.path.join(PROMPTS_PATH, "score-system-prompt.txt")) as f:
    SCORE_SYSTEM_PROMPT = f.read()
with open(os.path.join(PROMPTS_PATH, "score-prompt-template.txt")) as f:
    SCORE_PROMPT_TEMPLATE = f.read()
with open(os.path.join(PROMPTS_PATH, "final-system-prompt.txt")) as f:
    FINAL_SYSTEM_PROMPT = f.read()
with open(os.path.join(PROMPTS_PATH, "final-prompt-template.txt")) as f:
    FINAL_PROMPT_TEMPLATE = f.read()


# Discord
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET")
DISCORD_REDIRECT_URI = os.getenv("DISCORD_REDIRECT_URI")
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")


# Server
PAGE_SIZE = 10
ACTION_DEFINITIONS_PATH = os.path.join(
    RESOURCES_PATH, "action-definitions.openapi.json"
)


# Stripe
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
STRIPE_PRICING_PRO_WEBHOOOK_SECRET = os.getenv("STRIPE_PRICING_PRO_WEBHOOOK_SECRET")
STRIPE_PRICING_PRO_PRICE_ID = os.getenv("STRIPE_PRICING_PRO_PRICE_ID")
stripe.api_key = STRIPE_API_KEY


# Logging
logging.basicConfig(
    filename="app.log",
    filemode="a",
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s",
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(
    logging.Formatter("%(asctime)s - [%(levelname)s] - %(name)s - %(message)s")
)
logger.addHandler(handler)

kafka_logger = logging.getLogger("kafka")
kafka_logger.setLevel(logging.CRITICAL)

del kafka_logger
