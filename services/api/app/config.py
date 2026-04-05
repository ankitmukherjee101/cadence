from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    supabase_url: str = ""
    supabase_jwt_secret: str = ""  # or JWKS URL / project ref for validation
    groq_api_key: str = ""
    deepgram_api_key: str = ""
    neo4j_uri: str = ""
    neo4j_user: str = Field(
        default="",
        validation_alias=AliasChoices("NEO4J_USER", "NEO4J_USERNAME"),
    )
    neo4j_password: str = ""
    neo4j_database: str = Field(default="", validation_alias="NEO4J_DATABASE")
    aura_instance_id: str = Field(default="", validation_alias="AURA_INSTANCEID")
    aura_instance_name: str = Field(default="", validation_alias="AURA_INSTANCENAME")
    # Comma-separated origins, or "*" for development only
    cors_origins: str = "*"


@lru_cache
def get_settings() -> Settings:
    return Settings()
