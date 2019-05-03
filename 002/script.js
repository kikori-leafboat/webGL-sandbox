
(() => {
    // variables
    let canvasWidth  = null;
    let canvasHeight = null;
    let targetDOM    = null;
    let run = true;
    let isDown = false;
    let count = 0;
    // three objects
    let scene;
    let camera;
    let controls;
    let renderer;
    let geometry;
    let material;
    let materialPoint;
    let boxes;
    let directionalLight;
    let ambientLight;
    let axesHelper;
    // constant variables
    const BOX_START_POS = {
        x: -5.0,
        y: 5.0,
        z: 0
    }
    const RENDERER_PARAM = {
        clearColor: 0x333333
    };
    const MATERIAL_PARAM = {
        color: 0xCCD4FC,
        specular: 0xF9CADB
    };
    const MATERIAL_PARAM_POINT = {
        color: 0xff9933,
        size: 0.1
    };
    const DIRECTIONAL_LIGHT_PARAM = {
        color: 0xF9CCCA,
        intensity: 1.0,
        x: 1.0,
        y: 1.0,
        z: 1.0
    };
    const AMBIENT_LIGHT_PARAM = {
        color: 0xffffff,
        intensity: 0.2
    };

    // - 初期化セクション -----------------------------------------------------
    // window のロードイベント後に実行される各種処理は、上記の宣言セクションで定
    // 義した変数や定数を用いて、各種オブジェクトを初期化するためのフェーズです。
    // ここで最初の設定を漏れなく行っておき、あとはレンダリングを行うだけのとこ
    // ろまで一気に処理を進めます。
    // ここでは出てきていませんが、ファイルを読み込むなどの非同期処理が必要にな
    // る場合には、このタイミングで実行すればよいでしょう。
    // ------------------------------------------------------------------------
    // entry point
    window.addEventListener('load', () => {
        // canvas
        canvasWidth  = window.innerWidth;
        canvasHeight = window.innerHeight;
        targetDOM    = document.getElementById('webgl');

        // scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 50.0);
        camera.position.x = 0.0;
        camera.position.y = 3.0;
        camera.position.z = 10.0;
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor));
        renderer.setSize(canvasWidth, canvasHeight);
        targetDOM.appendChild(renderer.domElement);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // material and geometory
        material = new THREE.MeshPhongMaterial(MATERIAL_PARAM);
        materialPoint = new THREE.PointsMaterial(MATERIAL_PARAM_POINT);
        
        boxes = new Array();
        let box;
        let torus;

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {

                // box
                geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
                box = new THREE.Mesh(geometry, material);
                box.position.x = BOX_START_POS.x + i;
                box.position.y = BOX_START_POS.y - j;
                scene.add(box);
                boxes.push(box);
            }
        }

        // lights
        directionalLight = new THREE.DirectionalLight(
            DIRECTIONAL_LIGHT_PARAM.color,
            DIRECTIONAL_LIGHT_PARAM.intensity
        );
        directionalLight.position.x = DIRECTIONAL_LIGHT_PARAM.x;
        directionalLight.position.y = DIRECTIONAL_LIGHT_PARAM.y;
        directionalLight.position.z = DIRECTIONAL_LIGHT_PARAM.z;
        scene.add(directionalLight);
        ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_PARAM.color,
            AMBIENT_LIGHT_PARAM.intensity
        );
        scene.add(ambientLight);

        // // helper
        axesHelper = new THREE.AxesHelper(5.0);
        scene.add(axesHelper);

        // events
        window.addEventListener('keydown', (eve) => {
            run = eve.key !== 'Escape';
            if(eve.key === ' '){isDown = true;}
        }, false);
        window.addEventListener('keyup', (eve) => {
            if(eve.key === ' '){isDown = false;}
        }, false);
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }, false);

        // rendering
        update();
    }, false);

    function update() {
        if(run){requestAnimationFrame(update);}

        translate();
        render();

    }

    let cubeCount = 0;
    let phiCount = 0;
    function translate() {
        if (count >= 180) {
            count = 0;
        }
        
        if (phiCount >= 360) {
            // phiCount = -180;
            phiCount = 0;
        }
        
        if (cubeCount >= 100) {
            cubeCount = 0;
        }


        let a = 0;
        if (cubeCount%2 == 0) {
            a = -1 * Math.random(-1, 1);;
        } else {
            a = Math.random(-1, 1);
        }
        
        box = boxes[cubeCount];
        box.position.x += Math.sin(count) * 5 * Math.sqrt(1-a*a) * Math.cos(deg2rad(phiCount));
        box.position.y += Math.sin(count) * 5 * Math.sqrt(1-a*a) * Math.sin(deg2rad(phiCount));
        box.position.z += Math.sin(count) * 5 * a;

        count+= 0.1;
        phiCount+= 4;
        cubeCount++;
    }
                
    function deg2rad(degrees)
    {
      return degrees * (Math.PI/180);
    }    

    // rendering
    function render(){

        for (let i = 0; i < boxes.length; i++) {
            boxes[i].rotation.y    += 0.01;

                if(isDown === true){
                    boxes[i].rotation.x    += 0.02;
                    boxes[i].rotation.z    += 0.02;
                }
            }

        renderer.render(scene, camera);
    }
})();

