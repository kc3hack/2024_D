/*
やりたい
設定
　前回の設定の保存と取得
*/

//フェッチURL
const URL = "https://httpbin.org/post";

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

const json_test = {
    "places": [
        {
            "open_now": true,
            "distance": 1162,
            "name": "提灯食堂 西院 おでん 居酒屋",
            "rating": 4.3,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEi4SCNmzxRYptHqQE1DvU3mmxGOsb7vJU6xrSa9HYdVJPaAkpMY-k4f0978zB7xdAG5jORCF66C8itZny_uhiUNUXP5et_Gtc=s1600-w400",
            "id": "ChIJbbFl-DUGAWARgf8gl8YhvLk"
        },
        {
            "open_now": true,
            "distance": 1581,
            "name": "串と伝説のテール煮 様様 西院店",
            "rating": 4.4,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEGbdYSGMj2Mo0RuwcqYNgGkX82gq_Uzub0JVZVD2W9liR-H9PGb0Rhcfh-NcFMOoucRxZyP_DIV4tf3lntKkq9uN-GzxYLnL0=s1600-w400",
            "id": "ChIJsUnAzkoGAWARy3YchJF-4ew"
        },
        {
            "open_now": true,
            "distance": 1036,
            "name": "酒食堂 餃子屋燦",
            "rating": 4,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqER9jXCqzhV7QCGATLMc9paTAhbR7rkHBnPR2-YCo9haZrY1C3cNwQ8fyBma6gOBWBjU9N586paQ4M1lrx5gkaMHPrR9Wd5T-o=s1600-w400",
            "id": "ChIJm3svZSYGAWARphcPpMY0dd4"
        },
        {
            "open_now": true,
            "distance": 874,
            "name": "京都 炭火串焼 つじや 梅小路北店",
            "rating": 4.7,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqH8gVvHhvz0vYTPIvJWhdhizcHTpZIdsjR1_i7_0pFvtX1dWESZ09urbKyd3VDET2hUn_aTLpr5Ns0f2Qc1vzl4FLq5-qqwxB8=s1600-w400",
            "id": "ChIJBUzRVuEHAWARojnPsmR6i38"
        },
        {
            "open_now": true,
            "distance": 1663,
            "name": "ハイカラ亭",
            "rating": 3.9,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqFFIJHFva4wQtrpjnanERD9e2Y6LV_9lob8XngVMOCrRKpmCBwG9By0qGf5HmLc0vfhSUVRlPyVWFPmEn1nwRudXTQ7489xZh0=s1600-w400",
            "id": "ChIJtfozjyoGAWAR0ypnbRBIaQI"
        },
        {
            "open_now": true,
            "distance": 1583,
            "name": "酒と魚とオトコマエ食堂 次郎",
            "rating": 4,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqH3EZZYytoZuPMoidL8ufuP8bM2EhhrjAYvs0kfOaoyicoXs6S1spvTGGe3p2uXbzk-VLoAOHA86cNxctj8GwyfYmt71kHsz0c=s1600-w400",
            "id": "ChIJkxMcskoGAWAR1TXHD0zmaZE"
        },
        {
            "open_now": true,
            "distance": 1590,
            "name": "樫尾食堂",
            "rating": 4.6,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEUar5UQ0OdPb1_CLLyf80Zm8Wtk7CG6F57jtvxq1NjR7BPWC92SX6mMm36g5i4PgLzNHAu1qG3fvfLM-7LkQQJ6-BgFTQ_pOs=s1600-w400",
            "id": "ChIJhTyB1gUHAWARQeLMvu1wRSQ"
        },
        {
            "open_now": true,
            "distance": 1618,
            "name": "ふる里",
            "rating": 4.1,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqE-HI-EFOUgt6ayk0W-V4FTxLdAtc4Ijw-zCgIcv6shB-yCXM_9WBVJwUdivqsp10b6uV7DIY_yP-dHLbYfK_KYuGSEy3mBJ0A=s1600-w400",
            "id": "ChIJAWwhhZkIAWAR1WEqnqDKkJw"
        },
        {
            "open_now": true,
            "distance": 606,
            "name": "居酒屋ダイニングSO-SO",
            "rating": 4.4,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqG_p9efYoy03hJw8N1RsZXa8t7o1vmeBjWsi7XilWQhTkmJWjPu8wPZSrNn7kE_EEuIn31w-NETTY0gu6VxxhIZUwSsKTZAP5A=s1600-w400",
            "id": "ChIJ1xfTtyMGAWARToZ7hItEzOY"
        },
        {
            "open_now": true,
            "distance": 1672,
            "name": "くいもの屋わん 京都西院駅前店",
            "rating": 3.4,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEBF1xfbePSXpjIEtKuVWtPaixIUnBPrOISoBnJ1brqTGpLz8azzz5tihe8NZOUvFZI6NDpnTQKgQ-f-kf7gEuK-jMsJ4T7ZiY=s1600-w400",
            "id": "ChIJrTJBOrUHAWAReY7PDCQ3dVc"
        },
        {
            "open_now": true,
            "distance": 770,
            "name": "大八",
            "rating": 4.9,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqHA9Fj8cYXwB7jF7bouAOtfsWUfwxrS13n7qzTiipYNcIrfXdMfViQCQ9oH-cYH16hEIWiXtE7t1cCaOhX4sSJfjwnwCYXs-SQ=s1600-w400",
            "id": "ChIJXYlhOzkGAWARho7E1bHmzHc"
        },
        {
            "open_now": true,
            "distance": 1611,
            "name": "大衆酒場 かぞく 四条大宮店",
            "rating": 4.2,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqGos2WXSG5uEIMtt2pr3KtFg-DwAyVTS-OT3OKjOUhIvi7dKcuh3ZglXaT6VHDjXXCogQBxyxXHVFMtllIwo0lSk0UK6CEcjFU=s1600-w400",
            "id": "ChIJu7c023UHAWARlA30g-yrLJ8"
        },
        {
            "open_now": true,
            "distance": 1671,
            "name": "しまや 京都西院店",
            "rating": 1.9,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEdtWhS3ORdYzKkWO67vVI9bQYDJmr9EVnXMCrVE_TMmZCY0En9F_3OuRah-LaItRcK47PlMR3R8Wam8yLpEqYYCkNa19VQgLw=s1600-w400",
            "id": "ChIJ-01zLbUHAWARjIzwd1la_O8"
        },
        {
            "open_now": true,
            "distance": 1589,
            "name": "喰う道 西院店",
            "rating": 4.7,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqEeuPqlsXa-fWQNe25labI5Xo7Lnho4A7blHFyBUlTOdQp1V2z59fpCcX3xNc-164yEsPcdegJTgk6fUqzuq36-ThhvxX2xhlk=s1600-w400",
            "id": "ChIJpyu-GG0HAWARIbgwauLycBs"
        },
        {
            "open_now": true,
            "distance": 1623,
            "name": "真夜中食堂 鳥獣戯画 四条大宮本店",
            "rating": 3.8,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqGrlRK_59_SLTenYmHLVMxs5asQhQ4VayWbIq3w17UXQw-Byen4iJqB2ElHhoo_xj425nGEIhFLWXQCXgHE7Jei3suJj8a21pM=s1600-w400",
            "id": "ChIJAWwhhZkIAWARShhILQun99c"
        },
        {
            "open_now": true,
            "distance": 1696,
            "name": "かしわ 西院店",
            "rating": 3.8,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqFlvX3Yi169j1HBwctHhkKGNCaJEEUjoK6zS23mbAcxvkavO0_WlqeSHBX8iasGlD06-XGq8tQpKo_id87w45XhlFVmtHa0UJs=s1600-w400",
            "id": "ChIJszP90rQHAWARJRhE4V7nF6E"
        },
        {
            "open_now": true,
            "distance": 1541,
            "name": "居酒屋 誠 ～macoto～",
            "rating": 4.1,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqE8tQUDDC0LIrK1MEPbO4zpEavxwglvVZpJwWeVh6Xf1uWASlVYh4rCY9DKdqPpCjLVTys-jqQY4kMJxubQWiHjpDUzMKcK6rA=s1600-w400",
            "id": "ChIJWWMS3UoGAWAR0SiwLzc1Ldk"
        },
        {
            "open_now": true,
            "distance": 1561,
            "name": "はなまる串カツ製作所 大宮店",
            "rating": 4.1,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqF6PV6LwOcHzik6CNRr07hKPSlTe-Jruwe2M5FPuVW1KW9vne5ja4N-NM4atXnAoFJiqR_qVSwIedK2kGwIUrOkOxTtIEWj8TE=s1600-w400",
            "id": "ChIJFVnvMCkGAWAR3g1fGrljykY"
        },
        {
            "open_now": true,
            "distance": 1309,
            "name": "西院 居酒屋 焼鳥×サムギョプサル×韓国料理 シアワセ横丁",
            "rating": 4.2,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqFTXbi83w8y_AII-nsStuqkcdV0DMijM4--9JxQCpsHnAx8E0vfxlGy7pzsQVbTzWthaDhAa9vxGAokz651KYOQaEd71c_o5_k=s1600-w400",
            "id": "ChIJ-_i27UoGAWARWj75fXRGAVc"
        },
        {
            "open_now": true,
            "distance": 1586,
            "name": "大衆炭火やきとん ぶった 西院店",
            "rating": 3.9,
            "photo": "https://lh3.googleusercontent.com/places/ANXAkqGEWCoFl85KdMwqY9jOzb0Bzmf6lmvxIUyRdZ3Te76s8yNTEV7aTQc1FoXwe-R3aS5DD2AAjbR0kzSBQovWDm__D5LsRfTu9po=s1600-w400",
            "id": "ChIJyRiNzkoGAWARbP-wM2c9WsA"
        }
    ]
};

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
            const res = await fetch(URL, {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(json_test)
            });
            const res_json = await res.json();
            list = res_json.json.places;
            console.log("Get JsonDate successful");
        }catch(e){
            console.error("Error:", e);
        }

        if(list.length == 0){alert("アカンは、ここ田舎や"); return;}

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