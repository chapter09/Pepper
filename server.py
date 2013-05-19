#_*_ coding: utf-8 _*_
import tornado.ioloop
import tornado.web
import os
import pymongo
import json
import bson
import datetime
import re
from jinja2 import Environment
from jinja2 import FileSystemLoader


connection=pymongo.Connection('202.120.38.9',27017)
db = connection.pepper


def gt(dt_str):
  dt, _, us= dt_str.partition(".")
  dt= datetime.datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S")
  us= int(us.rstrip("Z"), 10)
  return dt + datetime.timedelta(microseconds=us)

class CustomEncoder(json.JSONEncoder):
    """A C{json.JSONEncoder} subclass to encode documents that have fields of
    type C{bson.objectid.ObjectId}, C{datetime.datetime}
    """
    def default(self, obj):
        if isinstance(obj, bson.objectid.ObjectId):
            return str(obj)
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj) 

def mobileDetecotr(req):
  reg_b = re.compile(r"(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino", re.I|re.M)
  reg_v = re.compile(r"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-", re.I|re.M)
  user_agent = req.headers['User-Agent']
  b = reg_b.search(user_agent)
  v = reg_v.search(user_agent[0:4])

  return b or v



def fetchById(collection, ids):
  res = []
  for id in ids:
    _r = collection.find_one({'_id': id})
    if _r:
      res.append(_r)
  return res


class MainHandler(tornado.web.RequestHandler):
  def get(self): 
    env = Environment(loader=FileSystemLoader('templates'))
    if mobileDetecotr(self.request):
      self.finish("Phone!!!")
    else:
      self.finish(env.get_template("index.desktop.html").render().encode("utf-8"))


class RegisterHandler(tornado.web.RequestHandler):
  def post(self):
    users = db.users
    un = self.get_argument('un', 'default')
    is_existed = users.find_one({'un': un})
    if is_existed:
      self.write('username is existed')
    else:
      user = {}
      pw = self.get_argument('pw', 'default')
      user['un'] = un
      user['pw'] = pw
      users.insert(user)       
      self.set_current_user(un)
      #self.redirect("create success")
      raise tornado.web.HTTPError(400)
  
  def set_current_user(self, user):
    if user:
      self.set_secure_cookie("user", tornado.escape.json_encode(user))
    else:
      self.clear_cookie("user")


class LoginHandler(tornado.web.RequestHandler):
  def get(self):
    users = db.users
    un = self.get_argument('name', 'default')
    pw = self.get_argument('password', 'default')
    user = users.find_one({'name': un, 'password': pw})
    self.content_type = 'application/json'
    enc = CustomEncoder();
    if user:
      user['recipes'] = fetchById(db.recipes, user['recipes'])
      user['watches'] = fetchById(db.recipes, user['watches'])
      user['comments'] = fetchById(db.comments, user['comments'])
    self.finish(enc.encode(user));
  
  def set_current_user(self, user):
    if user:
      self.set_secure_cookie("user", tornado.escape.json_encode(user))
    else:
      self.clear_cookie("user")


class RecipesCollectionHandler(tornado.web.RequestHandler):
  def get(self):
    recipes = db.recipes
    #d = datetime.datetime.utcnow()
    gt = int(self.get_argument("gt", "0"))
    lt = int(self.get_argument("lt", "0"))
    sk = int(self.get_argument("sk", "0"))
    lmt = int(self.get_argument("lmt", "10"))
    order = self.get_argument('order', 'asc')

    _q = {} 
    if gt:
      gtd = datetime.datetime.fromtimestamp(gt)
      _q.update({"$gt": gtd})
    if lt:
      ltd = datetime.datetime.fromtimestamp(lt)
      _q.update({"$lt": ltd})

    _recipes = recipes.find({"datetime": _q}) if _q else recipes.find()
    _recipes = _recipes.sort([("datetime", \
        pymongo.DESCENDING)]).skip(sk).limit(lmt)
    self.content_type = 'application/json'

    enc = CustomEncoder()
    _rs = []
    for _r in _recipes:
      _r["ts"] = int(_r["ceated_datetime"].strftime("%s"))
      _rs.append(_r)
     
    if order=="desc": _rs.reverse()
    self.finish(json.dumps(enc.encode(_rs)))


