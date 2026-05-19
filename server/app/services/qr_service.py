import secrets
import string
import uuid

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.qr_code import QRCode
from app.schemas.qr import QRCreate, QRRead, QRUpdate

_ALPHABET = string.ascii_letters + string.digits


def _make_short_code(length: int = 8) -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(length))


def _public_redirect_url(short_code: str) -> str:
    base = str(settings.REDIRECT_BASE_URL).rstrip("/")
    return f"{base}/r/{short_code}"


def to_read(model: QRCode) -> QRRead:
    return QRRead(
        id=model.id,
        short_code=model.short_code,
        title=model.title,
        destination_url=model.destination_url,
        redirect_url=_public_redirect_url(model.short_code),
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


def generate_unique_short_code(db: Session) -> str:
    for _ in range(20):
        code = _make_short_code()
        exists = db.scalars(
            select(QRCode.id).where(QRCode.short_code == code)
        ).first()
        if not exists:
            return code
    raise RuntimeError("Could not allocate short code")


def create_qr(db: Session, owner_id: uuid.UUID, data: QRCreate) -> QRRead:
    short_code = generate_unique_short_code(db)
    row = QRCode(
        short_code=short_code,
        title=data.title,
        destination_url=data.destination_url_str,
        owner_id=owner_id,
    )
    db.add(row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(row)
    return to_read(row)


def list_qrs_for_owner(db: Session, owner_id: uuid.UUID) -> list[QRRead]:
    rows = db.scalars(
        select(QRCode)
        .where(QRCode.owner_id == owner_id)
        .order_by(QRCode.created_at.desc())
    ).all()
    return [to_read(r) for r in rows]


def get_qr_for_owner(
    db: Session, owner_id: uuid.UUID, qr_id: uuid.UUID
) -> QRCode | None:
    return db.scalars(
        select(QRCode).where(
            QRCode.id == qr_id,
            QRCode.owner_id == owner_id,
        )
    ).first()


def update_qr(
    db: Session, owner_id: uuid.UUID, qr_id: uuid.UUID, data: QRUpdate
) -> QRRead | None:
    row = get_qr_for_owner(db, owner_id, qr_id)
    if row is None:
        return None
    if "title" in data.model_fields_set:
        row.title = data.title
    if "destination_url" in data.model_fields_set:
        if data.destination_url is None:
            raise ValueError("destination_url cannot be null")
        row.destination_url = data.destination_url_str
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise
    db.refresh(row)
    return to_read(row)


def delete_qr(db: Session, owner_id: uuid.UUID, qr_id: uuid.UUID) -> bool:
    row = get_qr_for_owner(db, owner_id, qr_id)
    if row is None:
        return False
    db.delete(row)
    db.commit()
    return True


def resolve_destination(db: Session, short_code: str) -> str | None:
    row = db.scalars(
        select(QRCode).where(QRCode.short_code == short_code)
    ).first()
    if row is None:
        return None
    return row.destination_url
