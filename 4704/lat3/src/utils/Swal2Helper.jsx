/* eslint-disable react-refresh/only-export-components */
import Swal from 'sweetalert2';

export const alert = (title = '', text = '', icon = 'info') =>
  Swal.fire({ title, text, icon, confirmButtonText: 'OK' });

export const confirm = (title = 'Konfirmasi', text = 'Apakah Anda yakin?') =>
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
  }).then((res) => !!res.isConfirmed);

export default Swal;
