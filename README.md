# Hệ Thống Phát Hiện Vượt Đèn Đỏ

Giao diện web hoàn chỉnh cho hệ thống phát hiện vi phạm giao thông, sử dụng HTML, Tailwind CSS và JavaScript thuần.

## Tính Năng

### 🎥 Video Player

-   **Hiển thị video giám sát**: Canvas animation mô phỏng camera giao thông
-   **Điều khiển phát/pause**: Nút play/pause với icon động
-   **Thanh tiến độ**: Hiển thị thời gian phát video
-   **Overlay điều khiển**: Hiển thị/ẩn controls khi hover

### 📋 Quản Lý Vi Phạm

-   **Danh sách vi phạm**: Hiển thị tất cả xe vi phạm với thông tin chi tiết
-   **Tìm kiếm**: Tìm kiếm theo biển số xe
-   **Lọc theo thời gian**: Hôm nay, tuần này, tháng này
-   **Trạng thái**: Chưa xử lý, Đã xử lý, Chờ xác nhận

### 🔍 Chi Tiết Vi Phạm

-   **Modal chi tiết**: Hiển thị đầy đủ thông tin khi click "Xem chi tiết"
-   **Ảnh vi phạm**: Ảnh chụp xe vi phạm
-   **Thông tin phương tiện**: Hãng, màu, loại, năm sản xuất
-   **Thông tin chủ sở hữu**: Họ tên, ngày sinh, địa chỉ, ảnh chân dung

## Cấu Trúc File

```
/
├── index.html          # File HTML chính
├── script.js           # JavaScript xử lý tương tác
└── README.md          # Hướng dẫn sử dụng
```

## Công Nghệ Sử Dụng

-   **HTML5**: Cấu trúc giao diện
-   **Tailwind CSS**: Framework CSS utility-first
-   **Font Awesome**: Icon library
-   **JavaScript ES6+**: Xử lý logic và tương tác
-   **Canvas API**: Animation video demo

## Cách Sử Dụng

### 1. Mở Giao Diện

Mở file `index.html` trong trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge).

### 2. Điều Khiển Video

-   **Phát/Pause**: Click vào nút play hoặc click trực tiếp lên video
-   **Theo dõi tiến độ**: Thanh tiến độ hiển thị thời gian phát

### 3. Quản Lý Vi Phạm

-   **Tìm kiếm**: Nhập biển số vào ô tìm kiếm
-   **Lọc thời gian**: Chọn mốc thời gian từ dropdown
-   **Xem chi tiết**: Click nút "Xem chi tiết" của mỗi vi phạm

### 4. Modal Chi Tiết

-   **Mở**: Click "Xem chi tiết" từ danh sách
-   **Đóng**: Click nút X hoặc click outside modal
-   **Thao tác**: Tải về, In biên bản (chức năng mẫu)

## Dữ Liệu Mẫu

Hệ thống bao gồm 5 vi phạm mẫu với dữ liệu đầy đủ:

-   Biển số, thời gian, địa điểm vi phạm
-   Thông tin phương tiện chi tiết
-   Thông tin chủ sở hữu với avatar SVG
-   Trạng thái xử lý khác nhau

## Tính Năng Nâng Cao

### Animation Canvas

-   Mô phỏng camera giao thông thời gian thực
-   Xe di chuyển, đèn giao thông đổi màu
-   Hiển thị thời gian và thông tin camera

### Responsive Design

-   Giao diện thích ứng trên mọi thiết bị
-   Grid layout responsive
-   Mobile-friendly controls

### Interactive Elements

-   Hover effects cho cards
-   Smooth transitions
-   Loading states
-   Error handling

## Tích Hợp Với Backend

Để tích hợp với hệ thống thực tế:

1. **Thay thế dữ liệu mẫu**:

    ```javascript
    // Trong script.js, thay thế generateSampleData()
    // bằng API call đến server của bạn
    ```

2. **Video streaming**:

    ```html
    <!-- Thay thế canvas bằng video thật -->
    <video src="your-stream-url.mp4" autoplay></video>
    ```

3. **API Integration**:
    ```javascript
    // Thêm các API calls cho:
    // - Lấy danh sách vi phạm
    // - Cập nhật trạng thái
    // - Tải ảnh từ server
    ```

## Tùy Chỉnh

### Thêm Vi Phạm Mới

Chỉnh sửa phương thức `generateSampleData()` trong `script.js`:

```javascript
{
    id: 6, // ID duy nhất
    licensePlate: "XX-YYYYY",
    time: "2024-11-10T15:00:00",
    // ... các field khác
}
```

### Tùy Chỉnh Giao Diện

-   **Màu sắc**: Chỉnh sửa Tailwind classes
-   **Bố cục**: Điều chỉnh grid system
-   **Fonts**: Thay đổi Google Fonts import

### Thêm Tính Năng

-   **Export Excel**: Thêm button export danh sách
-   **Báo cáo**: Tạo trang báo cáo riêng
-   **Notifications**: Thêm thông báo real-time

## Browser Support

-   ✅ Chrome 60+
-   ✅ Firefox 55+
-   ✅ Safari 12+
-   ✅ Edge 79+

## License

MIT License - Tự do sử dụng và tùy chỉnh cho mục đích phi thương mại.

## Hỗ Trợ

Để được hỗ trợ hoặc báo lỗi, vui lòng tạo issue hoặc liên hệ qua email.
