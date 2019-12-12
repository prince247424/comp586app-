from models import User, Rating, db

def display_all_tables():
    print("\n\n")
    print("USER TABLE")
    print("----------")
    for row in User.query.all():
        print(row)
    print("\n\n*******************\n\n")
    print("RATING TABLE")
    print("----------")
    for row in Rating.query.all():
        print(row)
    print("\n\n")

def login_success(email_id, name):
    # check if user already exists
    # if not: add new user to db
    db.create_all()
    if not db.session.query(User).filter_by(email_id=email_id).one_or_none():
        # email id is not registered
        user = User(email_id=email_id, name=name)
        db.session.add(user)
        db.session.commit()

    user = User.query.filter_by(email_id=email_id).one_or_none()
    display_all_tables()
    return user.id


def none_if_zero(val):
    if val == 0:
        return None
    return val


def submit_new_rating(uid, r1, r2, r3, r4, r5):
    # check if user has already submitted
    # ignore the submission in case of repeat
    r1 = none_if_zero(r1)
    r2 = none_if_zero(r2)
    r3 = none_if_zero(r3)
    r4 = none_if_zero(r4)
    r5 = none_if_zero(r5)
    row = Rating(user_id=uid, rating1=r1, rating2=r2, rating3=r3, rating4=r4, rating5=r5)
    db.session.add(row)
    db.session.commit()
    display_all_tables()


def get_average_ratings():
    # fetch the average rating for all questions
    all_rows = Rating.query.all()
    num_reviews = len(all_rows)
    sum_r1 = 0
    sum_r2 = 0
    sum_r3 = 0
    sum_r4 = 0
    sum_r5 = 0

    n_r1 = 0
    n_r2 = 0
    n_r3 = 0
    n_r4 = 0
    n_r5 = 0

    res = {'num_reviews': num_reviews, 'r1': 0, 'r2': 0, 'r3': 0, 'r4': 0, 'r5': 0}
    for row in all_rows:
        if row.rating1:
            n_r1+=1
            sum_r1+=row.rating1
        if row.rating2:
            n_r2+=1
            sum_r2+=row.rating2
        if row.rating3:
            n_r3+=1
            sum_r3+=row.rating3
        if row.rating4:
            n_r4+=1
            sum_r4+=row.rating4
        if row.rating5:
            n_r5+=1
            sum_r5+=row.rating5
    if n_r1:
        res['r1'] = sum_r1/n_r1
    if n_r2:
        res['r2'] = sum_r2/n_r2
    if n_r3:
        res['r3'] = sum_r3/n_r3
    if n_r4:
        res['r4'] = sum_r4/n_r4
    if n_r5:
        res['r5'] = sum_r5/n_r5

    print(res)
    return res

