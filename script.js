let audioEnabled = false;
let lang = "ar";
let isAdmin = false;

const texts = {
  ar: {title:"بطولة PMGC", subtitle:"مرحبًا بك في الموقع الرسمي للبطولة", playersTitle:"اللاعبون المقبولون"},
  en: {title:"PMGC Tournament", subtitle:"Welcome to the official tournament website", playersTitle:"Accepted Players"}
};

const ADMIN_PASSWORD = "PMGC2026";

const players = [
  {name:"عمر السيد محمد", code:"5682", id:"5535931335"},
  {name:"عمر الشافعي", code:"1683", id:"5780015747"},
  {name:"محمد أحمد", code:"0618", id:"5114404295"},
  {name:"زياد محمود", code:"4681", id:"5181732509"},
  {name:"فارس محسن", code:"8331", id:"52013524002"},
  {name:"يوسف عمرو", code:"1656", id:"5568744837"},
  {name:"معاذ محمود", code:"8989", id:"5888700371"},
  {name:"مهند محمود", code:"2326", id:"5789024569"},
  {name:"محمد سلامة", code:"1656", id:"5964471266"},
  {name:"منجا", code:"5115", id:"5233336518"},
  {name:"عمر", code:"8452", id:"5514938673"}
];

// عناصر DOM
const welcomeScreen = document.getElementById("welcomeScreen");
const mainContent = document.getElementById("mainContent");
const playersList = document.getElementById("playersList");

// دخول الموقع
function enterSite(){
  audioEnabled=true;
  welcomeScreen.style.display="none";
  mainContent.style.display="block";
  speak("مرحبًا بك في بطولة PMGC");
  renderPlayers();
}

// نطق النصوص
function speak(text){
  if(!audioEnabled) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang==="ar"?"ar":"en-US";
  msg.rate=0.95;
  speechSynthesis.speak(msg);
}

// تغيير اللغة
function toggleLang(){
  lang = lang==="ar"?"en":"ar";
  document.documentElement.dir = lang==="ar"?"rtl":"ltr";
  document.getElementById("title").innerText = texts[lang].title;
  document.getElementById("subtitle").innerText = texts[lang].subtitle;
  document.getElementById("playersTitle").innerText = texts[lang].playersTitle;
  renderPlayers();
}

// عرض اللاعبين
function renderPlayers(){
  playersList.innerHTML="";
  players.forEach(player=>{
    const msg=`تم قبول اللاعب ${player.name} في بطولة PMGC. كود الدخول الخاص بك هو ${player.code}`;
    const whatsappLink=`https://wa.me/201211056530?text=${encodeURIComponent(msg)}`;
    const div=document.createElement("div");
    div.className="player-card gold";
    div.innerHTML=`
      <h3>${player.name}</h3>
      <p>ID: ${player.id}</p>
      <p>كود الدخول: <strong>${player.code}</strong></p>
      <button onclick="speakPlayer('${player.name}','${player.code}')">🔊 نطق القبول</button>
      <a href="${whatsappLink}" target="_blank">
        <button>📱 واتساب – تأكيد الانضمام</button>
      </a>
    `;
    playersList.appendChild(div);
  });
}

function speakPlayer(name, code){
  const text=`تم قبول اللاعب ${name} في بطولة PMGC. كود الدخول الخاص بك هو ${code}`;
  speak(text);
}

// إداري
function adminLogin(){
  const pass = document.getElementById("adminPassword").value;
  if(pass===ADMIN_PASSWORD){
    isAdmin=true;
    document.getElementById("adminLogin").style.display="none";
    document.getElementById("adminPanel").style.display="block";
    alert("تم تسجيل الدخول كإداري");
    renderComments();
  }else alert("كلمة السر خاطئة");
}

// تعليقات
function getComments(){return JSON.parse(localStorage.getItem("pmgc_comments")||"[]");}
function saveComments(c){localStorage.setItem("pmgc_comments",JSON.stringify(c));}

function addComment(){
  const text=document.getElementById("commentText").value.trim();
  if(!text) return;
  const comments=getComments();
  comments.push({id:Date.now(),text:text,pinned:false,gold:false});
  saveComments(comments);
  document.getElementById("commentText").value="";
  renderComments();
}

function deleteComment(id){if(!isAdmin) return;let c=getComments();c=c.filter(x=>x.id!==id);saveComments(c);renderComments();}
function togglePin(id){if(!isAdmin)return;const c=getComments();c.forEach(x=>{if(x.id===id)x.pinned=!x.pinned;});saveComments(c);renderComments();}
function toggleGold(id){if(!isAdmin)return;const c=getComments();c.forEach(x=>{if(x.id===id)x.gold=!x.gold;});saveComments(c);renderComments();}

function renderComments(){
  const list=document.getElementById("commentsList");
  if(!list)return;
  let comments=getComments();
  comments.sort((a,b)=>b.pinned - a.pinned);
  list.innerHTML="";
  comments.forEach(c=>{
    const div=document.createElement("div");
    div.className="comment"+(c.gold?" gold":"");
    div.innerHTML=`
      <div class="actions">
        ${isAdmin?`<button onclick="togglePin(${c.id})">⭐</button>
        <button onclick="toggleGold(${c.id})">🟡</button>
        <button onclick="deleteComment(${c.id})">❌</button>`:""}
      </div>
      ${c.text}
    `;
    list.appendChild(div);
  });
}

// تشغيل عند الفتح
renderComments();
