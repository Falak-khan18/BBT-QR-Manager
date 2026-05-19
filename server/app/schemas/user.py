from pydantic import BaseModel, EmailStr


class UserPublic(BaseModel):
    id: str
    email: EmailStr

    model_config = {"from_attributes": True}
