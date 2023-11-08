import datetime
from flask import Flask, jsonify, request, send_file
import os
import requests
import json

app = Flask(__name__)
#pip install --proxy=http://yokozekin:password@proxy-t.systena.local:8080 openai
#flask
#http://<username>:<password>@<proxyのドメイン名 or IPアドレス>:<Port>
#HTTP_PROXY=http://nogamir:pass@proxy-t.systena.local:8080

# OpenAI APIの設定
OPENAI_API_KEY = "810ce485d12a4d93a5bab669bcc9bf31"
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEYが環境変数に設定されていません。")

OPENAI_API_BASE = "https://inner-gpt-us.openai.azure.com/"
OPENAI_API_VERSION = "2023-06-01-preview"

proxies = {
        "http": "http://yuuk:Jia412340787!@proxy-t.systena.local:8080",
        "https": "http://yuuk:Jia412340787!@proxy-t.systena.local:8080",
    }

# データファイルのパス
DATA_FILE_PATH = 'data_store.json'

# アプリケーション起動時に保存されたデータを読み込む
if os.path.exists(DATA_FILE_PATH):
    with open(DATA_FILE_PATH, 'r') as f:
        try:
            data_store = json.load(f)
        except json.JSONDecodeError:
            data_store = {}
else:
    data_store = {}

@app.route('/')
def index():
    return open('templates/index.html', encoding='utf-8').read()

@app.route('/submit')
def submit():
    text = request.args.get('text')
    style = request.args.get('style')
    quality = request.args.get('quality')
    prompt_text = f"{text},{style},{quality}"

    generated_image_urls = []

    for _ in range(1):
        response = create_image(prompt_text)
        if response:
            image_url = response["data"][0]["url"]
            generated_image_urls.append(image_url)

    image_paths = download_images(generated_image_urls)

    if len(image_paths) == 1:
        # データをdata_storeに追加
        data_key = len(data_store) + 1
        current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data_store[data_key] = {
            "text": text,
            "timestamp": current_time
        }

        # data_storeの内容をファイルに保存
        with open(DATA_FILE_PATH, 'w') as f:
            json.dump(data_store, f, separators=(',', ':'))  # インデントを削除して改行を追加

        return jsonify({"data_key": data_key})
    else:
        return "Image download failed for one or both images", 500


def create_image(prompt_text):
    import openai
    openai.api_type = "azure"
    openai.api_base = OPENAI_API_BASE
    openai.api_version = OPENAI_API_VERSION
    openai.api_key = OPENAI_API_KEY

    response = openai.Image.create(
        prompt=prompt_text,
        size='1024x1024',
        n=1
        
    )
    return response

def download_images(image_urls):
    static_folder = os.path.join(app.root_path, 'static')
    if not os.path.exists(static_folder):
        os.makedirs(static_folder)

    image_paths = []

    for idx, image_url in enumerate(image_urls):
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            image_path = os.path.join(static_folder, f'downloaded_image_{idx}.jpg')
            with open(image_path, 'wb') as f:
                f.write(image_response.content)
            image_paths.append(image_path)
        else:
            print(f"Image {idx + 1} download failed with status code:", image_response.status_code)

    return image_paths


@app.route('/get_all_texts')
def get_all_texts():
    sorted_data = sorted(data_store.items(), key=lambda item: int(item[0]))  # キーを整数にキャストしてソート
    all_texts = {str(key): {"text": data["text"], "timestamp": data["timestamp"]} for key, data in sorted_data}
    return jsonify(all_texts)




@app.route('/export_texts')
def export_texts():
    export_filename = 'exported_texts.txt'

    with open(export_filename, 'w') as f:
        for key, data in data_store.items():
            text = data["text"]
            timestamp = data["timestamp"]
            f.write(f"Data Key: {key}\n")
            f.write(f"Text: {text}\n")
            f.write(f"Timestamp: {timestamp}\n")
            f.write("=" * 20 + "\n")

    return send_file(export_filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
