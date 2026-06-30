export const pseudoCode: Record<string, string> = {
  mooredijkstra: `void MooreDijkstra(int soDinh, int maTranKe[][1000], int dinhNguon) {
    int khoangCach[soDinh]; // Mảng lưu khoảng cách ngắn nhất từ đỉnh nguồn
    int daXet[soDinh];      // Mảng đánh dấu đỉnh đã được xử lý
    
    // Bước 1: Khởi tạo
    for (int i = 0; i < soDinh; i++) {
        khoangCach[i] = INFINITY; // Đặt khoảng cách ban đầu là vô cực
        daXet[i] = 0;            // Chưa có đỉnh nào được xét
    }
    khoangCach[dinhNguon] = 0; // Khoảng cách từ nguồn đến chính nó là 0
    
    // Bước 2: Vòng lặp chính tìm đường đi
    for (int count = 0; count < soDinh - 1; count++) {
        
        // Hàm tự định nghĩa: Tìm đỉnh chưa xét có khoảng cách nhỏ nhất
        int u = TimDinhNhoNhat(khoangCach, daXet, soDinh);
        daXet[u] = 1; // Đánh dấu đỉnh u đã xử lý
        
        // Bước 3: Cập nhật khoảng cách cho các đỉnh kề của u
        for (int v = 0; v < soDinh; v++) {
            // Nếu v chưa xét, có đường đi từ u đến v, và đi qua u sẽ ngắn hơn
            if (!daXet[v] && maTranKe[u][v] && khoangCach[u] != INFINITY && 
                khoangCach[u] + maTranKe[u][v] < khoangCach[v]) {
                
                khoangCach[v] = khoangCach[u] + maTranKe[u][v];
            }
        }
    }
}`,
  bellmanFord: `
// Cấu trúc định nghĩa một cạnh đồ thị
struct Canh {
    int nguon;
    int dich;
    int trongSo;
};

void BellmanFord(int soDinh, int soCanh, struct Canh danhSachCanh[], int dinhNguon) {
    int khoangCach[soDinh];
    
    // Bước 1: Khởi tạo khoảng cách
    for (int i = 0; i < soDinh; i++) {
        khoangCach[i] = INFINITY; // Đặt tất cả khoảng cách bằng vô cực
    }
    khoangCach[dinhNguon] = 0;
    
    // Bước 2: Nới lỏng tất cả các cạnh (|V| - 1) lần
    for (int i = 1; i <= soDinh - 1; i++) {
        for (int j = 0; j < soCanh; j++) {
            int u = danhSachCanh[j].nguon;
            int v = danhSachCanh[j].dich;
            int trongSo = danhSachCanh[j].trongSo;
            
            // Cập nhật đường đi ngắn hơn nếu có thể
            if (khoangCach[u] != INFINITY && khoangCach[u] + trongSo < khoangCach[v]) {
                khoangCach[v] = khoangCach[u] + trongSo;
            }
        }
    }
    
    // Bước 3: Kiểm tra chu trình âm
    for (int j = 0; j < soCanh; j++) {
        int u = danhSachCanh[j].nguon;
        int v = danhSachCanh[j].dich;
        int trongSo = danhSachCanh[j].trongSo;
        
        // Nếu vẫn còn có thể giảm chi phí, chắc chắn có chu trình âm
        if (khoangCach[u] != INFINITY && khoangCach[u] + trongSo < khoangCach[v]) {
            printf("Phat hien chu trinh am trong do thi!\n");
            return;
        }
    }
}
`
};
