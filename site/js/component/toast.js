export function Toast(status, message) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        // "onCloseClick": function() { console.log('close button clicked'); },
        "showDuration": "300",
        "hideDuration": "10",
        "timeOut": "2000",
        "extendedTimeOut": "500",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "rtl": false
    }
    
    switch (status) {
      case "error":
        return toastr.error(message, status.toUpperCase());
      
      case "success":
        return toastr.success(message, "SUKSES");
    
      case "warning":
        return toastr.warning(message, "PERHATIAN");

      default:
        return toastr.info(message, status.toUpperCase());
    }
}