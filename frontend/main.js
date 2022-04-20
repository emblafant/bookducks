//Variables
const loggedInSection = document.querySelector("#loggedInSection");
const loginSection = document.querySelector("#loginSection");
const profileSection = document.querySelector("#profileSection");
const librarySection = document.querySelector("#librarySection");
const uploadSection = document.querySelector("#uploadSection");

const uplaodBookSection = document.querySelector("#uplaodBookSection");

const checkboxFieldsetBook = document.querySelector("#checkboxFieldsetBook");
const checkboxFieldsetAudioBook = document.querySelector("#checkboxFieldsetAudioBook");

const bookUl = document.querySelector("#bookUl");
const audioBookUl = document.querySelector("#audioBookUl");

const buttonDiv = document.querySelector("#buttonDiv");




//Books----------------


//Generate genres
const generateGenres = (genres) => {
  const genresDiv = document.createElement("div");
  const genresText = document.createElement("h4");
  genresText.innerText = "Genrer:"
  genresDiv.appendChild(genresText);
  genres.data.forEach(genre => {
    genre = genre.attributes.genre;
    const genreText = document.createElement("p");
    genreText.innerText = genre;
    genresDiv.appendChild(genreText);
  })
  return genresDiv;
}

//Render contact info
const renderContactinfo = async (id) => {
  let result = await axios.get(`http://localhost:1337/api/users/${id}`,
  {
    headers : {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  const {username, email} = result.data;
  
  const contact = document.createElement("article");
  const contactText = document.createElement("h4");
  contactText.innerText = "Kontakt:";
  const usernameText = document.createElement("p");
  usernameText.innerText = username;
  const emailText = document.createElement("p");
  emailText.innerText = email;
  contact.append(contactText, usernameText, emailText);
  return contact;
}

//Render books
const renderBooks = async (ul) => {
  let books = await axios.get("http://localhost:1337/api/books?populate=*",
  {
    headers : {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  });
  books = books.data.data;
  bookUl.innerHTML = "";
  books.forEach(async book => {
    const {title, author, pages, rating, cover, userId, genres} = book.attributes;
    
    const bookContainer = document.createElement("li");
    coverUrl = cover.data.attributes.url;
    const img = document.createElement("img");
    img.src = `http://localhost:1337${coverUrl}`;
    const titleText = document.createElement("h3");
    titleText.innerText = title;
    const authorText = document.createElement("p");
    authorText.innerText = `Author: ${author}`;
    const pagesText = document.createElement("p");
    pagesText.innerText = `Pages: ${pages}`;
    const ratingText = document.createElement("p");
    ratingText.innerText = `${rating}/10`;
    const genresDiv = generateGenres(genres);
    bookContainer.append(img, titleText, authorText, pagesText, ratingText, genresDiv);

    const contactInfo = await renderContactinfo(userId);

    ul.append(bookContainer, contactInfo)
  })
}

//Render audioBooks
const renderAudioBooks = async (ul) => {
  let audioBooks = await axios.get("http://localhost:1337/api/audio-books?populate=*",
  {
    headers : {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  });
  audioBooks = audioBooks.data.data;
  audioBookUl.innerHTML = "";
  audioBooks.forEach(async book => {
    const {title, published, lengthMin, rating, userId, genres, cover} = book.attributes;
  
    const audioBookContainer = document.createElement("li");
    coverUrl = cover.data.attributes.url;
    const img = document.createElement("img");
    img.src = `http://localhost:1337${coverUrl}`;
    const titleText = document.createElement("h3");
    titleText.innerText = title;
    const publishedText = document.createElement("p");
    publishedText.innerText = `Publiserad: ${published}`;
    const lengthText = document.createElement("p");
    lengthText.innerText = `Length: ${lengthMin} min`;
    const ratingText = document.createElement("p");
    ratingText.innerText = `${rating}/10`;
    const genresDiv = generateGenres(genres);
    audioBookContainer.append(img, titleText, publishedText, lengthText, ratingText, genresDiv);

    const contactInfo = await renderContactinfo(userId);

    ul.append(audioBookContainer, contactInfo);
  });
}

//Render users books

const renderMyBooks = async (ul) => {
  ul.innerHTML = "";
  const userId = sessionStorage.getItem("id");
  let books = await axios.get(`http://localhost:1337/api/books/?filters[userId][$eq]=${userId}`,
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  books = books.data.data;
  books.forEach(book => {
    const title = book.attributes.title;
    const titleText = document.createElement("li");
    titleText.innerText = title;
    ul.appendChild(titleText);
  })

  let audioBooks = await axios.get(`http://localhost:1337/api/audio-books/?filters[userId][$eq]=${userId}`,
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  audioBooks = audioBooks.data.data;
  audioBooks.forEach(book => {
    const title = book.attributes.title;
    const titleText = document.createElement("li");
    titleText.innerText = title;
    ul.appendChild(titleText);
  })
}

//Generate genres buttons

const generateGenresBtns = async (type, fieldset) => {
  let genres = await axios.get("http://localhost:1337/api/genres",
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  });
  genres = genres.data.data;

fieldset.innerHTML = "";

  const legend = document.createElement("legend");
  legend.innerText = "Gengrer:";
  fieldset.appendChild(legend);
  
  genres.forEach(genre => {
    id = genre.id;
    genre = genre.attributes;
    
    const label = document.createElement("label");
    label.htmlFor = genre.genre + type;
    label.innerText = `${genre.genre}:`
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = genre.genre + type;
    checkbox.value = id;

    fieldset.append(label, checkbox)
  })

}




//User -------------------------------

//Save user info
const setUserInfo = (token, id, username) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("id", id);
  sessionStorage.setItem("username", username)
};

//Render user info
const renderUserInfo = (username, email, id, createdAt) => {

  const profileText = document.createElement("h2");
  const userInfo = document.createElement("article");
  const usernameText = document.createElement("h3");
  const emailText = document.createElement("p");
  const idText = document.createElement("p");
  const registerText = document.createElement("p");

  profileText.innerText = "Min Profil";
  usernameText.innerText = username;
  emailText.innerText = email;
  idText.innerText = `Id: ${id}`;
  registerText.innerText = `Gick med: ${createdAt.slice(0, 10)}`;

  userInfo.append(profileText, usernameText, emailText, idText, registerText);
  return userInfo;
}

//Render profile section
const renderProfile = async () => {
  const result = await axios.get(`http://localhost:1337/api/users/${sessionStorage.getItem("id")}`,
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  });

  const {username, email, id, createdAt} = result.data;
  profileSection.innerHTML = "";

  const userInfo = renderUserInfo(username, email, id, createdAt)
  profileSection.appendChild(userInfo);

  const myBooksBtn = document.createElement("button");
  myBooksBtn.innerText = "Visa Mina Böcker";
  profileSection.appendChild(myBooksBtn);

  const myBooksUl = document.createElement("ul");
  myBooksUl.classList.add("hidden");
  myBooksUl.classList.add("my-books-ul")
  profileSection.appendChild(myBooksUl);

  myBooksBtn.addEventListener("click", () => {
    if (myBooksUl.classList.contains("hidden")) {
      myBooksUl.classList.remove("hidden");
      myBooksBtn.innerText = "Dölj Mina Böcker";
      renderMyBooks(myBooksUl);
    } else {
      myBooksUl.classList.add("hidden");
      myBooksBtn.innerText = "Visa Mina Böcker";
    }
  })
}
renderProfile();

//Render loggedin sections
const renderLoggedInSections = () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    loggedInSection.classList.remove("hidden");
    loginSection.classList.add("hidden");
    profileSection.classList.remove("hidden");

    buttonDiv.classList.remove("hidden")

    document.querySelector("#username").innerText = sessionStorage.getItem("username");

    renderProfile();
  } else {
    loggedInSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
    profileSection.classList.add("hidden");

    buttonDiv.classList.add("hidden");
  }
}
renderLoggedInSections();

//Login
const login = async () => {
  const response = await axios.post("http://localhost:1337/api/auth/local",
  {
    identifier: document.querySelector("#usernameLogin").value,
    password: document.querySelector("#passwordLogin").value,
  })

  setUserInfo(response.data.jwt, response.data.user.id, response.data.user.username);
  renderLoggedInSections();
}

//Register
const register = async () => {
  const response = await axios.post("http://localhost:1337/api/auth/local/register",
  {
    username: document.querySelector("#usernameRegister").value,
    email: document.querySelector("#emailRegister").value,
    password: document.querySelector("#passwordRegister").value,
  });

  setUserInfo(response.data.jwt, response.data.user.id, response.data.user.username);
  renderLoggedInSections();
}

//Logout
const logout = () => {
  sessionStorage.clear();
  renderLoggedInSections();
}






//Uploads------------------------------------------------------------------

//Get genres from fierldset
const getGenres = (fieldset) => {
  const genres = [];
  const genresCheckboxes = fieldset.querySelectorAll("input");
  genresCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      genres.push(checkbox.value);
    }
  })
  return genres;
}

