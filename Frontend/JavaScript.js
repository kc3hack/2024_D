/*やること
設定
　*設定画面の表示
　*設定の取得

メイン動作
　位置情報の取得
　情報の送信
　情報の受信
　画面の反映

やりたい
設定
　前回の設定の保存と取得
*/

//HTML要素
const Main_Frame = document.getElementById("main");
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

async function GetInfo(){
    const posi = await GetPosi();
    /*緯度：posi.coords.latitude
      経度：posi.coords.longitude
    */
    
}
const GetPosi = ()=>{
    return new Promise((resolve)=>{
        navigator.geolocation.getCurrentPosition((posi)=> {
            resolve(posi);
        });
    })
}

function Display(name){
    //画面の切り替え
}

function GetSetting(){
    //設定の取得
}
GetInfo();