from flask import Flask, render_template, request, redirect, url_for, flash, send_file, send_from_directory
from flask_login import login_required, current_user, LoginManager, UserMixin, login_user, logout_user
from mysql_db import MySQL
import mysql.connector
from typing import Dict
import re
import math
import markdown
from check_user import CheckUser
from functools import wraps
import hashlib
import nh3
import os

app = Flask(__name__)

application = app

app.config.from_pyfile('config.py')

db = MySQL(app)

ADMIN_ROLE_ID = 1
MODER_ROLE_ID = 3


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Для доступа необходимо пройти аутентификацию'
login_manager.login_message_category = 'warning'


def check_rights(action):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = None
            if kwargs.get('user_id'):
                user_id = kwargs['user_id']
                user = load_user(user_id)
            if current_user.can(action, user):
                return func(*args, **kwargs)
            else:
                flash("У вас недостаточно прав для доступа к данной странице.", "danger")
                return redirect(url_for('show_users'))

        return wrapper

    return decorator


class User(UserMixin):
    def __init__(self, user_id, user_login, role_id, name):
        self.id = user_id
        self.login = user_login
        self.role_id = role_id
        self.name = name

    def is_admin(self):
        return self.role_id == ADMIN_ROLE_ID

    def is_moder(self):
        return self.role_id == MODER_ROLE_ID

    def can(self, action, record=None):
        check_user = CheckUser(record)
        method = getattr(check_user, action, None)
        if method:
            return method()
        return False

@login_manager.user_loader
def load_user(user_id):
    query = 'SELECT * FROM Users WHERE Users.id=%s'
    user = None
    try:
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        cursor.close()
        if user:
            name = '%s %s %s' % (user.first_name, user.middle_name, user.last_name)
            return User(user.id, user.login, user.rid, name)
    except mysql.connector.errors.DatabaseError as e:
        db.connection().rollback()
        flash('Database error: {}'.format(e), 'danger')
    except Exception as e:
        flash('An error occurred: {}'.format(e), 'danger')

    return None


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        check = request.form.get('secretcheck') == 'on'
        query = 'SELECT * FROM Users WHERE Users.login=%s AND Users.hash=SHA2(%s,256)'
        user = None
        try:
            cursor = db.connection().cursor(named_tuple=True)
            cursor.execute(query, (login, password))
            user = cursor.fetchone()
            cursor.close()

            if user:
                name = '%s %s %s' % (user.first_name, user.middle_name, user.last_name)
                login_user(User(user.id, user.login, user.rid, name), remember=check)
                param_url = request.args.get('next')
                flash('Вы успешно вошли!', 'success')
                return redirect(param_url or url_for('index'))
            else:
                flash('Неверный логин или пароль.', 'danger')
        except mysql.connector.errors.DatabaseError as e:
            db.connection().rollback()
            flash('Database error: {}'.format(e), 'danger')
        except Exception as e:
            flash('An error occurred: {}'.format(e), 'danger')

    return render_template('login.html')


@app.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return redirect(url_for('index'))

PER_PAGE = 10

@app.route('/get_image', methods=['GET'])
def get_image():
    md5 = request.args.get('md5')
    mime = request.args.get('mime')
    filename = f"{md5}.{mime.split('/')[1]}"
    return send_from_directory('images', filename)

@app.route('/')
def index():
    querry_count = '''SELECT COUNT(*) as cnt FROM Books'''
    cursor = db.connection().cursor(named_tuple=True)
    cursor.execute(querry_count)
    count = math.ceil((cursor.fetchone().cnt) / PER_PAGE)
    cursor.close()

    querry_data = '''
    SELECT Books.name as name, Books.year as year, Skins.mime as mime, Skins.md5 as md5, GROUP_CONCAT(Genres.name) as genres,  
    AVG(IFNULL(Reviews.mark, 0)) as mark, count(Reviews.id) as reviews, Books.id as id FROM Books 
    LEFT JOIN Skins ON Books.skin = Skins.id
    LEFT JOIN Reviews ON Reviews.bid = Books.id
    LEFT JOIN GenresBooks ON GenresBooks.bid = Books.id
    LEFT JOIN Genres ON GenresBooks.gid = Genres.id
    group by Books.id
    ORDER BY Books.year DESC
    LIMIT %s OFFSET %s
    '''
    values = []
    try:
        page = int(request.args.get('page', 1))
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(querry_data, (PER_PAGE, PER_PAGE * (page - 1)))
        values = cursor.fetchall()
        cursor.close()
    except mysql.connector.errors.DatabaseError:
        db.connection().rollback()
        flash(f'При создании обложки произошла ошибка.', 'danger')

    return render_template('index.html', values=values, count=count, page=page)

