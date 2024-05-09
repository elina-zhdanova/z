from flask import Flask, render_template, url_for, request, session, redirect, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required

app=Flask(__name__)

application = app

#Для загрузки переменных конфигурации из папки экземпляра
app.config.from_pyfile('config.py')

# позволяет приложению и flask login работать вместе например, 
# как загружать пользователя по идентификатору, куда отправлять пользователей, когда им нужно войти в систему, и тому подобное.
login_manager = LoginManager() 
#После создания фактического объекта приложения вы можете настроить его для входа с помощью:
login_manager.init_app(app)

login_manager.login_view = 'login' #Название представления, на которое нужно перенаправлять, когда пользователю необходимо войти в систему
login_manager.login_message = 'Для доступа пройдите авторизацию' #Сообщение, которое отображается, когда пользователь перенаправляется на страницу входа в систему
login_manager.login_message_category = "warning" 



class User(UserMixin):
    def __init__(self, user_id, login):
        self.id = user_id
        self.login = login

users = [
    {
        'id': 1,
        'login': 'user',
        'password': '123',
    },
]

# для аутентификации и загрузки пользователя на основании предоставленного идентификатора пользователя
#load_user функция вызывается при каждом запросе и должна вернуть объект пользователя, представляющего пользователя, аутентифицированного по user_id
@login_manager.user_loader
def load_user(user_id):
    for user in users:
        if user['id'] == int(user_id):
            return User(user['id'], user['login'])
    return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/counter')
def counter():
    if 'count' in session:
        session['count'] += 1
    else:
        session['count'] = 1
    return render_template('counter.html')

@app.route('/secret', methods = ['GET'])
@login_required
def secret():
    return render_template('secret.html')

@app.route('/auth')
def auth():
    return render_template('auth.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        login = request.form['login']
        password = request.form['password']
        check = request.form.get('secretcheck') == 'on'
        for user in users:
            if login == user['login'] and password == user['password']:
                login_user(User(user['id'], user['login']), remember=check)
                param_url = request.args.get('next')
                flash('Вы успешно вошли!!!', 'success')
                return redirect(param_url or url_for('index'))
        else: 
            flash('Логин или пароль введены неверно','danger')
    return render_template('login.html')
    
@app.route('/logout', methods = ['GET'])
def logout():   
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':  
   app.run()