from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, create_engine
from sqlalchemy.orm import relationship, declarative_base, sessionmaker
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from check_rights import CheckRights

Base = declarative_base()

db = SQLAlchemy(model_class=Base)

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
    
    def __repr__(self):
        return '<Book %r>' % self.name

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


class User(Base, UserMixin):
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
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @property
    def full_name(self):
        return ' '.join([self.last_name, self.first_name, self.middle_name or ''])

    def __repr__(self):
        return '<User %r>' % self.login
    
    def is_admin(self):
        return self.role.name == 'Администратор'

    def is_moderator(self):
        return self.role.name == 'Модератор'

    def is_user(self):
        return self.role.name == 'Пользователь'
    
    def can(self, action):
        # Проверяем, имеет ли пользователь право на выполнение действия
        if not self.is_authenticated:
            return False
        if action == 'edit_book' and (self.is_admin or self.is_moderator):
            return True
        if action == 'delete_book' and self.is_admin:
            return True
        if action == 'review_book' and (self.is_user or self.is_moderator or self.is_admin):
            return True
        return False

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
    

