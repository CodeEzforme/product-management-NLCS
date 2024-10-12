import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// Khai báo biến files ở ngoài để có thể truy cập ở cả 2 sự kiện
let files = [];

// Hàm reset preview và files
function resetPreviewAndFiles() {
  files = []; // Reset mảng files
  previewContainer.innerHTML = ''; // Xóa các ảnh đã preview
  imageInput.value = ''; // Reset input file
}

// Lắng nghe sự kiện thay đổi khi người dùng chọn ảnh
const imageInput = document.querySelector('input#file-upload-with-preview-upload-image');
const previewContainer = document.querySelector('.upload-images-preview');
imageInput.addEventListener('change', function (event) {
  previewContainer.innerHTML = ''; // Xóa preview trước đó
  files = Array.from(event.target.files);
  files.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Tạo div chứa ảnh và nút xóa
      const previewDiv = document.createElement('div');
      previewDiv.classList.add('preview-image-container');
      previewDiv.style.position = 'relative';
      previewDiv.style.display = 'inline-block';
      previewDiv.style.margin = '5px';

      // Tạo ảnh preview
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100px'; // Đặt kích thước ảnh
      img.style.border = '1px solid #ddd';
      img.style.padding = '5px';
      previewDiv.appendChild(img);

      // Tạo nút xóa
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.style.position = 'absolute';
      deleteButton.style.top = '0';
      deleteButton.style.right = '0';
      deleteButton.style.background = 'red';
      deleteButton.style.color = 'white';
      deleteButton.style.border = 'none';
      deleteButton.style.borderRadius = '50%';
      deleteButton.style.cursor = 'pointer';
      deleteButton.style.width = '20px';
      deleteButton.style.height = '20px';
      deleteButton.style.lineHeight = '20px';
      deleteButton.style.fontSize = '12px';

      // Sự kiện khi bấm nút xóa
      deleteButton.addEventListener('click', function () {
        previewContainer.removeChild(previewDiv); // Xóa ảnh khỏi preview

        // Tìm chỉ số của file trong mảng files
        const fileIndex = files.indexOf(file);
        if (fileIndex > -1) {
          files.splice(fileIndex, 1); // Xóa file khỏi mảng files
        }
      });

      previewDiv.appendChild(deleteButton);
      previewContainer.appendChild(previewDiv);
    };
    reader.readAsDataURL(file);
  });
});

// End File upload with image


// CLIENT SEND MESSAGE
const formDataSend = document.querySelector(".chat .inner-form");
if (formDataSend) {
  formDataSend.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = files ? Array.from(files) : []; // Chuyển FileList thành mảng
    if (images.length > 0 || content) {
      // send images
      socket.emit('CLIENT_SEND_MESSAGE', {
        content: content,
        images: images
      });
      e.target.elements.content.value = "";
      // hide the typing effect
      setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', 'hidden');
      }, 200)

      clearTimeout(timeOut); //

      resetPreviewAndFiles();
    }
  })
}
// END CLIENT SEND MESSAGE

// SERVER RETURN MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
  const myId = document.querySelector('[my-id]').getAttribute('my-id');
  const chatBody = document.querySelector('.chat .inner-body');
  const boxTyping = document.querySelector('inner-list-typing');
  const newDiv = document.createElement("div")

  let fullNameDisplay = '';
  let contentDisplay = '';
  let imagesDisplay = '';

  if (data.userId == myId) {
    newDiv.classList.add('inner-outgoing');
  } else {
    newDiv.classList.add('inner-incoming');
    fullNameDisplay = `<div class='inner-name'>${data.fullName}</div>`
  }

  if (data.content) {
    contentDisplay = `<div class='inner-content'>${data.content}</div>`
  }

  if (data.images) {
    imagesDisplay += `<div class="inner-images">`;

    for (const image of data.images) {
      imagesDisplay += `
        <img src="${image}">
      `;
    }

    imagesDisplay += `</div>`;
  }

  newDiv.innerHTML = `
    ${fullNameDisplay}
    ${contentDisplay}
    ${imagesDisplay}
  `
  chatBody.insertBefore(newDiv, boxTyping);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Preview Image
  const boxImages = newDiv.querySelector('.inner-images');
  if (boxImages) {
    const gallery = new Viewer(boxImages);
  }
});

// Scroll Chat to bottom
const chatBody = document.querySelector('.chat .inner-body');
if (chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// Show Typing
var timeOut;
const showTyping = () => {
  socket.emit('CLIENT_SEND_TYPING', 'show');

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit('CLIENT_SEND_TYPING', 'hidden');
  }, 3000)
}

// emoji picker
// Show Popup
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
  const tooltip = document.querySelector('.tooltip');
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }

  // Đóng emoji picker khi click ra ngoài
  document.addEventListener('click', (event) => {
    // Kiểm tra nếu click không phải vào tooltip hoặc buttonIcon
    if (!tooltip.contains(event.target) && !buttonIcon.contains(event.target)) {
      tooltip.classList.remove('shown'); // Ẩn tooltip
    }
  });
}

// insert icon to input
const emojiPicker = document.querySelector('emoji-picker')
if (emojiPicker) {
  const inputChat = document.querySelector('.chat .inner-form input[name="content"]')

  emojiPicker.addEventListener('emoji-click', event => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus()

    showTyping();
  });

  // CLIENT SEND TYPING
  if (inputChat)
    inputChat.addEventListener("keyup", () => {
      showTyping();
    })
}

// End emoji picker


// SERVER RETURN TYPING
const typingListElements = document.querySelector('.chat .inner-list-typing');
if (typingListElements) {
  socket.on('SERVER_RETURN_TYPING', (data) => {
    if (data.type == 'show') {
      const existedTyping = typingListElements.querySelector(`[user-id="${data.userId}"]`);

      if (!existedTyping) {
        const boxTyping = document.createElement('div');
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class='inner-name'>${data.fullName}</div>
          <div class='inner-dots'>
            <span></span>
            <span></span>
            <span></span>
          </div>
        `

        typingListElements.appendChild(boxTyping);
        chatBody.scrollTop = chatBody.scrollHeight;

      }
    } else {
      const boxTypingRemove = typingListElements.querySelector(`[user-id="${data.userId}"]`);
      if (boxTypingRemove) {
        typingListElements.removeChild(boxTypingRemove);
      }
    }
  })
}
// END SERVER RETURN TYPING

// Preview image
if (chatBody) {
  const gallery = new Viewer(chatBody)
}