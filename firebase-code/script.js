var firebaseConfig = {
  apiKey: "AIzaSyD9Yzye0-DAVfQN2epnOjKwr8RhzGxc7Xc",
  authDomain: "chat-app-4aeb4.firebaseapp.com",
  projectId: "chat-app-4aeb4",
  storageBucket: "chat-app-4aeb4.appspot.com",
  messagingSenderId: "843467518559",
  appId: "1:843467518559:web:221edfe1c09943ea18e1ea",
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

if (!localStorage.getItem("name")) {
  name = prompt("What is your name?");
  localStorage.setItem("name", name);
} else {
  name = localStorage.getItem("name");
}
document.querySelector("#name").innerText = name;

document.querySelector("#change-name").addEventListener("click", () => {
  name = prompt("What is your name?");
  localStorage.setItem("name", name);
  document.querySelector("#name").innerText = name;
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let message = document.querySelector("#message-input").value;
  db.collection("messages")
    .add({
      name: name,
      message: message,
      date: firebase.firestore.Timestamp.fromMillis(Date.now()),
    })
    .then((docRef) => {
      console.log(`Document written with ID: ${docRef.id}`);
      document.querySelector("#message-form").reset();
    })
    .catch((error) => {
      console.error(`Error adding document: ${error}`);
    });
});

db.collection("messages")
  .orderBy("date", "asc")
  .onSnapshot((snapshot) => {
    document.querySelector("#messages").innerHTML = "";
    snapshot.forEach((doc) => {
      let message = document.createElement("div");
      message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`;
      document.querySelector("#messages").prepend(message);
    });
  });

document.querySelector("#clear").addEventListener("click", () => {
  db.collection("messages")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        db.collection("messages")
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error(`Error removing document: ${error}`);
          });
      });
    })
    .catch((error) => {
      console.log(`Error getting documents: ${error}`);
    });
});
