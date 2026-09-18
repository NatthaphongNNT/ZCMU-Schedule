
(() => {
  const D = window.SCHEDULE_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const STORAGE = {week:"zcmu.week", lang:"zcmu.lang", theme:"zcmu.theme"};

  const I18N = {
    th:{eyebrow:"LIVE ACADEMIC DASHBOARD",title:"ตารางเรียน",subtitle:"ตารางเรียนแบบรายสัปดาห์ พร้อมเวลา China Time, countdown และสถานะแบบเรียลไทม์",nextClass:"NEXT CLASS",todayClasses:"วันนี้มีเรียน",freeSlots:"ช่วงว่างวันนี้",freeHint:"จาก 13 คาบ",currentWeek:"สัปดาห์ปัจจุบัน",weekSelector:"เลือกสัปดาห์",today:"วันนี้",all:"ทั้งหมด",morning:"เช้า",afternoon:"บ่าย",evening:"เย็น",search:"ค้นหาวิชา / อาจารย์ / ห้อง",legendNormal:"ปกติ",legendSoon:"เหลือ ≤15 นาที",legendLive:"กำลังเรียน",legendDone:"เรียนจบแล้ว",miniCalendar:"MINI CALENDAR",timeline:"TIMELINE",freeTime:"FREE TIME",footer:"เวลาเรียนอ้างอิงตาราง 富春校区 จากไฟล์ที่ให้มา • China Time (UTC+8)",before:"ปกติ",soon:"เหลือ ≤15 นาที",live:"กำลังเรียน",done:"เรียนจบแล้ว",none:"ไม่มีเรียน",teacher:"อาจารย์",room:"ห้อง",week:"สัปดาห์",period:"คาบ",countdown:"เริ่มใน",remaining:"เหลือ",finished:"จบแล้ว",next:"คาบถัดไป",noNext:"วันนี้ไม่มีคาบถัดไป",free:"ว่าง"},
    zh:{eyebrow:"实时课程仪表盘",title:"课程表",subtitle:"按周查看课程，结合中国标准时间、倒计时与实时状态",nextClass:"下一节课",todayClasses:"今日课程",freeSlots:"今日空闲",freeHint:"共 13 节",currentWeek:"当前周",weekSelector:"选择周次",today:"今天",all:"全部",morning:"上午",afternoon:"下午",evening:"晚上",search:"搜索课程 / 教师 / 教室",legendNormal:"正常",legendSoon:"≤15 分钟",legendLive:"上课中",legendDone:"已结束",miniCalendar:"迷你日历",timeline:"时间线",freeTime:"空闲时间",footer:"上课时间依据所提供的富春校区课表 • 中国标准时间 UTC+8",before:"正常",soon:"即将开始",live:"上课中",done:"已结束",none:"无课",teacher:"教师",room:"教室",week:"周",period:"节",countdown:"距开始",remaining:"剩余",finished:"已结束",next:"下一节",noNext:"今天没有下一节课",free:"空闲"},
    en:{eyebrow:"LIVE ACADEMIC DASHBOARD",title:"Class Schedule",subtitle:"Weekly classes with China Time, countdowns and live status",nextClass:"NEXT CLASS",todayClasses:"TODAY'S CLASSES",freeSlots:"FREE SLOTS",freeHint:"out of 13 periods",currentWeek:"CURRENT WEEK",weekSelector:"SELECT WEEK",today:"Today",all:"All",morning:"Morning",afternoon:"Afternoon",evening:"Evening",search:"Search course / teacher / room",legendNormal:"Normal",legendSoon:"≤15 min",legendLive:"In class",legendDone:"Finished",miniCalendar:"MINI CALENDAR",timeline:"TIMELINE",freeTime:"FREE TIME",footer:"Class times follow the supplied 富春校区 timetable • China Standard Time UTC+8",before:"Normal",soon:"Starting soon",live:"In class",done:"Finished",none:"No class",teacher:"Teacher",room:"Room",week:"Week",period:"Period",countdown:"Starts in",remaining:"Remaining",finished:"Finished",next:"Next class",noNext:"No more classes today",free:"Free"}
  };
  const DOW = {th:["จ","อ","พ","พฤ","ศ","ส","อา"],zh:["一","二","三","四","五","六","日"],en:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]};
  const MONTHS = {th:["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."],zh:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]};
  const SEMESTER_START = new Date("2026-09-14T00:00:00+08:00"); // Week 1 = Sep 14–20, 2026 (first teaching day: Sep 14)
  const TZ = "Asia/Shanghai";
  let lang = localStorage.getItem(STORAGE.lang) || "th";
  let theme = localStorage.getItem(STORAGE.theme) || "light";
  let filter = "all", query = "";
  let selectedWeek = Number(localStorage.getItem(STORAGE.week)) || weekFromChinaNow();
  selectedWeek = Math.max(1,Math.min(17,selectedWeek));

  function tr(k){return (I18N[lang]||I18N.th)[k]||k}
  function chinaParts(){
    const parts = new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",weekday:"short",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(new Date());
    const o={}; parts.forEach(p=>o[p.type]=p.value); return o;
  }
  function chinaNow(){ return new Date(new Date().toLocaleString("en-US",{timeZone:TZ})); }
  function weekFromChinaNow(){
    const n=chinaNow(); const s=new Date(2026,8,14); const diff=Math.floor((new Date(n.getFullYear(),n.getMonth(),n.getDate())-s)/86400000);
    return diff<0?1:Math.min(17,Math.floor(diff/7)+1);
  }
  function dateFor(week,d){ const x=new Date(2026,8,14+(week-1)*7+(d-1)); return x; }
  function pad(n){return String(n).padStart(2,"0")}
  function timeToMin(t){const [h,m]=t.split(":").map(Number);return h*60+m}
  function fmtDate(date){
    return `${MONTHS[lang][date.getMonth()]} ${date.getDate()}`;
  }
  function getCourse(cId){return D.courses.find(c=>c.id===cId)}
  function activeOccurrences(week){
    const out=[];
    D.courses.forEach(c=>c.occ.forEach(o=>{
      if(o.weeks.includes(week)) out.push({course:c,...o});
    }));
    return out;
  }
  function labelCourse(c){return lang==="zh"?c.zh:lang==="en"?c.en:c.th}
  function statusFor(o, dayDate, now=chinaNow()){
    const y=dayDate.getFullYear(),m=dayDate.getMonth(),d=dayDate.getDate();
    const start=new Date(y,m,d,...o.start.split(":").map(Number));
    const end=new Date(y,m,d,...o.end.split(":").map(Number));
    const diff=(start-now)/60000;
    if(now>=end) return {key:"done",progress:100,diff};
    if(now>=start){return {key:"live",progress:Math.max(0,Math.min(100,((now-start)/(end-start))*100)),diff}}
    if(diff<=15) return {key:"soon",progress:0,diff};
    return {key:"normal",progress:0,diff};
  }
  function matchFilter(o){
    if(filter==="all") return true;
    const p=o.p[0]; return filter==="morning"?p<=5:filter==="afternoon"?p>=6&&p<=10:p>=11;
  }
  function matchSearch(c,o){
    if(!query)return true;
    const s=(c.zh+" "+c.en+" "+c.th+" "+c.teacher+" "+o.room).toLowerCase();
    return s.includes(query.toLowerCase());
  }
  function setText(){
    document.documentElement.lang=lang;
    $$("[data-i18n]").forEach(el=>el.textContent=tr(el.dataset.i18n));
    $$("[data-i18n-placeholder]").forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));
    $$("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  }
  function renderWeeks(){
    const box=$("#weekScroller"); box.innerHTML="";
    for(let w=1;w<=17;w++){
      const d=dateFor(w,1), e=dateFor(w,7);
      const b=document.createElement("button"); b.className="week-btn"+(w===selectedWeek?" active ":"")+(w===weekFromChinaNow()?" today":"");
      b.innerHTML=`<strong>W${pad(w)}</strong><span>${fmtDate(d)} — ${fmtDate(e)}</span>${w===1?`<em>${lang==='th'?'เปิดเรียนวันแรก':lang==='zh'?'首个教学周':'First teaching week'}</em>`:''}`;
      b.onclick=()=>{selectedWeek=w;localStorage.setItem(STORAGE.week,w);renderAll()};
      box.appendChild(b);
    }
  }
  function renderGrid(){
    $("#weekLabel").textContent=pad(selectedWeek);
    const start=dateFor(selectedWeek,1),end=dateFor(selectedWeek,7);
    $("#weekTitle").textContent=`${fmtDate(start)} — ${fmtDate(end)}`;
    const now=chinaNow(), currentW=weekFromChinaNow();
    const grid=$("#daysGrid"); grid.innerHTML="";
    const dow=DOW[lang];
    for(let d=1;d<=7;d++){
      const date=dateFor(selectedWeek,d), iso=date.toISOString().slice(0,10);
      const dayOcc=activeOccurrences(selectedWeek).filter(o=>o.d===d&&matchFilter(o)&&matchSearch(o.course,o)).sort((a,b)=>timeToMin(a.start)-timeToMin(b.start));
      const isToday=selectedWeek===currentW && d===((now.getDay()+6)%7+1);
      const col=document.createElement("div");col.className="day-column";
      col.innerHTML=`<div class="day-header ${isToday?"today":""}"><div class="dow">${dow[d-1]}</div><div class="date">${date.getDate()} ${MONTHS[lang][date.getMonth()]}</div></div><div class="day-body"></div>`;
      const body=col.querySelector(".day-body");
      if(!dayOcc.length){body.innerHTML=`<div class="empty">${tr("none")}<br><small>${fmtDate(date)}</small></div>`}
      dayOcc.forEach(o=>{
        const st=(isToday?statusFor(o,date,now):selectedWeek<currentW||(selectedWeek===currentW&&d<((now.getDay()+6)%7+1))?{key:"done",progress:100}: {key:"normal",progress:0});
        const card=document.createElement("div");card.className=`class-card ${st.key}`;
        const statusText=tr(st.key);
        const pLabel=o.p.length===1?o.p[0]:`${o.p[0]}–${o.p[o.p.length-1]}`;
        const countdown=st.key==="soon"?` · ${Math.max(0,Math.ceil(st.diff))}m`:st.key==="live"?` · ${Math.max(0,Math.ceil((new Date(date.getFullYear(),date.getMonth(),date.getDate(),...o.end.split(":").map(Number))-now)/60000))}m`:"";
        card.innerHTML=`<div class="status-line"><span class="time">${o.start}—${o.end}</span><span class="status-chip ${st.key}">${statusText}${countdown}</span></div><div class="class-title">${labelCourse(o.course)}</div><div class="class-en">${lang==="en"?o.course.zh:o.course.en}</div><div class="class-meta"><span>${o.course.teacher||"—"}</span><span>•</span><span>${o.room}</span><span>•</span><span>${tr("period")} ${pLabel}</span></div><div class="progress"><i style="width:${st.progress}%"></i></div>`;
        card.onclick=()=>openCourse(o);
        body.appendChild(card);
      });
      grid.appendChild(col);
    }
  }
  function nextForToday(){
    const w=weekFromChinaNow(), now=chinaNow(), d=((now.getDay()+6)%7)+1;
    if(w<1||w>17)return null;
    return activeOccurrences(w).filter(o=>o.d===d).map(o=>({o,date:dateFor(w,d),st:statusFor(o,dateFor(w,d),now)})).filter(x=>x.st.key!=="done").sort((a,b)=>timeToMin(a.o.start)-timeToMin(b.o.start))[0]||null;
  }
  function renderDashboard(){
    const now=chinaNow(), w=weekFromChinaNow(), d=((now.getDay()+6)%7)+1;
    const today=activeOccurrences(w).filter(o=>o.d===d);
    $("#todayCount").textContent=today.length;
    $("#todayMeta").textContent=today.length?today.map(x=>x.start).join(" · "):tr("none");
    $("#freeCount").textContent=Math.max(0,13-today.length);
    $("#currentWeekStat").textContent="W"+pad(w);
    $("#weekDateStat").textContent=`${fmtDate(dateFor(w,1))} — ${fmtDate(dateFor(w,7))}`;
    const n=nextForToday(), box=$("#nextClassContent");
    if(!n){box.innerHTML=`<div class="next-main"><div><div class="next-name">${tr("noNext")}</div><div class="next-meta">${fmtDate(now)} · ${tr("free")}</div></div></div>`}
    else{
      const isLive=n.st.key==="live";
      let delta=isLive?Math.max(0,Math.ceil((new Date(n.date.getFullYear(),n.date.getMonth(),n.date.getDate(),...n.o.end.split(":").map(Number))-now)/1000)):Math.max(0,Math.ceil(n.st.diff*60));
      const hh=Math.floor(delta/3600),mm=Math.floor((delta%3600)/60),ss=delta%60;
      const cd=isLive?`${pad(hh)}:${pad(mm)}:${pad(ss)}`:`${pad(Math.floor(delta/3600))}:${pad(Math.floor(delta%3600/60))}:${pad(delta%60)}`;
      box.innerHTML=`<div class="next-main"><div><div class="next-name">${labelCourse(n.o.course)}</div><div class="next-meta">${n.o.start}—${n.o.end} · ${n.o.room} · ${n.o.course.teacher||"—"}</div></div><div class="countdown ${isLive?"live":""}" id="nextCountdown">${cd}</div></div>`;
    }
  }
  function renderTimeline(){
    const now=chinaNow(),w=weekFromChinaNow(),d=((now.getDay()+6)%7)+1,date=dateFor(w,d);
    $("#timelineDate").textContent=fmtDate(date);
    const items=activeOccurrences(w).filter(o=>o.d===d).sort((a,b)=>timeToMin(a.start)-timeToMin(b.start));
    $("#timelineList").innerHTML=items.length?items.map(o=>`<div class="timeline-item"><div class="timeline-time">${o.start}</div><div class="timeline-name">${labelCourse(o.course)}<br><span style="font-weight:400;color:var(--muted)">${o.room}</span></div></div>`).join(""):`<div class="empty">${tr("none")}</div>`;
    const free=$("#freeTimeContent");
    const slots=Array.from({length:13},(_,i)=>i+1).filter(p=>!items.some(o=>o.p.includes(p)));
    free.innerHTML=slots.length?slots.slice(0,7).map(p=>`<div class="free-pill"><span>${tr("period")} ${p}</span><span>${D.periods[p][0]}–${D.periods[p][1]}</span></div>`).join(""):`<div class="empty">${tr("none")}</div>`;
  }
  function renderMiniCalendar(){
    const now=chinaNow(), selectedDate=dateFor(selectedWeek,1);
    const y=selectedDate.getFullYear(),m=selectedDate.getMonth();
    $("#monthLabel").textContent=MONTHS.en[m].toUpperCase()+" "+y;
    const box=$("#miniCalendar");box.innerHTML=DOW[lang].map(x=>`<div class="cal-dow">${x}</div>`).join("");
    const first=new Date(y,m,1), start=(first.getDay()+6)%7, days=new Date(y,m+1,0).getDate(), prev=new Date(y,m,0).getDate();
    for(let i=0;i<42;i++){
      let day=i-start+1, date, muted=false;
      if(day<1){date=new Date(y,m-1,prev+day);muted=true}else if(day>days){date=new Date(y,m,day);muted=true}else date=new Date(y,m,day);
      const btn=document.createElement("div");btn.className="cal-day"+(muted?" muted":"");
      const isSelected=date.toDateString()===selectedDate.toDateString(),isToday=date.toDateString()===new Date(now.getFullYear(),now.getMonth(),now.getDate()).toDateString();
      btn.className+=" "+(isSelected?"selected ":"")+(isToday?"today":"");btn.textContent=date.getDate();
      btn.onclick=()=>{const monday=new Date(date);monday.setDate(date.getDate()-((date.getDay()+6)%7)); const diff=Math.round((monday-new Date(2026,8,14))/86400000);if(diff>=0&&diff<119){selectedWeek=Math.floor(diff/7)+1;localStorage.setItem(STORAGE.week,selectedWeek);renderAll()}};
      box.appendChild(btn);
    }
  }
  function openCourse(o){
    const c=o.course, dialog=$("#courseDialog");
    $("#dialogContent").innerHTML=`<div class="detail-kicker">COURSE DETAIL · W${pad(selectedWeek)}</div><div class="detail-title">${labelCourse(c)}</div><div class="detail-en">${lang==="zh"?c.en:lang==="en"?c.zh:c.en}</div><div class="detail-grid"><div class="detail-box"><span>${tr("teacher")}</span><strong>${c.teacher||"—"}</strong></div><div class="detail-box"><span>${tr("room")}</span><strong>${o.room}</strong></div><div class="detail-box"><span>${tr("week")}</span><strong>${o.w}</strong></div><div class="detail-box"><span>${tr("period")}</span><strong>${o.start} — ${o.end}</strong></div></div>`;
    dialog.showModal();
  }
  function tickClock(){
    const p=chinaParts(), clock=`${p.hour}:${p.minute}:${p.second}`;
    $("#chinaClock").textContent=clock;$("#heroTime").textContent=`${p.hour}:${p.minute}:${p.second}`;$("#heroDate").textContent=`${p.year}-${p.month}-${p.day}`;
    renderDashboard(); renderGrid();
  }
  function renderAll(){setText();renderWeeks();renderGrid();renderDashboard();renderTimeline();renderMiniCalendar()}
  $$("#langSwitch button")?.forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;localStorage.setItem(STORAGE.lang,lang);renderAll()}));
  // Fallback-safe binding
  $$("[data-lang]").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;localStorage.setItem(STORAGE.lang,lang);renderAll()}));
  $("#todayBtn").onclick=()=>{selectedWeek=weekFromChinaNow();localStorage.setItem(STORAGE.week,selectedWeek);renderAll()};
  $$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;renderGrid()});
  $("#searchInput").addEventListener("input",e=>{query=e.target.value.trim();renderGrid()});
  $("#themeBtn").onclick=()=>{theme=theme==="light"?"dark":"light";localStorage.setItem(STORAGE.theme,theme);document.documentElement.dataset.theme=theme};
  $("#dialogClose").onclick=()=>$("#courseDialog").close();
  $("#courseDialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
  document.documentElement.dataset.theme=theme;
  renderAll(); tickClock(); setInterval(tickClock,1000);
})();
