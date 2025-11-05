/* eslint-disable react-refresh/only-export-components */
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const toastSuccess = (title = 'Berhasil') => Toast.fire({ icon: 'success', title });
export const toastError = (title = 'Terjadi kesalahan') => Toast.fire({ icon: 'error', title });
export const toastInfo = (title = '') => Toast.fire({ icon: 'info', title });

export default Toast;
