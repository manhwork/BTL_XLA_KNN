# Quy Trình Nhận Diện Biển Số Xe Bằng KNN

Dựa trên file `BTL_XLA_KNN.ipynb`, bài toán nhận diện biển số xe được thực hiện qua 4 giai đoạn chính sử dụng thuật toán K-Nearest Neighbors (KNN).

## Tổng quan bài toán

-   **Input**: Ảnh biển số nghiêng với tọa độ 4 góc đã được cung cấp
-   **Output**: Chuỗi ký tự nhận diện được từ biển số (2 dòng)
-   **Thuật toán chính**: K-Nearest Neighbors với k=3
-   **Kích thước chuẩn ký tự**: 20x30 pixels
-   **Đặc điểm**: Xử lý riêng biệt 2 dòng của biển số Việt Nam

---

## Giai đoạn 1: Chuẩn bị dữ liệu và xử lý ảnh đầu vào

### 1.1 Import các thư viện cần thiết

-   **cv2**: Xử lý ảnh và computer vision
-   **numpy**: Tính toán ma trận và mảng đa chiều
-   **matplotlib**: Hiển thị ảnh và biểu đồ
-   **sklearn.neighbors**: Thuật toán K-Nearest Neighbors
-   **collections**: Đếm và thống kê

### 1.2 Load và chuẩn bị dữ liệu training

#### 1.2.1 Dữ liệu training

-   **classifications.txt**: Chứa nhãn (label) của từng ký tự dưới dạng mã ASCII
-   **flattened_images.txt**: Chứa dữ liệu ảnh đã được flatten thành vector 1D
-   Kích thước chuẩn: 20×30 = 600 pixels cho mỗi ký tự
-   Dạng dữ liệu: float32 với giá trị 0-255

#### 1.2.2 Reshape và xử lý dữ liệu

-   Reshape classifications từ ma trận thành vector 1D
-   Kiểm tra tính toàn vẹn dữ liệu và số lượng mẫu training
-   Xác định các lớp ký tự hỗ trợ (0-9, A-Z)

### 1.3 Xử lý ảnh đầu vào với tọa độ 4 góc chuẩn hóa

#### 1.3.1 Định nghĩa ảnh đầu vào và tọa độ tham chiếu

-   **Ảnh đầu vào**: biển số xe nghiêng bất kỳ (JPEG/PNG)
-   **Tọa độ 4 góc chuẩn hóa**: normalized coordinates từ 0.0 đến 1.0
-   Các điểm tọa độ được xác định bởi:
    -   Điểm 1: x=0.8665, y=0.1346 (góc trên phải)
    -   Điểm 2: x=0.2477, y=0.1236 (góc trên trái)
    -   Điểm 3: x=0.0341, y=0.7542 (góc dưới trái)
    -   Điểm 4: x=0.6876, y=0.8607 (góc dưới phải)

#### 1.3.2 Lợi ích của tọa độ chuẩn hóa

-   **Độc lập với kích thước ảnh**: Có thể áp dụng cho ảnh có kích thước bất kỳ
-   **Độ chính xác cao**: Tọa độ được xác định chính xác từ biển số thực tế
-   **Dễ dàng thay đổi**: Chỉ cần cập nhật giá trị normalized coordinates
-   **Áp dụng rộng rãi**: Có thể sử dụng cho nhiều loại biển số khác nhau

#### 1.3.3 Sắp xếp tọa độ theo thứ tự chuẩn

**Mục tiêu**: Chuyển đổi 4 điểm bất kỳ thành thứ tự cố định

-   **TL** (Top-Left): Điểm trên-trái
-   **TR** (Top-Right): Điểm trên-phải
-   **BR** (Bottom-Right): Điểm dưới-phải
-   **BL** (Bottom-Left): Điểm dưới-trái

**Thuật toán sắp xếp**:

1. Tính tổng (x+y) của mỗi điểm
2. Điểm có tổng nhỏ nhất → TL (trên-trái)
3. Điểm có tổng lớn nhất → BR (dưới-phải)
4. Với 2 điểm còn lại, tính hiệu (x-y)
5. Hiệu nhỏ nhất → TR (trên-phải)
6. Hiệu lớn nhất → BL (dưới-trái)