def get_roles():
    query = 'SELECT * FROM Roles'
    cursor = db.connection().cursor(named_tuple=True)
    cursor.execute(query)
    roles = cursor.fetchall()
    cursor.close()
    return roles

@app.route('/show_book/<int:index>')
def show_book(index):
    querry_data = '''
    SELECT * from Books where id = %s
    '''
    values = []
    try:
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(querry_data, (index, ))
        values = cursor.fetchone()
        cursor.close()
    except mysql.connector.errors.DatabaseError:
        db.connection().rollback()
        flash(f'При загрузке книги произошла ошибка.', 'danger')

    about = markdown.markdown(values.about)

    querry_data = '''
    SELECT mime, md5 FROM Skins where id = %s
    '''
    try:
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(querry_data, (values.skin, ))
        skin = cursor.fetchone()
        cursor.close()
    except mysql.connector.errors.DatabaseError:
        db.connection().rollback()
        flash(f'При создании обложки произошла ошибка.', 'danger')

    querry_data = '''
    SELECT mark, text, data, login, uid from Reviews 
    LEFT JOIN Users ON Reviews.uid = Users.id
    where bid = %s and status = 2 
    '''
    try:
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(querry_data, (index, ))
        reviews = cursor.fetchall()
        cursor.close()
    except mysql.connector.errors.DatabaseError:
        db.connection().rollback()
        flash(f'При загрузке рецензий произошла ошибка.', 'danger')

    if not current_user.is_anonymous:
        for review in reviews:
            if review.uid == current_user.id:
                my_review = review
                return render_template('show_book.html', values = values, reviews = reviews, skin = skin, about = about, my_review = my_review)
    return render_template('show_book.html', values = values, reviews = reviews, skin = skin, about = about)


def validate(name, about, author, pub, pages, year, genres, userfile):
    errors = {}
    if not name:
        errors['name_message'] = "Название не может быть пустым"
    if not about:
        errors['about_message'] = "Описание не может быть пустым"
    if not author:
        errors['author_message'] = "Автор не должен быть пустым"
    if not pub:
        errors['pub_message'] = "Издательство не должно быть пустым"
    if not pages:
        errors['pages_message'] = "К-во страниц не должно быть пустым"
    if not year or int(year) < 1900 or int(year) > 2155:
        errors['year_message'] = "Год должен быть в пределах от 1900 до 2155"
    if not genres:
        errors['genres_message'] = "Жанры не могут быть пустыми"
    if not userfile:
        errors['userfile_message'] = "Обложка не может быть пустой"

    return errors

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin():
            flash('У вас недостаточно прав для доступа к данной странице.', 'danger')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

def moder_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated and (current_user.is_admin() or current_user.is_moder()):
            return f(*args, **kwargs)
        flash('У вас недостаточно прав для доступа к данной странице.', 'danger')
        return redirect(url_for('index'))
    return decorated_function

@app.route('/create', methods=['POST', 'GET'])
@admin_required
def create():
    query = '''select name from Genres'''
    cursor = db.connection().cursor(named_tuple=True)
    cursor.execute(query)
    genres_start = cursor.fetchall()
    cursor.close()

    if request.method == 'POST':
        name = request.form['name']
        about = request.form['about']
        about = nh3.clean(about)
        author = request.form['author']
        pub = request.form['pub']
        pages = request.form['pages']
        year = request.form['year']
        genres = request.form.getlist('genres')
        userfile = request.files['userfile']

        errors = validate(name, about, author, pub, pages, year, genres, userfile)
        if len(errors.keys()) > 0:
            return render_template('admin/create.html', genres=genres_start, **errors)

        md5_hash = hashlib.md5(userfile.read()).hexdigest()
        mime_type = userfile.mimetype
        name_f = f"{md5_hash}.{mime_type.split('/')[1]}"

        try:
            query = '''
                select id from Skins where md5 = %s
                '''
            cursor = db.connection().cursor(named_tuple=True)
            cursor.execute(query, (md5_hash,))
            skin = cursor.fetchone()
            cursor.close()
            if not skin:
                query = '''
                insert into Skins (md5, mime, name) values (%s, %s, %s)
                '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (md5_hash, mime_type, name_f))
                db.connection().commit()
                cursor.close()

                query = '''
                select id from Skins where md5 = %s
                '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (md5_hash,))
                skin = cursor.fetchone()
                cursor.close()

                userfile.seek(0)

                if not os.path.exists('images'):
                    os.makedirs('images')

                userfile.save(os.path.join('images', name_f))
                flash(f'Обложка {skin.id} успешно создана.', 'success')
        except mysql.connector.errors.DatabaseError:
            db.connection().rollback()
            flash(f'При создании обложки произошла ошибка.', 'danger')
            return render_template('admin/create.html', genres=genres_start)

        try:
            query = '''
                insert into Books (name, about, author, pub, pages, year, skin)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                '''
            cursor = db.connection().cursor(named_tuple=True)
            cursor.execute(query, (name, about, author, pub, pages, year, skin.id))
            db.connection().commit()
            cursor.close()

            query = '''
                select id from Books ORDER BY id DESC LIMIT 1
                '''
            cursor = db.connection().cursor(named_tuple=True)
            cursor.execute(query)
            book = cursor.fetchone()
            cursor.close()
            flash(f'Книга {book.id} успешно создана.', 'success')
        except mysql.connector.errors.DatabaseError:
            db.connection().rollback()
            flash(f'При создании книги произошла ошибка.', 'danger')
            return render_template('admin/create.html', genres=genres_start)

        try:
            for genre in genres:
                query = '''
                    select id from Genres where name = %s
                    '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (genre,))
                genreId = cursor.fetchone()
                cursor.close()

                query = '''
                    insert into GenresBooks (bid, gid) Values (%s, %s)
                    '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (book.id, genreId.id))
                db.connection().commit()
                cursor.close()
            flash(f'Жанры успешно созданы.', 'success')
        except mysql.connector.errors.DatabaseError:
            db.connection().rollback()
            flash(f'При заполнении жанров произошла ошибка.', 'danger')
            return render_template('admin/create.html', genres=genres_start)
        return render_template('admin/create.html', genres=genres_start)
    return render_template('admin/create.html', genres=genres_start)


