import requests
import datetime
import time
import pytz

# APIエンドポイント
api_url = 'http://localhost:4500/api/tweet'

# 日本時間を取得する関数
def get_japan_time():
    tz_japan = pytz.timezone('Asia/Tokyo')
    japan_time = datetime.datetime.now(tz_japan)
    return japan_time.strftime('%Y-%m-%d %H:%M:%S')

# 定期的にツイートする関数の定義
def tweet_current_time():
    current_time = get_japan_time()
    tweet_text = f"現在の日本時間は {current_time} です。"
    headers = {'Content-Type': 'application/json'}
    data = {'message': tweet_text}
    
    try:
        response = requests.post(api_url, headers=headers, json=data)
        if response.status_code == 200:
            print(f"ツイートしました: {tweet_text}")
        else:
            print(f"ツイートに失敗しました: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"ツイートに失敗しました: {e}")

# 定期的に実行するループ
while True:
    tweet_current_time()
    # 10分ごとに実行するための待機時間（秒）
    time.sleep(600)  # 10分 = 600秒
