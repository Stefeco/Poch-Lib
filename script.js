class Book{
    constructor(id, title, author, image, description){
    this.id = id;
    this.title = title;
    this.author = author;
    this.image = image;
    this.description = description;
    }
}

let books = [];
let testId = "";

const app = {
    init: () => {
        document.addEventListener("DOMContentLoaded", app.load);
        console.log("HTML Loaded");
    },
    load: () => {
        //the page has finished loading
        app.showLoading();
        //app.getData(); TODO a modifier si on charge le bouton au load de la page ou si on utilise uniquement le bouton searchBook?
    },
    showLoading: () => {
        let ul = document.querySelector(".Blist");
        let li = document.createElement("li");
        li.textContent = "loading ...";
        li.className = "loadingList";
        ul.appendChild(li);
        li.innerHTML = "liste chargée";
    },

    getData: () => {
        let page = document.body.id;
        switch(page) {
            case "indexPage":
            //app.addTestMessage();
            //add custom code for index page (nothing now)
            break;

            case "searchPage":
            app.getBooks();
            break;

            default:
            //app.doNothing();
            break;
        }
    },

    getBooks: () => {
        let titleReq = document.getElementById("bookTitle").value;
        let authorReq = document.getElementById("author").value;
        let url = "https://www.googleapis.com/books/v1/volumes?q=" + titleReq +"+inauthor:" + authorReq;
        let req = new Request(url, {
            method : 'GET',
            mode : 'cors'
        });
        console.log("fetch : " + url);
        fetch(req)
            .then(function(response){
                if(response.ok){
                return response.json();
                }else{
                    throw new Error("invalid request or connection issue");
                }
            })
            .then(function(data){
                console.log(data);
                books = data.items;
                console.log(books);
                //let jsonData = JSON.stringify(data);
                //console.log(jsonData)
                app.showBooks(books);
            })
            .catch(app.err);
    },

    parseResponse: () => {
        //add JSONP parsing for the book object.
    },

    showBooks: (books) => {
        //remove the loading screen
        let ul = document.querySelector(".Blist");
        ul.innerHTML = "";
        //create a list of books
        let bookList = document.createDocumentFragment();

        for (let book in books) {
            console.log(book);
            console.log(books[book]);
            let li = document.createElement("li");
            li.textContent = books[book].volumeInfo.title + " - " + books[book].volumeInfo.authors[0];
            //li.textContent = books[book].volumeInfo.authors[0];
            li.setAttribute("data-id",books[book].id);
            bookList.appendChild(li);
        }
        ul.appendChild(bookList);
    },

    err: (err) => {
        //remove the loading li
        let ul = document.querySelector(".Blist");
        ul.innerHTML = "";
        //display an error
        let div = document.createElement("div");
        div.className = "error_msg";
        div.textContent = "error message";
        document.body.appendChild(div);
        setTimeout(() => {
            let div = document.querySelector(".error_msg");
            div.parentElement.removeChild(div);
        }, 3000);
    }

}

app.init();

document.querySelector("#bookSearch").addEventListener("click", app.getBooks, false);
//console.log(bookSearchButton.value);
















/** 
function addMessage(){
    document.getElementById("searchPage");
    document.querySelector("#aqueSearch").innerHTML = "I search for a book!";
}

function addTestMessage(){
    document.getElementById("indexPage");
    document.getElementById("test").innerHTML = "added test message";
}



//addMessage();
*/