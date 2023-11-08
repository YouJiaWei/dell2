function downloadGeneratedImage() {
    var textareaValue = document.getElementById("custom-input").value;
    var styleSelectValue = document.getElementById("style-select").value; // セレクトボックスの値を取得
    var qualitySelectValue = document.getElementById("quality-select").value; // セレクトボックスの値を取得

    var promptText = `${textareaValue},${styleSelectValue},${qualitySelectValue}`;

    fadeOutElements();

    setTimeout(function () {
        fadeInrobot();
        fadeInload(); // 1秒後に画像をフェードインさせる
        setTimeout(function () {
            fadeInheart(); // Now fadeInheart() is executed 5 seconds after fadeInrobot() and fadeInload()
        }, 3000);
    }, 1000);

    fetch('/submit?text=' + encodeURIComponent(promptText)) // テキストとセレクトボックスの値を組み合わせて送信
        .then(response => response.json())
        .then(data => {
            var imagePaths = data.image_paths;
            if (imagePaths && imagePaths.length === 6) {
                for (var i = 0; i < imagePaths.length; i++) {
                    var imagePath = imagePaths[i];
                    console.log("Downloaded image path:", imagePath);
                    // ここで必要な処理を実行（ダウンロードや表示など）
                    
                }
            } else {
                console.error("Image download failed");
            }
            setTimeout(function () {
                location.reload();
            }, 1000);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function fadeInTreeImage() {
    var treeImage = document.querySelector(".treeImage");
    treeImage.style.opacity = "0"; // 初期状態で透明にする
    var opacity = 0;
    var fadeInInterval = setInterval(function () {
        opacity += 0.01;
        treeImage.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval); // フェードイン終了
        }
    }, 20);
}

window.onload = function () {
    fadeInTreeImage(); // 画面の読み込みが完了した後に実行
};

function fadeInheart() {
    var treeImage = document.querySelector("#heart");
    treeImage.style.opacity = "0"; // 初期状態で透明にする
    var opacity = 0;
    var fadeInInterval = setInterval(function () {
        opacity += 0.01;
        treeImage.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval); // フェードイン終了
        }
    }, 100);
}

function fadeInrobot() {
    var treeImage = document.querySelector("#robot");
    treeImage.style.opacity = "0"; // 初期状態で透明にする
    var opacity = 0;
    var fadeInInterval = setInterval(function () {
        opacity += 0.01;
        treeImage.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInInterval); // フェードイン終了
        }
    }, 20);
}

function fadeInload() {
    var treeImage = document.querySelector("#load");
    treeImage.style.opacity = "0"; // 初期状態で透明にする
    var opacity = 0;
    var fadeInInterval;
    
    function fadeIn() {
        fadeInInterval = setInterval(function () {
            opacity += 0.01;
            treeImage.style.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(fadeInInterval); // フェードイン終了
                setTimeout(fadeOut, 1000); // フェードイン後、1秒後にフェードアウトを開始
            }
        }, 20);
    }
    
    function fadeOut() {
        fadeInInterval = setInterval(function () {
            opacity -= 0.01;
            treeImage.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeInInterval); // フェードアウト終了
                setTimeout(fadeIn, 1000); // フェードアウト後、1秒後に再びフェードインを開始
            }
        }, 20);
    }
    
    fadeIn(); // 最初にフェードインを開始
}

function fadeOutElements() {
    var elementsToFade = document.querySelectorAll(".fullscreen-image,.custom-input,.treeImage,.selectbox-001,.selectbox-002,.btn"); // フェードアウトさせたい要素のクラス名を指定
    var opacity = 1;
    
    var fadeOutInterval = setInterval(function () {
        opacity -= 0.01;
        for (var i = 0; i < elementsToFade.length; i++) {
            elementsToFade[i].style.opacity = opacity;
        }
        
        if (opacity <= 0) {
            clearInterval(fadeOutInterval); // フェードアウト終了
            // フェードアウト後、fetch() を呼び出すなどの処理をここに追加
        }
    }, 10);
}