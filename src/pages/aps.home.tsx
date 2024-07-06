import { faker } from '@faker-js/faker'
import { Divider } from '@mui/material'
import { useEffect, useState } from 'react';
import { ApiGetObjectByLayout } from '../service/mp.service';
import { PropsMpckObject } from '../interface/mp.interface';
function ApsHome() {
    const [objects, setObjects] = useState<PropsMpckObject[]>([]);
    const ThemeTrue:any = {
        bg: ["yellow", "#bba17a", "#b88a45"],
        text: "#333333",
    };
    const ThemeFalse:any = {
        bg: ["#fff", "#6d1803", "#6d210f"],
        text: "white",
    };
    useEffect(() => {
        init();
    }, [])
    const init = async () => {
        const resGetObjectByLayout = await ApiGetObjectByLayout({
            layoutCode: 'LAY23008'
        });
        setObjects(resGetObjectByLayout);
    }
    useEffect(() => {
        if (objects.length > 0) {
            renderSvg();
        } else {
            console.log('ไม่พบข้อมูล')
        }
    }, [objects])

    const renderSvg = async () => {
        console.log('render svg')
        let svgContent = document.querySelector("#svgContent");
        if (svgContent != undefined) {
            svgContent.innerHTML = "";
            let svgMaster = "";
            let svg = "";
            await objects.map((elObj: PropsMpckObject) => {
                svgMaster = elObj.objSvg;
                let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                let mSkill = elObj.manskill;
                if (elObj.objSvg.includes('bg-set')) {
                    const itemSvg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    itemSvg.innerHTML = svgMaster;
                    let BgParent: HTMLElement | null = itemSvg.querySelector('#bgTitle');
                    if (BgParent != null) {
                        let BGChild: any = BgParent.querySelector('rect');
                        let svgChild: any = itemSvg.querySelector('g>svg');
                        BGChild.setAttribute('width', elObj.objWidth);
                        BGChild.setAttribute('height', elObj.objHeight);
                        BGChild.setAttribute('fill', elObj.objBackgroundColor != '' ? elObj.objBackgroundColor : 'blue');
                        BGChild.setAttribute('stroke', elObj.objBorderColor != '' ? elObj.objBorderColor : 'black')
                        svgChild.setAttribute('width', elObj.objWidth);
                        svgChild.setAttribute('height', elObj.objHeight);
                        svgChild.setAttribute('stroke-width', elObj.objBorderWidth);
                        const blob = new Blob([itemSvg.innerHTML], { type: "image/svg+xml" });
                        const url = URL.createObjectURL(blob);
                        const use = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "use"
                        );
                        use.setAttribute("href", url + "#" + elObj.objMasterId);
                        use.setAttribute("id", elObj.objCode);
                        use.setAttribute("x", elObj.objX.toString());
                        use.setAttribute("y", elObj.objY.toString());
                        svg.appendChild(use);
                    }

                } else if (elObj.objSvg.includes("animateMotion")) {
                    let itemSvg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    elObj.objSvg = elObj.objSvg.replace("<defs>", "");
                    elObj.objSvg = elObj.objSvg.replace("{objName}", elObj.objTitle);
                    elObj.objSvg = elObj.objSvg.replace("{objName}", elObj.objTitle);
                    elObj.objSvg = elObj.objSvg.replace("{empcode}", elObj.empCode);
                    elObj.objSvg = elObj.objSvg.replace("{empcode}", elObj.empCode);
                    elObj.objSvg = elObj.objSvg.replace("{obj_man_skill}", mSkill);
                    (elObj.mq == "TRUE" ? ThemeTrue.bg : ThemeFalse.bg).map(
                        (theme:any) => {
                            elObj.objSvg = elObj.objSvg.replace(`{bgmq}`, theme);
                        }
                    );
                    (elObj.sa == "TRUE" ? ThemeTrue.bg : ThemeFalse.bg).map(
                        (theme:any) => {
                            elObj.objSvg = elObj.objSvg.replace(`{bgsa}`, theme);
                        }
                    );
                    (elObj.ot == "TRUE" ? ThemeTrue.bg : ThemeFalse.bg).map(
                        (theme:any) => {
                            elObj.objSvg = elObj.objSvg.replace(`{bgot}`, theme);
                        }
                    );
                    elObj.objSvg = elObj.objSvg.replace("{empImage}", elObj.empImage);
                    itemSvg.innerHTML = elObj.objSvg;
                    itemSvg.setAttribute("id", elObj.objCode);
                    itemSvg.setAttribute("x", elObj.objX);
                    itemSvg.setAttribute("y", elObj.objY);
                    // itemSvg.addEventListener("click", function () {
                    //     setObjSelected(elObj);
                    //     setOpenCheckIn(true);
                    // });
                    itemSvg = createViewMQSA(elObj, itemSvg);
                    svg.appendChild(itemSvg);
                } else if (elObj.objSvg.includes("svgTxtTitle") && elObj.objSvg.includes("WidthFollowText")) {
                    const itemSvg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    elObj.objSvg = elObj.objSvg.replace("{objName}", elObj.objTitle);
                    itemSvg.innerHTML = elObj.objSvg;

                    let areaFree = document.getElementById('bg');
                    let iSpan = document.createElement('span');
                    iSpan.innerHTML = elObj.objTitle;
                    iSpan.setAttribute('refId', elObj.objCode);
                    iSpan.style.fontSize = `${elObj.objFontSize}px`
                    let spanWidth: number = 0;
                    let oSpanAgain: number = 0;
                    if (areaFree != null) {
                        areaFree.appendChild(iSpan);
                        let oSpanAgain: HTMLElement | null = areaFree.querySelector(`span[refid=${elObj.objCode}]`);
                        if (oSpanAgain != null) {
                            spanWidth = oSpanAgain.offsetWidth;
                            oSpanAgain.remove();
                        }
                    }
                    let text = itemSvg.querySelectorAll('text');
                    let widthBg: string = '0';
                    if (text.length > 0) {
                        widthBg = (Math.ceil(spanWidth) + 50).toString();
                    }
                    let bg = itemSvg.querySelectorAll('svg#bgTitle');
                    if (bg.length > 0) {
                        bg[0].setAttribute('width', widthBg);
                    }
                    let rect = itemSvg.querySelectorAll('rect.svgTxtTitleBg');
                    if (rect.length > 0) {
                        rect[0].setAttribute('width', widthBg);
                    }
                    if (itemSvg.querySelector("svg#bgTitle") != null) {
                        let textTitle = itemSvg.querySelectorAll('text');
                        if (textTitle.length > 0) {
                            textTitle[0].setAttribute('fill', elObj.objFontColor);
                        }
                        // itemSvg.querySelector("svg#bgTitle").setAttribute("width", Math.ceil(parseInt(spanWidth)) + 50);
                    }
                    itemSvg.setAttribute("id", elObj.objCode);
                    itemSvg.setAttribute("x", elObj.objX);
                    itemSvg.setAttribute("y", elObj.objY);
                    svg.appendChild(itemSvg);
                } else if (elObj.objSvg.includes("svgTxtBigTitle")) {
                    const itemSvg: any = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    elObj.objSvg = elObj.objSvg.replace("{objName}", elObj.objTitle);
                    itemSvg.innerHTML = elObj.objSvg;
                    var areaFree: any = document.getElementById('bg')
                    var iSpan = document.createElement('span');
                    iSpan.innerHTML = elObj.objTitle;
                    iSpan.setAttribute('refId', elObj.objCode)
                    areaFree.appendChild(iSpan)
                    var oSpanAgain = areaFree.querySelector(`span[refid=${elObj.objCode}]`);
                    var spanWidth = oSpanAgain.offsetWidth;
                    oSpanAgain.remove();
                    let len = elObj.objTitle.length;
                    itemSvg
                        .querySelector("rect.svgTxtBigTitleBg")
                        .setAttribute("width", Math.ceil(parseInt(spanWidth)) + (len < 20 ? 100 : 115));
                    if (itemSvg.querySelector("svg#bgTitle") != null) {
                        itemSvg.querySelector("svg#bgTitle").setAttribute("width", Math.ceil(parseInt(spanWidth)) + (len < 20 ? 100 : 115));
                    }
                    itemSvg.setAttribute("id", elObj.objCode);
                    itemSvg.setAttribute("x", elObj.objX);
                    itemSvg.setAttribute("y", elObj.objY);
                    svg.appendChild(itemSvg);
                } else if (elObj.objSvg.includes("animate")) {
                    const itemSvg: any = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );
                    itemSvg.innerHTML = elObj.objSvg;
                    itemSvg.setAttribute("id", elObj.objCode);
                    itemSvg.setAttribute("x", elObj.objX);
                    itemSvg.setAttribute("y", elObj.objY);
                    if (itemSvg.querySelector('svg').getAttribute('viewBox') != null) {
                        itemSvg.querySelector('svg').removeAttribute('viewBox')
                    }
                    svg.appendChild(itemSvg);
                } else {
                    svgMaster = svgMaster.replace("{objName}", elObj.objTitle);
                    svgMaster = svgMaster.replace("{empcode}", elObj.empCode);
                    svgMaster = svgMaster.replace("{title_color_bg}", elObj.empCode != "" ? "green" : "red");
                    svgMaster = svgMaster.replace("{obj_man_skill}", mSkill);
                    const blob = new Blob([svgMaster], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    const use = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "use"
                    );
                    use.setAttribute("href", url + "#" + elObj.objMasterId);
                    use.setAttribute("id", elObj.objCode);
                    use.setAttribute("x", elObj.objX);
                    use.setAttribute("y", elObj.objY);
                    svg.appendChild(use);
                }
                svgContent.appendChild(svg);
            });
            return true;
        }
    }

    function createViewMQSA(elObj: PropsMpckObject, elSVG: any) {
        elSVG.innerHTML = elObj.objSvg;

        let bgSA = elSVG.querySelector('.bg_sa');
        let txtSA = elSVG.querySelector('.txt_sa');

        if (txtSA != null) {
            let txtOT = elSVG.querySelector('.txt_ot');
            txtSA.style.fontWeight = 'bold';
            txtOT.style.fontWeight = 'bold';
            if (typeof elObj.objSA != 'undefined' && elObj.objSA.length) {
                bgSA.style.fill = 'yello';
                txtSA.style.fill = 'black';
            } else {
                bgSA.style.fill = 'white';
                txtSA.style.fill = 'white';
            }
            let bgImage = elSVG.querySelector('.bg_img');
            if (typeof elObj.empCode != 'undefined' && elObj.empCode == '') {
                bgImage.style.fill = '#ff4234';
            }
        }
        let bgMQ = elSVG.querySelector('.bg_mq');
        let txtMQ = elSVG.querySelector('.txt_mq');

        if (txtMQ != null) {
            if (typeof elObj.objMQ != 'undefined' && elObj.objMQ.length) {
                bgMQ.style.fill = 'yello';
                txtMQ.style.fill = 'black';
            } else {
                bgMQ.style.fill = 'white';
                txtMQ.style.fill = 'white';
            }
        }
        return elSVG;
    }
    return (
        <div>

            <>
                <div className='grid grid-cols-4 gap-2'>
                    <div className='border rounded-md bg-white border-gray-200 py-3 px-6 gap-2 flex flex-col'>
                        <div className=' flex gap-3'>
                            <span className='font-bold'>SCR LINE 4</span>
                            <div className='bg-green-100 border border-dashed border-green-600 rounded-xl px-2 text-green-700 w-fit text-[12px] items-center flex cursor-pointer '>Online</div>
                        </div>
                        <Divider />
                        <div className='grid grid-cols-3 text-sm'>
                            <div >
                                <div className='text-[#6b7280]'>Total</div>
                                <div className='pl-1 text-[#4f46e5] font-semibold'>{faker.datatype.number({ min: 1, max: 50 }).toLocaleString('en')}</div>
                            </div>
                            <div>
                                <div className='text-[#6b7280]'>Check-In</div>
                                <div className='pl-1 text-[#16A34A] font-semibold'>{faker.datatype.number({ min: 1, max: 30 }).toLocaleString('en')}</div>
                            </div>
                            <div>
                                <div className='text-[#6b7280]'>Percent</div>
                                <div className='pl-1 text-red-500 font-semibold'>{faker.datatype.number({ min: 1, max: 100 }).toLocaleString('en')} <span className='text-[12px] text-red-400'>%</span></div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        {
                            ['MACHINE L5', 'MACHINE L6'].map((item, i) => <div key={i} className=' rounded-md py-3 px-6 gap-2 flex flex-col  cursor-pointer w-fit items-center'>
                                <div className={`text-[#4d5665] opacity-30`}>
                                    {item}
                                </div>
                                <div className='border bg-white rounded-md opacity-100 w-fit px-3'>View</div>
                            </div>)
                        }
                    </div>
                </div>
                <div className='px-3'>
                    <svg
                        id="svgContent"
                        viewBox={`0 0 1200 800`}
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid meet"
                    ></svg>
                    <div id="bg" style={{ color: '#e9fbff', marginLeft: -5000, position: 'absolute' }}>
                    </div>
                </div>
            </>
        </div>
    )
}

export default ApsHome