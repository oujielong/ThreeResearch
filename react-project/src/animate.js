import * as THREE from 'three';
import { useEffect, useContext } from "react";
import { GlobalContent2 } from "./config/globalConfig";
function moveAnimat(mesh) {
    const times = [ 0, 3, 6 ]; //时间轴上，设置三个时刻0、3、6秒
    // times中三个不同时间点，物体分别对应values中的三个xyz坐标
    const values = [ 0, 0, 0, 100, 0, 0, 0, 0, 100 ];
    // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
    const posKF = new THREE.KeyframeTrack('gltf-cow.position', times, values);
    // 从2秒到5秒，物体从红色逐渐变化为蓝色
    const colorKF = new THREE.KeyframeTrack('gltf-cow.material.color', [ 2, 5 ], [ 1, 0, 0, 0, 0, 1 ]);
    // 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
    const clip = new THREE.AnimationClip("test", 6, [ posKF, colorKF ]);

    //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
    const mixer = new THREE.AnimationMixer(mesh);
    //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
    const clipAction = mixer.clipAction(clip);

    clipAction.loop = THREE.LoopRepeat;
    clipAction.clampWhenFinished = true;
    //.play()控制动画播放，默认循环播放
    return { clipAction, mixer };
}
function deformed() {
    //几何体两组顶点一一对应，位置不同，然后通过权重系数，可以控制模型形状在两组顶点之间变化
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    // 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
    const target1 = new THREE.BoxGeometry(10, 200, 10).attributes.position;//变高
    const target2 = new THREE.BoxGeometry(5, 10, 10).attributes.position;//变细
    // 几何体顶点变形目标数据，可以设置1组或多组
    geometry.morphAttributes.position = [ target1, target2 ];

    const material = new THREE.MeshBasicMaterial({ color: "#346790" });
    const mesh = new THREE.Mesh(geometry, material);
    // 两个变形目标同时影响模型形状
    mesh.name = "Box";//关键帧动画控制的模型对象命名
    // 设置变形目标1对应权重随着时间的变化
    const KF1 = new THREE.KeyframeTrack('Box.morphTargetInfluences[0]', [ 0, 5 ], [ 0, 0.5 ]);
    // 设置变形目标2对应权重随着时间的变化
    const KF2 = new THREE.KeyframeTrack('Box.morphTargetInfluences[1]', [ 5, 10 ], [ 0, 1 ]);
    // 创建一个剪辑clip对象
    const clip = new THREE.AnimationClip("t", 10, [ KF1, KF2 ]);
    const mixer = new THREE.AnimationMixer(mesh);
    const clipAction = mixer.clipAction(clip);
    clipAction.play();
    clipAction.loop = THREE.LoopOnce; //不循环播放
    clipAction.clampWhenFinished = true; // 物体状态停留在动画结束的时候

    const clock = new THREE.Clock();
    function loop() {
        requestAnimationFrame(loop);
        const frameT = clock.getDelta();
        // 更新播放器时间
        mixer.update(frameT);
    }
    loop();
    return mesh;
}

export { moveAnimat, deformed };