#### 1.3.4 Làm thẳng biển số bằng Perspective Transform

**Quy trình thực hiện**:

1. **Chuyển đổi tọa độ**: Từ normalized (0-1) sang pixel coordinates

    - X*pixel = X_normalized × Width*ảnh
    - Y*pixel = Y_normalized × Height*ảnh

2. **Xác định tọa độ đích**: Tạo hình chữ nhật chuẩn 400×400 pixels

    - TL: (0, 0)
    - TR: (399, 0)
    - BR: (399, 399)
    - BL: (0, 399)

3. **Tính ma trận biến đổi**: Sử dụng cv2.getPerspectiveTransform()

    - Input: 4 điểm nguồn (từ ảnh nghiêng)
    - Output: 4 điểm đích (hình chữ nhật thẳng)

4. **Áp dụng biến đổi**: Sử dụng cv2.warpPerspective()
    - Input: Ảnh gốc + ma trận biến đổi
    - Output: Ảnh biển số thẳng 400×400

**Kết quả giai đoạn 1**:

-   Mô hình KNN đã được huấn luyện với dữ liệu chuẩn
-   Ảnh biển số nghiêng → Ảnh biển số thẳng 400×400 pixels
-   Sẵn sàng cho giai đoạn phân đoạn ký tự

---

## Giai đoạn 2: Xử lý ảnh đầu vào - Làm thẳng biển số

### 2.1 Định nghĩa tham số đầu vào

```python
# Đường dẫn ảnh biển số nghiêng
IMAGE_PATH = 'bien_so_nghieng.jpg'

# Tọa độ 4 góc chuẩn hóa (normalized coordinates từ 0-1)
normalized_coords_raw = np.array([
    [0.8665292390625, 0.13456756718750001],    # Điểm 1
    [0.2476783625, 0.1236081078125],           # Điểm 2
    [0.03405555625, 0.754216215625],           # Điểm 3
    [0.6876491234375, 0.8606655406250001]      # Điểm 4
])
```

### 2.2 Hàm sắp xếp tọa độ `order_points_corrected()`

Sắp xếp 4 điểm theo thứ tự chuẩn:

-   **TL** (Top-Left): Trên-Trái
-   **TR** (Top-Right): Trên-Phải
-   **BR** (Bottom-Right): Dưới-Phải
-   **BL** (Bottom-Left): Dưới-Trái

```python
def order_points_corrected(pts):
    """
    Sắp xếp 4 điểm tọa độ theo thứ tự chuẩn: TL, TR, BR, BL
    """
    pts = np.array(pts, dtype="float32")
    rect = np.zeros((4, 2), dtype="float32")

    # Trên-Trái (TL) có tổng nhỏ nhất, Dưới-Phải (BR) có tổng lớn nhất
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]  # TL
    rect[2] = pts[np.argmax(s)]  # BR

    # Lấy 2 điểm còn lại
    remaining_pts = np.delete(pts, [np.argmin(s), np.argmax(s)], axis=0)

    # Trên-Phải (TR) có hiệu (x-y) nhỏ nhất, Dưới-Trái (BL) có hiệu lớn nhất
    remaining_diff = np.diff(remaining_pts, axis=1).flatten()
    rect[1] = remaining_pts[np.argmin(remaining_diff)]  # TR
    rect[3] = remaining_pts[np.argmax(remaining_diff)]  # BL

    return rect
```

### 2.3 Hàm làm thẳng biển số `rectify_license_plate()`

Thực hiện phép biến đổi phối cảnh để tạo ảnh biển số thẳng:

```python
def rectify_license_plate(image_path, norm_points):
    """
    Làm thẳng biển số xe từ ảnh nghiêng sử dụng tọa độ chuẩn hóa
    """
    # 1. Load ảnh
    img = cv2.imread(image_path)
    if img is None:
        print(f"❌ Lỗi: Không thể tải ảnh từ: {image_path}")
        return None, 0, 0

    # 2. Chuyển tọa độ normalized sang pixel coordinates
    H_img, W_img = img.shape[:2]
    pixel_points = norm_points.copy()
    pixel_points[:, 0] *= W_img  # Convert x
    pixel_points[:, 1] *= H_img  # Convert y
    input_pts = np.float32(pixel_points)

    # 3. Định nghĩa kích thước và tọa độ đích
    RECTIFIED_WIDTH = 400
    RECTIFIED_HEIGHT = 400
    output_pts = np.float32([
        [0, 0], [RECTIFIED_WIDTH - 1, 0],
        [RECTIFIED_WIDTH - 1, RECTIFIED_HEIGHT - 1], [0, RECTIFIED_HEIGHT - 1]
    ])

    # 4. Tính và áp dụng ma trận biến đổi phối cảnh
    M = cv2.getPerspectiveTransform(input_pts, output_pts)
    img_rectified = cv2.warpPerspective(
        cv2.cvtColor(img, cv2.COLOR_BGR2RGB),
        M,
        (RECTIFIED_WIDTH, RECTIFIED_HEIGHT)
    )

    return img_rectified, W_img, H_img
```

### 2.4 Kết quả giai đoạn 2

-   Input: Ảnh biển số nghiêng bất kỳ
-   Output: Ảnh biển số thẳng 400×400 pixels
-   Sử dụng: `cv2.getPerspectiveTransform()` + `cv2.warpPerspective()`

---

## Giai đoạn 3: Phân đoạn ký tự (Tách phân ngưỡng)

### 3.1 Chia ảnh biển số thành 2 phần

```python
# Chia đôi ảnh theo chiều dọc để tách phần trên và dưới
H, W = img_rectified.shape[:2]
split_y = H // 2

img_top = img_rectified[0:split_y, :]      # Phần trên
img_bottom = img_rectified[split_y:, :]    # Phần dưới
```

**Lý do**: Biển số Việt Nam thường có 2 dòng ký tự (số và chữ)

### 3.2 Hàm phân đoạn ký tự `segment_characters_debug()`

#### Bước 3.2.1: Tiền xử lý ảnh

```python
# Chuyển sang grayscale và làm mờ
gray = cv2.cvtColor(img_rectified, cv2.COLOR_RGB2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)

# Áp dụng threshold - có 2 phương pháp:

# 1. Ngưỡng Otsu (tự động tìm ngưỡng tối ưu)
ret_otsu, binary_otsu = cv2.threshold(blurred, 0, 255,
                                      cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# 2. Adaptive Threshold (phương pháp thay thế)
binary_adaptive = cv2.adaptiveThreshold(blurred, 255,
                                        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                        cv2.THRESH_BINARY_INV, 11, 2)

# Sử dụng Otsu (thường tốt hơn cho ảnh biển số)
binary = binary_otsu
```

#### Bước 3.2.2: Phép đóng (Morphological Closing)

```python
# Phép đóng = Giãn (Dilate) rồi Co (Erode)
# Mục đích: Nối liền các ký tự bị đứt gãy do ngưỡng Otsu hoặc ảnh mờ
kernel = np.ones((3,3), np.uint8)
binary_morphed = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=1)
```

#### Bước 3.2.3: Tìm và lọc Contours

```python
# Tìm contours trên ảnh đã xử lý
contours, _ = cv2.findContours(binary_morphed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Tham số lọc contours
MIN_W = 10       # Chiều rộng tối thiểu
MAX_H = 180      # Chiều cao tối đa (gần bằng chiều cao ảnh)
MIN_H = 50       # Chiều cao tối thiểu (loại bỏ dấu chấm/nhiễu)
MIN_ASPECT = 0.1 # Tỷ lệ khung hình tối thiểu
MAX_ASPECT = 0.9 # Tỷ lệ khung hình tối đa (nới lỏng cho ký tự 'V', 'M')

char_contours = []
for i, cnt in enumerate(contours):
    x, y, w, h = cv2.boundingRect(cnt)
    aspect_ratio = w / h if h > 0 else 0

    # Các điều kiện lọc
    condition_w = w > MIN_W
    condition_h = h > MIN_H and h < MAX_H
    condition_aspect = aspect_ratio > MIN_ASPECT and aspect_ratio < MAX_ASPECT

    if condition_w and condition_h and condition_aspect:
        char_contours.append((x, y, w, h))

# Sắp xếp theo vị trí từ trái sang phải
char_contours = sorted(char_contours, key=lambda b: b[0])
```

