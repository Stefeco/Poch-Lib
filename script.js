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
        console.log("HTML Loaded");
    },
    load: () => {
        //the page has finished loading
        app.showLoading();
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

    getBooks: () => {
    //titleReq = document.getElementById("bookTitle").value;
    //authorReq = document.getElementById("author").value;

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
            
            livre.description = books[book].volumeInfo.description;
            
            let sourceImg;
            try{
                livre.thumbnail = books[book].volumeInfo.imageLinks.thumbnail;
            } catch (e) {
            } finally {
                if(livre.thumbnail != undefined){
                    sourceImg = livre.thumbnail;       
                    }else{
                        sourceImg = "./images/unavailable.png";        
                    }
    
            }
            
            bookHTML += "<h3 id=\"title\">Titre : <span id=\"book_title_span\">"+livre.title+"</span></h3>"
                                + "<p>id : <span id=\"book_id_span\">"+livre.id+"</span></p>"
                                + "<p>auteur : <span id=\"book_author_span\">"+livre.author+"</span></p>"
                                + "<p>Description : <span class=\"book_desc_span\">"+livre.description+"</span></p>"
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

function checkInputs(){
    //get the values from the inputs
    let bookTitle = document.getElementById("bookTitle");
    let author = document.getElementById("author");
    titleReq = bookTitle.value.trim();
    authorReq = author.value.trim();

    let errorMsg = document.querySelector("#bookTitle_error").innerHTML;
    console.log(errorMsg);

    if (titleReq === undefined || titleReq === ""){
        //show error
        //add error class
        setErrorFor(bookTitle, "you must enter a book title"); //as argument we search the document.getElementById for bookTitle
    } else {
        setSuccessFor(bookTitle);
        //add success class
    }

    if (authorReq === undefined || authorReq === ""){
        //show error
        //add error class
        setErrorFor(author, "you must enter an author name");
    } else {
        //add success class
        setSuccessFor(author);
    }

    if ((bookTitle.parentElement.className == "input-control success") && (author.parentElement.className =="input-control success")){
        app.getBooks();
    }


}

function setErrorFor(input, message){
    const inputControl = input.parentElement; // .input-control - get the input-control class name
    const small = inputControl.querySelector("small");
    //we add the error message inside the small tag
    small.innerHTML=message;
    //add error class
    inputControl.className="input-control error";

}

function setSuccessFor(input){
    const inputControl = input.parentElement;
    inputControl.className = "input-control success";
}


app.init();

document.querySelector("#bookSearch").addEventListener("click", checkInputs, false);
