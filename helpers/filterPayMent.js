module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đã thanh toán",
            status: "active",
            class: ""
        },
        {
            name: "Chưa thanh toán",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status){
        const index = filterStatus.findIndex((item) => {
            return item.status == query.status;
        });

        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex((item) => {
            return item.status == "";
        });
        filterStatus[index].class = "active";
    }
    return filterStatus;
}