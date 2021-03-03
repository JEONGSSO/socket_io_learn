var App = (function () {
  const socket = new Socket().init();
  const querySelect = (selector) => document.querySelector(selector);

  const modalEl = querySelect(".modalContainer");
  const shadowEl = querySelect(".shadow");
  const closeBtnEl = querySelect(".closeBtn");
  const roomNumberEl = querySelect(".roomNumber");
  const chatListEl = querySelect(".chatList");
  const chatInputEl = querySelect(".chatInput input");
  const chatButtonEl = querySelect(".chatInput button");

  const createChatList = ({ type, userId, message }) => {
    chatListEl.appendChild(chatCreateEl(type, userId, message));
    chatListEl.scrollTo(0, chatListEl.scrollHeight);
  };

  const chatCreateEl = (type, userId, msg) => {
    const child = document.createElement("li");
    child.classList.add(type);

    if (type === "notice") {
      child.innerHTML = `
      <p class="noticeMessage">${msg}</p>
    `;
    } else {
      child.innerHTML = `
      <p class="userId">${userId}</p>
      <p class="chatMessage">${msg}</p>
    `;
    }

    if (userId === socket.id) child.classList.add("me");

    return child;
  };

  const modalToggle = () => {
    modalEl.classList.toggle("show");
    shadowEl.classList.toggle("show");
    if (!modalEl.classList.contains("show")) {
      //모달 나갔을때 방 나가기
      joinedRoom && socket.emit("leaveRoom", joinedRoom);
      chatListEl.innerHTML = "";
    }
  };

  let joinedRoom = "";
  const joinRoom = ({ target }) => {
    // if (!target.matches(".roomList > li> a")) return;
    const roomId = location.hash.split("#")[1];

    roomNumberEl.innerText = roomId;
    // socket.emit("joinRoom", { roomId });
    socket.emit("joinRoom", { roomId }, () => {
      // joinedRoom && socket.emit("leaveRoom", joinedRoom); // 조인과 동시에 이전방 나가기
      // joinedRoom = roomId;
    });
    joinedRoom = roomId;
    modalToggle();
  };

  const sendMessage = (e) => {
    const roomId = location.hash.split("#")[1];

    if (!roomId) return;
    if (e.type === "keypress" && e.keyCode !== 13) return;

    const message = chatInputEl.value;
    if (!message) {
      // chatInputEl.classList.add("ani");
      // if (chatInputEl.classList.contains("ani")) {
      //   setTimeout(() => {
      //     chatInputEl.classList.remove("ani");
      //   }, 700);
      // }
      return;
    }
    socket.emit("message", roomId, message, (res) => {
      createChatList(res);
    });
    chatInputEl.value = "";
  };

  socket.on("connected", (data) => {
    console.log("client", data);
  });

  socket.on("joinRoom", (data) => {
    createChatList(data);
  });

  socket.on("message", (data) => {
    data.type = "message";
    createChatList(data);
  });

  window.addEventListener("hashchange", joinRoom);

  shadowEl.addEventListener("click", modalToggle);
  closeBtnEl.addEventListener("click", modalToggle);
  chatInputEl.addEventListener("keypress", sendMessage);
  chatButtonEl.addEventListener("click", sendMessage);

  return {
    socket,
    modalToggle,
  };
})();
