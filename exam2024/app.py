from flask import Flask, render_template,url_for, request, session, redirect, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from mysql_db import MySQL
import string
from functools import wraps


app = Flask(__name__)

login_manager = LoginManager()

login_manager.init_app(app)

db = MySQL(app)

login_manager.login_view = 'login'
login_manager.login_message = 'Для доступа к данной странице необходимо пройти аутентификацию'
login_manager.login_message_category = "warning" 

application = app


app.config.from_pyfile('config.py')

class User(UserMixin):
    def __init__(self, user_id, login):
        self.id = user_id
        self.login = login

    

@login_manager.user_loader
def load_user(user_id):
    cursor = db.connection().cursor(named_tuple=True)
    query = 'SELECT id, login FROM users3 WHERE users3.id = %s'
    cursor.execute(query, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        return User(user.id, user.login)
    return None

@app.route('/')
def index():
    # Здесь должен быть код для извлечения списка книг из базы данных
    # и их сортировки по дате выхода с пагинацией
    cursor = db.connection().cursor(named_tuple=True)
    query = 'SELECT id, title, year, publisher, author FROM books'
    cursor.execute(query)
    books = cursor.fetchall()
    cursor.close()
    return render_template('index.html', books=books)   


@app.route('/login', methods=['GET', 'POST'])
def login():
    error_login = None
    error_passwd = None
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        remember = request.form.get('remember') == 'on'
        if check_login(login) != None or check_passwd(password) != None:
            error_login = check_login(login)
            error_passwd = check_passwd(password)
            return render_template('login.html', error_login=error_login, error_passwd=error_passwd)
        cursor = db.connection().cursor(named_tuple=True)
        query = 'SELECT * FROM users WHERE users.login = %s and users.password_hash = SHA2(%s, 256)'
        cursor.execute(query, (login,password))
        user = cursor.fetchone()
        cursor.close()
        if user:
                login_user(User(user.id, user.login),remember = remember)
                param = request.args.get('next')
                flash('Успешный вход','success')
                return redirect(param or url_for('index'))
        flash('Логин или пароль введены неверно','danger')
    return render_template('login.html')
    

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

def check_login(login):
    if len(login) < 5:
        return 'Длина логина не может быть меньше 5'
    
    elif not all([char in string.ascii_letters and char in string.digits for char in login]):
        return 'Логин должен состоять только из латинских букв и цифр'
    
    return None

def check_passwd(passwd):
    upper_letters = string.ascii_uppercase + 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    lower_letters = string.ascii_lowercase + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
    perm_letters = r'~!?@#$%^&*_-+()[]{\}></\|\"\'.,:;'

    if len(passwd) < 8:
        return 'Пароль должен содержать не менее 8 символов'
    elif len(passwd) > 128:
        return 'Пароль не должен превышать 128 символов'
    elif not any([char in upper_letters for char in passwd]) and not any([char in lower_letters for char in passwd]):
        return 'Пароль должен состоять как минимум из одной заглавной и одной строчной буквы'
    elif not all([char in (upper_letters + lower_letters + perm_letters) for char in passwd]):
        return 'Пароль должен состоять только из латинских или кириллических букв'
    elif not any([char in string.digits for char in passwd]):
        return 'Пароль должен состоять хотя бы из одной цифры'
    elif ' ' in passwd:
        return 'Пароль не должен содержать пробелы'
    
    return None


# Декоратор для проверки прав пользователя
def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'role' not in session or session['role'] not in role:
                flash('У вас недостаточно прав для выполнения данного действия')
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator


@app.route('/book/<int:book_id>')
@login_required
def view_book(book_id):
    # Здесь должен быть код для отображения информации о книге
    return render_template('view_book.html', book_id=book_id)

@app.route('/book/edit/<int:book_id>', methods=['GET', 'POST'])
@login_required
@role_required(['Администратор', 'Модератор'])
def edit_book(book_id):
    # Здесь должен быть код для редактирования книги
    return render_template('edit_book.html', book_id=book_id)

@app.route('/book/delete/<int:book_id>')
@login_required
@role_required(['Администратор'])
def delete_book(book_id):
    # Здесь должен быть код для удаления книги
    return redirect(url_for('index'))

@app.route('/book/add', methods=['GET', 'POST'])
@login_required
@role_required(['Администратор'])
def add_book():
    # Здесь должен быть код для добавления новой книги
    return render_template('add_book.html')

if __name__ == '__main__':
    app.run(debug=True)
