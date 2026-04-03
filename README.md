# 🎓 Thanh Xuân Của Chúng Ta – Hướng Dẫn Cài Đặt

Website kỷ niệm lớp học với đầy đủ tính năng: gatekeeper, thành viên, thư viện ảnh, dòng thời gian, lưu bút, nhạc nền.

---

## 📁 Cấu trúc thư mục khuyên dùng

```
project/
├── index.html          ← File chính
├── README.md
├── assets/
│   ├── images/
│   │   ├── hero.jpg            ← Ảnh nền trang chủ
│   │   ├── members/
│   │   │   ├── thanh-binh.jpg
│   │   │   ├── thu-ngan.jpg
│   │   │   └── ...
│   │   └── gallery/
│   │       ├── anh1.jpg
│   │       ├── anh2.jpg
│   │       └── ...
│   ├── videos/
│   │   └── ky-niem.mp4         ← Video kỷ niệm
│   └── music/
│       ├── bai1.mp3
│       ├── bai2.mp3
│       └── bai3.mp3
```

---

## ⚙️ Các bước cài đặt

### 1. Thay ảnh

Mở `index.html`, tìm tất cả các thẻ `<img>` có `src="https://placehold.co/..."` và thay bằng đường dẫn ảnh thật:

```html
<!-- Trước -->
<img src="https://placehold.co/200x240/fce4ec/e91e8c?text=Thanh+Bình" />

<!-- Sau -->
<img src="assets/images/members/thanh-binh.jpg" />
```

**Ảnh hero (trang chủ):**
```html
<!-- Tìm dòng này trong CSS -->
background: url('https://placehold.co/1200x800/...') center/cover;

<!-- Thay thành -->
background: url('assets/images/hero.jpg') center/cover;
```

---

### 2. Đổi đáp án câu hỏi gatekeeper

Tìm dòng trong phần `<script>`:

```js
const CORRECT = 'A'; // Đổi thành B, C hoặc D tùy đáp án đúng
```

Đổi nội dung câu hỏi và 4 lựa chọn trong HTML:

```html
<p class="gate-question" id="gateQuestion">Câu hỏi của bạn ở đây?</p>

<button class="gate-btn" data-answer="A" onclick="checkAnswer(this,'A')">A. Đáp án A</button>
<button class="gate-btn" data-answer="B" onclick="checkAnswer(this,'B')">B. Đáp án B</button>
<button class="gate-btn" data-answer="C" onclick="checkAnswer(this,'C')">C. Đáp án C</button>
<button class="gate-btn" data-answer="D" onclick="checkAnswer(this,'D')">D. Đáp án D</button>
```

---

### 3. Thêm / sửa thành viên

Mỗi thành viên là 1 khối `.member-card`. Sao chép và chỉnh sửa:

```html
<div class="member-card fade-in">
  <img src="assets/images/members/ten-ban.jpg" alt="Tên Bạn" />
  <div class="member-info">Tên Bạn</div>
  <div class="member-hover">
    <p>Chức vụ trong lớp<br/>Mô tả ngắn 💕</p>
    <a href="#">Xem chi tiết →</a>
  </div>
</div>
```

> Thành viên từ card thứ 7 trở đi sẽ bị ẩn, chỉ hiện khi bấm **"Xem thêm"**. Để ẩn, thêm class `members-extra`:
> ```html
> <div class="member-card members-extra fade-in">
> ```

---

### 4. Thêm ảnh vào thư viện

**Scroll ngang (strip trên):** thêm vào trong `<div class="gallery-scroll">`:

```html
<div class="gallery-item" onclick="openLightbox(5)">
  <img src="assets/images/gallery/anh6.jpg" />
  <div class="gallery-reaction">
    <span onclick="react(event,'👍')">👍</span>
    <span onclick="react(event,'❤️')">❤️</span>
    <span onclick="react(event,'😂')">😂</span>
    <span onclick="react(event,'😍')">😍</span>
    <span onclick="react(event,'😡')">😡</span>
  </div>
</div>
```

**Thêm ảnh vào lightbox** – cập nhật mảng `lbImages` trong script:

```js
const lbImages = [
  'assets/images/gallery/anh1.jpg',
  'assets/images/gallery/anh2.jpg',
  'assets/images/gallery/anh3.jpg',
  // thêm tiếp...
];
```

**Masonry grid (lưới dưới):** thêm vào `<div class="gallery-masonry">`:

