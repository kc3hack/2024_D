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
const test_json2 = {"places":[{"open_now":true,"distance":381,"name":"Cafe & Meat Bar, NICK STOCK - Kyoto Research Park (KRP)","rating":3.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqECBrsu1nOm1QXybw2Z0bNPbbZw8vOioazAGXTJEs9QEai_98ddH9heXiWZXG-0zAbwRMMaTd5Q-IVdiwHqrpPO1zut8nVdn2c=s1600-w400","id":"ChIJVVX4oDkGAWAR9qg0A2K60UA"},{"open_now":true,"distance":831,"name":"ALIARE","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqErVOU-y6Z6VDYemWzXMNxW1zudOA8ybzzZkj4tkef6QZZ8C9zM_LZIwZN_D64lFpdCP3j5rfpXR3hG2389ZijeyaaqMedbN0k=s1600-w400","id":"ChIJAb2GfCYGAWARhjQvbdbfDiU"},{"open_now":true,"distance":729,"name":"Kyo・Sushi Ookini＜Sushi restaurant＞","rating":4.2,"photo":"https://lh3.googleusercontent.com/places/ANXAkqH1cyIYWkxknwTz5kZ4rYgL472QX3e11r5-iRJo3q_U0QSeWi4lmzxJY2gZ7B46j8r69QU9At3Ul05BrNK-_pHZQ8UZrCsJcjo=s1600-w400","id":"ChIJRQo2AzcGAWARF2v-tFXtJDw"},{"open_now":true,"distance":1255,"name":"Hoshigaoka","rating":4.1,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFeVpaz6bDuGNqKhA5p1LxtZD5vBsjEb8wJ2ROhXV1gkReDbsctkn-76k_0zjzbrTmvehdjb9aU9c-YuVwflQW_j3O_iPcyleg=s1600-w400","id":"ChIJNVg1AyAGAWARP52HnW77MSA"},{"open_now":true,"distance":1044,"name":"Kimchi-no-Mizuno","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHpqczXEAVNayZFisR35dK6hvymvIL5YskDQ-fdUzqC3B9RVAkmr0g9LRq0fG9PjMraG7juzirfqkQiuaQ9pd9e5Nc5RbVmQZM=s1600-w400","id":"ChIJJ7xg1SoGAWAR9RYnri1wARo"},{"open_now":true,"distance":981,"name":"Seabura no Kami","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGbmUteSAal_KTQ-j4LSTTguv1J6bDzaP3ADP_OMVGM4n1eEG2E3XxNxzlyJZMeztDf41A6ef2k4qlVyriUrvndOdYEBBmHpwI=s1600-w400","id":"ChIJpVDo5SUGAWARpjPcgIKjA8k"},{"open_now":true,"distance":335,"name":"Starbucks Coffee - Tsutaya Kyoto Research Park","rating":3.9,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFaaCxkZPotJLyvwNkBaUzuMwlOnfMVu5cUTw6RPqVV16MHRldhpu_3lk6V64mAHq9_bsXmfB8qOEp0K8UhxN-J8dVBwyEkjcA=s1600-w400","id":"ChIJA6pajDkGAWARQc9i-VEOPEk"},{"open_now":true,"distance":1272,"name":"All Day Dining Kazahana","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEhoed9L1QA6dR7zmWSXHzjkxmgPwVA93S5hfD1GLGrFUKc1Fd31qRm1FD5f0O1GTuFaCIH_0oOYTr8Wb2ScbwR46R3a1wDzt8=s1600-w400","id":"ChIJVVWVBSAGAWARPVb_GOCRvkg"},{"open_now":false,"distance":992,"name":"七栄鮨七条店","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEMk1e0IwV4i0qC6ov5VQC4K4ARr6zVmFiMsK-Dm2UPaSiCdRnOUcxgRyA37hErF8JuSfWqMmEPwcFv0iQe6wSq9jsZuqtKfz0=s1600-w400","id":"ChIJ1TPnCj4GAWARV1Qf3k3Z1WU"},{"open_now":true,"distance":120,"name":"Kyoto Ramen Kairikiya - Tambaguchi","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHMOn9UEAHXEI_9A1F7Ok9i9Xyk98DlOm0TwxDwT7jkA5m_nHeYFK27elV9I1pKWv3sfuz_iZU2fnWO4h63YCMmDVpy1mjsWIk=s1600-w400","id":"ChIJgSNpHzsGAWARf4jnp2qVH9g"},{"open_now":true,"distance":702,"name":"Okoyama","rating":3.7,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGWMgJQvDvXOrisLTBbnpw8nuEfLTAVRKK5R8KxIexqqiZQLoK_PDDysmUauWn00bNUBafuyF3Q1iMWRzZ_nWtPFggyFDrGcQQ=s1600-w400","id":"ChIJ1Wf5yT0GAWARq4W5h61coTU"},{"open_now":true,"distance":114,"name":"Sushiro - Gojo Shichihommatsu","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHZ0yFD82vtGjQtqA511I_IE7U7OZv5443hoGwHJwREh1iOAqml0vatWJp8sL1NB-vGzY5V9vDf--2Y2FNx227ECemA8F3i1iE=s1600-w400","id":"ChIJQfD6qzsGAWAR8ND6zxKCCBY"},{"open_now":true,"distance":654,"name":"大仙","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFCEaGZhWg0EKrnCW6ZGEHWgavN6T8UNTlteCgVFSg6SgJL6T7PPVoisboJ5NgiDc7rIVu-LNJ4djZgMn7TmvkWMLb8TzFKLGo=s1600-w400","id":"ChIJQ94a_DAGAWAReoa2mmQEbMM"},{"open_now":true,"distance":869,"name":"Kyo Takoyaki 8 \u2013Hacchi\u2013","rating":4.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEHWybu3RToP4bKtBabaKrKBzgfYMWZDFdZ9BTe8QCPbHls76EizdSFuq_F9vMK9eENbKySy1lYQKWuABT7wGKxEiqWUYx7R-k=s1600-w400","id":"ChIJadq3IhgGAWARMKSgUuiXSps"},{"open_now":true,"distance":781,"name":"Maisaka Honten","rating":4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGlZ3IO-IwTvGzSCKUBEnNnzVHVcZSqXf5OjlDlt49SIAXBtP42eO6n3CimGhrOnOuV7dHNXYWdRPseeQk1mAhByROEEl1bT8k=s1600-w400","id":"ChIJ28nglT0GAWARDKaCflavq6U"},{"open_now":false,"distance":1070,"name":"Marukatsu Ramen","rating":3.8,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFrkwohTOIqVA-Ok7LQ6uq_zt-lHR6W_udKSB-tgi8dnkmfYs0eT804Z6o31_wuG2nFL4SjLYXKLBzC31BwxQBM-kqlps_G6T8=s1600-w400","id":"ChIJNeh3Yx8GAWAREFwE3R4YNVk"},{"open_now":true,"distance":741,"name":"大衆酒場 壬生 夜吉","rating":4.3,"photo":"https://lh3.googleusercontent.com/places/ANXAkqFrrB0h8NwYKyBsWLeMcoDWstLfp7s0HbNGXthMndjEZJ9ObHqwg_vHs5evOnLgECfekFdu8b963hZIGEgUGRkPPtgX3A8hb0A=s1600-w400","id":"ChIJRUo2FTEGAWARqZ0Xp-ik8Ho"},{"open_now":true,"distance":721,"name":"Korean Kitchen The Three Little Pigs - Nishioji Gojo","rating":4.6,"photo":"https://lh3.googleusercontent.com/places/ANXAkqEhqEaLTbyCImK5mcul4FGk-858CvVO0GOLH6sd2AbuYKppCzaC1JVEvMvBhj6lV1Eg9IwfLdLHhW0aCHQYEgTVDjcticVaaTQ=s1600-w400","id":"ChIJSzL53jcGAWARBwz2f1GJ2eE"},{"open_now":true,"distance":1022,"name":"Menkiya - Kyoto Mibu Main Shop","rating":4.2,"photo":"https://lh3.googleusercontent.com/places/ANXAkqGnInA2JA29vnH0WOtFDsCKoYyTkDiiJ9colXdsedKTugmILdGOxvf7iTVIjJOInIS-GI9_iSXkyNAbRC0V9n9nNCuTJ5IRl9E=s1600-w400","id":"ChIJ__9v4CUGAWAR7aBIzZ7aKpE"},{"open_now":true,"distance":606,"name":"Izakaya Dining SO-SO","rating":4.4,"photo":"https://lh3.googleusercontent.com/places/ANXAkqHFomcecEWvgFXqO0riyXS7yKGo3SSE_Vz2ISnQxBbwvfvEQE6sFOVBpyYIfR1oDf6QaCA1PCyQiDbiWi9t9CnjEuQJlpim_ZI=s1600-w400","id":"ChIJ1xfTtyMGAWARToZ7hItEzOY"}]};

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
    // Info.SACH_L.href = `${Search_URL_Id}${info.id}`;
    Info.SACH_L.href = `${Search_URL_Name}${info.name}`;
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