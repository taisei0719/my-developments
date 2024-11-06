import pymysql.cursors

def createConnection():
    ret = pymysql.connect(host='database_container',
                          port=13306,
                          database='wanitter',
                          user='wani',
                          password='pZ95C4kV',
                          cursorclass=pymysql.cursors.DictCursor)

    return ret

    
def insertMessage(message):
    con = createConnection()

    cur = con.cursor()
    sql = "INSERT INTO messages (text) VALUES(%s)"
    ret = cur.execute(sql, message)
    con.commit()

    con.close()
    return ret


def getMessages(from_id):
    con = createConnection()

    cur = con.cursor()
    if from_id != None:
        sql = "SELECT * FROM messages WHERE id >= %s ORDER BY ID DESC LIMIT 10"
        ret = cur.execute(sql, from_id)
    else:
        sql = "SELECT * FROM messages ORDER BY ID DESC LIMIT 10"
        ret = cur.execute(sql)

    messages = cur.fetchall()

    con.close()
    return messages


def getMessageCount(from_id):
    con = createConnection()

    cur = con.cursor()
    if from_id != None:
        sql = "SELECT COUNT(*) FROM messages WHERE id >= %s"
        ret = cur.execute(sql, from_id)
    else:
        sql = "SELECT COUNT(*) FROM messages"
        ret = cur.execute(sql)

    ret = cur.fetchall()[0]
    ret = ret["COUNT(*)"]

    con.close()
    return ret
    


