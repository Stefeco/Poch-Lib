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
let titleReq;
let authorReq;
let bookHTML = '';



const app = {
    init: () => {
        document.addEventListener("DOMContentLoaded", app.load);
        //app.getData();
        console.log("HTML Loaded");
    },
    load: () => {
        //the page has finished loading
        app.showLoading();
        //app.getData(); TODO a modifier si on charge le bouton au load de la page ou si on utilise uniquement le bouton searchBook?
    },
    showLoading: () => {
        let div_loading = document.querySelector("#output_div");
        let div_intra = document.createElement("div");
        div_intra.textContent = "loading ...";
        div_intra.className = "loadingList";
        div_loading.appendChild(div_intra);
        div_intra.innerHTML = "liste chargée";
        console.log(div_intra.innerHTML);
    },

    getData: () => {
        let page = document.body.id;
        switch(page) {
            case "indexPage":
            break;

            case "searchPage":
            app.getBooks();
            break;

            default:
                //app.donothing();
            break;
        }
    },

    validateEntries: () => {

        let messages = []
        console.log("titre avant le if : " + titleReq);
        console.log("auteur avant le if : " + authorReq);
        
    
        if (titleReq === undefined || titleReq === ""){
            console.log("titre dans le if : " + titleReq);
        messages.push("a title is required");
        }
        if (authorReq === undefined || authorReq === ""){
            console.log("auteur dans le if : " + authorReq);
        messages.push("you must enter a name for the author");
        }
        if(messages.length > 0){
        console.log("messages = " + messages);
        bookHTML = '';
        app.err(messages);

        }
        
    },

    getBooks: () => {
    titleReq = document.getElementById("bookTitle").value;
    authorReq = document.getElementById("author").value;

        app.validateEntries();
        

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
                books = data.items;
                app.showBooks(books);
            })
            .catch(app.err);
    },

    showBooks: (books) => {
        let bookList = document.getElementById("output_div");
        let bookDiv = document.createElement("DIV");

        for (let book in books){
            let livre = new Book();

            bookDiv.setAttribute("class", "book_box");
            bookDiv.setAttribute("id", "book-item"+[book]);

            livre.title = books[book].volumeInfo.title;

            livre.id = books[book].id;

            livre.author = books[book].volumeInfo.authors;
            //livre.author.innerHTML = livre.author;
            
            livre.description = books[book].volumeInfo.description;
            //livre.description.innerHTML = livre.description;
            
            let sourceImg;
            try{
                livre.thumbnail = books[book].volumeInfo.imageLinks.thumbnail;
                //console.log("livre.thumbnail pour livre " + book + " : " + livre.thumbnail);
            } catch (e) {
                //console.log("le thumbnail du livre " + book + " n'est pas présent" + e);
            } finally {
                //let book_thumbnail_img = document.querySelector("#img-unav");
                if(livre.thumbnail != undefined){
                    sourceImg = livre.thumbnail;        //book_thumbnail_img.setAttribute("src", livre.thumbnail);
                    }else{
                        sourceImg = "./images/unavailable.png";        //book_thumbnail_img.setAttribute("src", "./images/unavailable.png");
                    }
    
            }
            
            bookHTML += "<h3 id=\"title\">Titre : <span id=\"book_title_span\">"+livre.title+"</span></h3>"
                                + "<p>id : <span id=\"book_id_span\">"+livre.id+"</span></p>"
                                + "<p>auteur : <span id=\"book_author_span\">"+livre.author+"</span></p>"
                                + "<p>Description : <span id=\"book_desc_span\">"+livre.description+"</span></p>"
                                + "<img src="+sourceImg+" id = \"img-unav\" alt=\"image non disponible\"></img>";

        }

        bookDiv.innerHTML = bookHTML;
        bookList.appendChild(bookDiv);
     
    },

    err: (err) => {
        //remove the loading
        let list_err = document.querySelector("#output_div");
        list_err.innerHTML = "";
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

document.querySelector("#bookSearch").addEventListener("click", app.getBooks, true);


















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