#### Bước 3.2.4: Trích xuất ký tự

```python
# Cắt từng ký tự từ ảnh nhị phân gốc
char_images = []
if len(char_contours) > 0:
    for i, (x, y, w, h) in enumerate(char_contours):
        padding = 2

        # Cắt từ ảnh nhị phân GỐC (đã qua bước tách phân ngưỡng Otsu)
        char_img = binary[max(0, y-padding):min(binary.shape[0], y+h+padding),
                          max(0, x-padding):min(binary.shape[1], x+w+padding)]

        char_images.append(char_img)
```

### 3.3 Kết hợp ký tự từ 2 phần

```python
# Phân đoạn riêng biệt từng phần
char_images_top = segment_characters_debug(img_top, show_debug=False)
char_images_bottom = segment_characters_debug(img_bottom, show_debug=False)

# Kết hợp tất cả ký tự (trên trước, dưới sau)
char_images = char_images_top + char_images_bottom
char_images_info = [('top', i) for i in range(len(char_images_top))] + \
                   [('bottom', i) for i in range(len(char_images_bottom))]
```

---

## Giai đoạn 4: Nhận diện ký tự bằng KNN

### 4.1 Hàm tiền xử lý ảnh ký tự `preprocess_char_image()`

```python
def preprocess_char_image(char_img, target_width=20, target_height=30):
    """
    Tiền xử lý ảnh ký tự: resize trực tiếp giống như dữ liệu training
    """
    # Đảm bảo ảnh là nhị phân (0 hoặc 255) và là uint8
    if char_img.max() <= 1:
        char_img = (char_img * 255).astype(np.uint8)
    else:
        char_img = char_img.astype(np.uint8)

    # Resize trực tiếp về kích thước đích (giống như training)
    char_resized = cv2.resize(char_img, (target_width, target_height),
                             interpolation=cv2.INTER_AREA)

    return char_resized
```

### 4.2 Hàm nhận diện ký tự `recognize_characters()`

#### Bước 4.2.1: Tiền xử lý từng ký tự

```python
for i, char_img in enumerate(char_images):
    # Tiền xử lý ảnh ký tự
    char_processed = preprocess_char_image(char_img, RESIZED_IMAGE_WIDTH, RESIZED_IMAGE_HEIGHT)

    # Flatten thành vector 1D (giống hệt cách training)
    char_flattened = char_processed.reshape((1, RESIZED_IMAGE_WIDTH * RESIZED_IMAGE_HEIGHT))

    # Chuyển sang float32 để phù hợp với dữ liệu training
    char_flattened = char_flattened.astype(np.float32)
```

#### Bước 4.2.2: Dự đoán bằng KNN

```python
# Dự đoán bằng KNN
prediction = knn_model.predict(char_flattened)
predicted_char = chr(int(prediction[0]))
```

#### Bước 4.2.3: Tính độ tin cậy

```python
# Phân tích k-neighbors (k=3)
distances, indices = knn_model.kneighbors(char_flattened, n_neighbors=3)

# Lấy labels của training data tại các vị trí indices
training_labels = knn_model._y if hasattr(knn_model, '_y') else classifications
neighbor_labels = training_labels[indices[0]]

# Đếm số neighbors cùng class với prediction
same_class_count = np.sum(neighbor_labels == prediction[0])
vote_ratio = same_class_count / len(neighbor_labels)  # Tỷ lệ vote

# Tính độ tin cậy dựa trên vote ratio và khoảng cách
avg_distance = np.mean(distances[0])
max_possible_distance = np.sqrt(RESIZED_IMAGE_WIDTH * RESIZED_IMAGE_HEIGHT) * 255
normalized_distance = min(avg_distance / max_possible_distance, 1.0)

# Confidence = vote_ratio * (1 - normalized_distance * weight)
confidence = vote_ratio * (1.0 - normalized_distance * 0.3)
confidence = max(0.0, min(1.0, confidence))  # Đảm bảo trong [0, 1]
```

#### Bước 4.2.4: Hiển thị kết quả

