from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.routes import auth as auth_routes
from app.api.routes import qr as qr_routes
from app.core.config import parse_cors_csv, settings
from app.db.session import get_db
from app.services import qr_service

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:  # noqa: ARG001
    yield


app = FastAPI(
    title="BBT QR Manager API",
    description="Dynamic QR: scan opens /r/{code}; destination comes from the database.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_cors_csv(settings.CORS_ORIGINS),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix=API_PREFIX)
app.include_router(qr_routes.router, prefix=API_PREFIX)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/r/{short_code}")
def redirect_by_short_code(short_code: str, db: Session = Depends(get_db)):
    destination = qr_service.resolve_destination(db, short_code.strip())
    if destination is None:
        raise HTTPException(status_code=404, detail="QR code not found")
    return RedirectResponse(url=destination, status_code=302)


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(
    request: Request, exc: SQLAlchemyError
):
    return JSONResponse(
        status_code=500,
        content={"detail": "A database error occurred"},
    )
