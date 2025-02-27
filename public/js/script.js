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


// box-chat
// document.addEventListener('DOMContentLoaded', () => { 
//     const wrapper = document.querySelector('.chatbox-wrapper'); // Wrapper định danh
//     const chatBubble = wrapper.querySelector('#chatbot-bubble'); 
//     const chatBox = wrapper.querySelector('#chatbot-box');       
//     const chatClose = wrapper.querySelector('#chatbot-close');   
//     const sendBtn = wrapper.querySelector('#send-btn');
//     const chatInput = wrapper.querySelector('#chat-input');
//     const chatBody = wrapper.querySelector('.chat-body');

//     // Mở Chatbox khi nhấn nút tròn nhỏ
//     chatBubble.addEventListener('click', () => {
//         chatBox.classList.remove('hidden');
//         chatBubble.classList.add('hidden');
//     });

//     // Đóng Chatbox và hiện lại nút tròn nhỏ
//     chatClose.addEventListener('click', () => {
//         chatBox.classList.add('hidden');
//         chatBubble.classList.remove('hidden');
//     });

//     // Gửi tin nhắn
//     sendBtn.addEventListener('click', sendMessage);
//     chatInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') sendMessage();
//     });

//     function sendMessage() {
//         const msg = chatInput.value.trim();
//         if (msg === '') return;

//         // Tin nhắn người dùng
//         const userMsg = document.createElement('div');
//         userMsg.className = 'message user';
//         userMsg.textContent = msg;
//         chatBody.appendChild(userMsg);

//         chatInput.value = '';

//         // Bot trả lời tự động
//         setTimeout(() => {
//             const botMsg = document.createElement('div');
//             botMsg.className = 'message bot';
//             botMsg.textContent = '🤖 This is a bot reply!';
//             chatBody.appendChild(botMsg);
//             chatBody.scrollTop = chatBody.scrollHeight;
//         }, 500);

//         chatBody.scrollTop = chatBody.scrollHeight;
//     }
// });

// // end box-chat
// document.addEventListener('DOMContentLoaded', () => {
//     const chatbox = document.getElementById('chatbot-box');
//     const resizeHandle = document.querySelector('.resize-handle');
//     const chatBubble = document.getElementById('chatbot-bubble');
//     const chatClose = document.getElementById('chatbot-close');
//     const sendBtn = document.getElementById('send-btn');
//     const chatInput = document.getElementById('chat-input');
//     const chatBody = document.querySelector('.chat-body');
//     const imageUpload = document.getElementById('image-upload');
//     const imagePreview = document.getElementById('image-preview');

//     let isResizing = false;
//     let isDragging = false;
//     let selectedImage = null;
//     let offset = { x: 0, y: 0 };
//     let animationFrameId;

//     // ✅ Mở Chatbox
//     chatBubble.addEventListener('click', () => {
//         chatbox.classList.remove('hidden');
//         chatBubble.classList.add('hidden');
//     });

//     // ✅ Đóng Chatbox
//     chatClose.addEventListener('click', () => {
//         chatbox.classList.add('hidden');
//         chatBubble.classList.remove('hidden');
//     });

//     // ✅ Kéo Chatbox (Drag)
//     chatbox.querySelector('.chat-header').addEventListener('mousedown', (e) => {
//         isDragging = true;
//         offset = {
//             x: e.clientX - chatbox.offsetLeft,
//             y: e.clientY - chatbox.offsetTop
//         };
//         document.body.style.cursor = 'move';
//     });

//     document.addEventListener('mousemove', (e) => {
//         if (isDragging) {
//             chatbox.style.left = `${e.clientX - offset.x}px`;
//             chatbox.style.top = `${e.clientY - offset.y}px`;
//         }
//     });

//     document.addEventListener('mouseup', () => {
//         isDragging = false;
//         document.body.style.cursor = 'default';
//     });

//     // ✅ Kéo Co Giãn Chatbox (Fix Kéo Ngược)
//     resizeHandle.addEventListener('mousedown', (e) => {
//         e.preventDefault();
//         isResizing = true;
//         document.body.style.cursor = 'nwse-resize';

//         const initialMouseX = e.clientX;
//         const initialMouseY = e.clientY;
//         const initialWidth = chatbox.offsetWidth;
//         const initialHeight = chatbox.offsetHeight;
//         const initialLeft = chatbox.offsetLeft;
//         const initialTop = chatbox.offsetTop;

//         const resize = (e) => {
//             if (!isResizing) return;

//             const deltaX = e.clientX - initialMouseX;
//             const deltaY = e.clientY - initialMouseY;

//             // ✅ Điều chỉnh vị trí và kích thước khi kéo từ góc trái
//             const newWidth = initialWidth - deltaX;
//             const newHeight = initialHeight - deltaY;
//             const newLeft = initialLeft + deltaX;
//             const newTop = initialTop + deltaY;

//             // ✅ Áp dụng kích thước và vị trí mới
//             if (newWidth >= 280 && newWidth <= 700) {
//                 chatbox.style.width = `${newWidth}px`;
//                 chatbox.style.left = `${newLeft}px`;
//             }