//Upload book
const uploadBook = async () => {
  const img = document.querySelector("#imgBook").files;
  let imgData = new FormData();
  imgData.append("files", img[0]);

  axios.post("http://localhost:1337/api/upload", imgData, 
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(result => {
    const imgId = result.data[0].id;
    const genres = getGenres(checkboxFieldsetBook);

    axios.post("http://localhost:1337/api/books?populate=*",
    {
      data: {
        userId: sessionStorage.getItem("id"),
        title: document.querySelector("#titleBook").value,
        author: document.querySelector("#authorBook").value,
        pages: document.querySelector("#pagesBook").value,
        rating: document.querySelector("#ratingBook").value,
        genres,
        cover: imgId
      }
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
  })
}

//upload audiobook
const uploadAudioBook = async () => {
  const img = document.querySelector("#imgAudioBook").files;
  let imgData = new FormData();
  imgData.append("files", img[0]);

  axios.post("http://localhost:1337/api/upload", imgData, 
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(result => {
    const imgId = result.data[0].id;
    const genres = getGenres(checkboxFieldsetAudioBook);

    axios.post("http://localhost:1337/api/audio-books?populate=*",
    {
      data: {
        userId: sessionStorage.getItem("id"),
        title: document.querySelector("#titleAudioBook").value,
        published: document.querySelector("#dateAudioBook").value,
        lengthMin: document.querySelector("#lengthAudioBook").value,
        rating: document.querySelector("#ratingAudioBook").value,
        genres,
        cover: imgId
      }
    }, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    })
  })
}








//Render Page------------------------------------------------------------

//Render library
const renderLibrary = async () => {
  if (librarySection.classList.contains("hidden")) {
    librarySection.classList.remove("hidden");

    renderBooks(bookUl);
    renderAudioBooks(audioBookUl);
  } else {
    librarySection.classList.add("hidden");
  }
}

//Render loan form
const renderUpload = async () => {
  if (uploadSection.classList.contains("hidden")) {
   uploadSection.classList.remove("hidden");

   generateGenresBtns("Book", checkboxFieldsetBook);
   generateGenresBtns("audioBook", checkboxFieldsetAudioBook);
  } else {
    uploadSection.classList.add("hidden");
  }

}