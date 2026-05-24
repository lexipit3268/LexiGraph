# LexiGraph

> A modern, interactive desktop application for visualizing graph theory and algorithms.

LexiGraph is a comprehensive tool designed to help developers, students, and educators intuitively understand graph algorithms. Built with a robust web stack and packaged as a desktop application, it provides a seamless experience for drawing graphs, customizing visual themes, and observing algorithmic processes step-by-step.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)
- [Author](#author)

## Features

- **Interactive Visualization:** Renders complex graphs efficiently with smooth animations.
- **Algorithm Execution:** Supports step-by-step execution of core graph algorithms (e.g., BFS, DFS, Dijkstra) with distinct state highlighting (Processing, Visited, Path).
- **Smart Input Editor:** Features a built-in code editor with syntax highlighting for quick text-to-graph data entry.
- **Dynamic Theming:** Includes multiple professional color themes (Default, Sunset, Monochrome, Nordic) tailored for long reading sessions and high contrast.
- **Flexible Configurations:** Easily toggle between directed and undirected graphs, adjust layout constraints, and manage edge weights.

## Tech Stack

- **Core Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Desktop Environment:** Electron
- **Graph Engine:** Cytoscape.js
- **Styling & UI:** Tailwind CSS, Element Plus
- **Language:** TypeScript

## Project Structure

```text
LexiGraph/
├── src/
│   ├── assets/       # Static assets (fonts, images)
│   ├── components/   # Reusable UI components (GraphView, TitleBar)
│   ├── core/         # Core graph logic and theme configurations
│   ├── layouts/      # Application wrapper layouts
│   ├── pages/        # Main application views
│   ├── routers/      # Vue Router configurations
│   └── utils/        # Global utilities and configurations
├── public/           # Unprocessed static files
└── electron-builder.json5 # Electron packaging configuration

```

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js (v18 or higher recommended)
- pnpm (Package manager)

### Installation

1. Clone the repository to your local machine.
2. Navigate into the project directory.
3. Install the required dependencies:

```bash
pnpm install

```

4. Start the development server with Hot-Module Replacement (HMR):

```bash
pnpm dev

```

### Building for Production

To package the application into a standalone executable file:

```bash
pnpm build

```

## Usage

1. Launch the application.
2. Use the **Right Panel** to input your graph data in the provided editor (format: `source target weight`).
3. Select the graph type (Directed/Undirected) and your preferred visual theme.
4. Click **"Vẽ Đồ Thị"** to render the graph on the main canvas.
5. Select an algorithm and control the execution speed using the toolbar.

## License

This project is licensed under the MIT License.

## Author

**Nguyen Phuoc Loc**

---

# LexiGraph (Vietnamese)

> Ứng dụng desktop hiện đại hỗ trợ trực quan hóa lý thuyết đồ thị và thuật toán tìm đường đi ngắn nhất.

LexiGraph là một công cụ toàn diện được thiết kế nhằm giúp các nhà phát triển, sinh viên và giảng viên tiếp cận các thuật toán đồ thị một cách trực quan nhất. Được xây dựng trên nền tảng web hiện đại và đóng gói dưới dạng ứng dụng desktop, LexiGraph mang đến trải nghiệm mượt mà trong việc vẽ đồ thị, tùy chỉnh giao diện và quan sát từng bước chạy của thuật toán.

## Mục lục

- [Tính năng chính](#t%C3%ADnh-n%C4%83ng-ch%C3%ADnh)
- [Công nghệ sử dụng](#c%C3%B4ng-ngh%E1%BB%87-s%E1%BB%AD-d%E1%BB%A5ng)
- [Cấu trúc dự án](#c%E1%BA%A5u-tr%C3%BAc-d%E1%BB%B1-%C3%A1n)
- [Hướng dẫn cài đặt](#h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-c%C3%A0i-%C4%91%E1%BA%B7t)
- [Hướng dẫn sử dụng](#h%C6%B0%E1%BB%9Bng-d%E1%BA%ABn-s%E1%BB%AD-d%E1%BB%A5ng)
- [Bản quyền](#b%E1%BA%A3n-quy%E1%BB%81n)
- [Tác giả](#t%C3%A1c-gi%E1%BA%A3)

## Tính năng chính

- **Trực quan hóa tương tác:** Hiển thị các đồ thị phức tạp với hiệu ứng chuyển động mượt mà.
- **Thực thi thuật toán:** Hỗ trợ chạy từng bước các thuật toán cốt lõi (BFS, DFS, Dijkstra...) với hệ thống làm nổi bật trạng thái (Đang xét, Đã duyệt, Đường đi ngắn nhất).
- **Trình soạn thảo thông minh:** Tích hợp trình soạn thảo mã nguồn để nhập dữ liệu đồ thị nhanh chóng và chính xác.
- **Giao diện tùy biến (Theming):** Cung cấp nhiều bộ màu chuyên nghiệp (Default, Sunset, Monochrome, Nordic) được thiết kế tối ưu cho độ tương phản và bảo vệ mắt.
- **Cấu hình linh hoạt:** Dễ dàng chuyển đổi giữa đồ thị có hướng và vô hướng, tùy chỉnh trọng số và thay đổi bố cục.

## Công nghệ sử dụng

- **Framework chính:** Vue 3 (Composition API)
- **Công cụ Build:** Vite
- **Môi trường Desktop:** Electron
- **Lõi đồ thị:** Cytoscape.js
- **Giao diện (UI/UX):** Tailwind CSS, Element Plus
- **Ngôn ngữ lập trình:** TypeScript

## Cấu trúc dự án

```text
LexiGraph/
├── src/
│   ├── assets/       # Tài nguyên tĩnh (fonts, hình ảnh)
│   ├── components/   # Các thành phần giao diện tái sử dụng (GraphView, TitleBar)
│   ├── core/         # Lõi logic đồ thị và cấu hình giao diện (Themes)
│   ├── layouts/      # Bố cục bao bọc toàn ứng dụng
│   ├── pages/        # Các trang nội dung chính
│   ├── routers/      # Cấu hình Vue Router điều hướng
│   └── utils/        # Các tiện ích và thiết lập toàn cục
├── public/           # Các tệp tĩnh không qua xử lý
└── electron-builder.json5 # Cấu hình đóng gói Electron

```

## Hướng dẫn cài đặt

### Yêu cầu hệ thống

Đảm bảo máy tính của bạn đã cài đặt sẵn các phần mềm sau:

- Node.js (Khuyên dùng phiên bản v18 trở lên)
- pnpm (Trình quản lý gói)

### Các bước cài đặt

1. Tải mã nguồn (Clone) về máy tính cá nhân.
2. Mở terminal tại thư mục dự án.
3. Cài đặt các thư viện phụ thuộc:

```bash
pnpm install

```

4. Khởi động máy chủ phát triển (Hỗ trợ HMR):

```bash
pnpm dev

```

### Đóng gói ứng dụng

Để xuất dự án thành file chạy độc lập (Executable file) cho hệ điều hành:

```bash
pnpm build

```

## Hướng dẫn sử dụng

1. Mở ứng dụng LexiGraph.
2. Tại **Bảng điều khiển bên phải**, nhập dữ liệu các cạnh của đồ thị vào trình soạn thảo (Cú pháp: `đỉnh_nguồn đỉnh_đích trọng_số`).
3. Lựa chọn loại đồ thị (Có hướng/Vô hướng) và chủ đề màu sắc mong muốn.
4. Nhấn nút **"Vẽ Đồ Thị"** để hiển thị kết quả lên màn hình trung tâm.
5. Chọn thuật toán và sử dụng thanh công cụ để điều khiển tốc độ thực thi.

## Bản quyền

Dự án được phân phối dưới Giấy phép MIT.

## Tác giả

**Nguyễn Phước Lộc**
