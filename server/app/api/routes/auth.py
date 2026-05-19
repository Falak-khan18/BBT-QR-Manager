from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserPublic
from app.services import user_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic)
def register(
    body: RegisterRequest,
    db: Annotated[Session, Depends(get_db)],
):
    if user_service.get_user_by_email(db, body.email.lower()):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    try:
        user = user_service.create_user(db, body)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    return UserPublic(id=str(user.id), email=user.email)


@router.post("/login", response_model=Token)
def login(
    body: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
):
    user = user_service.get_user_by_email(db, body.email.lower())
    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(str(user.id))
    return Token(access_token=token)


@router.get("/me", response_model=UserPublic)
def read_me(current_user: Annotated[User, Depends(get_current_user)]):
    return UserPublic(id=str(current_user.id), email=current_user.email)
