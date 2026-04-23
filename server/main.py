from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Cấu hình DB (Thay thông tin của bạn vào đây)
DATABASE_URL = "postgresql://admin:admin@localhost:5432/book_review_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# 2. Định nghĩa model Author
class Author(Base):
    __tablename__ = "authors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)


# Tạo bảng nếu chưa có
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Cấu hình CORS để frontend React kết nối được
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuthorCreate(BaseModel):
    name: str


# API Lấy danh sách Author
@app.get("/authors")
def get_authors():
    db = SessionLocal()
    authors = db.query(Author).all()
    db.close()
    return authors


# API Tạo mới Author
@app.post("/authors")
def create_author(author: AuthorCreate):
    db = SessionLocal()
    new_author = Author(name=author.name)
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    db.close()
    return new_author


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