//             if (newHeight >= 300 && newHeight <= 800) {
//                 chatbox.style.height = `${newHeight}px`;
//                 chatbox.style.top = `${newTop}px`;
//             }

//             animationFrameId = requestAnimationFrame(() => resize(e));
//         };

//         const onMouseMove = (e) => resize(e);

//         document.addEventListener('mousemove', onMouseMove);

//         document.addEventListener('mouseup', () => {
//             isResizing = false;
//             document.body.style.cursor = 'default';
//             cancelAnimationFrame(animationFrameId);
//             document.removeEventListener('mousemove', onMouseMove);
//         }, { once: true });
//     });

//     // ✅ Chọn và Preview Ảnh
//     imageUpload.addEventListener('change', (e) => {
//         selectedImage = e.target.files[0];

//         if (selectedImage) {
//             const imgPreview = document.createElement('img');
//             imgPreview.src = URL.createObjectURL(selectedImage);
//             imgPreview.style.maxWidth = '100%';
//             imgPreview.style.borderRadius = '5px';

//             imagePreview.innerHTML = '';
//             imagePreview.appendChild(imgPreview);
//         }
//     });

//     // ✅ Gửi Tin Nhắn
//     sendBtn.addEventListener('click', sendMessage);
//     chatInput.addEventListener('keypress', (e) => {
//         if (e.key === 'Enter') sendMessage();
//     });

//     function sendMessage() {
//         const msg = chatInput.value.trim();
//         if (msg === '' && !selectedImage) return;

//         const userMsg = document.createElement('div');
//         userMsg.className = 'message user';
//         userMsg.textContent = msg;
//         chatBody.appendChild(userMsg);

//         if (selectedImage) {
//             const imgInChat = document.createElement('img');
//             imgInChat.src = URL.createObjectURL(selectedImage);
//             imgInChat.style.maxWidth = '100%';
//             imgInChat.style.borderRadius = '5px';
//             userMsg.appendChild(imgInChat);
//         }

//         chatInput.value = '';
//         chatBody.scrollTop = chatBody.scrollHeight;

//         selectedImage = null;
//         imageUpload.value = '';
//         imagePreview.innerHTML = '';
//     }
// });

// Hết box-chat


// ✅ Hàm kích hoạt hiệu ứng lắc lắc
function triggerShake() {
    const bubble = document.getElementById('chatbot-bubble');
    bubble.classList.add('animate');

    // Xóa class sau khi hoàn thành animation
    setTimeout(() => {
        bubble.classList.remove('animate');
    }, 1000);
}

// ✅ Hiển thị thông báo ảo bên phải nút chat bubble khi chatbox đóng
function showFakeMessage() {
    const chatBubble = document.getElementById('chatbot-bubble');
    const chatbox = document.getElementById('chatbot-box');

    // Kiểm tra nếu chatbox đang mở thì không hiển thị thông báo
    if (!chatbox.classList.contains('hidden')) return;

    // Kiểm tra nếu đã có thông báo thì không tạo thêm
    if (document.getElementById('fake-message')) return;

    // Tạo tooltip-like thông báo
    const message = document.createElement('div');
    message.id = 'fake-message';
    message.innerText = 'Bạn cần tư vấn về sản phẩm?';
    message.style.position = 'fixed';
    message.style.bottom = '40px'; // Điều chỉnh vị trí theo nhu cầu
    message.style.right = '90px';  // Cách nút chat bubble
    message.style.backgroundColor = '#4f46e5';
    message.style.color = 'white';
    message.style.padding = '6px 12px';
    message.style.borderRadius = '8px';
    message.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    message.style.fontSize = '14px';
    message.style.zIndex = '1002';
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.5s ease';

    // Thêm thông báo vào DOM
    document.body.appendChild(message);

    // Hiện thông báo
    setTimeout(() => message.style.opacity = '1', 100);

    // Ẩn và xóa thông báo sau 5 giây
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
    }, 5000);
}

// ✅ Lặp lại hiệu ứng và thông báo mỗi 10 giây (chỉ khi chatbox đóng)
setInterval(() => {
    const chatbox = document.getElementById('chatbot-box');
    if (chatbox.classList.contains('hidden')) {
        triggerShake();
        showFakeMessage();
    }
}, 10000);

