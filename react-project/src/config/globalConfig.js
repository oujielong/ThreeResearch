// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { useState, createContext } from "react";
const GlobalContent2 = createContext(null);

function GlobalData(prop) {
    const [ gloSc, setGloSc ] = useState(null);
    const [ outlinePass, setoutlinePass ] = useState(null);

    const [ AnimatObj, setAnimatObj ] = useState(null);

    return (<GlobalContent2.Provider value={{
        gloSc,
        setGloSc,
        outlinePass,
        setoutlinePass,
        AnimatObj,
        setAnimatObj
    }}>{prop.children}</GlobalContent2.Provider>);
}


class GlobalGui {
    static instance = null;
    constructor() {
        if (GlobalGui.instance) return GlobalGui.instance;
        this.GUI = new GUI(document.querySelector("#root"));
        return GlobalGui.instance = this;
    }
    getGui() {
        return this.GUI;
    }
};
const GUI_Instance = (new GlobalGui).getGui();
export {
    GlobalContent2,
    GlobalData,
    GUI_Instance
};