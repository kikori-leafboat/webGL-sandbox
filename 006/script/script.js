
// = 004 ======================================================================
// 三次元的な座標を自在に頭の中で思い描くのは、一種の慣れを必要とします。
// ここではそんな 3D 特有の感覚を養うために、自力で頂点を定義することに挑戦して
// みましょう。
// また、頂点はどのようなプリミティブタイプを選択したかによって、その外観が全く
// 別物になります。これについても、ここで理解を深めておきましょう。
// ============================================================================

(() => {
    // variables
    let canvas;     // canvas エレメントへの参照
    let canvasSize; // canvas の大きさ（ここでは正方形の一辺の長さ）
    let prg;        // プログラムオブジェクト
    let position;   // 頂点の位置座標
    let color;      // 頂点の色
    let VBO;        // Vertex Buffer Object
    let tLoc;
    // let startTime;
    let isHovered = false;
    let iTime = 0.0;

    window.addEventListener('load', () => {
        // glcubic の初期化
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }

        // キャンバスの大きさはウィンドウの短辺
        canvasSize = Math.min(window.innerWidth, window.innerHeight);
        canvas.width  = canvasSize;
        canvas.height = canvasSize;

        canvas.addEventListener('mouseenter', () => {
            isHovered = true;
        }, false);
    
        canvas.addEventListener('mouseleave', () => {
            isHovered = false;
        }, false);

        // シェーダロードへ移行
        loadShader();
    }, false);

    function loadShader(){
        // glcubic の機能を使ってプログラムを生成
        prg = gl3.createProgramFromFile(
            './shader/main.vert',
            './shader/main.frag',
            ['position', 'color'],
            [3, 4],
            ['globalColor'],
            ['4fv'],
            initialize
        );
    }

    function initialize(){
        // startTime = Date.now();
        tLoc = gl3.gl.getUniformLocation(prg.prg,"iTime");

        // - [やってみよう] ---------------------------------------------------
        // 現在は、三角形がひとつだけ表示されるような構造になっています。これは
        // サンプル 003 とまったく同じ初期状態です。
        // これを自分で修正して、いびつな形で構わないので「五角形」にしてみてく
        // ださい。WebGL では、原則として「三角形」以外のポリゴンは作れません。
        // よって、五角形を形作るためには、最低でも三枚のポリゴンが必要になると
        // いうことがヒントです。がんばってチャレンジしてみてください。
        // --------------------------------------------------------------------
        // 頂点の座標データ

        let angleCount = 5;

        // 角度計算
        let rad = 1 / angleCount * 2 * Math.PI;

        // 中心からスタートするためのオフセット計算
        let offset = Math.PI/2;

        // 中心となる点の定義
        let mid =[0.0, 0.0, 0.0];

        // 周りの点の定義
        let points = new Array();
        for (let i = 0; i < angleCount;i++) {
            points.push([ Math.cos(rad * i + offset),   Math.sin(rad * i + offset),  0.0]);
        }

        // 点配列の作成
        position = new Array();
        for (let i = 0; i < points.length;i++) {
            // the last one
            if (i+1 == points.length) {
                position.push(...mid, ...points[i], ...points[0]);
            } else {
                position.push(...mid, ...points[i], ...points[i + 1]);
            }
        }

        // 色定義
        let w = [1.0, 1.0, 1.0, 1.0];
        let r = [0.59, 0.26, 0.52, 1.0];
        let g = [0.0, 1.0, 0.0, 1.0];
        let b = [0.38, 0.25, 0.59, 1.0];

        color = new Array();

        for (let i = 0; i < angleCount; i++) {
            color.push(...w, ...b, ...b);
        }

        // 座標データから頂点バッファを生成
        VBO = [
            gl3.createVbo(position),
            gl3.createVbo(color),
        ];

        // レンダリング関数を呼ぶ
        render();
    }

    function render(){
        if (isHovered) {
            if (iTime < 1.0) {
                iTime += 0.01;
            }
        } else if (iTime > 0) {
            iTime -= 0.01;
        }

        // console.log(iTime);
        // gl3.gl.uniform1f(tLoc,.001*(Date.now() - startTime));
        gl3.gl.uniform1f(tLoc, iTime);
        window.requestAnimationFrame(render);

        // ビューを設定
        gl3.sceneView(0, 0, canvasSize, canvasSize);
        // シーンのクリア
        gl3.sceneClear([1.0, 1.0, 1.0, 1.0]);
        // どのプログラムオブジェクトを利用するか明示的に設定
        prg.useProgram();
        // プログラムに頂点バッファをアタッチ
        prg.setAttribute(VBO);
        // uniform 変数をシェーダにプッシュ
        prg.pushShader([
            [1.0, 1.0, 1.0, 1.0]
        ]);
        // - プリミティブタイプ -----------------------------------------------
        // WebGL には代表的なプリミティブタイプには以下のようなものがあります。
        // これらを変更すると、いったいどのような変化が起こるのかを観察しながら、
        // それぞれのプリミティブタイプの違いについて理解を深めておきましょう。
        // * gl.POINTS
        // * gl.LINES
        // * gl.LINE_STRIP
        // * gl.TRIANGLES
        // * gl.TRIANGLE_STRIP
        //
        // また、ドローコールを行う glcubic.js のメソッドの、第二引数を見てくだ
        // さい。そこには position.length / 3 と書かれています。
        // これは「何個の頂点を描くか」ということを表す数値です。
        // つまりその気になれば頂点を全て描くのではなく、一部だけを描画するとい
        // うこともできるわけです。ただし、定義した順番が大きく影響しますので、
        // もし仮にそのような処理を記述する際は十分に注意しましょう。
        // --------------------------------------------------------------------
        // ドローコール（描画命令）
        gl3.drawArrays(gl3.gl.TRIANGLES, position.length / 3); // Trianglesは頂点３つでワンセット
        
    }
})();

        // let angleCount = 15;
        // let p = new Array(angleCount);
        
        // let theta = new Array(angleCount);
        // let thetaDiff = 1/angleCount * 2 * Math.PI;
        
        // theta[0] = Math.PI/2;
        // for (let i = 1; i < angleCount;i ++) {
        //     theta[i] = theta[0] + thetaDiff * i;
        // }
        
        // let mid = [0.0, 0.0, 0.0];
        
        // for (let i = 0; i < angleCount;i ++) {
        //     p[i] = [ Math.cos(theta[i]), Math.sin(theta[i]), 0.0];
        // }

        // position = new Array();
        // for (let i = 0; i < p.length;i++) {
        //     // the last one
        //     if (i+1 == p.length) {
        //         position.push(...mid, ...p[i], ...p[0]);
        //     } else {
        //         position.push(...mid, ...p[i], ...p[i + 1]);
        //     }
        // }