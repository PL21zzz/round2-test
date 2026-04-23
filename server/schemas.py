from typing import Optional

from pydantic import BaseModel


class AuthorSchema(BaseModel):
    name: Optional[str] = None


class BookSchema(BaseModel):
    title: Optional[str] = None
    author_id: Optional[int] = None


class ReviewSchema(BaseModel):
    content: Optional[str] = None
    book_id: Optional[int] = None
