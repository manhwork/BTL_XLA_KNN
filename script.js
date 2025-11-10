console.log("Script.js loading...");

// ========================================
// HỆ THỐNG PHÁT HIỆN VƯỢT ĐÈN ĐỎ - JAVASCRIPT
// ========================================

class TrafficViolationSystem {
    constructor() {
        console.log("🚀 Initializing TrafficViolationSystem...");
        console.log("📊 Generating sample data...");
        this.violations = this.generateSampleData();
        console.log(`✅ Generated ${this.violations.length} violations`);
        this.filteredViolations = [...this.violations];
        this.currentVideoTime = 0;
        this.isVideoPlaying = false;

        console.log("🔧 Starting initialization...");
        this.init();
    }

    // Khởi tạo hệ thống
    init() {
        console.log("Setting up system...");
        try {
            this.setupVideoControls();
        } catch (error) {
            console.error("Error setting up video controls:", error);
        }

        try {
            this.setupSearchAndFilter();
        } catch (error) {
            console.error("Error setting up search and filter:", error);
        }

        try {
            this.setupModal();
        } catch (error) {
            console.error("Error setting up modal:", error);
        }

        try {
            this.updateCurrentTime();
        } catch (error) {
            console.error("Error updating time:", error);
        }

        // Đảm bảo renderViolations luôn được gọi
        try {
            this.renderViolations();
        } catch (error) {
            console.error("Error rendering violations:", error);
        }

        console.log("System initialized successfully!");
        console.log("Violations data:", this.violations);

        // Cập nhật thời gian mỗi giây
        setInterval(() => {
            try {
                this.updateCurrentTime();
            } catch (error) {
                console.error("Error updating time:", error);
            }
        }, 1000);
    }

    // Tạo dữ liệu mẫu cho demo
    generateSampleData() {
        return [
            {
                id: 1,
                licensePlate: "30A-12345",
                time: "2024-11-10T14:30:15",
                location: "Ngã tư Nguyễn Huệ - Lê Lợi",
                speed: "45 km/h",
                fine: "800,000 VND",
                vehicle: {
                    brand: "Toyota",
                    color: "Trắng",
                    type: "Ô tô con",
                    year: "2020",
                },
                owner: {
                    name: "Nguyễn Văn An",
                    dob: "15/03/1985",
                    address: "123 Đường ABC, Quận 1, TP.HCM",
                    photo: this.generateAvatarSVG("NVA"),
                },
                image: this.generateViolationImage("30A-12345"),
                status: "Chưa xử lý",
            },
            {
                id: 2,
                licensePlate: "59B-98765",
                time: "2024-11-10T14:25:32",
                location: "Đường Pasteur, Quận 3",
                speed: "52 km/h",
                fine: "1,200,000 VND",
                vehicle: {
                    brand: "Honda",
                    color: "Đen",
                    type: "Xe máy",
                    year: "2019",
                },
                owner: {
                    name: "Trần Thị Bình",
                    dob: "22/07/1990",
                    address: "456 Đường XYZ, Quận 3, TP.HCM",
                    photo: this.generateAvatarSVG("TTB"),
                },
                image: this.generateViolationImage("59B-98765"),
                status: "Đã xử lý",
            },
            {
                id: 3,
                licensePlate: "43C-54321",
                time: "2024-11-10T14:20:10",
                location: "Cầu Thủ Thiêm, Quận 2",
                speed: "38 km/h",
                fine: "600,000 VND",
                vehicle: {
                    brand: "Ford",
                    color: "Xanh",
                    type: "Ô tô tải",
                    year: "2018",
                },
                owner: {
                    name: "Lê Văn Cường",
                    dob: "10/12/1975",
                    address: "789 Đường DEF, Quận 2, TP.HCM",
                    photo: this.generateAvatarSVG("LVC"),
                },
                image: this.generateViolationImage("43C-54321"),
                status: "Chờ xác nhận",
            },
            {
                id: 4,
                licensePlate: "51D-11111",
                time: "2024-11-10T13:45:22",
                location: "Bến Bạch Đằng, Quận 1",
                speed: "41 km/h",
                fine: "700,000 VND",
                vehicle: {
                    brand: "Mazda",
                    color: "Đỏ",
                    type: "Ô tô con",
                    year: "2021",
                },
                owner: {
                    name: "Phạm Thị Dung",
                    dob: "05/06/1988",
                    address: "321 Đường GHI, Quận 1, TP.HCM",
                    photo: this.generateAvatarSVG("PTD"),
                },
                image: this.generateViolationImage("51D-11111"),
                status: "Chưa xử lý",
            },
            {
                id: 5,
                licensePlate: "65E-22222",
                time: "2024-11-10T13:30:45",
                location: "Đường Sư Vạn Hạnh, Quận 10",
                speed: "48 km/h",
                fine: "900,000 VND",
                vehicle: {
                    brand: "Hyundai",
                    color: "Bạc",
                    type: "Ô tô con",
                    year: "2020",
                },
                owner: {
                    name: "Hoàng Văn Em",
                    dob: "18/09/1982",
                    address: "654 Đường JKL, Quận 10, TP.HCM",
                    photo: this.generateAvatarSVG("HVE"),
                },
                image: this.generateViolationImage("65E-22222"),
                status: "Đã xử lý",
            },
        ];
    }

