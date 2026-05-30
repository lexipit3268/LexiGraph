export type StepAction =
  | 'INIT' // Khởi tạo ban đầu
  | 'VISIT' // Lấy một đỉnh ra khỏi tập chưa xét
  | 'CHECK' // Đang nhìn thử vào một cung (chưa làm gì cả)
  | 'RELAX' // Cập nhật thành công khoảng cách mới
  | 'COMPLETE'; // Xong thuật toán
