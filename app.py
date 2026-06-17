from flask import Flask, render_template, request, jsonify
import random
import datetime
import hashlib

app = Flask(__name__)

FORTUNES = ["大吉", "中吉", "小吉", "吉", "末吉", "凶"]
LUCKY_COLORS = ["ゴールド", "ミッドナイトブルー", "サクラピンク", "エメラルドグリーン", "ラベンダー", "ルビーレッド"]
LUCKY_ITEMS = ["お気に入りの本", "クラシック音楽", "新しい文房具", "ハーブティー", "スニーカー", "革の財布"]
ADVICES = {
    "大吉": "絶好調の一日！新しいことに挑戦するなら今日がベストタイミングです。",
    "中吉": "運気は上昇傾向。周囲の人への感謝を言葉にすると、さらに良い波に乗れます。",
    "小吉": "穏やかで安定した日。普段通りに過ごすことで、小さな幸せが見つかるでしょう。",
    "吉": "まずまずの運勢。一歩一歩着実に進むことで、目標に近づけます。",
    "末吉": "焦りは禁物。今日は準備期間と捉え、ゆっくり自分のペースを保ちましょう。",
    "凶": "少し慎重に行動すべき日。無理をせず、自分を労わる時間を作ると吉です。"
}
CAUTIONS = [
    "スマートフォンの使いすぎによる目の疲れに注意しましょう。",
    "忘れ物がないか、外出前にバッグの中身をダブルチェックしてください。",
    "大切な約束やスケジュールをもう一度確認しておくと安心です。",
    "言葉遣いに少しだけ気を使うと、対人関係のトラブルを未然に防げます。",
    "食べすぎや飲みすぎに注意し、胃腸を労わってあげましょう。",
    "お金の使い道は慎重に。衝動買いは避けた方が賢明です。",
    "姿勢が悪くなっていないか意識してみましょう。肩こりの予防になります。",
    "焦って判断を下さず、一呼吸置いてから決めるようにしましょう。"
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/fortune', methods=['POST'])
def get_fortune():
    data = request.get_json() or {}
    name = data.get('name', '')
    zodiac = data.get('zodiac', '')
    
    # 日付と名前・星座を組み合わせて、その日の運勢が固定されるようにする（毎日引けるおみくじとしてリアルにするため）
    today_str = datetime.date.today().strftime('%Y-%m-%d')
    seed_str = f"{today_str}-{name}-{zodiac}"
    hash_val = int(hashlib.md5(seed_str.encode('utf-8')).hexdigest(), 16)
    
    # 決定的な乱数生成器
    rng = random.Random(hash_val)
    
    fortune = rng.choice(FORTUNES)
    color = rng.choice(LUCKY_COLORS)
    item = rng.choice(LUCKY_ITEMS)
    advice = ADVICES[fortune]
    caution = rng.choice(CAUTIONS)
    
    # 運勢ごとのスコア (0-100)
    scores = {
        "大吉": {"love": rng.randint(85, 100), "money": rng.randint(85, 100), "work": rng.randint(85, 100)},
        "中吉": {"love": rng.randint(70, 85), "money": rng.randint(70, 85), "work": rng.randint(70, 85)},
        "小吉": {"love": rng.randint(60, 75), "money": rng.randint(60, 75), "work": rng.randint(60, 75)},
        "吉": {"love": rng.randint(55, 70), "money": rng.randint(55, 70), "work": rng.randint(55, 70)},
        "末吉": {"love": rng.randint(40, 60), "money": rng.randint(40, 60), "work": rng.randint(40, 60)},
        "凶": {"love": rng.randint(20, 45), "money": rng.randint(20, 45), "work": rng.randint(20, 45)}
    }
    
    score = scores[fortune].copy()
    overall = int((score["love"] + score["money"] + score["work"]) / 3)
    score["overall"] = overall
    
    return jsonify({
        "fortune": fortune,
        "color": color,
        "item": item,
        "advice": advice,
        "caution": caution,
        "scores": score
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
