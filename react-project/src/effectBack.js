import * as THREE from 'three';
import { GUI_Instance } from './config/globalConfig';
//渲染器
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export function effect({ renderer, scene, camera }) {
    // 特效渲染器基于webGlrender的加强
    renderer = new EffectComposer(renderer);
    // 创建一个渲染器通道，场景和相机作为参数
    const renderPass = new RenderPass(scene, camera);
    renderer.addPass(renderPass); //必须的基本渲染通道
    // ---------------------------
    // OutlinePass第一个参数v2的尺寸和canvas画布保持一致
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    //模型描边颜色，默认白色         
    outlinePass.visibleEdgeColor.set(0xffff00);
    //高亮发光描边厚度
    outlinePass.edgeThickness = 4;
    //高亮描边发光强度
    outlinePass.edgeStrength = 6;
    //模型闪烁频率控制，默认0不闪烁
    outlinePass.pulsePeriod = 2;
    renderer.addPass(outlinePass);
    // ---------------------------
    return {
        EffectComposer: renderer,
        OutlinePass: outlinePass
    };
}