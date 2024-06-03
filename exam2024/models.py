from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from datetime import datetime

Base = declarative_base()

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    year = Column(Integer, nullable=False)
    publisher = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    page_count = Column(Integer, nullable=False)
    cover_id = Column(Integer, ForeignKey('covers.id'), nullable=False)

    cover = relationship('Cover', back_populates='books')
    genres = relationship('Genre', secondary='book_genres', back_populates='books')
    reviews = relationship('Review', back_populates='book')
    
    # Свойство для подсчета количества оценок
    @property
    def review_count(self):
        return len(self.reviews)
    
    # Свойство для подсчета средней оценки
    @property
    def average_rating(self):
        if self.reviews:
            return sum(review.rating for review in self.reviews) / self.review_count
        return 0  # Возвращаем 0, если у книги нет оценок

class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)

    books = relationship('Book', secondary='book_genres', back_populates='genres')

class Cover(Base):
    __tablename__ = 'covers'

    id = Column(Integer, primary_key=True)
    file_name = Column(String(255), nullable=False)
    mime_type = Column(String(50), nullable=False)
    md5_hash = Column(String(32), nullable=False)

    books = relationship('Book', back_populates='cover')

class BookGenre(Base):
    __tablename__ = 'book_genres'

    book_id = Column(Integer, ForeignKey('books.id'), primary_key=True)
    genre_id = Column(Integer, ForeignKey('genres.id'), primary_key=True)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    login = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    first_name = Column(String(255), nullable=False)
    middle_name = Column(String(255))
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)

    role = relationship('Role', back_populates='users')
    reviews = relationship('Review', back_populates='user')

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=False)

    users = relationship('User', back_populates='role')

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    book_id = Column(Integer, ForeignKey('books.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    rating = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    date_added = Column(DateTime, default=datetime.now)

    book = relationship('Book', back_populates='reviews')
    user = relationship('User', back_populates='reviews')
    
# Создание движка и сессии для подключения к базе данных
engine = create_engine('mysql://username:password@localhost/ElectronicLibrary')
Session = sessionmaker(bind=engine)

# Создание всех таблиц в базе данных
Base.metadata.create_all(engine)
