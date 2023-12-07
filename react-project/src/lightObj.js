import * as THREE from 'three';
import { GUI_Instance } from './config/globalConfig';
export function light({ isdirHelper, lightShadowHelper, manualDynamicHelper } = { isdirHelper: true, lightShadowHelper: false, manualDynamicHelper: true }) {

    let cameraHelper;
    let dirHelper;
    // 需要用get Points
    const Group = new THREE.Group();
    //环境光，平衡光
    const ambienLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
    const directLine = new THREE.DirectionalLight(0x8F7722);
    directLine.position.set(-50, 50, 50);

    directLine.castShadow = true;
    directLine.shadow.mapSize.set(1024, 1024);
    directLine.shadow.radius = 0.5;
    if (lightShadowHelper) {
        // 可以产生阴影的范围,样例图
        directLine.shadow.camera.left = -20;
        directLine.shadow.camera.right = 20;
        directLine.shadow.camera.top = 20;
        directLine.shadow.camera.bottom = -20;
        directLine.shadow.camera.near = 0.5;
        directLine.shadow.camera.far = 120;
        cameraHelper = new THREE.CameraHelper(directLine.shadow.camera);
    }
    // 平行光光线方向辅助
    if (isdirHelper) {
        dirHelper = new THREE.DirectionalLightHelper(directLine, 5);//平衡光辅助
    }

    //GUI 手动调节参数
    manualDynamicHelper && lightShadowHelper && GUICombine();
    let GropItme = [ directLine, ambienLight, isdirHelper ? dirHelper : null, lightShadowHelper ? cameraHelper : null ].filter(item => item);;
    Group.add(...GropItme);
    return Group;

    // --------------------------------
    function GUICombine() {
        const gui = GUI_Instance; //new GUI();
        const shadowFolder = gui.addFolder('平行光阴影');
        const cam = directLine.shadow.camera;
        // 相机left、right等属性变化执行.updateProjectionMatrix();
        // 相机变化了，执行CameraHelper的更新方法.update();
        shadowFolder.add(cam, 'left', -500, 0).onChange(function (v) {
            cam.updateProjectionMatrix();//相机更新投影矩阵
            cameraHelper.update();//相机范围变化了，相机辅助对象更新
        });
        shadowFolder.add(cam, 'right', 0, 500).onChange(function (v) {
            cam.updateProjectionMatrix();
            cameraHelper.update();
        });
        shadowFolder.add(cam, 'top', 0, 500).onChange(function (v) {
            cam.updateProjectionMatrix();
            cameraHelper.update();
        });
        shadowFolder.add(cam, 'bottom', -500, 0).onChange(function (v) {
            cam.updateProjectionMatrix();
            cameraHelper.update();
        });
        shadowFolder.add(cam, 'far', 0, 1000).onChange(function (v) {
            cam.updateProjectionMatrix();
            cameraHelper.update();
        });

        const lightFolder = gui.addFolder('光线阴影位置');
        const obj = {
            R: 100,
            angle: Math.PI,
        };
        lightFolder.add(obj, 'R', 0, 300).onChange(function (value) {
            directLine.position.setX(value * Math.cos(obj.angle));
            directLine.position.setZ(value * Math.sin(obj.angle));
            dirHelper.update();
        });
        lightFolder.add(obj, 'angle', 0, Math.PI * 2).onChange(function (value) {
            directLine.position.x = obj.R * Math.cos(value);
            directLine.position.z = obj.R * Math.sin(value);
            dirHelper.update();
        });
    }
}