```python
# Kết hợp thành biển số đúng (trên + dưới)
if 'char_images_info' in locals() and len(recognized_chars) == len(char_images_info):
    # Nhóm ký tự theo phần
    top_chars = []
    bottom_chars = []

    for i, (part, idx) in enumerate(char_images_info):
        if part == 'top':
            top_chars.append(recognized_chars[i])
        else:
            bottom_chars.append(recognized_chars[i])

    # Kết hợp thành biển số hoàn chỉnh
    license_plate_top = ''.join(top_chars)
    license_plate_bottom = ''.join(bottom_chars)
    license_plate_text = f"{license_plate_top}\n{license_plate_bottom}"
```

---

## Sơ đồ tổng quan quy trình

```
Ảnh biển số nghiêng
        ↓
┌─────────────────────────────────┐
│ Giai đoạn 1: Chuẩn bị          │
│ - Load dữ liệu training         │
│ - Train KNN (k=3)               │
│ - Kích thước: 20x30             │
│ - Features: 600 pixels          │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Giai đoạn 2: Làm thẳng         │
│ - Tọa độ 4 góc normalized      │
│ - Perspective transform         │
│ - Output: 400x400 pixels        │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Giai đoạn 3: Phân đoạn         │
│ - Chia 2 phần (trên/dưới)       │
│ - Otsu threshold               │
│ - Morphological closing         │
│ - Tìm & lọc contours            │
│ - Trích xuất ký tự              │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│ Giai đoạn 4: Nhận diện         │
│ - Tiền xử lý (20x30)           │
│ - KNN predict                   │
│ - Tính độ tin cậy              │
│ - Ghép thành biển số           │
└─────────────────────────────────┘
        ↓
   KẾT QUẢ CUỐI CÙNG
```

---

## Đặc điểm chính của bài toán

### Ưu điểm:

-   **Sử dụng Perspective Transform** để xử lý biển số nghiêng một cách chính xác
-   **Kết hợp Otsu threshold với Morphological closing** để tối ưu hóa việc tách ký tự
-   **Tính toán độ tin cậy** cho từng ký tự dựa trên vote ratio và khoảng cách
-   **Xử lý riêng biệt 2 dòng** của biển số Việt Nam
-   **Mô hình KNN đơn giản** nhưng hiệu quả cho bài toán phân loại ký tự

### Các tham số quan trọng:

| Tham số                | Giá trị | Mô tả                            |
| ---------------------- | ------- | -------------------------------- |
| `RESIZED_IMAGE_WIDTH`  | 20      | Chiều rộng chuẩn của ký tự       |
| `RESIZED_IMAGE_HEIGHT` | 30      | Chiều cao chuẩn của ký tự        |
| `KNN neighbors`        | 3       | Số lượng neighbors trong KNN     |
| `MIN_W`                | 10      | Chiều rộng contour tối thiểu     |
| `MIN_H`                | 50      | Chiều cao contour tối thiểu      |
| `MAX_H`                | 180     | Chiều cao contour tối đa         |
| `MIN_ASPECT`           | 0.1     | Tỷ lệ khung hình tối thiểu       |
| `MAX_ASPECT`           | 0.9     | Tỷ lệ khung hình tối đa          |
| `kernel_size`          | 3x3     | Kích thước kernel morphological  |
| `RECTIFIED_SIZE`       | 400x400 | Kích thước ảnh sau khi làm thẳng |

### Phạm vi ký tự hỗ trợ:

-   **Số**: 0-9 (10 ký tự)
-   **Chữ**: A-Z (26 ký tự)
-   **Tổng cộng**: 36 ký tự

---

## Kết luận

Đây là một bài toán **nhận diện ký tự quang học (OCR)** hoàn chỉnh với quy trình 4 giai đoạn rõ ràng:

1. **Chuẩn bị và huấn luyện** mô hình KNN
2. **Làm thẳng ảnh** bằng phép biến đổi phối cảnh
3. **Phân đoạn ký tự** bằng xử lý ảnh và tìm contours
4. **Nhận diện và tổng hợp** kết quả

Thuật toán KNN với k=3 được sử dụng làm bộ phân loại chính, kết hợp với các kỹ thuật xử lý ảnh tiên tiến để tạo ra một hệ thống nhận diện biển số xe hiệu quả và chính xác.
