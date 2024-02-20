/*やること
設定
　*設定画面の表示
　*設定の取得

メイン動作
　**位置情報の取得
　**情報の送信
　情報の受信
　画面の反映

やりたい
設定
　前回の設定の保存と取得
*/

//フェッチURL
const URL = "https://httpbin.org/post";

//HTML要素
const Main_Frame = {
    Info:document.getElementById("info"),
    Set:document.getElementById("setting"),
    Load:document.getElementById("load"),
}
const Info = {
    NAME_T:document.getElementById(""),
    STAR_T:document.getElementById(""),
    STAR_S:document.getElementById(""),
    DIST_T:document.getElementById(""),
}
const List_Frame = document.getElementById("list");
const Setting = {
    RAN_S:document.getElementById("slider_ran"),
    RAN_T:document.getElementById("ran_text"),
    ICL_C:document.getElementById("check_icl"),
    RES_C:document.getElementById("check_res"),
    PAR_C:document.getElementById("check_par"),
    ENT_C:document.getElementById("check_ent"),
    STO_C:document.getElementById("check_sto"),
}

//設定項目の変数
let Range = 500;
let InClouse = false;
let Type = {
    RES:{Name:"restaurant", Value:true},
    PAR:{Name:"park", Value:true},
    ENT:{Name:"entertainment", Value:true},
    STO:{Name:"store", Value:true},
}

const load_text = "そうそう、このまえ聞いた話なんやけどな、なんやったっけ、すぐ思い出すんやけど、、、そやそや山田さんがさ、ちょいまって違うわ、あれやねんあれ、待ってな、もうここまで出てんねんけどさ、、、"
let NowLoad = false;

//受信JSON
let list = [];

const test_json = {
    plase:[
        {
            name:"天下一品",
            inclose:true,
            rating:4.5,
            distance:300,
        },
        {
            name:"来来亭",
            inclose:false,
            rating:3.5,
            distance:200,
        },
    ]
}

async function GetInfo(){//Button{別のおばちゃんを呼ぶ}
    Display("Load");
    NowLoad = true;
    Load();

    GetSetting();//設定の更新

    if(list.length == 0){
        const posi = await GetPosi();
        //緯度：posi.coords.latitude
        //経度：posi.coords.longitude

        const json = {
            latitude:posi.coords.latitude,
            longitude:posi.coords.longitude,
            range:Range,
            inclose:InClouse,
            type:[],
        }
        for(let i of Object.values(Type)){
            if(i.Value == true){json.type.push(i.Name)}
        }
        try{
            const res = await fetch(URL, {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(test_json)//変更--修正忘れ注意
            });
            const res_json = await res.json();
            list = res_json.json.plase;
        }catch(e){
            console.error("Error:", e);
        }
        console.log("Get JsonDate successful");
    }

    const i = Math.floor(Math.random()*list.length);

    DispInfo(list[i]);

    list.splice(i, 1);

    NowLoad = false;
    Display("Info");
}
const GetPosi = ()=>{//GetInfoの同期処理
    return new Promise((resolve)=>{
        try{
            navigator.geolocation.getCurrentPosition((posi)=> {
                resolve(posi);
            });
        }catch(e){
            console.error("Error:", e);
        }
    })
}
const DispInfo = (info)=>{
    //情報をInfoに表示する
    console.log(info);
}

function Display(Name){
    //画面の切り替え
    //console.log(Main_Frame["Info"]);
    for(let i of Object.keys(Main_Frame)){
        if(i == Name){
            Main_Frame[i].style.display = "";
        }else{
            Main_Frame[i].style.display = "none";
        }
    }
}

function Load(){
    const str = "";
    let i=0;
    const loop = setInterval(()=>{
        Main_Frame.Load.innerText = load_text.substring(0, i);
        i++
        if(!NowLoad){
            clearInterval(loop);
        }
    }, 75);
    
}

function GetSetting(){
    Range = Setting.RAN_S.value - 0;
    InClouse = Setting.ICL_C.checked;
    Type.RES.Value = Setting.RES_C.checked;
    Type.PAR.Value = Setting.PAR_C.checked;
    Type.ENT.Value = Setting.ENT_C.checked;
    Type.STO.Value = Setting.STO_C.checked;
}

Setting.RAN_S.addEventListener('input', (e)=>{
    Setting.RAN_T.innerText = `:${Setting.RAN_S.value}m`;
});
window.addEventListener('popstate', (e)=>{
    console.log("NO!Back");
    history.pushState(null, null, null);
    return;
});
history.pushState(null, null, null);
//console.log(やる気);