#recipe["_id"] : recipe id
#recipe["pl"] : paper list 
#recipe["_uid"] : owner id
#recipe["fl"] : fork list
#recipe["wl"] : watch list
#recipe["ts"] : time stamp
#recipe["datetime"] : time string
class RecipeHandler(tornado.web.RequestHandler):
  def get(self, id):
    recipes = db.recipes
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    recipe = recipes.find_one({'_id': _id})
    if recipe:
      self.content_type = 'application/json'
      enc = CustomEncoder()
      recipe['_comments'] = fetchById(db.comments, recipe['comments'][:10]);
      recipe['_papers'] = fetchById(db.papers, recipe['papers'][:10]);
      recipe["ts"] = int(recipe["ceated_datetime"].strftime("%s"))

      self.finish(enc.encode(recipe))
    else:
      raise tornado.web.HTTPError(404)

  def post(self, id):
    recipes = db.recipes
    self.write(json.dumps(id))
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)
    recipe = recipes.find_one({'_id': _id})

    if recipe:
      #update
      update = {}
      update['pl'] = self.get_argument('pl', '')
      update['fl'] = self.get_argument('fl', '')
      update['wl'] = self.get_argument('wl', '')
      recipes.update({'_id': _id}, {"$set": update})
      
    else:
      #create
      _pl = self.get_argument('pl', '')
      _recipe={}
      _recipe["_uid"] = self.get_argument('uid', 'default')
      _recipe["datetime"] = dateime.datetime.utcnow()

      _id = recipes.insert(_recipe)
      if not _id:
        raise tornado.web.HTTPError(400)


  def delete(self, id):
    recipes = db.recipes
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)
    
    recipe = recipes.find_one({'_id': _id})
    if recipe:
      recipes.remove({'_id': _id})
    else:
      message = 'Recipe not existed'
      self.write(message)



#user["_id"] : user id
#user["un"] : user name
#user["cl"] : user's comments list 
#user["rkl"] : user's ranks list 
#user["rl"] : user's recipes list 
#recipe["wl"] : user's watch list
#recipe["ts"] : time stamp
#recipe["datetime"] : time string
class UserHandler(tornado.web.RequestHandler):
  def get(self, id):
    users = db.users
    try:

      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    user = users.find_one({'_id': _id})
    if user:
      self.content_type = 'application/json'
      enc = CustomEncoder()
      user['recipes'] = fetchById(db.recipes, user['recipes'])
      user['watches'] = fetchById(db.recipes, user['watches'])
      user['comments'] = fetchById(db.comments, user['comments'])
    
      self.finish(enc.encode(user))
    else:
      raise tornado.web.HTTPError(404)

#author["_id"]: author id
#author["pl"]: author papers list
#author["rl"]: author recipes list
class AuthorHandler(tornado.web.RequestHandler):
  def get(self, id):
    authors = db.authors
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    author = authors.find_one({'_id': _id})
    if author:
      self.content_type = 'application/json'
      enc = CustomEncoder()
      self.finish(enc.encode(author))
    else:
      raise tornado.web.HTTPError(404)

#paper["_id"]: paper id
#paper["cl"]: paper comment list
#paper["rkl"]: paper rank list
#paper["rl"]: paper recipe list
class PapersCollectionHandler(tornado.web.RequestHandler):
  def get(self):
    papers = db.papers
    self.write(json.dumps(db.collection_names()))

