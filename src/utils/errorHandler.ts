import { ElMessage, ElMessageBox } from 'element-plus';
import {
  GlobalException,
  GraphActionException,
  GraphExportException,
  GraphInputException
} from '../core/exceptions/GlobalException';

export const handleError = (error: unknown) => {
  if (error instanceof GraphInputException) {
    ElMessageBox({
      type: 'error',
      title: 'Lỗi dữ liệu',
      message: `${error.message}`
    });
  } else if (error instanceof GraphExportException) {
    ElMessage.error({
      message: `Lỗi xuất file: ${error.message}`,
      grouping: true
    });
  } else if (error instanceof GraphActionException) {
    ElMessage.error({
      message: `Lỗi thao tác: ${error.message}`,
      grouping: true
    });
  } else if (error instanceof GlobalException) {
    ElMessage.error(`${error.message}`);
  } else if (error instanceof Error) {
    ElMessage.error('Đã có lỗi hệ thống xảy ra. Vui lòng thử lại!');
    console.error(error);
  } else {
    console.error('Lỗi không xác định:', error);
  }
};
