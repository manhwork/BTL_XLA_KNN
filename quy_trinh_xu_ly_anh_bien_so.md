# Quy Trình Xử Lý Ảnh Biển Số Xe Với KNN

## Tổng quan bài toán

Bài toán nhận diện biển số xe từ ảnh nghiêng sử dụng thuật toán K-Nearest Neighbors (KNN), được thực hiện qua 4 giai đoạn chính với các kỹ thuật xử lý ảnh tiên tiến.

---

## Giai đoạn 1: Chuẩn bị dữ liệu và xử lý ảnh đầu vào

### 1.1 Chuẩn bị dữ liệu training

-   **Dữ liệu ảnh**: Các mẫu ký tự đã được chuẩn bị sẵn (số 0-9, chữ A-Z)
-   **Kích thước chuẩn**: 20×30 pixels cho mỗi ký tự
-   **Định dạng**: Ảnh đã được flatten thành vector 1D với 600 features
-   **Huấn luyện KNN**: Sử dụng thuật toán K-Nearest Neighbors với k=3

### 1.2 Xử lý ảnh đầu vào với tọa độ 4 góc chuẩn hóa

#### 1.2.1 Tọa độ chuẩn hóa (Normalized Coordinates)

-   **Định nghĩa**: Sử dụng tọa độ từ 0.0 đến 1.0 thay vì pixel coordinates
-   **Lợi ích**: Độc lập với kích thước ảnh, dễ dàng thay đổi và áp dụng
-   **Ứng dụng**: Xác định chính xác 4 góc của biển số trong ảnh bất kỳ

#### 1.2.2 Kỹ thuật sắp xếp tọa độ

-   **Mục tiêu**: Chuyển đổi 4 điểm bất kỳ thành thứ tự cố định
-   **Thứ tự chuẩn**: TL (Top-Left) → TR (Top-Right) → BR (Bottom-Right) → BL (Bottom-Left)
-   **Thuật toán**:
    -   Tính tổng (x+y) để xác định TL và BR
    -   Tính hiệu (x-y) để xác định TR và BL

#### 1.2.3 Perspective Transform (Phép biến đổi phối cảnh)

-   **Mục đích**: Chuyển đổi biển số từ hình tứ giác nghiêng thành hình chữ nhật thẳng
-   **Quy trình**:
    1. Chuyển đổi tọa độ normalized → pixel coordinates
    2. Tính ma trận biến đổi từ 4 điểm nguồn đến 4 điểm đích
    3. Áp dụng warp perspective để tạo ảnh thẳng
-   **Kết quả**: Ảnh biển số thẳng 400×400 pixels

---

## Giai đoạn 2: Phân đoạn ký tự (Tách phân ngưỡng)

### 2.1 Tiền xử lý ảnh

#### 2.1.1 Chuyển đổi không gian màu

-   **Grayscale**: Chuyển ảnh màu thành ảnh xám để đơn giản hóa
-   **Gaussian Blur**: Làm mờ ảnh để giảm nhiễu và làm mượt biên

#### 2.1.2 Kỹ thuật phân ngưỡng (Thresholding)

-   **Otsu Thresholding**: Tự động tìm ngưỡng tối ưu dựa trên histogram
-   **Adaptive Thresholding**: Phương pháp thay thế với ngưỡng cục bộ
-   **Binary Image**: Tạo ảnh nhị phân (đen/trắng) để tách ký tự khỏi nền

### 2.2 Kỹ thuật Morphological (Hình thái học)

#### 2.2.1 Morphological Closing

-   **Định nghĩa**: Phép giãn nở (Dilation) followed by phép co (Erosion)
-   **Mục đích**: Nối liền các ký tự bị đứt gãy do ngưỡng hoặc ảnh mờ
-   **Kernel**: Sử dụng ma trận 3×3 làm cấu trúc phần tử

### 2.3 Tìm và lọc Contours

#### 2.3.1 Contour Detection

-   **Thuật toán**: Tìm đường biên của các đối tượng trong ảnh
-   **Phương pháp**: RETR_EXTERNAL để chỉ lấy contour ngoài cùng
-   **Nén**: CHAIN_APPROX_SIMPLE để giảm số điểm

#### 2.3.2 Lọc Contours theo tiêu chí

-   **Kích thước**: Chiều rộng > 10px, chiều cao 50-180px
-   **Tỷ lệ khung hình**: 0.1 - 0.9 để loại bỏ các đối tượng không hợp lệ
-   **Sắp xếp**: Theo vị trí từ trái sang phải

### 2.4 Trích xuất ký tự

-   **Cắt ảnh**: Từ ảnh nhị phân gốc, cắt từng vùng ký tự
-   **Padding**: Thêm 2 pixels đệm để bảo toàn thông tin biên
-   **Chia 2 phần**: Tách biển số thành phần trên và dưới để xử lý riêng

---

## Giai đoạn 3: Nhận diện ký tự bằng KNN

### 3.1 Tiền xử lý ký tự

-   **Resize**: Đưa mỗi ký tự về kích thước chuẩn 20×30 pixels
-   **Normalization**: Đảm bảo dữ liệu ở định dạng phù hợp với mô hình
-   **Flattening**: Chuyển ma trận 2D thành vector 1D (600 features)