// ✅ Đảm bảo thông báo biến mất khi mở chatbox và thêm toàn bộ sự kiện trong một DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbot-box');
    const chatBubble = document.getElementById('chatbot-bubble');
    const chatClose = document.getElementById('chatbot-close');
    const resizeHandle = document.querySelector('.resize-handle');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.querySelector('.chat-body');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');

    let isResizing = false;
    let isDragging = false;
    let selectedImage = null; // Biến để lưu ảnh đã chọn
    let previousImage = null; // Biến để lưu ảnh đã gửi trước đó
    let offset = { x: 0, y: 0 };
    let animationFrameId;

    // ✅ Mở Chatbox
    chatBubble.addEventListener('click', () => {
        chatbox.classList.remove('hidden');
        chatBubble.classList.add('hidden');

        // Xóa thông báo khi mở chatbox
        const existingMessage = document.getElementById('fake-message');
        if (existingMessage) existingMessage.remove();
    });

    // ✅ Đóng Chatbox
    chatClose.addEventListener('click', () => {
        chatbox.classList.add('hidden');
        chatBubble.classList.remove('hidden');
    });

    // ✅ Kéo Chatbox (Drag)
    chatbox.querySelector('.chat-header').addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = {
            x: e.clientX - chatbox.offsetLeft,
            y: e.clientY - chatbox.offsetTop
        };
        document.body.style.cursor = 'move';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            chatbox.style.left = `${e.clientX - offset.x}px`;
            chatbox.style.top = `${e.clientY - offset.y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
    });

    // ✅ Kéo Co Giãn Chatbox (Fix Kéo Ngược)
    resizeHandle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isResizing = true;
        document.body.style.cursor = 'nwse-resize';

        const initialMouseX = e.clientX;
        const initialMouseY = e.clientY;
        const initialWidth = chatbox.offsetWidth;
        const initialHeight = chatbox.offsetHeight;
        const initialLeft = chatbox.offsetLeft;
        const initialTop = chatbox.offsetTop;

        const resize = (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;

            const newWidth = initialWidth - deltaX;
            const newHeight = initialHeight - deltaY;
            const newLeft = initialLeft + deltaX;
            const newTop = initialTop + deltaY;

            if (newWidth >= 280 && newWidth <= 700) {
                chatbox.style.width = `${newWidth}px`;
                chatbox.style.left = `${newLeft}px`;
            }

            if (newHeight >= 300 && newHeight <= 800) {
                chatbox.style.height = `${newHeight}px`;
                chatbox.style.top = `${newTop}px`;
            }

            animationFrameId = requestAnimationFrame(() => resize(e));
        };

        const onMouseMove = (e) => resize(e);

        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.body.style.cursor = 'default';
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });

    // ✅ Chọn và Preview Ảnh
    imageUpload.addEventListener('change', (e) => {
        selectedImage = e.target.files[0];
        const imagePreview = document.getElementById('image-preview');

        if (selectedImage) {
            const imgPreview = document.createElement('img');
            imgPreview.src = URL.createObjectURL(selectedImage);
            imgPreview.style.maxWidth = '100%';
            imgPreview.style.borderRadius = '5px';

            imagePreview.innerHTML = ''; // Xóa preview cũ nếu có
            imagePreview.appendChild(imgPreview);
            imagePreview.style.display = 'flex'; // ✅ Hiện preview khi có ảnh
        } else {
            imagePreview.style.display = 'none'; // ✅ Ẩn khi không có ảnh
        }
    });

    // ✅ Gửi Tin Nhắn
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

// ✅ Ẩn Preview sau khi gửi tin nhắn
    function sendMessage() {
        const msg = chatInput.value.trim();
        if (msg === '' && !selectedImage) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = msg;
        chatBody.appendChild(userMsg);

        // Gửi ảnh nếu có ảnh đã chọn hoặc ảnh cũ
        const imageToSend = selectedImage || previousImage;

        if (imageToSend) {
            const imgInChat = document.createElement('img');
            imgInChat.src = URL.createObjectURL(imageToSend);
            imgInChat.style.maxWidth = '200px';
            imgInChat.style.borderRadius = '5px';
            userMsg.appendChild(imgInChat);
        }

        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        const formData = new FormData();
        formData.append('message', msg);
        if (imageToSend) {
            formData.append('image', imageToSend);
        }

        // kết nối sever
        fetch('http://127.0.0.1:8000/chat/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
            const botMsg = document.createElement('div');
            botMsg.className = 'message bot';

            if (status === 200) {
                botMsg.textContent = body.reply || body.answer || '🤖 Không có phản hồi từ server, vui lòng chờ chút!';
            } else if (status === 429) {
                // ⚠️ Quá nhiều yêu cầu
                botMsg.textContent = body.error || '⚠️ Bạn đã gửi quá nhiều yêu cầu! Vui lòng thử lại sau.';
            } else if (status === 403) {
                // 🚫 IP bị chặn
                botMsg.textContent = body.error || '🚫 IP của bạn đã bị chặn. Vui lòng thử lại sau.';
            } else if (status === 405) {
                // ❌ Phương thức không hợp lệ
                botMsg.textContent = body.error || '❌ Phương thức không được phép.';
            } else {
                // ❓ Lỗi không xác định
                botMsg.textContent = body.error || `❓ Lỗi không xác định: ${status}`;
            }
        
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            // Lỗi kết nối mạng hoặc lỗi hệ thống
            console.error('Lỗi khi kết nối Django API:', error);
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message bot';
            errorMsg.textContent = '💥 Lỗi kết nối đến server. Vui lòng thử lại sau.';
            chatBody.appendChild(errorMsg);
        });

        // selectedImage = null;
        // imageUpload.value = '';
        // imagePreview.innerHTML = '';
        // ✅ Reset preview sau khi gửi
        imageUpload.value = '';
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
        // selectedImage = null;
    }
});
