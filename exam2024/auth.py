from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from models import db, User
import string
from app import db
from check_rights import CheckRights
from mysql_db import MySQL
from functools import wraps

bp = Blueprint('auth', __name__, url_prefix='/auth')

def check_perm(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                flash('Для выполнения данного действия необходимо пройти процедуру аутентификации', 'warning')
                return redirect(url_for('login'))
            user_role = current_user.role.name
            if user_role not in role:
                flash('У вас нет прав для доступа к этой странице', 'error')
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def init_login_manager(app):
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Для доступа к данной странице необходимо пройти процедуру аутентификации.'
    login_manager.login_message_category = 'warning'
    login_manager.user_loader(load_user)
    login_manager.init_app(app)

def load_user(user_id):
    user = db.session.execute(db.select(User).filter_by(id=user_id)).scalar()
    return user

@bp.route('/login', methods=['GET', 'POST'])
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
    return render_template('auth/login.html')

@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

# def check_login(login):
#     if len(login) < 5:
#         return 'Длина логина не может быть меньше 5'
    
#     elif not all([char in string.ascii_letters and char in string.digits for char in login]):
#         return 'Логин должен состоять только из латинских букв и цифр'
    
#     return None

# def check_passwd(passwd):
#     upper_letters = string.ascii_uppercase + 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
#     lower_letters = string.ascii_lowercase + 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'
#     perm_letters = r'~!?@#$%^&*_-+()[]{\}></\|\"\'.,:;'

#     if len(passwd) < 8:
#         return 'Пароль должен содержать не менее 8 символов'
#     elif len(passwd) > 128:
#         return 'Пароль не должен превышать 128 символов'
#     elif not any([char in upper_letters for char in passwd]) and not any([char in lower_letters for char in passwd]):
#         return 'Пароль должен состоять как минимум из одной заглавной и одной строчной буквы'
#     elif not all([char in (upper_letters + lower_letters + perm_letters) for char in passwd]):
#         return 'Пароль должен состоять только из латинских или кириллических букв'
#     elif not any([char in string.digits for char in passwd]):
#         return 'Пароль должен состоять хотя бы из одной цифры'
#     elif ' ' in passwd:
#         return 'Пароль не должен содержать пробелы'
    
#     return None
