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

//GoogleMap検索のURL
const Search_URL = "https://maps.google.co.jp/maps?q="

//HTML要素
const Display_Frame = {
    Title:document.getElementById("title_disp"),
    Main:document.getElementById("main_disp"),
}
const Main_Frame = {
    Info:document.getElementById("info"),
    Set:document.getElementById("setting"),
    Load:document.getElementById("load"),
}
const Info = {
    NAME_T:document.getElementById("name_text"),
    SACH_L:document.getElementById("search_link"),
    STAR_T:document.getElementById("rating_text"),
    STAR_S:document.getElementById("rating_star"),
    DIST_T:document.getElementById("distance_text"),
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

const load_text = "そうそう、このまえ聞いた話なんやけどな、なんやったっけ、すぐ思い出すんやけど、、、そやそや山田さんがさ、ちょいまって違うわ、あれやねんあれ、待ってな、もうここまで出てんねんけどさ、、、、、、、、、、、、、"
let NowLoad = false;

//送受信データ
let list = [];
let tmep_json;
let temp_info = [];

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
        {
            name:"新福菜館",
            inclose:true,
            rating:4.0,
            distance:500,
        },
    ]
}

async function GetInfo(){//Button{別のおばちゃんを呼ぶ}
    /*ロード画面の表示*/
    Display("Load");
    NowLoad = true;
    Load();

    /*送信JSONを作る*/
    GetSetting();//設定の更新
    const posi = await GetPosi();
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

    /*バックエンドと送受信*/
    if(ChangeJson(json) || list.length == 0){//検索条件の変更or全閲覧
        try{
            tmep_json = json;//送信Jsonの保存
            const res = await fetch(URL, {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(test_json)//変更--修正忘れ注意
            });
            const res_json = await res.json();
            list = res_json.json.plase;
/* 完成時にres_json.json.plaseからres_json.plaseに変更*/
        }catch(e){
            console.error("Error:", e);
        }
        console.log("Get JsonDate successful");
    }

    /*表示*/
    const i = Math.floor(Math.random()*list.length);
    temp_info.push(list[i]);
    if(temp_info.length > 3){temp_info.shift();}
    DispInfo();
    list.splice(i, 1);

    NowLoad = false;
    Display("Info");
}
const GetPosi = ()=>{//同期的な位置情報の取得
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
const ChangeJson = (json)=>{
    if(tmep_json == undefined)return true;
    if(json.range != tmep_json.range)return true;
    if(json.inclose != tmep_json.inclose)return true;
    if(json.type.toString() != tmep_json.type.toString())return true;
    return false;
}
const DispInfo = ()=>{//情報をInfoフレームに表示する
    const info = temp_info[temp_info.length-1];
    Info.NAME_T.innerText = info.name;
    Info.SACH_L.href = `${Search_URL}${info.name}`
    Info.STAR_T.innerText = info.rating;
    Info.STAR_S.style.setProperty('--percent', `${20 * info.rating}%`);
    Info.DIST_T.innerText = `${info.distance}m`;
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
    if(temp_info.length > 1){
        temp_info.pop();
        DispInfo();
    }else{
        alert("そんな昔のこと覚えてへんわ");
    }
    history.pushState(null, null, null);
    return;
});
history.pushState(null, null, null);
//console.log(やる気);