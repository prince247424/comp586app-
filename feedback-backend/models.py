from flask_login import LoginManager
from app import app, db

loginMgr = LoginManager()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_id = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(50), unique=False, nullable=False)

    def __repr__(self):
        return f"User('{self.id, self.email_id, self.name}')"


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    rating1 = db.Column(db.Integer)
    rating2 = db.Column(db.Integer)
    rating3 = db.Column(db.Integer)
    rating4 = db.Column(db.Integer)
    rating5 = db.Column(db.Integer)

    def __repr__(self):
        return f"Rating('{self.id, self.user_id, self.rating1, self.rating2, self.rating3, self.rating4, self.rating5}')"
