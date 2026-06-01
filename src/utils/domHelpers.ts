/**
 * Cuộn một thẻ HTML đến vị trí chỉ định (Trục Y)
 * @param element Thẻ HTML cần cuộn
 * @param position Vị trí Top (px) cần cuộn tới. Nếu bỏ trống sẽ tự cuộn xuống đáy.
 * @param smooth Bật hiệu ứng cuộn mượt (mặc định: true)
 */
export const scrollToPosition = (
  element: HTMLElement | null,
  position?: number,
  smooth: boolean = true
) => {
  if (!element) return;

  element.scrollTo({
    top: position ?? element.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto'
  });
};
