#_*_ coding: utf-8 _*_
import tornado.ioloop
import tornado.web
import os
import pymongo
import json
import bson
import datetime
import re


connection=pymongo.Connection('localhost',27017)
db = connection.hanwei_database


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
  
  
class MainHandler(tornado.web.RequestHandler):
  def get(self):
    if mobileDetecotr(self.request):
      _f = open(os.path.join(os.path.dirname(__file__), "release/index.html"), "rb")
      self.write(_f.read())
      _f.close()
    else:
      self.finish("you are desktop")


class EventHandler(tornado.web.RequestHandler):
  def get(self, id):
    events = db.events
    try:

      _id = bson.objectid.ObjectId(id)
    except pymongo.errors.InvalidId:
      raise tornado.web.HTTPError(400)

    event = events.find_one({'_id': _id})
    if event:
      self.content_type = 'application/json'
      enc = CustomEncoder()
      event["_ts"] = int(event["datetime"].strftime("%s"))
      
      self.finish(enc.encode(event))
    else:
      raise tornado.web.HTTPError(404)


class EventsCollectionHandler(tornado.web.RequestHandler):
  def get(self):
    events = db.events
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

    _events = events.find({"datetime": _q}) if _q else events.find()
    _events = _events.sort([("datetime", pymongo.DESCENDING)]).skip(sk).limit(lmt)
    self.content_type = 'application/json'

    enc = CustomEncoder()
    _es = []
    for _e in _events:
      _e["_ts"] = int(_e["datetime"].strftime("%s"))
      _es.append(_e)
     
    if order=="desc": _es.reverse()
    self.finish(json.dumps(enc.encode(_es)))
    

def createSampleDb():
  from data import data
  _es = []
  for d in data:
    _es.append({
      "title": d[0],
      "content": d[1],
      "datetime": datetime.datetime.utcnow() - datetime.timedelta(d[2]),
      "hot": d[3]
    })

  db.events.insert(_es)



settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "release"),
    "cookie_secret": "7IG1FyflRlC3GqtlUJNCe2FKqfPGlEMFmG1Q6dHFlVE=",
    "xsrf_cookies": True,
}


application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/events", EventsCollectionHandler),
    (r"/events/(\w+)", EventHandler),
    (r"/(.+)", tornado.web.StaticFileHandler, dict(path=settings['static_path'])),
], **settings)

if __name__ == '__main__':
  #createSampleDb()
  application.listen(8801)
  tornado.ioloop.IOLoop.instance().start()
