// button-status
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if(status != "") {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}
// hết button-status

// form search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e);
        const value = e.target.elements.keyword.value;
        if(value != "") {
            url.searchParams.set("keyword", value);
            url.searchParams.set("page", 1);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}
// Hết from search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination.length > 0) {
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

// change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange  = statusCurrent == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();


        });
    });
}
// Hết change Status

// checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked == true) {
            inputsId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// Hết checkbox Multi

// form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");

            if(!isConfirm) {
                return;
            }
        }

        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    });
}
// Hết form-change-multi

// Xóa sản phẩm
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        console.log(button);
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc muốn xóa bản ghi này?");

            if(confirmDelete) {

                const id = button.getAttribute("data-id");
                console.log(id);
                const action = path + `/${id}?_method=DELETE`;

                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        });
    });
}
// Hết Xóa sản phẩm

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

// Upload ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        if(e.target.files.length){
            const image = URL.createObjectURL(e.target.files[0]);

            uploadImagePreview.src = image;
        }
    });
}
// Hết upload ảnh

// Sort
const sort = document.querySelector("[sort]");
    if(sort) {
    let url = new URL(window.location.href);

    const sortSelect =sort.querySelector("[sort-select]");
    const sortClear =sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });

    // Xoa sap xep
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });
    // Het xóa sắp xếp

    // Hien thi mac dinh lua chon

    // Het hien thi mac dinh lua chon
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
}


// Hết Sort