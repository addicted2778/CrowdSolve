import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export const successMessage = (msg) => {
  Toast.fire({
    icon: "success",
    title: msg,
   
  });
};

export const errorMessage = (msg) => {
  Toast.fire({
    icon: "error",
    title: msg,
    
  });
};
