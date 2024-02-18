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
    Info:document.getElementById(""),
    Set:document.getElementById(""),
    Load:document.getElementById(""),
}
const List_Frame = document.getElementById("list");
const Setting_Input = {
    RAN_S:document.getElementById(""),
    ICL_C:document.getElementById(""),
    RES_C:document.getElementById(""),
    PAR_C:document.getElementById(""),
    ENT_C:document.getElementById(""),
    STO_C:document.getElementById(""),
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

async function GetInfo(){//Button{別のおばちゃんを呼ぶ}
    const posi = await GetPosi();
    //緯度：posi.coords.latitude
    //経度：posi.coords.longitude
    
    GetSetting();//設定の更新

    const json = {
        latitude:posi.coords.latitude,
        longitude:posi.coords.longitude,
        range:Range,
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
            body:JSON.stringify(json)
        });
        const res_json = await res.json();
        console.log(res_json.json);
    }catch(e){
        console.error("Error:", e);
    }
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

function Display(name){
    //画面の切り替え
}

function GetSetting(){
    //設定の取得
}
//console.log(error);
GetInfo();