class PaperHandler(tornado.web.RequestHandler):
  def get(self, id):
    papers = db.papers
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    paper = papers.find_one({'_id': _id})
    if paper:
      paper['_comments'] = fetchById(db.comments, paper['comments'][:10]);
      self.content_type = 'application/json'
      enc = CustomEncoder()
      
      self.finish(enc.encode(paper))
    else:
      raise tornado.web.HTTPError(404)

  def put(self, id):
    data = json.loads(self.request.body)
    comments = map(bson.ObjectId, data['comments'])
    res = db.papers.update({'_id': bson.ObjectId(id)}, {'$set': {'comments': comments}})
    return data
 
      

class CommentsCollectionHandler(tornado.web.RequestHandler):
  def post(self):
    data = json.loads(self.request.body)
    un = data['user']
    content = data['content']
    datetime = gt(data['created_datetime'])
    stars = data['stars']

    _c = {
      'user': un,
      'content': content,
      'created_datetime': datetime,
      'stars': stars,
    }
    cid = db.comments.insert(_c)
    print cid
    _c['_id'] = cid

    enc = CustomEncoder()
    self.content_type = 'application/json'
    self.finish(enc.encode(_c))


  def get(self):
    comments = db.comments
    gt = int(self.get_argument("gt", "0"))
    lt = int(self.get_argument("lt", "0"))
    sk = int(self.get_argument("sk", "0"))
    lmt = int(self.get_argument("lmt", "10"))
    order = self.get_argument('order', 'asc')

    _q = {} 
    if gt:
      gtd = datetime.datetime.fromtimestamp(gt)
      _q.update({"$gt": gtd})
    if lt:
      ltd = datetime.datetime.fromtimestamp(lt)
      _q.update({"$lt": ltd})

    _comments = comments.find({"datetime": _q}) if _q else comments.find()
    _comments = _comments.sort([("datetime", \
        pymongo.DESCENDING)]).skip(sk).limit(lmt)
    self.content_type = 'application/json'

    enc = CustomEncoder()
    _cs = []
    for _c in _comments:
      _c["ts"] = int(_c["datetime"].strftime("%s"))
      _cs.append(_c)
     
    if order=="desc": _cs.reverse()
    self.finish(json.dumps(enc.encode(_cs)))

#comment["_id"] : comment id
#comment["ctnt"] : comment id
#comment["_uid"] : comment owner id
#comment["_pid"] : paper commented id
class CommentHandler(tornado.web.RequestHandler):
  def get(self, id):
    comments = db.comments
    recipes = db.recipes
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    comment = comments.find_one({'_id': _id})
  

  def post(self):
    comments = db.comments
    
#    _pl = self.get_argument('pl', '')
    _comment = {}
    _comment["_uid"] = self.get_argument('_uid', '0')
    _comment["ctnt"] = self.get_argument('ctnt', 'default')
    _comment["_pid"] = self.get_argument('_pid', '0')
    _comment["datetime"] = dateime.datetime.utcnow()

    _id = comments.insert(_comment)
    if not _id:
      raise tornado.web.HTTPError(400)
  
  def delete(self, id):
    comments = db.comments
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)
    
    comment = comments.find_one({'_id': _id})
    if comment:
      comments.remove({'_id': _id})
    else:
      message = 'Comments not existed'
      self.write(message)


class RanksCollectionHandler(tornado.web.RequestHandler):
  def get(self):
    ranks = db.ranks
    gt = int(self.get_argument("gt", "0"))
    lt = int(self.get_argument("lt", "0"))
    sk = int(self.get_argument("sk", "0"))
    lmt = int(self.get_argument("lmt", "10"))
    order = self.get_argument('order', 'asc')

    _q = {} 
    if gt:
      gtd = datetime.datetime.fromtimestamp(gt)
      _q.update({"$gt": gtd})
    if lt:
      ltd = datetime.datetime.fromtimestamp(lt)
      _q.update({"$lt": ltd})

    _ranks = rank.find({"datetime": _q}) if _q else ranks.find()
    _ranks = _ranks.sort([("datetime", \
        pymongo.DESCENDING)]).skip(sk).limit(lmt)
    self.content_type = 'application/json'

    enc = CustomEncoder()
    _rks = []
    for _rk in _ranks:
      _rk["ts"] = int(_rk["datetime"].strftime("%s"))
      _rks.append(_rk)
     
    if order=="desc": _rks.reverse()
    self.finish(json.dumps(enc.encode(_rks)))

