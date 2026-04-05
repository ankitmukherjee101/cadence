from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    supabase_url: str = ""
    supabase_jwt_secret: str = ""  # or JWKS URL / project ref for validation
    groq_api_key: str = ""
    deepgram_api_key: str = ""
    neo4j_uri: str = ""
    neo4j_user: str = ""
    neo4j_password: str = ""
    # Comma-separated origins, or "*" for development only
    cors_origins: str = "*"


@lru_cache
def get_settings() -> Settings:
    return Settings()
