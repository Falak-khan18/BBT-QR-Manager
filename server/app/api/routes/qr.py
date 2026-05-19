import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.qr import QRCreate, QRRead, QRUpdate
from app.services import qr_service

router = APIRouter(prefix="/qr", tags=["qr"])


@router.get("", response_model=list[QRRead])
def list_qr_codes(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return qr_service.list_qrs_for_owner(db, current_user.id)


@router.post("", response_model=QRRead, status_code=status.HTTP_201_CREATED)
def create_qr_code(
    body: QRCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return qr_service.create_qr(db, current_user.id, body)


@router.get("/{qr_id}", response_model=QRRead)
def get_qr_code(
    qr_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    row = qr_service.get_qr_for_owner(db, current_user.id, qr_id)
    if row is None:
        raise HTTPException(status_code=404, detail="QR code not found")
    return qr_service.to_read(row)


@router.patch("/{qr_id}", response_model=QRRead)
def patch_qr_code(
    qr_id: uuid.UUID,
    body: QRUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        updated = qr_service.update_qr(db, current_user.id, qr_id, body)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if updated is None:
        raise HTTPException(status_code=404, detail="QR code not found")
    return updated


@router.delete("/{qr_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_qr_code(
    qr_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    ok = qr_service.delete_qr(db, current_user.id, qr_id)
    if not ok:
        raise HTTPException(status_code=404, detail="QR code not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
