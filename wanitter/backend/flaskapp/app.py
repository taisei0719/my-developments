from flask import Flask ,render_template, request, jsonify
import db

app = Flask(__name__)


@app.route('/')
def index():
    return "Flask is working!!!"

@app.route('/api', methods=['GET'])
def api():
    return "API is working!!!"

@app.route('/api/tweet', methods=['POST'])
def post_tweet():
    post_data = request.get_json()
    message = post_data["message"]
    db.insertMessage(message)
    return "success: " + message

@app.route('/api/tweet', methods=['GET'])
def get_tweet():
    from_id = request.args.get('from_id')
    messages = db.getMessages(from_id)
    return jsonify(messages)

@app.route('/api/tweet/count', methods=['GET'])
def get_tweet_count():
    from_id = request.args.get('from_id')
    count = db.getMessageCount(from_id)
    return "%d" % count
    



if __name__=="__main__":
    app.run(host='0.0.0.0')


    
