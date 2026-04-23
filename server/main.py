import database
import models
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from schemas import AuthorSchema, BookSchema, ReviewSchema
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()


class AuthorCreate(BaseModel):
    name: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép tất cả các nguồn (để dev cho dễ)
    allow_credentials=True,
    allow_methods=["*"],  # Cho phép tất cả các phương thức (GET, POST, PUT, DELETE...)
    allow_headers=["*"],
)


# --- AUTHORS ---
@app.post("/author")
def create_author(data: AuthorSchema, db: Session = Depends(database.get_db)):
    new_author = models.Author(name=data.name)
    db.add(new_author)
    db.commit()
    return {"message": "Success"}


@app.put("/authors/{author_id}")
def update_author(
    author_id: int,
    data: AuthorSchema,
    db: Session = Depends(database.get_db),
):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    if data.name:
        author.name = data.name
    db.commit()
    return {"message": "Author updated"}


@app.delete("/authors/{author_id}")
def delete_author(author_id: int, db: Session = Depends(database.get_db)):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    db.delete(author)
    db.commit()
    return {"message": "Author deleted"}


@app.get("/authors")
def list_authors(
    skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)
):
    authors = db.query(models.Author).offset(skip).limit(limit).all()
    total = db.query(models.Author).count()

    data = []
    for a in authors:
        data.append(
            {
                "id": a.id,
                "name": a.name,
                "books": len(a.books),  # Đếm số lượng sách thực tế trong quan hệ
            }
        )

    return {"data": data, "total": total}


# --- BOOKS ---
@app.post("/book")
def create_book(data: BookSchema, db: Session = Depends(database.get_db)):
    # Kiểm tra xem tác giả có tồn tại không
    author = db.query(models.Author).filter(models.Author.id == data.author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    book = models.Book(title=data.title, author_id=data.author_id)
    db.add(book)
    db.commit()
    return {"message": "Book created"}


@app.put("/books/{book_id}")
def update_book(book_id: int, data: BookSchema, db: Session = Depends(database.get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.title = data.title
    book.author_id = data.author_id
    db.commit()
    return {"message": "Book updated"}


@app.delete("/books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(database.get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(book)
    db.commit()
    return {"message": "Book deleted"}


@app.get("/books")
def list_books(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    books = db.query(models.Book).offset(skip).limit(limit).all()
    total = db.query(models.Book).count()  # Đếm tổng để FE tính số trang

    return {
        "data": [
            {
                "id": b.id,
                "title": b.title,
                "author_id": b.author_id,  # FE cần ID để làm dropdown
                "author": b.author.name if b.author else "Unknown",
            }
            for b in books
        ],
        "total": total,
    }


# --- REVIEWS ---
@app.post("/review")
def create_review(data: ReviewSchema, db: Session = Depends(database.get_db)):
    # Kiểm tra xem sách có tồn tại không
    book = db.query(models.Book).filter(models.Book.id == data.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    review = models.Review(content=data.content, book_id=data.book_id)
    db.add(review)
    db.commit()
    return {"message": "Review created"}


@app.put("/reviews/{review_id}")
def update_review(
    review_id: int, data: ReviewSchema, db: Session = Depends(database.get_db)
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.content = data.content
    db.commit()
    return {"message": "Review updated"}


@app.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(database.get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    return {"message": "Review deleted"}


@app.get("/reviews")
def list_reviews(
    skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)
):
    reviews = db.query(models.Review).offset(skip).limit(limit).all()
    total = db.query(models.Review).count()

    return {
        "data": [
            {
                "id": r.id,
                "content": r.content,
                "book_id": r.book_id,
                "book_title": r.book.title if r.book else "Unknown",
                "author_name": r.book.author.name
                if (r.book and r.book.author)
                else "Unknown",  # Lấy tên tác giả
            }
            for r in reviews
        ],
        "total": total,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
