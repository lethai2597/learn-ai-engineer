# UI Rules — Lesson 2 cột (Theory / Practice)

## Mục tiêu
- UI/UX **đồng bộ**, **dễ nhìn**, giảm cảm giác “nặng viền”.
- Tất cả lesson 2 cột tuân thủ **1 chuẩn layout**, **1 chuẩn spacing**, **1 chuẩn hành vi Tabs/Steps**.

## 0) Nguyên tắc phân cấp (Information Hierarchy)
- **Level 0**: Header của cột (sticky) — định danh “đang ở cột nào”.
- **Level 1**: Section lớn trong cột (Summary / Detail / Practice).
- **Level 2**: Sub-section (Concepts / Design Patterns / Best Practices / Notes).
- **Level 3**: Item trong sub-section (một concept/pattern/best-practice item).

### Quy tắc “border / box / card” (bạn yêu cầu)
- **Title + detail (đọc liền mạch)**: *không dùng card border*, chỉ dùng typography + spacing.
- **Title + detail dạng list card (nhiều item cùng loại, item “to” và cần scan)**: *dùng card border* để tạo nhịp, dễ scan.

## 1) Layout Anatomy (2 cột)
### Desktop
- 2 cột 50/50.
- Mỗi cột có **header sticky riêng**.
- Mỗi cột có scroll độc lập (chỉ bật `overflow-auto` ở `lg:`).

### Mobile
- Xếp dọc (Theory trước, Practice sau).
- Không tạo scroll lồng nhau (không `overflow-auto` ở mobile).

## 2) Spacing System (Tailwind)
- **Padding pane chuẩn**: `px-6 py-4`
- **Khoảng cách**:
  - Trong 1 block: `space-y-3` hoặc `space-y-4`
  - Giữa section lớn: `space-y-8`
  - Giữa item trong list: `space-y-6`

## 3) Theory Column
### 3.1. Summary box (luôn có, “neo mắt”)
- Đây là khối duy nhất ở Theory dùng nền + border rõ.
- Chuẩn:
  - Container: `bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3`
  - Text: `text-sm text-gray-700`

### 3.2. Separator giữa Summary và Detail (bắt buộc)
- Để tránh cảm giác "dính", luôn có một ranh giới rõ:
  - `border-t border-gray-200 pt-6`
  - Không cần heading "Chi tiết bài học" (chỉ cần border separator)

### 3.3. Lesson Detail (phân cấp, hạn chế border)
#### Khi nào dùng Divider
- Chỉ dùng Divider khi chuyển **sub-section lớn** (Level 2):
  - Concepts → Design Patterns → Best Practices → Note/Alert

#### “Title + detail” (không card border)
- Dùng cho nội dung đọc liền mạch, tập trung vào diễn giải:
  - Ví dụ: đoạn tổng quan sâu, giải thích flow, giải thích best practice theo dạng narrative.
- Cách thể hiện phân cấp:
  - Heading (Title level)
  - Whitespace (`space-y-*`)
  - Separator mảnh nếu là list (Rule A)

#### “List card lớn” (có card border)
- Dùng khi có nhiều item cùng loại, mỗi item cần scan nhanh:
  - Ví dụ: danh sách “Design Patterns”, danh sách “Best practices groups” (nhiều nhóm).
- Card chuẩn:
  - `border border-gray-200 rounded-lg p-4 bg-white`
- Nếu muốn nhẹ hơn nhưng vẫn “card”: bỏ hover, bỏ shadow.

### 3.4. Rule A — Separator mảnh cho list (không card)
- Nếu item cùng loại nhưng muốn “nhẹ” hơn card:
  - Item đầu: không separator
  - Item sau: `border-t border-gray-100 pt-6`

### 3.5. Code/Example block (luôn là box)
- Dùng để đọc code/schema/output mẫu.
- Chuẩn:
  - Container: `bg-gray-50 border border-gray-100 rounded p-3`
  - Code: `text-sm text-gray-700 font-mono whitespace-pre-wrap`

### 3.6. Alert / Note
- Dùng `Alert` (antd) cho thông tin cần nhấn mạnh (info/warning/error).
- Không lạm dụng; ưu tiên đặt cuối sub-section hoặc cuối cột.

## 4) Practice Column
### 4.1. Single Padding Owner (bắt buộc)
- Chỉ **1** nơi được đặt padding theo pane.
- **Quy tắc phân nhánh**:
  - **Nếu có Tabs** (số bài ≥ 2):
    - Owner = `PracticeSection` (không bọc Tabs bằng `px-6 py-4`).
    - Các exercise **không được** đặt `px-* py-*` ở root.
  - **Nếu không có Tabs** (chỉ 1 bài):
    - `PracticeSection` **không padding** (chỉ render trực tiếp exercise).
    - Exercise component không được thêm padding (`px-6 py-4` ở root của exercise).

### 4.2. Tabs rule
- **Có Tabs khi**: số bài tập ≥ 2.
- **Không Tabs khi**: chỉ 1 bài tập (render trực tiếp exercise component).
- **Quy tắc align** (khi có Tabs):
  - Tab bar và tab content phải cùng lề (do `PracticeSection` quản lý padding).
- **Quy tắc chiều rộng**:
  - Không được để tab content "hẹp hơn" do padding chồng ở child component.

### 4.3. Steps rule (đồng bộ)
- Dùng `Steps orientation="vertical"` khi cần hiển thị flow/process.
- **Step container luôn thống nhất**:
  - `Card` (antd) với `className="mt-2"` cho mọi step description.
- **Không dùng Collapse trong tab Thực hành** (bắt buộc).
  - Nếu step data dài / nhiều JSON: vẫn show trực tiếp, đảm bảo `pre` có `overflow-x-auto`.
- **JSON/pre block chuẩn**:
  - `pre` với `overflow-x-auto` để không phá layout cột.
  - Container: `bg-gray-50 rounded p-2 text-sm`

### 4.4. Exercise component structure
- **Khi có Tabs** (PracticeSection là padding owner):
  - Exercise root **không được** đặt `px-* py-*`.
  - Chỉ dùng spacing nội bộ: `space-y-*`, `mb-*`, `mt-*`.
- **Khi không có Tabs** (chỉ 1 bài):
  - Exercise root **phải có** padding: `px-6 py-4`.
  - PracticeSection chỉ render trực tiếp exercise, không bọc thêm container.
- **Form/Input/Button**: tuân thủ antd Form layout chuẩn, không tự thêm padding container ngoài quy tắc trên.


