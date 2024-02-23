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

const test_json = {
    plase:[
        {
            name:"天下一品",
            open_now:true,
            rating:4.5,
            distance:300,
            photo:"https://tenkaippin-media.com/wp-content/uploads/2023/01/kotteri.jpg",
        },
        {
            name:"来来亭",
            open_now:false,
            rating:3.5,
            distance:200,
            photo:"https://tblg.k-img.com/restaurant/images/Rvw/210275/640x640_rect_f7498aa7c70141ad349d3e2d57df9419.jpg",
        },
        {
            name:"新福菜館",
            open_now:true,
            rating:4.0,
            distance:500,
            photo:"https://shinpukusaikan.net/img/sp_slide_0_sp.png",
        },
    ]
}
const test_json2 = {"places":[{"open_now":true,"distance":381,"name":"Cafe & Meat Bar, NICK STOCK - Kyoto Research Park (KRP)","rating":3.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHYu-HsVwdoe-MD73GRfXa7iO4S-V5PeEBo-CcCKiQSibtZ5YPj6iqttjihvRzZRCZO8yvMfg6voa19XmkeZBzZrB_vWdAyeG0=s1600-w400"},{"open_now":true,"distance":831,"name":"ALIARE","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHvllN4B-ja4YFP1VVYZgfdbnn5YFuGaCHJ3_0myz73aGbbdpv-FoCVnnd-jazlM6qncDX5tDEfRMF6gSwN9mNFfSp8y8wchDo=s1600-w400"},{"open_now":true,"distance":729,"name":"Kyo・Sushi Ookini＜Sushi restaurant＞","rating":4.2,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHMr0HsXP1vW8GuVi_v8VSL1XPTXDJO_hZkvl7NUqcoJq3WB751XvhPo1uYbNMUSj65z45AmTwBYQ39lTy8C4oi7u1V7-v2qpM=s1600-w400"},{"open_now":true,"distance":1255,"name":"Hoshigaoka","rating":4.1,"photo":"https://lh3.googleusercontent.com/places/ANXAkqG3oZhr1203zp4qt5k2w6qoo_1_clBjsaFTggiROcnAJDI9IXD35zHLn4PV6s0xxKJ9QHvNRIPsHh99x5BkWkIjT7itocW6GA4=s1600-w400"},{"open_now":true,"distance":1044,"name":"Kimchi-no-Mizuno","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqE46ydCVX_MlXXfS5NEKmEHqXcNsqJ9_ujIvKKVipbYY4-QV2PfMEGAqwJzlM27jbL9xhok1eyboJ_C0WhVpn2bNihEQtvNv6k=s1600-w400"},{"open_now":true,"distance":981,"name":"Seabura no Kami","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHGZvrj_aya7VmrcIv2Y6iSXU0bA5wzibvjw50XDP8nGWODKtsGA7LwuE1aJxpCHyayscimSOotkpwpQ3XumyOnBeNM0l8bF9g=s1600-w400"},{"open_now":true,"distance":335,"name":"Starbucks Coffee - Tsutaya Kyoto Research Park","rating":3.9,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFjo1FEHxMQScqW73Zrzz8oy5WKpd7SP-imyMKsPITJfXRX5VzkROq3HSFeMKG6YwcbrloDh8MOLis-rWMp0XGuVKA5huh8o50=s1600-w400"},{"open_now":true,"distance":1272,"name":"All Day Dining Kazahana","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFh1tyQ2t-mOVZRqm_ytT9nZQGUsCT0vm8Dl-jFm2cg40IHKPuhLLJ6vd26s65w685yg1vapsQ9nbqBpTczv37AgWXlYxiuw2Q=s1600-w400"},{"open_now":false,"distance":992,"name":"七栄鮨七条店","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGC-5MlcsqnRvGSvSM3tgCV1W8qjYC1leQlaPe7TlsvvGB3wX0wqUwW_IK9JS0k_zJx5KrVtJKaMYuJwqmfixOgZFLK7IOqVdU=s1600-w400"},{"open_now":true,"distance":120,"name":"Kyoto Ramen Kairikiya - Tambaguchi","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqH8tIaMufmtcXPpKLh2DUwS2AtxfmViiyQrUtsmb5A9ZP6tTweIvc5ITuHakKPEgyUFdgJZLOrfa69L4ptth4RsOfSyr3h19ds=s1600-w400"},{"open_now":true,"distance":702,"name":"Okoyama","rating":3.7,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEb2BAiLEyw2hBJBVybaG5Hr29TzxeoFjbOd1wNKuGzS6snOAirT7lZtmMvRvjD3y9OCz-Hsqy0dRMcVYmF6fFJdhRAjSFEgSs=s1600-w400"},{"open_now":true,"distance":114,"name":"Sushiro - Gojo Shichihommatsu","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHc5yKGZPULktZj-I6AXeRnVnbWeb8CClrG70W2TX5TvJd1ky68Tuwlb7cp0o0ld6_7pPy7vkadFGoX1OXOwDoM0fLUaIlrw3w=s1600-w400"},{"open_now":true,"distance":654,"name":"大仙","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFpArwmiaLluI8v2UtgE-c4wp4xKwqMBQVRFrlMC1LPoUgYejJpUClkqtxk_CguFKA7gFhVlhzrOFXV97ptSRKcmpmyUcs5rIM=s1600-w400"},{"open_now":true,"distance":869,"name":"Kyo Takoyaki 8 \u2013Hacchi\u2013","rating":4.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqG-xvOsLJR297cB3Gt6GqnEvSHYr2JI3LvBUdpVliIVJcqcMEBTtN9xq2yevKMBc15YW_aqknJUuEr3YB4t-WD1Sk51gpP6yAs=s1600-w400"},{"open_now":true,"distance":781,"name":"Maisaka Honten","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGX6fG8_3MXjlApqx92Lz4vFzbIpYWId29vU89od2TbjZ2kAp0ViB5mHXibdBj8Oq6iaBK4A-QfCGCsrJkafk9A-oSur-dO-Lo=s1600-w400"},{"open_now":false,"distance":1070,"name":"Marukatsu Ramen","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqE7gmNh5DVPjLAiK9cOz5vN9XoDvV_V3MWH5ZhwCl0aWu8oCcMoFe7balOiub-uhc-W12tIcngoAThHTjA5GGWLGPvG9_OjgTo=s1600-w400"},{"open_now":true,"distance":741,"name":"大衆酒場 壬生 夜吉","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEB4mfBxPnCeaUj6C0_oC-OhpKDYdF5rAZg--XzowEJ5Ov0De5RJfvN1SH48N3fvUTlVyehxLn0Wxx1QlHE5yi2IK36XZhaUF0=s1600-w400"},{"open_now":true,"distance":721,"name":"Korean Kitchen The Three Little Pigs - Nishioji Gojo","rating":4.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHhQ8PTT1-So-7z2MdMHC27SAoCOL_CZGpbowDXEkNI-tch2bzsGK6EXb0-CBTviNP_Pxap6_UYZjUFxYkAusvZ8rQWnpGdvXM=s1600-w400"},{"open_now":true,"distance":1022,"name":"Menkiya - Kyoto Mibu Main Shop","rating":4.2,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFKcfTvLQnWsoyJwvClU-8-BsIQLONoZPHjl_zlv3_HlbLbFsqxivDI6Ghbq2upZk1IY8G8Scokvh_9rYx7GjokAXHtoGEn3xQ=s1600-w400"},{"open_now":true,"distance":606,"name":"Izakaya Dining SO-SO","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFdnzni_7WqLTkYITS9j5fXBj4CtBVlI5W4pXZFyRKe5_u33ezzKpS6OL-oTSSCYoUElgLK1gd88Ws07VwqkrpLnzPjCnJvEkY=s1600-w400"}]};

async function GetInfo(){

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
                body:JSON.stringify(test_json2)//変更--修正忘れ注意
            });
            const res_json = await res.json();
            list = res_json.json.places;//完成時にres_json.json.plaseからres_json.plaseに変更
            console.log("Get JsonDate successful");
        }catch(e){
            console.error("Error:", e);
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
    Info.SACH_L.href = `${Search_URL}${info.name}`
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