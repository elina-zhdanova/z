from flask import Flask, render_template, redirect, flash, url_for, request
from flask_login import login_required, current_user, LoginManager, login_user, logout_user, current_user
from flask_migrate import Migrate
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from models import Role, db, Book, User
from check_rights import CheckRights
from functools import wraps

app = Flask(__name__)
application = app

app.config.from_pyfile('config.py')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# def load_user(user_id):
#     user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar()
#     return user

def load_user(user_id):
    return User.query.get(int(user_id))

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.login_view = 'login'
    login_manager.login_message = 'Для доступа к данной странице необходимо пройти процедуру аутентификации.'
    login_manager.login_message_category = 'warning'
    login_manager.user_loader(load_user)
    login_manager.init_app(app)

init_login_manager(app)



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login = request.form.get('login')
        password = request.form.get('password')
        remember = request.form.get('remember') == 'on'
        if login and password:
            user = db.session.execute(db.select(User).filter_by(login=login)).scalar()
            if user and user.check_password(password):
                login_user(user, remember = remember)
                flash('Вы успешно аутентифицированы.', 'success')
                next = request.args.get('next')
                return redirect(next or url_for('index'))
        flash('Введены неверные логин и/или пароль.', 'danger')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.errorhandler(SQLAlchemyError)
def handle_sqlalchemy_error(err):
    error_msg = ('Возникла ошибка при подключении к базе данных. '
                 'Повторите попытку позже.')
    return f'{error_msg} (Подробнее: {err})', 500


# @app.route('/')
# def index():
#     books = Book.query.all()
#     return render_template('index.html', books=books)

@app.route('/')
def index():
    books = db.session.execute(db.select(Book)).scalars()
    return render_template(
    'index.html',
    books=books,
    )


# def get_roles():
#     cursor = db.connection().cursor(named_tuple=True)
#     query = 'SELECT * FROM roles'
#     cursor.execute(query)
#     roles = cursor.fetchall()
#     cursor.close()
#     return roles

def get_roles():
    roles = db.session.execute(db.select(Role)).scalars().all()
    return roles


@app.route('/createuser', methods=["GET", "POST"])
# @login_required 
def createuser():
    if request.method == 'GET':
        roles = get_roles()
        return render_template('createuser.html', roles=roles)

    elif request.method == "POST":
        login = request.form['login']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        password = request.form['password']
        role_id = request.form['role']

        # Проверяем, существует ли уже пользователь с таким логином
        existing_user = User.query.filter_by(login=login).first()
        if existing_user:
            flash('Пользователь с таким логином уже существует', 'error')
            return redirect(url_for('createuser'))

        # Создаем нового пользователя
        new_user = User(
            login=login,
            password_hash=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            role_id=role_id
        )
        # Добавляем пользователя в сессию и сохраняем изменения
        db.session.add(new_user)
        db.session.commit()
        flash('Пользователь успешно создан', 'success')
        return redirect(url_for('login'))


@app.route('/book/<int:book_id>')
@login_required
def view_book(book_id):
    # Получаем объект книги по её id
    book = Book.query.get(book_id)
    if book is None:
        flash('Книга не найдена.', 'error')
        return redirect(url_for('index'))

    # Получаем жанры и обложку книги
    genres = book.genres
    cover = book.cover
    
    # Вычисляем среднюю оценку и количество рецензий
    average_rating = book.average_rating
    review_count = book.review_count
    
    # Отображаем шаблон, передавая в него данные о книге
    return render_template(
        'view_book.html',
        book=book,
        genres=genres,
        cover=cover,
        average_rating=average_rating,
        review_count=review_count
    )



@app.route('/book/edit/<int:book_id>', methods=['GET', 'POST'])
@login_required
def edit_book(book_id):
    # Здесь должен быть код для редактирования книги
    if not CheckRights.edit():
        flash('У вас нет прав для редактирования этой книги', 'error')
        return redirect(url_for('index'))
    
    return render_template('edit_book.html', book_id=book_id)

@app.route('/book/delete/<int:book_id>', methods=['GET', 'POST'])
@login_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id) #Ищет книгу в базе данных по book_id, Если книга не найдена, будет возвращена ошибка 404.
    if not CheckRights.delete():
        flash('У вас нет прав для удаления этой книги', 'error')
        return redirect(url_for('index'))
    if request.method == 'POST':
        db.session.delete(book)
        db.session.commit()
        flash('Книга успешно удалена', 'success')
        return redirect(url_for('index'))
    # Если метод GET, отображаем страницу с формой для подтверждения удаления
    return render_template('delete_book.html', book=book)



@app.route('/book/add', methods=['GET', 'POST'])
@login_required
def add_book():
    if not CheckRights.create():
        flash('У вас нет прав для редактирования этой книги', 'error')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        # Здесь код для обработки данных формы и добавления книги
        new_book = Book(
            title=request.form['title'],
            description=request.form['description'],
            year=request.form['year'],
            publisher=request.form['publisher'],
            author=request.form['author'],
            page_count=request.form['page_count'],
            cover_id=request.form['cover_id']
        )
        db.session.add(new_book)
        db.session.commit()
        flash('Книга успешно добавлена', 'success')
        return redirect(url_for('index'))
    # Если метод GET, отображаем форму для добавления книги
    return render_template('add_book.html')


if __name__ == '__main__':
    app.run(debug=True)
