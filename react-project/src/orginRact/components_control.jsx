import { useEffect, useState, useContext } from "react";
import { Button, ConfigProvider, MenuProps, Dropdown, Flex, Slider } from 'antd';
import { GlobalContent2 } from "../config/globalConfig";
import React from 'react';

export function Control() {
    const { gloSc, outlinePass } = useContext(GlobalContent2);
    const { AnimatObj, setAnimatObj } = useContext(GlobalContent2);
    const [ controlMenu, setcontrolMenu ] = useState([ {
        key: 'start',
        label: '开始',
    },
    {
        key: 'stop',
        label: '停止',
    },
    {
        key: 'pause',
        label: '暂停',
    }
    ]);
    const marks = {
        1: '1',
        "1.5": '1.5',
        2: {
            style: {
                color: '#f50',
            },
            label: <strong>2</strong>,
        },
    };
    // 渲染选中目标
    const changehightLight = () => {
        const A = gloSc.getObjectByName('gltf-cow');
        const Exist = outlinePass.selectedObjects.some(item => {
            return item.name == 'gltf-cow';
        });
        !Exist && (outlinePass.selectedObjects = [ A ]);
        Exist && (outlinePass.selectedObjects = outlinePass.selectedObjects.filter(item => item.name != 'gltf-cow'));

    };

    // 动画触发
    const onMenuClick = (e) => {
        switch (e.key) {
            case "start":
                AnimatObj.play();
                break;
            case "stop":
                //动画停止结束，回到开始状态
                AnimatObj.stop();
                break;
            case "pause":
                if (AnimatObj.paused) {//暂停状态
                    AnimatObj.paused = false;//切换为播放状态
                    setcontrolMenu(controlMenu.map(item => {
                        if (item.key == e.key) {
                            item.label = "暂停";
                        }
                        return item;
                    }));
                } else {//播放状态
                    AnimatObj.paused = true;//切换为暂停状态
                    setcontrolMenu(controlMenu.map(item => {
                        if (item.key == e.key) {
                            item.label = "继续";
                        }
                        return item;
                    }));
                }
            default:
                break;
        }

    };
    const speeOfAnimate = (value) => {
        AnimatObj.timeScale = value;
    };
    const timeOfAnimate = (value) => {
        AnimatObj.play();
        AnimatObj.paused = true;
        AnimatObj.time = value;//物体状态为动画1秒对应状态
    };
    return (<>
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        /* here is your component tokens */
                    },
                },
            }}
        >
            <Flex style={{
                padding: "10px",
                width: '100%',
                height: 120,
                borderRadius: 6,
                border: '1px solid #40a9ff',
            }} gap="small"
                vertical={false}
            >
                <Button onClick={changehightLight} type="primary">选中目标渲染修改</Button>
                <Dropdown.Button
                    style={{ width: "20vh" }}
                    menu={{
                        items: controlMenu,
                        onClick: onMenuClick
                    }}
                >
                    动画
                </Dropdown.Button>
                <div>
                    <h4>速度</h4>
                    <Slider style={{ width: "40vh" }} marks={marks} step={0.2} defaultValue={1} min={0.5} max={6} onChange={speeOfAnimate} />
                </div>
                <div>
                    <h4>动画进度时间</h4>
                    <Slider style={{ width: "40vh" }} marks={marks} step={0.1} defaultValue={0} min={0} max={6} onChange={timeOfAnimate} />
                </div>
            </Flex>

        </ConfigProvider>

    </>);
};

