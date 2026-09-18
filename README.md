# ZCMU Schedule — 2026–2027

เว็บตารางเรียนแบบ Static / GitHub Pages สำหรับตารางเรียนจากไฟล์ Excel ที่ให้มา

## สิ่งที่มีให้แล้ว

### Phase 1
- Dashboard
- Next Class
- Countdown
- Week Selector
- Today button
- Status System
- Progress Bar
- China Time (UTC+8) แบบวินาทีต่อวินาที

### Phase 2
- Search
- Filter: เช้า / บ่าย / เย็น
- Course Detail modal
- Timeline
- Free Time
- Mini Calendar

### Phase 3
- Thai / Chinese / English
- Responsive Mobile UI
- Dark / Light
- Animation
- LocalStorage: จำ Week / Language / Theme

## Status System

- **ก่อนเรียน > 15 นาที** → ปกติ
- **เหลือไม่เกิน 15 นาที** → แดงกระพริบ
- **ถึงเวลาเรียน** → เขียว / กำลังเรียน
- **หมดเวลาเรียน** → แดง / เรียนจบแล้ว
- **วันหรือเวลาที่ไม่มีเรียน** → ไม่แสดงสถานะ
- คาบที่ผ่านมาในสัปดาห์ปัจจุบันจะลด Opacity เพื่อแยกจากคาบที่ยังไม่ถึง

## Timezone

ระบบใช้ `Asia/Shanghai` ผ่าน JavaScript `Intl.DateTimeFormat` ดังนั้นนาฬิกาและสถานะจะอ้างอิง **China Standard Time (UTC+8)** ไม่ใช่เวลาของเครื่อง

เวลาเรียนอ้างอิงตาราง **富春校区** จากภาพที่แนบ:
1 08:30–09:10
2 09:15–09:55
3 10:10–10:50
4 10:55–11:35
5 11:35–13:05
6 13:10–13:50
7 13:55–14:35
8 14:45–15:25
9 15:30–16:10
10 16:15–16:55
11 18:00–18:40
12 18:45–19:25
13 19:30–20:10

**เลขสัปดาห์ของภาคเรียน:** Week 1 = 14–20 September 2026 โดยวันที่ 14 กันยายนเป็นวันเริ่มเรียนวันแรก, Week 2 = 21–27 September 2026, ... Week 17 = 4–10 January 2027

## โครงสร้าง

```text
zcmu-schedule/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── schedule.js
├── assets/
│   └── README.md
└── README.md
```

## วิธีเปิดในเครื่อง

ไม่ต้องติดตั้ง Node.js และไม่ต้องเชื่อม API

วิธีง่ายที่สุด:
1. เปิด `index.html` ด้วย Chrome / Edge / Safari
2. หรือใช้ VS Code + ส่วนขยาย Live Server ถ้าต้องการ hot reload

## วิธีแก้ใน Visual Studio Code

เปิดโฟลเดอร์ `zcmu-schedule` แล้วแก้:
- `index.html` = โครงสร้างหน้า
- `styles.css` = UX/UI
- `app.js` = logic, countdown, status, filter, language, theme
- `data/schedule.js` = ข้อมูลตารางเรียน
- `assets/` = รูปภาพของคุณ

### ใส่รูปเองผ่าน assets

นำรูป เช่น `hero.jpg` ไปไว้ใน:

```text
assets/hero.jpg
```

จากนั้นสามารถเพิ่มใน `index.html` ได้ เช่น:

```html
<img src="assets/hero.jpg" alt="Campus">
```

ไม่ต้องใช้ URL ภายนอก จึงเหมาะกับ GitHub Pages และยังทำงานแบบ static ได้

## วิธีขึ้น GitHub Pages

1. สร้าง GitHub repository ใหม่ เช่น `zcmu-schedule`
2. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมดใน repo นี้
3. ไปที่ **Settings → Pages**
4. เลือก **Deploy from a branch**
5. Branch: `main`
6. Folder: `/ (root)`
7. Save
8. GitHub จะสร้าง URL ให้ เช่น `https://YOUR-USERNAME.github.io/zcmu-schedule/`

ไม่ต้องมี backend, database, API key หรือ server เพิ่ม

## ถ้าต้องการแก้ข้อมูลตารางเรียน

แก้เฉพาะ `data/schedule.js`

ตัวอย่าง:

```js
{
  id: "my-course",
  zh: "课程中文名",
  en: "Course English Name",
  th: "ชื่อวิชาภาษาไทย",
  teacher: "Teacher",
  occ: [
    { d: 1, w: "1-17", p: [3,4], room: "南6A206" }
  ]
}
```

- `d`: 1=Mon ... 7=Sun
- `w`: สัปดาห์ เช่น `1-3,5-10`
- `p`: คาบ เช่น `[3,4]`
- `room`: ห้องเรียน

เวลาเริ่ม/จบจะถูกสร้างจาก `D.periods` โดยอัตโนมัติ

## หมายเหตุเรื่องข้อมูล

ไฟล์ `schedule.js` ถูกแยกจาก Excel ให้เป็นข้อมูลที่เว็บอ่านง่ายแล้ว เพื่อให้เว็บนี้ไม่ต้องโหลด Excel parser หรือ dependency ภายนอก

ข้อมูลต้นฉบับมีบางรายการที่มีหลายวันอยู่ใน cell เดียว เช่น 始业教育 จึงถูกแตกออกเป็นแต่ละวัน/ช่วงเวลาในข้อมูลเว็บ

---

Made as a self-contained static web app for ZCMU timetable.
