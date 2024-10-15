// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// Hết Show Alert

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}
//  Hết Pagination

// form checkout order
const phoneInputField = document.getElementById('phone');
if(phoneInputField){
    // Bắt sự kiện khi người dùng rời khỏi ô input số điện thoại (hoặc khi nhập)
    phoneInputField.addEventListener('blur', function () {
        const phoneInput = this.value.replace(/\s+/g, ''); // Xoá khoảng trắng
        const phonePattern = /^\d{10,11}$/;
        if (!phonePattern.test(phoneInput)) {
            alert('Số điện thoại không hợp lệ. Vui lòng nhập lại (10 hoặc 11 chữ số).');
        }
    });
}
// End form checkout order

/// đăng ký annimation
document.querySelector('.user')?.classList.add('active'); // Thêm lớp active
