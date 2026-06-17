document.addEventListener('DOMContentLoaded', () => {
    const fortuneForm = document.getElementById('fortune-form');
    const setupSection = document.getElementById('setup-section');
    const loadingSection = document.getElementById('loading-section');
    const resultSection = document.getElementById('result-section');
    
    const btnSubmit = document.getElementById('btn-submit');
    const btnRetry = document.getElementById('btn-retry');
    
    // 結果項目
    const resultUserName = document.getElementById('result-user-name');
    const resultDateText = document.getElementById('result-date-text');
    const fortuneBadgeVal = document.getElementById('fortune-badge-val');
    const adviceText = document.getElementById('advice-text');
    const cautionText = document.getElementById('caution-text');
    
    const overallBar = document.getElementById('overall-bar');
    const loveBar = document.getElementById('love-bar');
    const moneyBar = document.getElementById('money-bar');
    const workBar = document.getElementById('work-bar');
    
    const overallVal = document.getElementById('overall-val');
    const loveVal = document.getElementById('love-val');
    const moneyVal = document.getElementById('money-val');
    const workVal = document.getElementById('work-val');
    
    const luckyColorVal = document.getElementById('lucky-color-val');
    const luckyItemVal = document.getElementById('lucky-item-val');
    const luckyExerciseVal = document.getElementById('lucky-exercise-val');

    // 日付の設定
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    resultDateText.textContent = today.toLocaleDateString('ja-JP', options);

    fortuneForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('user-name').value.trim();
        const zodiac = document.getElementById('user-zodiac').value;
        
        if (!name || !zodiac) return;

        // 演出開始
        setupSection.classList.add('hidden');
        loadingSection.classList.remove('hidden');

        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, zodiac }),
            });

            if (!response.ok) {
                throw new Error('ネットワークの応答が正常ではありません。');
            }

            const data = await response.json();

            // 演出を少し味わわせるために1.5秒のディレイ
            setTimeout(() => {
                loadingSection.classList.add('hidden');
                resultSection.classList.remove('hidden');
                
                // データを反映
                resultUserName.textContent = name;
                fortuneBadgeVal.textContent = data.fortune;
                adviceText.textContent = data.advice;
                cautionText.textContent = data.caution;
                luckyColorVal.textContent = data.color;
                luckyItemVal.textContent = data.item;
                luckyExerciseVal.textContent = data.exercise;
                
                // 運勢に応じたグラデーションやエフェクト（おみくじの強さ）
                updateBadgeStyle(data.fortune);

                // アニメーションを伴うプログレスバー表示
                setTimeout(() => {
                    animateProgressBar(overallBar, overallVal, data.scores.overall);
                    animateProgressBar(loveBar, loveVal, data.scores.love);
                    animateProgressBar(moneyBar, moneyVal, data.scores.money);
                    animateProgressBar(workBar, workVal, data.scores.work);
                }, 200);

            }, 1800);

        } catch (error) {
            console.error('エラー:', error);
            alert('運勢の取得に失敗しました。もう一度お試しください。');
            loadingSection.classList.add('hidden');
            setupSection.classList.remove('hidden');
        }
    });

    btnRetry.addEventListener('click', () => {
        // 表示を初期状態に戻す
        resultSection.classList.add('hidden');
        setupSection.classList.remove('hidden');
        
        // プログレスバーをリセット
        overallBar.style.width = '0%';
        loveBar.style.width = '0%';
        moneyBar.style.width = '0%';
        workBar.style.width = '0%';
        overallVal.textContent = '0%';
        loveVal.textContent = '0%';
        moneyVal.textContent = '0%';
        workVal.textContent = '0%';
    });

    function animateProgressBar(barElement, valElement, targetValue) {
        barElement.style.width = `${targetValue}%`;
        
        let currentValue = 0;
        const duration = 1200; // ms
        const steps = 60;
        const stepTime = duration / steps;
        const increment = targetValue / steps;

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            valElement.textContent = `${Math.round(currentValue)}%`;
        }, stepTime);
    }

    function updateBadgeStyle(fortune) {
        // 運勢に応じてバッジの見た目を変える
        const badge = fortuneBadgeVal;
        badge.className = 'fortune-badge'; // リセット
        
        if (fortune === '大吉') {
            badge.style.background = 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)';
            badge.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.6)';
            badge.style.color = '#000';
        } else if (fortune === '凶') {
            badge.style.background = 'linear-gradient(135deg, #4a4a4a 0%, #1a1a1a 100%)';
            badge.style.boxShadow = '0 0 25px rgba(0, 0, 0, 0.8)';
            badge.style.color = '#fff';
            badge.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        } else {
            // デフォルトのグラデーション
            badge.style.background = '';
            badge.style.boxShadow = '';
            badge.style.color = '';
        }
    }
});
