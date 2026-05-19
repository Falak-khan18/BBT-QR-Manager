import uuid
from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class QRCreate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    destination_url: HttpUrl | str

    @property
    def destination_url_str(self) -> str:
        return str(self.destination_url)


class QRUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    destination_url: HttpUrl | str | None = None

    @property
    def destination_url_str(self) -> str | None:
        if self.destination_url is None:
            return None
        return str(self.destination_url)


class QRRead(BaseModel):
    id: uuid.UUID
    short_code: str
    title: str | None
    destination_url: str
    redirect_url: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
