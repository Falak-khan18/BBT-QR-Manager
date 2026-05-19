from datetime import UTC, datetime, timedelta

import bcrypt
from jose import JWTError, jwt
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.auth import TokenPayload


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))
    return hashed.decode("utf-8")


def create_access_token(subject: str) -> str:
    expire = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode = {"exp": int(expire.timestamp()), "sub": subject}
    return jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )


def decode_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return TokenPayload.model_validate(payload)
    except (JWTError, ValidationError) as exc:
        raise ValueError("Invalid token") from exc
