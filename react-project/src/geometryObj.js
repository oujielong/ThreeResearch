import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI_Instance } from './config/globalConfig';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
// 引入CSS2渲染器CSS2DRenderer和CSS2模型对象CSS2DObject
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


//坐标创建 一个圆形
export function ScreenObject_2() {
    // 需要用get Points
    const Group = new THREE.Group();
    // 三维向量Vector3创建一组顶点坐标
    const arr = [
        new THREE.Vector3(-50, 20, 90),
        new THREE.Vector3(-10, 40, 40),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(60, -60, 0),
        new THREE.Vector3(70, 0, 80)
    ];
    const arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI);
    // 三维样条曲线
    const curve = new THREE.CatmullRomCurve3(arr);
    const linematerial = new THREE.LineBasicMaterial({
        color: 0xFF0000,
        fog: false,
        linewidth: 2
    });
    const geometry = new THREE.BufferGeometry();
    // geometry.setFromPoints(curve.getPoints());
    geometry.setFromPoints(arc.getPoints(1000));
    const cube2 = new THREE.LineLoop(geometry, linematerial);
    // Group.add(cube);
    Group.add(cube2);
    return Group;
}
// 坐标创建正方形 线性
export function ScreenObject_0() {
    const Group = new THREE.Group();
    const pointsArr = [
        // 三维向量Vector3表示的坐标值
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 100, 0),
        new THREE.Vector3(0, 100, 100),
        new THREE.Vector3(0, 0, 100),
    ];
    const linematerial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        fog: false,
        linewidth: 2,
        side: THREE.FrontSide
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(pointsArr);

    const cube2 = new THREE.Line(geometry, linematerial);

    const geometrybox = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const linematerialbox = new THREE.LineBasicMaterial({
        color: 0xFF0000,
        fog: false,
        linewidth: 2,
        side: THREE.FrontSide
    });
    const messhBox = new THREE.Mesh(geometrybox, linematerialbox);

    Group.add(messhBox);
    Group.add(cube2);
    return Group;
}
// 精灵图对象
export function ScreenObject() {
    const Group = new THREE.Group();
    // --------------------------
    // 尺寸相同的Sprite和矩形平面Mesh
    // 创建精灵材质对象SpriteMaterial  
    const texture = new THREE.TextureLoader().load("./staticModeL/mountain_landscape/cow.png");
    const spriteMaterial = new THREE.SpriteMaterial({
        color: 0x00ffff,//设置颜色
        map: texture, //设置精灵纹理贴图
        // transparent:true,//SpriteMaterial默认是true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 5, 1);
    sprite.add(new THREE.AxesHelper(5));
    sprite.position.y += 6;
    // ----------------------------
    Group.add(sprite);
    return Group;
}
// 生成坐标，来创建园
export function ScreenObj_1() {
    const Group = new THREE.Group();
    const geometry = new THREE.BufferGeometry(); //创建一个几何体对象
    const R = 90; //圆弧半径
    const N = 10050; //分段数量
    const sp = 2 * Math.PI / N;//两个相邻点间隔弧度
    // 批量生成圆弧上的顶点数据
    const arr = [];
    for (let i = 0; i < N; i++) {
        const angle = sp * i;//当前点弧度
        // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
        const x = R * Math.cos(angle);
        const y = R * Math.sin(angle);
        arr.push(x, y, 0);
    }
    //类型数组创建顶点数据
    const vertices = new Float32Array(arr);
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    const attribue = new THREE.BufferAttribute(vertices, 3);
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;

    // 线材质
    const material = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
    const line = new THREE.Line(geometry, material);
    // const line = new THREE.LineLoop(geometry, material);//线条模型对象
    Group.add(line);
    return Group;
}
// 加载第三方模型
export async function lodadByL() {
    // 引入gltf模型加载库GLTFLoader.js
    // 创建GLTF加载器对象
    const loader = new GLTFLoader();
    const texture = new THREE.TextureLoader().load("./staticModeL/mountain_landscape/cow.png");
    texture.flipY = false;
    console.log("纹理", texture);
    const div = document.getElementById('tag');
    // HTML元素转化为threejs的CSS3模型对象
    // const tag = new CSS2DObject(div);
    const tag = new CSS3DObject(div);
    tag.scale.set(0.05, 0.05, 1);//缩放标签尺寸
    return new Promise((resolve) => {
        loader.load('./staticModeL/mountain_landscape/Cow.gltf', function (gltf) {
            gltf.scene.name = "gltf-cow";
            const axesHelper = new THREE.AxesHelper(5); //局部坐标辅助
            let ancestors = gltf.scene;

            const mixer = new THREE.AnimationMixer(gltf.scene);
            const clipAction = mixer.clipAction(gltf.animations[0]);
            clipAction.play();
            const clock = new THREE.Clock();
            function loop() {
                requestAnimationFrame(loop);
                const frameT = clock.getDelta();
                // 更新播放器时间
                mixer.update(frameT);
            }
            loop();
            gltf.scene.traverse(function (obj) {
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    obj.ancestors = ancestors;
                    if (obj.material.map) {//判断是否存在贴图
                        obj.material.map = texture;
                        console.log('.encoding', obj.material.map.encoding);
                        obj.material.map.encoding = THREE.SRGBColorSpace;
                    }
                }
            });
            gltf.scene.add(axesHelper);
            //标签tag作为mesh子对象，默认标注在模型局部坐标系坐标原点
            // gltf.scene.add(tag);

            // 計算模型大小 
            const box3 = new THREE.Box3();
            box3.expandByObject(gltf.scene);
            const scale = new THREE.Vector3();
            box3.getSize(scale);
            console.log('模型包围盒尺寸', scale);
            // 相对父对象局部坐标原点偏移80,刚好标注在圆锥
            tag.position.y += parseInt(scale.y)
            console.log('控制台查看加载gltf文件返回的对象结构', gltf);
            // .encoding显示3001，说明是THREE.sRGBEncoding
            resolve(gltf.scene);// 返回的场景对象gltf.scene插入到threejs场景中
        });
    });
}
