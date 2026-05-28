import { ElMessage } from 'element-plus';
import {
  GlobalException,
  GraphExportException,
  GraphInputException
} from '../core/exceptions/GlobalException';

export const handleError = (error: unknown) => {
  if (error instanceof GraphInputException) {
    ElMessage.warning(`Lỗi dữ liệu: ${error.message}`);
  } else if (error instanceof GraphExportException) {
    ElMessage.error(`Lỗi xuất file: ${error.message}`);
  } else if (error instanceof GlobalException) {
    ElMessage.error(`${error.message}`);
  } else if (error instanceof Error) {
    ElMessage.error('Đã có lỗi hệ thống xảy ra. Vui lòng thử lại!');
    console.error(error);
  } else {
    console.error('Lỗi không xác định:', error);
  }
};
