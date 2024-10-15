const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const moment = require("moment");

// Hỗ trợ route [GET] /admin/statistics
module.exports.index = async (req, res) => {
    const Orders = await Order.find();
    const Products = await Product.find();

    // initialize revenueData
    const revenueData = Array(12).fill(0);
    let currentMonthRevenue = 0;
    let currentYearRevenue = 0;

    // initialize labels revenueDataByProduct
    const productLabels = [
        "chả lụa có tiêu",
        "chả lụa không tiêu",
        "chả gân có tiêu",
        "chả gân không tiêu",
        "Nem chua",
        "Patê",
        "Khác"
    ];

    // initialize revenueDataByProduct
    const revenueDataByProduct = Array(productLabels.length).fill(0);



    const currentMonth = moment().month(); // Tháng hiện tại (0-11)
    const currentYear = moment().year();
    Orders.forEach(order => {
        if (order.createdAt) {
            const orderMonth = moment(order.createdAt).month();
            const orderYear = moment(order.createdAt).year();

            // Tính tổng doanh thu cho đơn hàng
            const totalAmount = Math.ceil(order.products.reduce((total, product) => {
                const priceAfterDiscount = product.price * (1 - product.discountPercentage / 100);
                return total + (priceAfterDiscount * product.quantity);
            }, 0));

            // Nếu đơn hàng thuộc năm hiện tại, thì cộng doanh thu vào tháng tương ứng
            if (orderYear === currentYear) {
                revenueData[orderMonth] += totalAmount;

                // Nếu đơn hàng thuộc tháng hiện tại, thì cộng vào doanh thu tháng hiện tại
                if (orderMonth === currentMonth) {
                    currentMonthRevenue += totalAmount;
                }

                // Cộng doanh thu vào tổng doanh thu của năm hiện tại
                currentYearRevenue += totalAmount;
            }
        }
    });

    // console.log("Doanh thu theo tháng của năm hiện tại:", revenueData);
    // console.log("Doanh thu tháng hiện tại:", currentMonthRevenue);
    // console.log("Doanh thu năm hiện tại:", currentYearRevenue);


    // Duyệt qua từng đơn hàng
    let totalRevenue = 0; // Tổng doanh thu tất cả sản phẩm
    Orders.forEach(order => {
        order.products.forEach(product => {
            // Tìm sản phẩm trong danh sách Products
            const productInfo = Products.find(p => p._id.toString() === product.product_id.toString());

            if (productInfo) {
                // Tính tổng tiền sau khi áp dụng giảm giá
                const priceAfterDiscount = product.price * (1 - product.discountPercentage / 100);
                const totalAmount = priceAfterDiscount * product.quantity;

                // Cộng vào tổng doanh thu
                totalRevenue += totalAmount;

                // Phân loại doanh thu cho sản phẩm dựa trên title chứa từ khóa
                if (productInfo.title.toLowerCase().includes("chả lụa có tiêu")) {
                    revenueDataByProduct[0] += totalAmount;
                } else if (productInfo.title.toLowerCase().includes("chả lụa không tiêu")) {
                    revenueDataByProduct[1] += totalAmount;
                } else if (productInfo.title.toLowerCase().includes("chả gân có tiêu")) {
                    revenueDataByProduct[2] += totalAmount;
                } else if (productInfo.title.toLowerCase().includes("chả gân không tiêu")) {
                    revenueDataByProduct[3] += totalAmount;
                } else if (productInfo.title.toLowerCase().includes("nem chua")) {
                    revenueDataByProduct[4] += totalAmount;
                } else if (productInfo.title.toLowerCase().includes("patê")) {
                    revenueDataByProduct[5] += totalAmount;
                } else {
                    // Nếu sản phẩm không thuộc các loại trên, tính vào "Khác"
                    revenueDataByProduct[6] += totalAmount;
                }
            }
        });
    });

    // Tính phần trăm doanh thu cho từng loại sản phẩm
    const percentageDataByProduct = revenueDataByProduct.map(amount => {
        return totalRevenue > 0 ? +((amount / totalRevenue) * 100).toFixed(2) : 0;
    });

    res.render("admin/pages/statistics/index", {
        pageTitle: "Thông kê doanh thu",
        revenueData: revenueData,
        currentMonthRevenue: currentMonthRevenue,
        currentYearRevenue: currentYearRevenue,
        revenueDataByProduct: percentageDataByProduct,
    });
};