    // Tạo SVG avatar cho chủ sở hữu
    generateAvatarSVG(initials) {
        const colors = [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
            "#DDA0DD",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const svgString = `<svg width="200" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="250" fill="${color}" rx="8"/>
                <text x="100" y="140" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="48" 
                      font-weight="bold" 
                      fill="white">${initials}</text>
            </svg>`;

        // Encode Unicode đúng cách
        return `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgString))
        )}`;
    }

    // Tạo ảnh vi phạm mẫu
    generateViolationImage(licensePlate) {
        const svgString = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#f0f0f0" rx="8"/>
                <rect x="50" y="50" width="300" height="150" fill="#333" rx="4"/>
                <text x="200" y="110" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="32" 
                      font-weight="bold" 
                      fill="white">${licensePlate}</text>
                <text x="200" y="240" text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="16" 
                      fill="#666">Vượt đèn đỏ</text>
            </svg>`;

        // Encode Unicode đúng cách
        return `data:image/svg+xml;base64,${btoa(
            unescape(encodeURIComponent(svgString))
        )}`;
    }

    // Thiết lập điều khiển video
    setupVideoControls() {
        const video = document.getElementById("surveillance-video");
        const playPauseBtn = document.getElementById("play-pause-btn");
        const playPauseIcon = document.getElementById("play-pause-icon");
        const mainPlayPause = document.getElementById("main-play-pause");
        const mainPlayIcon = document.getElementById("main-play-icon");
        const progressBar = document.getElementById("progress-bar");
        const videoTime = document.getElementById("video-time");
        const videoOverlay = document.getElementById("video-overlay");

        // Tạo video demo (có thể thay thế bằng video thật)
        this.createDemoVideo();

        // Nút play/pause chính
        const togglePlayPause = () => {
            if (this.isVideoPlaying) {
                video.pause();
                playPauseIcon.className = "fas fa-play text-2xl";
                mainPlayIcon.className = "fas fa-play text-lg";
                this.isVideoPlaying = false;
            } else {
                video.play();
                playPauseIcon.className = "fas fa-pause text-2xl";
                mainPlayIcon.className = "fas fa-pause text-lg";
                this.isVideoPlaying = true;
            }
        };

        // Sự kiện click
        playPauseBtn.addEventListener("click", togglePlayPause);
        mainPlayPause.addEventListener("click", togglePlayPause);
        videoOverlay.addEventListener("click", togglePlayPause);

        // Video events
        video.addEventListener("timeupdate", () => {
            this.currentVideoTime = video.currentTime;
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = progress + "%";

            // Cập nhật thời gian hiển thị
            const current = this.formatTime(video.currentTime);
            const duration = this.formatTime(video.duration);
            videoTime.textContent = `${current} / ${duration}`;
        });

        video.addEventListener("play", () => {
            this.isVideoPlaying = true;
            playPauseIcon.className = "fas fa-pause text-2xl";
            mainPlayIcon.className = "fas fa-pause text-lg";
        });

        video.addEventListener("pause", () => {
            this.isVideoPlaying = false;
            playPauseIcon.className = "fas fa-play text-2xl";
            mainPlayIcon.className = "fas fa-play text-lg";
        });
    }

    // Tạo video demo
    createDemoVideo() {
        const video = document.getElementById("surveillance-video");
        // Tạo canvas animation cho demo
        this.createCanvasAnimation();
    }

    // Tạo animation canvas thay thế video
    createCanvasAnimation() {
        try {
            const container = document.querySelector(".video-container");
            if (!container) {
                console.warn(
                    "Video container not found, skipping canvas animation"
                );
                return;
            }

            const video = document.getElementById("surveillance-video");
            if (!video) {
                console.warn(
                    "Video element not found, skipping canvas animation"
                );
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = 800;
            canvas.height = 600;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.objectFit = "cover";

            // Thay thế video bằng canvas để demo
            video.parentNode.replaceChild(canvas, video);

            this.startCanvasAnimation(canvas);
        } catch (error) {
            console.error("Error creating canvas animation:", error);
        }
    }

    // Animation canvas
    startCanvasAnimation(canvas) {
        const ctx = canvas.getContext("2d");
        let frame = 0;

        const animate = () => {
            frame++;

            // Xóa canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Tạo hiệu ứng giao thông demo
            this.drawTrafficScene(ctx, frame, canvas.width, canvas.height);

            // Vẽ thời gian và thông tin
            this.drawVideoInfo(ctx, frame, canvas.width, canvas.height);

            requestAnimationFrame(animate);
        };

        animate();
    }

    // Vẽ cảnh giao thông demo
    drawTrafficScene(ctx, frame, width, height) {
        // Nền đường
        ctx.fillStyle = "#2C3E50";
        ctx.fillRect(0, height * 0.7, width, height * 0.3);

        // Vạch kẻ đường
        ctx.strokeStyle = "#F39C12";
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(0, height * 0.85);
        ctx.lineTo(width, height * 0.85);
        ctx.stroke();
        ctx.setLineDash([]);

        // Xe di chuyển
        const carX = ((frame * 2) % (width + 200)) - 100;
        const carY = height * 0.75;

        // Xe 1
        ctx.fillStyle = "#E74C3C";
        ctx.fillRect(carX, carY, 60, 30);
        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(carX + 5, carY + 5, 50, 20);

        // Xe 2
        const car2X = ((frame * 1.5) % (width + 300)) - 150;
        ctx.fillStyle = "#3498DB";
        ctx.fillRect(car2X, carY + 40, 50, 25);
        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(car2X + 3, carY + 43, 44, 19);

        // Đèn giao thông
        ctx.fillStyle = "#34495E";
        ctx.fillRect(width - 60, height * 0.2, 20, 80);

        // Đèn đỏ
        ctx.fillStyle = frame % 120 < 60 ? "#E74C3C" : "#7F8C8D";
        ctx.beginPath();
        ctx.arc(width - 50, height * 0.25, 10, 0, 2 * Math.PI);
        ctx.fill();

        // Đèn xanh
        ctx.fillStyle = frame % 120 >= 60 ? "#27AE60" : "#7F8C8D";
        ctx.beginPath();
        ctx.arc(width - 50, height * 0.35, 10, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Vẽ thông tin video
    drawVideoInfo(ctx, frame, width, height) {
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.fillText("CAM 001 - Ngã tư Nguyễn Huệ", 20, 40);

        const time = this.formatTime(frame / 30);
        ctx.textAlign = "right";
        ctx.fillText(time, width - 20, 40);

        // Trạng thái
        ctx.textAlign = "center";
        ctx.fillStyle = frame % 120 < 60 ? "#E74C3C" : "#27AE60";
        ctx.font = "18px Arial";
        ctx.fillText(
            frame % 120 < 60 ? "ĐÈN ĐỎ" : "ĐÈN XANH",
            width / 2,
            height - 30
        );
    }

    // Thiết lập tìm kiếm và lọc
    setupSearchAndFilter() {
        const searchInput = document.getElementById("search-input");
        const timeFilter = document.getElementById("time-filter");

        searchInput.addEventListener("input", () => this.filterViolations());
        timeFilter.addEventListener("change", () => this.filterViolations());
    }

    // Lọc danh sách vi phạm
    filterViolations() {
        const searchTerm = document
            .getElementById("search-input")
            .value.toLowerCase();
        const timeFilter = document.getElementById("time-filter").value;

        this.filteredViolations = this.violations.filter((violation) => {
            // Lọc theo biển số
            const matchesSearch = violation.licensePlate
                .toLowerCase()
                .includes(searchTerm);

            // Lọc theo thời gian
            let matchesTime = true;
            const violationDate = new Date(violation.time);
            const now = new Date();

            switch (timeFilter) {
                case "today":
                    matchesTime =
                        violationDate.toDateString() === now.toDateString();
                    break;
                case "week":
                    const weekAgo = new Date(
                        now.getTime() - 7 * 24 * 60 * 60 * 1000
                    );
                    matchesTime = violationDate >= weekAgo;
                    break;
                case "month":
                    const monthAgo = new Date(
                        now.getTime() - 30 * 24 * 60 * 60 * 1000
                    );
                    matchesTime = violationDate >= monthAgo;
                    break;
            }

            return matchesSearch && matchesTime;
        });

        this.renderViolations();
    }

    // Hiển thị danh sách vi phạm
    renderViolations() {
        console.log("=== renderViolations START ===");
        console.log("Total violations:", this.violations.length);
        console.log("Filtered violations:", this.filteredViolations.length);

        const container = document.getElementById("violations-list");
        console.log("Container element:", container);

        if (!container) {
            console.error(
                "❌ Violations list container not found! ID: violations-list"
            );
            // Thử tìm lại sau một chút
            setTimeout(() => {
                const retryContainer =
                    document.getElementById("violations-list");
                if (retryContainer) {
                    console.log(
                        "✅ Container found on retry, rendering now..."
                    );
                    this.renderViolations();
                } else {
                    console.error("❌ Container still not found after retry");
                }
            }, 100);
            return;
        }

        console.log("✅ Container found, clearing content...");
        container.innerHTML = "";

        if (this.filteredViolations.length === 0) {
            console.log("⚠️ No violations to display");
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p>Không tìm thấy vi phạm nào</p>
                </div>
            `;
            return;
        }

        console.log(
            `✅ Creating ${this.filteredViolations.length} violation cards...`
        );
        this.filteredViolations.forEach((violation, index) => {
            try {
                console.log(
                    `Creating card ${index + 1}/${
                        this.filteredViolations.length
                    }: ${violation.licensePlate}`
                );
                const violationCard = this.createViolationCard(violation);
                container.appendChild(violationCard);
                console.log(`✅ Card ${index + 1} added successfully`);
            } catch (error) {
                console.error(
                    `❌ Error creating card for ${violation.licensePlate}:`,
                    error
                );
            }
        });
        console.log("=== renderViolations END ===");
        console.log(
            `✅ Successfully rendered ${container.children.length} cards`
        );
    }

