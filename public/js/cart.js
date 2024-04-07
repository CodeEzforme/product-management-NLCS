/* Cập nhật số lượng sản phẩm trong giỏ hàng */
const inputQuantities = document.querySelectorAll('[name="quantity"]');
if (inputQuantities) {
  inputQuantities.forEach(input => {
    input.addEventListener("change", (e) => {
      const productId = e.target.getAttribute('product-id');
      const quantity = parseInt(e.target.value);

      if (quantity > 0) {
        window.location.href=`/cart/update/${productId}/${quantity}`
      }
    })
  })
}
/* Hết Cập nhật số lượng sản phẩm trong giỏ hàng */