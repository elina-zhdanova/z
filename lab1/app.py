import random
from flask import Flask, render_template, request, redirect, url_for
from faker import Faker

fake = Faker()

app = Flask(__name__)
application = app

images_ids = ['7d4e9175-95ea-4c5f-8be5-92a6b708bb3c',
              '2d2ab7df-cdbc-48a8-a936-35bba702def5',
              '6e12f3de-d5fd-4ebb-855b-8cbc485278b7',
              'afc2cfe7-5cac-4b80-9b9a-d5c65ef0c728',
              'cab5b7f2-774e-4884-a200-0c0180fa777f']

def generate_comments(replies=True):# replies=True - будут ли генерироваться ответы на комментарии. 
    #По умолчанию -True, что означает генерацию ответов
    #Если передать значение False при вызове функции, ответы на комментарии создаваться не будут.
    comments = []
    for i in range(random.randint(1, 3)):#комментариев от 1 до 3
        comment = { 'author': fake.name(), 'text': fake.text() }
        if replies:
            comment['replies'] = generate_comments(replies=False)#replies=False, чтобы избежать бесконечной рекурсии вложенных комментариев.
        comments.append(comment)
    return comments

def generate_post(i):
    return {
        'title': 'Заголовок поста',
        'text': fake.paragraph(nb_sentences=100), #абзац из 100 предложений
        'author': fake.name(),
        'date': fake.date_time_between(start_date='-2y', end_date='now'),#-2y-2 года назад
        'image_id': f'{images_ids[i]}.jpg',
        'comments': generate_comments()
    }

posts_list = sorted([generate_post(i) for i in range(5)], key=lambda p: p['date'], reverse=True)#список постов, который сортируется по дате в обратном порядке

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/posts')
def posts():
    return render_template('posts.html', title='Посты', posts=posts_list)

@app.route('/posts/<int:index>') #<int:index>- индекс из posts_list
def post(index):
    p = posts_list[index]
    return render_template('post.html', title=p['title'], post=p)#post=p передает сам пост p в шаблон для отображения

@app.route('/about')
def about():
    return render_template('about.html', title='Об авторе')