    // Tạo card vi phạm
    createViolationCard(violation) {
        const card = document.createElement("div");
        card.className =
            "violation-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer";
        card.setAttribute("data-violation-id", violation.id);

        const time = new Date(violation.time);
        const timeStr = time.toLocaleString("vi-VN");

        const statusColors = {
            "Chưa xử lý": "bg-yellow-100 text-yellow-800",
            "Đã xử lý": "bg-green-100 text-green-800",
            "Chờ xác nhận": "bg-blue-100 text-blue-800",
        };

        const statusColor =
            statusColors[violation.status] || "bg-gray-100 text-gray-800";

        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div>
                    <h3 class="font-semibold text-lg text-gray-900">${violation.licensePlate}</h3>
                    <p class="text-sm text-gray-600">${violation.location}</p>
                </div>
                <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColor}">
                    ${violation.status}
                </span>
            </div>
            
            <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-clock w-4 mr-2"></i>
                    <span>${timeStr}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-tachometer-alt w-4 mr-2"></i>
                    <span>${violation.speed}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600">
                    <i class="fas fa-money-bill-wave w-4 mr-2"></i>
                    <span class="font-medium text-red-600">${violation.fine}</span>
                </div>
            </div>
            
            <div class="flex space-x-2">
                <button class="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors view-details-btn" 
                        data-violation-id="${violation.id}">
                    <i class="fas fa-eye mr-1"></i>
                    Xem chi tiết
                </button>
            </div>
        `;

        // Thêm sự kiện click cho toàn bộ card
        card.addEventListener("click", (e) => {
            // Ngăn chặn sự kiện bubble nếu click vào nút
            if (!e.target.closest(".view-details-btn")) {
                this.showViolationDetails(violation);
            }
        });

        // Thêm sự kiện click cho nút xem chi tiết
        const detailsBtn = card.querySelector(".view-details-btn");
        detailsBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện bubble
            this.showViolationDetails(violation);
        });

        return card;
    }

    // Thiết lập modal
    setupModal() {
        const modal = document.getElementById("detail-modal");
        const closeBtn = document.getElementById("close-modal");

        // Đóng modal khi click nút đóng
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
        });

        // Đóng modal khi click outside
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        });

        // Đóng modal khi nhấn phím ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) {
                modal.classList.remove("show");
            }
        });
    }

    // Hiển thị chi tiết vi phạm
    showViolationDetails(violation) {
        const modal = document.getElementById("detail-modal");

        // Cập nhật thông tin trong modal
        document.getElementById(
            "modal-license-plate"
        ).textContent = `Biển số: ${violation.licensePlate}`;
        document.getElementById("violation-image").src = violation.image;
        document.getElementById("violation-time").textContent = new Date(
            violation.time
        ).toLocaleString("vi-VN");
        document.getElementById("violation-location").textContent =
            violation.location;
        document.getElementById("violation-speed").textContent =
            violation.speed;
        document.getElementById("violation-fine").textContent = violation.fine;

        // Thông tin phương tiện
        document.getElementById("vehicle-brand").textContent =
            violation.vehicle.brand;
        document.getElementById("vehicle-color").textContent =
            violation.vehicle.color;
        document.getElementById("vehicle-type").textContent =
            violation.vehicle.type;
        document.getElementById("vehicle-year").textContent =
            violation.vehicle.year;

        // Thông tin chủ sở hữu
        document.getElementById("owner-name").textContent =
            violation.owner.name;
        document.getElementById("owner-dob").textContent = violation.owner.dob;
        document.getElementById("owner-address").textContent =
            violation.owner.address;
        document.getElementById("owner-photo").src = violation.owner.photo;

        // Hiển thị modal
        modal.classList.add("show");
    }

    // Cập nhật thời gian hiện tại
    updateCurrentTime() {
        const now = new Date();
        const timeElement = document.getElementById("current-time");
        const dateElement = document.getElementById("current-date");

        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString("vi-VN");
        }

        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    }

    // Định dạng thời gian
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
}

// Khởi tạo hệ thống khi trang được tải
let systemInitialized = false;

function initializeSystem() {
    if (systemInitialized) {
        console.log("System already initialized, skipping...");
        return;
    }

    systemInitialized = true;
    console.log("Starting system initialization");

    try {
        new TrafficViolationSystem();
    } catch (error) {
        console.error("Error initializing TrafficViolationSystem:", error);
        // Vẫn cố gắng hiển thị danh sách vi phạm ngay cả khi có lỗi
        const container = document.getElementById("violations-list");
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-500">
                    <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                    <p>Có lỗi xảy ra khi tải hệ thống. Vui lòng kiểm tra console.</p>
                    <p class="text-sm mt-2">${error.message}</p>
                </div>
            `;
        }
    }
}

// Khởi tạo khi DOM ready
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
    initializeSystem();
});

// Fallback: initialize immediately if DOM is already loaded
if (document.readyState !== "loading") {
    console.log("Document is already loaded, initializing immediately");
    initializeSystem();
}
