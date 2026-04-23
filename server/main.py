import database
import models
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()


# --- AUTHORS ---
@app.post("/authors")
def create_author(name: str, db: Session = Depends(database.get_db)):
    auth = models.Author(name=name)
    db.add(auth)
    db.commit()
    return {"message": "Author created"}


@app.put("/authors/{author_id}")
def update_author(author_id: int, name: str, db: Session = Depends(database.get_db)):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    author.name = name
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
def list_authors(db: Session = Depends(database.get_db)):
    return db.query(models.Author).all()


# --- BOOKS ---
@app.post("/books")
def create_book(title: str, author_id: int, db: Session = Depends(database.get_db)):
    # Kiểm tra xem tác giả có tồn tại không
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(status_code=404, detail="Author not found")

    book = models.Book(title=title, author_id=author_id)
    db.add(book)
    db.commit()
    return {"message": "Book created"}


@app.put("/books/{book_id}")
def update_book(
    book_id: int, title: str, author_id: int, db: Session = Depends(database.get_db)
):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    book.title = title
    book.author_id = author_id
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
def list_books(db: Session = Depends(database.get_db)):
    # Trả về book kèm tên author
    books = db.query(models.Book).all()
    return [
        {
            "id": b.id,
            "title": b.title,
            "author": b.author.name if b.author else "Unknown",
        }
        for b in books
    ]


# --- REVIEWS ---
@app.post("/reviews")
def create_review(content: str, book_id: int, db: Session = Depends(database.get_db)):
    # Kiểm tra xem sách có tồn tại không
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    review = models.Review(content=content, book_id=book_id)
    db.add(review)
    db.commit()
    return {"message": "Review created"}


@app.put("/reviews/{review_id}")
def update_review(review_id: int, content: str, db: Session = Depends(database.get_db)):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.content = content
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
def list_reviews(db: Session = Depends(database.get_db)):
    return db.query(models.Review).all()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