```html
<div class="gm-item" onclick="openLightbox(5)">
  <img src="assets/images/gallery/anh6.jpg" />
</div>
```

---

### 5. Thêm nhạc

Thay đường dẫn nhạc thật vào. Trước tiên thêm thẻ `<audio>` vào cuối `<body>`:

```html
<audio id="audioPlayer" src="assets/music/bai1.mp3"></audio>
```

Sau đó cập nhật mảng tracks và kết nối với audio player trong script:

```js
const tracks = [
  { name: 'Tháng Năm Không Quên', artist: 'Tên ca sĩ', src: 'assets/music/bai1.mp3' },
  { name: 'Năm Tháng Trôi Qua',   artist: 'Tên ca sĩ', src: 'assets/music/bai2.mp3' },
  { name: 'Nhớ Mãi Chuyện Đi Này',artist: 'Tên ca sĩ', src: 'assets/music/bai3.mp3' },
];

// Trong hàm updateTrack(), thêm dòng:
document.getElementById('audioPlayer').src = tracks[currentTrack].src;

// Trong hàm playPause(), thêm:
const audio = document.getElementById('audioPlayer');
playing ? audio.play() : audio.pause();
```

---

### 6. Thêm video kỷ niệm

Tìm phần `<div class="video-placeholder">` và thay bằng:

```html
<video controls poster="assets/images/video-thumb.jpg">
  <source src="assets/videos/ky-niem.mp4" type="video/mp4" />
  Trình duyệt không hỗ trợ video.
</video>
```

Hoặc nhúng từ YouTube:

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

---

### 7. Sửa dòng thời gian

Mỗi mốc sự kiện là 1 khối `.tl-item`. Chỉnh nội dung:

```html
<div class="tl-item">
  <div class="tl-dot"></div>
  <div class="tl-card">
    <div class="tl-year">📅 Năm học / Sự kiện</div>
    <div class="tl-text">Mô tả kỷ niệm của sự kiện này...</div>
  </div>
</div>
```

> Các item chẵn (2, 4, 6...) tự động hiển thị bên phải, lẻ bên trái.

---

### 8. Sửa lời nhắn lưu bút

Mỗi lời nhắn là 1 khối `.note-card`. Màu sắc có 6 lựa chọn:

| Class | Màu |
|---|---|
| `note-yellow` | Vàng nhạt |
| `note-pink` | Hồng nhạt |
| `note-green` | Xanh lá nhạt |
| `note-blue` | Xanh dương nhạt |
| `note-purple` | Tím nhạt |
| `note-peach` | Cam đào nhạt |

```html
<div class="note-card note-pink fade-in" style="--rot: 1.5deg">
  Nội dung lời nhắn của bạn ở đây...
  <div class="note-author">– Tên người viết</div>
</div>
```

> `--rot` là góc nghiêng, nên dùng giá trị nhỏ từ `-3deg` đến `3deg` để trông tự nhiên.

---

## 🚀 Chạy website

### Cách 1 – Mở trực tiếp (đơn giản nhất)
Chỉ cần mở file `index.html` bằng trình duyệt Chrome / Edge / Firefox.

### Cách 2 – Dùng Live Server (khuyên dùng khi dev)
Nếu có VS Code, cài extension **Live Server** rồi nhấn **"Go Live"**.

### Cách 3 – Dùng Python (không cần cài gì thêm)
```bash
# Python 3
python -m http.server 8080

# Truy cập: http://localhost:8080
```

### Cách 4 – Deploy lên GitHub Pages (miễn phí, có link chia sẻ)
1. Tạo repo trên [github.com](https://github.com)
2. Upload toàn bộ thư mục project lên repo
3. Vào **Settings → Pages → Branch: main → Save**
4. Website sẽ có link dạng: `https://username.github.io/repo-name`

---

## 🌐 Deploy lên Netlify (kéo thả, miễn phí)
1. Truy cập [netlify.com](https://netlify.com) → Đăng nhập
2. Kéo toàn bộ thư mục project vào ô **"Deploy manually"**
3. Nhận link chia sẻ ngay lập tức

---

## ❓ Lưu ý

- Ảnh nên có tỉ lệ **1:1** hoặc **3:4** cho ảnh thành viên để đẹp nhất
- Ảnh gallery nên có chiều rộng tối thiểu **800px** để không bị vỡ khi lightbox
- File nhạc `.mp3` nên nén xuống dưới **5MB/bài** để tải nhanh
- Website hoàn toàn chạy bằng HTML/CSS/JS thuần, **không cần server, không cần database**