### 3.2 K-Nearest Neighbors Classification

#### 3.2.1 Thuật toán KNN

-   **Nguyên lý**: Tìm k mẫu gần nhất trong không gian đặc trưng
-   **Giá trị k**: Sử dụng k=3 để cân bằng độ chính xác và tính ổn định
-   **Khoảng cách**: Euclidean distance trong không gian 600 chiều

#### 3.2.2 Quy trình phân loại

-   **Tính khoảng cách**: Đo độ tương đồng với từng mẫu training
-   **Sắp xếp**: Sắp xếp theo khoảng cách từ nhỏ đến lớn
-   **Bầu cử**: Lấy nhãn phổ biến nhất trong k neighbors
-   **Quyết định**: Chọn class có số vote cao nhất

### 3.3 Tính độ tin cậy (Confidence Score)

#### 3.3.1 Phân tích Vote Ratio

-   **Tỷ lệ đồng thuận**: Số neighbors cùng class / tổng số neighbors
-   **Độ chính xác**: Vote ratio cao → độ tin cậy lớn

#### 3.3.2 Phân tích khoảng cách

-   **Khoảng cách trung bình**: Tính toán từ k neighbors
-   **Chuẩn hóa**: Đưa về khoảng 0-1 để so sánh
-   **Điều chỉnh**: Khoảng cách nhỏ → độ tin cậy cao

#### 3.3.3 Công thức tính confidence

-   **Công thức**: `Confidence = Vote_Ratio × (1 - Normalized_Distance × 0.3)`
-   **Giới hạn**: Đảm bảo kết quả trong khoảng [0, 1]

### 3.4 Tổng hợp kết quả

-   **Ghép ký tự**: Kết hợp các ký tự đã nhận diện theo thứ tự
-   **Tách 2 dòng**: Phân biệt dòng trên và dưới của biển số
-   **Hiển thị**: Thể hiện kết quả với độ tin cậy từng ký tự

---

## Sơ đồ tổng quan quy trình

```
Ảnh biển số nghiêng
        ↓
┌─────────────────────────────┐
│ Giai đoạn 1: Chuẩn bị      │
│ - Dữ liệu training KNN     │
│ - Tọa độ 4 góc normalized  │
│ - Perspective transform     │
│ - Ảnh thẳng 400×400        │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Giai đoạn 2: Phân đoạn     │
│ - Grayscale + Blur         │
│ - Otsu thresholding        │
│ - Morphological closing    │
│ - Contour detection        │
│ - Character extraction     │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Giai đoạn 3: Nhận diện    │
│ - Image preprocessing      │
│ - KNN classification       │
│ - Confidence calculation   │
│ - Result compilation       │
└─────────────────────────────┘
        ↓
   KẾT QUẢ CUỐI CÙNG
```

---

## Các kỹ thuật xử lý ảnh chính

### Kỹ thuật tiền xử lý

-   **Color Space Conversion**: RGB → Grayscale
-   **Smoothing**: Gaussian Blur để giảm nhiễu
-   **Thresholding**: Otsu và Adaptive threshold

### Kỹ thuật hình thái học

-   **Morphological Operations**: Closing, Opening
-   **Kernel/Structuring Element**: 3×3 matrix
-   **Purpose**: Nối liền, làm sạch đối tượng

### Kỹ thuật phát hiện đặc trưng

-   **Contour Detection**: Tìm đường biên đối tượng
-   **Bounding Box**: Tọa độ và kích thước đối tượng
-   **Feature Filtering**: Lọc theo kích thước và tỷ lệ

### Kỹ thuật biến đổi hình học

-   **Perspective Transform**: Chuyển đổi phối cảnh
-   **Image Resizing**: Thay đổi kích thước ảnh
-   **Coordinate Normalization**: Chuẩn hóa tọa độ

### Kỹ thuật machine learning

-   **K-Nearest Neighbors**: Thuật toán phân loại
-   **Feature Vector**: 600-dimensional vector
-   **Distance Metrics**: Euclidean distance

---

## Ưu điểm của hệ thống

1. **Xử lý ảnh nghiêng**: Perspective transform giải quyết vấn đề góc chụp
2. **Phân ngưỡng tự động**: Otsu threshold tối ưu cho nhiều điều kiện ánh sáng
3. **Lọc thông minh**: Nhiều tiêu chí để đảm bảo chất lượng ký tự
4. **Độ tin cậy**: Tính confidence score cho từng ký tự
5. **Xử lý 2 dòng**: Phù hợp với định dạng biển số Việt Nam
6. **Đơn giản hiệu quả**: KNN cho kết quả tốt với dữ liệu phù hợp

## Ứng dụng thực tế

Hệ thống này có thể áp dụng trong:

-   **Hệ thống giao thông thông minh**: Nhận diện xe vào/ra
-   **Bãi đỗ xe tự động**: Tính phí dựa trên biển số
-   **An ninh**: Theo dõi phương tiện
-   **Thống kê giao thông**: Phân tích lưu lượng xe

Đây là một giải pháp OCR (Optical Character Recognition) hoàn chỉnh với pipeline xử lý ảnh chuẩn và thuật toán học máy hiệu quả.