#rank["_id"] : rank id
#rank["lvl"] : rank id
#rank["_uid"] : rank owner id
#rank["_pid"] : paper ranked id
class RankHandler(tornado.web.RequestHandler):
  def get(self, id):
    ranks = db.ranks
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    rank = ranks.find_one({'_id': _id})
    if rank:
      self.content_type = 'application/json'
      enc = CustomEncoder()
      rank["ts"] = int(_r["datetime"].strftime("%s"))

      self.finish(enc.encode(rank))
    else:
      raise tornado.web.HTTPError(404)

  def post(self, id):
    ranks = db.ranks
    self.write(json.dumps(id))
    try:
      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)
    rank = ranks.find_one({'_id': _id})

    if rank:
      #update
      update = {}
      update['lvl'] = self.get_argument('lvl', '2')
      update['_uid'] = self.get_argument('_uid', '0')
      update['_pid'] = self.get_argument('_pid', '0')
      recipes.update({'_id': _id}, {"$set": update})
      
    else:
      #create
      _rank = {}
      _rank["_uid"] = self.get_argument('uid', '0')
      _rank['lvl'] = self.get_argument('lvl', '2')
      _rank['_pid'] = self.get_argument('_pid', '0')
      _recipe["datetime"] = dateime.datetime.utcnow()

      _id = ranks.insert(_recipe)
      if not _id:
        raise tornado.web.HTTPError(400)
    


class SearchHandler(tornado.web.RequestHandler):
  def get(self):
    keywords = self.get_argument('keywords')
    page = int(self.get_argument('page', '0'))
    limit = int(self.get_argument('limit', '25'))
    type = self.get_argument('type', 'all')

    keywords = re.sub(r'\s+', ' ', keywords.replace('+', ' ')).lower().strip().split()
   
    data = {}

    if type == 'recipe' or type == 'all':
      data['recipes'] = list(db.resipes.find({'_keywords': {'$all': keywords}})\
                                       .skip(page*limit).limit(limit))

    if type == 'papers' or type == 'all':
      data['papers'] = list(db.papers.find({'_keywords': {'$all': keywords}})\
                                     .skip(page*limit).limit(limit))
    self.content_type = 'application/json'
    enc = CustomEncoder()

    self.finish(enc.encode(data))
       
    



def createSampleDb():
  from data import data
  _rs = []
  for d in data:
    _rs.append({
      "title": d[0],
      "content": d[1],
      "datetime": datetime.datetime.utcnow() - datetime.timedelta(d[2]),
      "hot": d[3]
    })

  db.events.insert(_rs)



settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "cookie_secret": "7IG1FyflRlC3GqtlUJNCe2FKqfPGlEMFmG1Q6dHFlVE=",
    "xsrf_cookies": False,
}


application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/register", RegisterHandler), 
    (r"/users/(\w+)", UserHandler),
    (r"/users", LoginHandler),
    (r"/recipes", RecipesCollectionHandler),
    (r"/recipes/(\w+)", RecipeHandler),
    (r"/authors/(\w+)", AuthorHandler),
    (r"/comments", CommentsCollectionHandler),
    (r"/comments/(\w+)", CommentHandler),
    (r"/papers", PapersCollectionHandler),
    (r"/papers/(\w+)", PaperHandler),
    (r"/ranks", RanksCollectionHandler),
    (r"/ranks/(\w+)", RankHandler),
    (r'/search', SearchHandler),
    (r"/(.+)", tornado.web.StaticFileHandler,\
        dict(path=settings['static_path'])),
], **settings)

if __name__ == '__main__':
  #createSampleDb()
  application.listen(8801)
  tornado.ioloop.IOLoop.instance().start()
