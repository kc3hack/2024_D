/*
やりたい
設定
　前回の設定の保存と取得
*/

//フェッチURL
let URL = "https://httpbin.org/post";

//GoogleMap検索のURL
const Search_URL_Id = "https://www.google.com/maps/place/?q=place_id:"
const Search_URL_Name = "https://maps.google.co.jp/maps/?q="

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
    PHOT_I:document.getElementById("photo_img"),
    SACH_L:document.getElementById("search_link"),
    STAR_T:document.getElementById("rating_text"),
    STAR_S:document.getElementById("rating_star"),
    DIST_T:document.getElementById("distance_text"),
    OPEN_T:document.getElementById("open_text"),
    OPEN_B:document.getElementById("open_border"),
}
const List_Frame = document.getElementById("list");
const Help_Img = document.getElementById("help_img");
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

const load_text = "そうそう、このまえ聞いた話なんやけどな、なんやったっけ、すぐ思い出すんやけど、、、そやそや山田さんがさ、ちょいまって違うわ、あれやねんあれ、待ってな、もうここまで出てんねんけどさ、、、あかんヤバイわ、ど忘れしてもうた、、、待ってや、すぐ思い出すからな、もうここまで出てきてんねん、、、、"
let NowLoad = false;

//受信データの処理
let list;      //受信したJSONを保存
let order = [];     //表示順を数列で保存
let now_No = 0;     //現在表示している店舗
let tmep_json;      //設定の変更を監視する用

async function GetInfo(){

    if(NowLoad == true){return;}    //複数読み込みの予防

    GetType();           //現在の設定を取得
    const json = {          //JSONの作成
        latitude:35,
        longitude:135,
        range:Setting.RAN_S.value - 0,
        inclose:Setting.ICL_C.checked,
        type:[],
    }
    for(let i of Object.values(Type)){
        if(i.Value == true){json.type.push(i.Name)}
    }

    if(ChangeJson(json) || now_No >= list.length-1){    //通信の必要性を確認

        /*ロード画面の表示*/
        Display("Load");
        NowLoad = true;
        Load();

        /*位置情報を取得*/
        const posi = await GetPosi();
        json.latitude = posi.coords.latitude;
        json.longitude = posi.coords.longitude;

        try{
            tmep_json = json;//送信Jsonの保存
            /*フェッチ*/
            const controller = new AbortController()
            await setTimeout(() => controller.abort(), 20000)
            const res = await fetch(URL, {
                method: "POST",
                signal: controller.signal,
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(json_test)
            });
            const res_json = await res.json();
            await new Promise(p => setTimeout(p, 3000))
            list = res_json.json.places;
            console.log("Get JsonDate successful");
        }catch(e){
            console.error("Error:", e);
            alert("あかんわ、なんも思い出せへんわ");
            tmep_json = undefined;
            NowLoad = false;
            Display("Info");
            return;
        }

        if(list.length == 0){
            alert("アカンは、ここ田舎や");
            NowLoad = false;
            Display("Info");
            return;
        }

        /*店舗一覧を表示*/
        DispList();

        /*表示順の数列を作成*/
        now_No = 0;
        order = [];
        for(let i=0; i<list.length; i++){
            while(1){
                const tmp = Math.floor(Math.random()*list.length);
                if(!order.includes(tmp)){
                    order.push(tmp);
                    break;
                }
            }
        }
    }else{
        now_No++;
    }
    /*メインInfoに表示*/
    DispInfo(order[now_No]);

    /*ロード画面の終了*/
    NowLoad = false;
    Display("Info");
}
const GetType = ()=>{
    Type.RES.Value = Setting.RES_C.checked;
    Type.PAR.Value = Setting.PAR_C.checked;
    Type.ENT.Value = Setting.ENT_C.checked;
    Type.STO.Value = Setting.STO_C.checked;
}
const GetPosi = ()=>{           //位置情報の取得
    return new Promise((resolve)=>{
        try{
            navigator.geolocation.getCurrentPosition((posi)=> {
                resolve(posi);
            });
        }catch(e){
            console.error("Error:", e);
            resolve();
        }
    })
}
const ChangeJson = (json)=>{    //JSONが変更されているかを確認  引数(現在のJSON)
    if(tmep_json == undefined)return true;
    if(json.range != tmep_json.range)return true;
    if(json.inclose != tmep_json.inclose)return true;
    if(json.type.toString() != tmep_json.type.toString())return true;
    return false;
}
const DispInfo = (Order)=>{     //メインInfoに表示する  引数(表示する店舗の要素番号)
    const info = list[Order];
    Info.NAME_T.innerText = info.name;
    Info.PHOT_I.src = info.photo;
    Info.SACH_L.href = `${Search_URL_Id}${info.id}`;
    // Info.SACH_L.href = `${Search_URL_Name}${info.name}`;
    Info.STAR_T.innerText = info.rating;
    Info.STAR_S.style.setProperty('--percent', `${20 * info.rating}%`);
    Info.DIST_T.innerText = `${info.distance}m`;
    Info.OPEN_T.innerText = (info.open_now == true)? "営業中":"時間外";
    Info.OPEN_B.style.setProperty('--color', (info.open_now == true)? "#00ff1a":"#ff0000");

    console.log(info);
}
const DispList = ()=>{          //周辺の店舗一覧を表示
    let str = "";
    for(let i=0; i<list.length; i++){
        str += `<p onclick="DispInfo(${i})" class="list_text">・${list[i].name}</p>`
    }
    List_Frame.innerHTML = str;
}

function Display(Name){         //メイン画面の変更  引数(表示するフレーム)
    if(Name == "Set"){now_No++;}//履歴表示用
    for(let i of Object.keys(Main_Frame)){
        if(i == Name){
            Main_Frame[i].style.display = "";
        }else{
            Main_Frame[i].style.display = "none";
        }
    }
}

function Load(){                //ロード画面を再生する
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

function Help(show){            //ヘルプ画面を表示する  引数(表示/非表示)
    Help_Img.style.display = (show)? "":"none";
    return "OK";
}

function Start_Btn(){           //スタートボタンが押された
    Display_Frame.Title.style.display = "none";
    Display_Frame.Main.style.display = "";
}

/**/
Setting.RAN_S.addEventListener('input', (e)=>{
    Setting.RAN_T.innerText = `:${Setting.RAN_S.value}m`;
});

window.addEventListener('popstate', (e)=>{
    if(now_No > 0){
        now_No--;
        DispInfo(order[now_No]);
        Display("Info");
    }else{
        alert("そんな昔のこと覚えてへんわ");
    }
    history.pushState(null, null, null);
    return;
});
history.pushState(null, null, null);
//console.log(やる気);