@app.route('/edit_book/<int:index>', methods=['POST', 'GET'])
@moder_required
def edit_book(index):
    query = '''select name from Genres'''
    cursor = db.connection().cursor(named_tuple=True)
    cursor.execute(query)
    genres_start = cursor.fetchall()
    cursor.close()

    query = '''select * from Books where id = %s'''
    cursor = db.connection().cursor(named_tuple=True)
    cursor.execute(query, (index,))
    book_start = cursor.fetchone()
    cursor.close()

    if request.method == 'POST':
        name = request.form['name']
        about = request.form['about']
        about = nh3.clean(about)
        author = request.form['author']
        pub = request.form['pub']
        pages = request.form['pages']
        year = request.form['year']
        genres = request.form.getlist('genres')

        errors = validate(name, about, author, pub, pages, year, genres, 'Ok')
        if len(errors.keys()) > 0:
            return render_template('admin/edit.html', genres=genres_start, book_start=book_start)

        try:
            query = '''
                update Books set name = %s, about = %s, author = %s, pub = %s, pages = %s, year = %s where id = %s
                '''
            cursor = db.connection().cursor(named_tuple=True)
            cursor.execute(query, (name, about, author, pub, pages, year, index))
            db.connection().commit()
            cursor.close()

            flash(f'Книга {index} успешно создана.', 'success')
        except mysql.connector.errors.DatabaseError:
            db.connection().rollback()
            flash(f'При создании книги произошла ошибка.', 'danger')
            return render_template('admin/edit.html', genres=genres_start, book_start=book_start)

        query = '''
                    delete from GenresBooks where bid = %s
                    '''
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(query, (index,))
        db.connection().commit()
        cursor.close()

        try:
            for genre in genres:
                query = '''
                    select id from Genres where name = %s
                    '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (genre,))
                genreId = cursor.fetchone()
                cursor.close()

                query = '''
                    insert into GenresBooks (bid, gid) Values (%s, %s)
                    '''
                cursor = db.connection().cursor(named_tuple=True)
                cursor.execute(query, (index, genreId.id))
                db.connection().commit()
                cursor.close()
            flash(f'Жанры успешно созданы.', 'success')
        except mysql.connector.errors.DatabaseError:
            db.connection().rollback()
            flash(f'При заполнении жанров произошла ошибка.', 'danger')
            return render_template('admin/edit.html', genres=genres_start, book_start=book_start)
        return render_template('admin/edit.html', genres=genres_start, book_start=book_start)
    return render_template('admin/edit.html', genres=genres_start, book_start=book_start)


@app.route('/delete/<int:index>')
@admin_required
def delete_book(index):
    try:
        query = '''
            select name FROM Books WHERE id = %s;
            '''
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(query, (index,))
        book = cursor.fetchone()
        cursor.close()
        flash(f'Книга {index} не успешно удалена.', 'success')
        query = '''
            DELETE FROM Books WHERE id = %s;
            '''
        cursor = db.connection().cursor(named_tuple=True)
        cursor.execute(query, (index,))
        db.connection().commit()
        cursor.close()
        flash(f'Книга {book.name} успешно удалена.', 'success')
    except mysql.connector.errors.DatabaseError:
        db.connection().rollback()
        flash(f'При удалении книги произошла ошибка.', 'danger')
    return redirect(url_for('index', index=index))

if __name__ == '__main__':
   app.run(debug=True)