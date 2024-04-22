import os

from flask import *


from main import *

app = Flask(__name__, template_folder='html')
app.secret_key = os.environ["SECRET_KEY"]

sessions={}
@app.route("/")

def home_page():
    return render_template("main.html")

@app.route('/about-us')

def about_page():
    return render_template("about-us.html")

@app.route('/create_test')

def create_test():
    return render_template("create test.html")


@app.route('/test')
def test():
    f=open("test.txt",'r').read().format(f"answer_{sessions[0]}.json")
    return f


@app.route('/loading', methods=['POST'])
def do_loading():
    f=request.files['myfile']
    f.save(f.filename)
    session_id = generate_session_id()
    sessions[session_id] = {session_id}
    get_test(f.filename,session_id)


    return redirect("/test")

@app.route('/loading')
def loading():
    return render_template("loading.html")


@app.route('/results')
def results():
    return template_rendered("results.html")



app.run()