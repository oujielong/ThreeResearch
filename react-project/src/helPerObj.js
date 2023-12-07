import * as THREE from 'three';
export function hepler({ AxesHelper, GridHelper, earthHelper } = { AxesHelper: false, GridHelper: false, earthHelper: true }) {
    // 需要用get Points
    const Group = new THREE.Group();
    const axesHelper = new THREE.AxesHelper(5); //全局坐标辅助
    const gridHelper = new THREE.GridHelper(10, 10);//网格辅助
    const Plan = new THREE.PlaneGeometry(100, 100, 100, 100);//一块地板
    const planMet = new THREE.MeshLambertMaterial({ color: 0xEEEEEE, side: THREE.DoubleSide });
    const earthPlan = new THREE.Mesh(Plan, planMet);
    earthPlan.rotateX(Math.PI / 2);
    earthPlan.receiveShadow = true;
    let GropItme = [ earthHelper ? earthPlan : null, AxesHelper ? axesHelper : null, GridHelper ? gridHelper : null ].filter(item=>item);
    Group.add(...GropItme);
    return Group;
}
