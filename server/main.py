import database
import models
from fastapi import Depends, FastAPI
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


@app.get("/authors")
def list_authors(db: Session = Depends(database.get_db)):
    return db.query(models.Author).all()


# --- BOOKS (Chưa có Author ID) ---
@app.post("/books")
def create_book(title: str, db: Session = Depends(database.get_db)):
    book = models.Book(title=title)
    db.add(book)
    db.commit()
    return {"message": "Book created"}


@app.get("/books")
def list_books(db: Session = Depends(database.get_db)):
    return db.query(models.Book).all()


# --- REVIEWS (Chưa có Book ID) ---
@app.post("/reviews")
def create_review(content: str, db: Session = Depends(database.get_db)):
    rev = models.Review(content=content)
    db.add(rev)
    db.commit()
    return {"message": "Review created"}


@app.get("/books")
def list_reviews(db: Session = Depends(database.get_db)):
    return db.query(models.Review).all()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
