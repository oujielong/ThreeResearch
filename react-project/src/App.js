import './App.css';
import { useEffect, useContext } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

import { hepler } from './helPerObj';
import { light } from './lightObj';
import { effect } from './effectBack';
import { ScreenObject, ScreenObj_1, ScreenObject_0, ScreenObject_2, lodadByL } from './geometryObj';
import { Control } from "./orginRact/components_control.jsx";
import { GlobalContent2 } from "./config/globalConfig";
import { callbackParams } from "./config/util";
import { renderClickCapture } from "./extralFunction";
import { moveAnimat, deformed } from "./animate";

function App() {
  const { setGloSc, setoutlinePass } = useContext(GlobalContent2);
  const { setAnimatObj } = useContext(GlobalContent2);

  const initThree = async () => {
    const scene = new THREE.Scene();
    setGloSc(scene);
    let renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.autoClearDepth = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;

    const css3Renderer = new CSS3DRenderer();
    document.body.appendChild(css3Renderer.domElement);
    css3Renderer.setSize(window.innerWidth, window.innerHeight);
    css3Renderer.domElement.style.position = 'absolute';
    css3Renderer.domElement.style.top = '0px';
    css3Renderer.domElement.style.pointerEvents = 'none';

    // 灯光组
    const lightGroup = light();
    scene.add(lightGroup);

    // 相机
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 3000);
    camera.lookAt(0, 0, 0); //坐标原点
    camera.position.set(20, 20, 20); //坐标原点

    // 视图控制器
    const control = new OrbitControls(camera, renderer.domElement);
    control.target = new THREE.Vector3(0, 0, 0);

    // 场景加东西----------------------------------------
    scene.add(hepler());
    const loadModel = await lodadByL();
    scene.add(loadModel);
    // scene.add(deformed());

    // scene.add(ScreenObject());
    // scene.add(ScreenObject_0());
    // scene.add(ScreenObject());
    // scene.add(ScreenObj_1());
    // -------------------------------------------
    // 后期特效渲染
    const { EffectComposer, OutlinePass } = effect({ renderer, scene, camera, scene });
    // 渲染器处理增强
    renderer = EffectComposer;
    setoutlinePass(OutlinePass);

    // 场景点击事件捕获
    renderer.renderer.domElement.addEventListener('click', callbackParams(renderClickCapture, { renderer, OutlinePass, camera, scene }));

    // 动画定义
    const { clipAction, mixer } = moveAnimat(loadModel);
    setAnimatObj(clipAction);
    const clock = new THREE.Clock();
    //执行渲染操作
    (function Animat() {
      renderer.render();
      css3Renderer.render(scene, camera);
      // 设置renderPass通道
      // renderer.render(scene, camera);
      requestAnimationFrame(Animat);
      // 更新播放器相关的时间
      mixer.update(clock.getDelta());
    })();

    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

  };
  useEffect(() => {
    initThree();
    return () => {
      // document.querySelector("body > div.lil-gui.allow-touch-styles.root.autoPlace > div.children > div") && document.querySelectorAll("body > div.lil-gui.allow-touch-styles.root.autoPlace > div.children > div").forEach((item) => item.remove());
      document.querySelector("canvas") && document.body.removeChild(document.querySelector("canvas"));
    };
  }, []);
  return (
    <>
      <Control></Control>
    </>
  );
};

export default App;
