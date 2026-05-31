export type StepAction =
  | 'INIT'
  | 'VISIT' // lấy một đỉnh ra khỏi tập chưa xét
  | 'CHECK' // đang kiểm tra 1 cung
  | 'RELAX' // cập nhật thành công khoảng cách mới PI
  | 'COMPLETE'; // Xong thuật toán
