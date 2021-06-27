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
let bookList = '';



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

        //titleReq et authorReq sont passés via la fonction checkInputs

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
        bookList = document.getElementById("output_div");

        for (let book in books){
            let livre = new Book();

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
            //console.log(livre);pour vérifier que l'objet livre est bien créé

            let bookHTML =         "<div class=\"book_box\" id=\"book-item"+book+"\">"
                                + "<a href=\"#\" onclick=\"app.addToStorage("+book+")\"class=\"fas fa-solid fa-bookmark\" id=\"bookmark"+book+"\"></a>"
                                + "<h3 id=\"title\">Titre : <span id=\"book_title_span\">"+livre.title+"</span></h3>"
                                + "<p>id : <span id=\"book_id_span\">"+livre.id+"</span></p>"
                                + "<p>auteur : <span id=\"book_author_span\">"+livre.author+"</span></p>"
                                + "<p>Description : <span class=\"book_desc_span\" id=\"book_desc\">"+livre.description+"</span></p>"
                                + "<img src="+sourceImg+" id = \"img-unav\" alt=\"image non disponible\"></img>"
                                + "</div>";

            bookList.innerHTML += bookHTML;

        }

    console.log(bookList);


     
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
    },



    addToStorage: (bk) => {
        console.log("addToStorage ok : " + bk);

        const openStorageButton = document.querySelectorAll('[data-storage-target]');
        const closeStorageButton = document.querySelectorAll('[data-close-button]');
        const overlay = document.getElementById('storage__overlay');
                        
        // on charge les variables à utiliser pour le sessionStorage
        const bookItemStorage = JSON.stringify(bookList.children[bk].id);
        const bookIdStorage = JSON.stringify(bookList.children[bk].querySelector('#book_id_span').firstChild.data);
        const bookTitleStorage = JSON.stringify(bookList.children[bk].querySelector('#book_title_span').firstChild.data);
        const bookAuthorStorage = JSON.stringify(bookList.children[bk].querySelector('#book_author_span').firstChild.data);
        const bookDescriptionStorage = JSON.stringify(bookList.children[bk].querySelector('#book_desc').firstChild.data);
        const bookImageStorage = JSON.stringify(bookList.children[bk].querySelector('img').getAttribute('src'));
                        
                        
        const livreHTML =  "<div class=\"book_box\" id="+bookItemStorage+">"
                            + "<a href=\"#\" onclick=\"app.addToStorage()\"class=\"fas fa-solid fa-bookmark\" id=\"bookmark\"></a>"
                            + "<h3 id=\"title\">Titre : <span data-title=\"title\" id=\"book_title_span\">"+bookTitleStorage+"</span></h3>"
                            + "<p>id : <span id=\"book_id_span\">"+bookIdStorage+"</span></p>"
                            + "<p>auteur : <span id=\"book_author_span\">"+bookAuthorStorage+"</span></p>"
                            + "<p>Description : <span class=\"book_desc_span\">"+bookDescriptionStorage+"</span></p>"
                            + "<img src="+bookImageStorage+" id = \"img-unav\" alt=\"image non disponible\"></img>"
                            + "</div>";
                        
                        
        /*console.log("bookItemstorage = " + bookItemStorage);
        console.log("bookIdStorage = " + bookIdStorage);
        console.log("bookTitleStorage = " + bookTitleStorage);
        console.log("bookAuthorStorage = " + bookAuthorStorage);
        console.log("bookDescriptionStorage = " + bookDescriptionStorage);
        console.log("bookImageStorage = " + bookImageStorage);
        
        console.log("after session storage : "+ sessionStorage.getItem(bookIdStorage));*/
                        
        sessionStorage.setItem(bookIdStorage, livreHTML);                
                        
                        
        /*------------event listeners pour le session storage -------------------------------------*/
        //eventListeners pour ouvrir ou fermer la librairie et changer l'overlay (semi-opaque).
        // sélection de l'interface graphique de la librairie


        overlay.addEventListener('click',() => {
        const storages = document.querySelectorAll('.storage.active')
        storages.forEach(storage => {
        closeStorage(storage);
            })
        })
                        
        openStorageButton.forEach(button => {
        button.addEventListener('click', () => {
        const storage = document.querySelector('#storId')
        console.log(storage);
        openStorage(storage)
                    })
                })
                        
        closeStorageButton.forEach(button => {
        button.addEventListener('click', () => {
        const storage = button.closest('.storage')
        closeStorage(storage)
           })
        })
                        
        //TO DO ADD THE HTML WITH THE BOOKS                
        function openStorage (storage) {
        if(storage == null) return
        storage.classList.add('active')//className?
        overlay.classList.add('active')

        const bookInLib = document.createElement('div');
        bookInLib.className = 'book_box__lib';
        let elt = document.getElementById('storage_body');
        elt.appendChild(bookInLib);

        const bookIdLib = document.createElement('p');
        bookIdLib.className = "book-id-lib";
        bookInLib.appendChild(bookIdLib);
        bookIdLib.innerHTML = bookIdStorage;

        const bookTitleLib = document.createElement('p');
        bookTitleLib.className = "book-title-lib";
        bookInLib.appendChild(bookTitleLib);
        bookTitleLib.innerHTML = bookTitleStorage;

        const bookAuthorLib = document.createElement('p');
        bookAuthorLib.className = "book-author-lib";
        bookInLib.appendChild(bookAuthorLib);
        bookAuthorLib.innerHTML = bookAuthorStorage;

        const bookDescriptionLib = document.createElement('p');
        bookDescriptionLib.className = "book-description-lib";
        bookInLib.appendChild(bookDescriptionLib);
        bookDescriptionLib.innerHTML = bookDescriptionStorage;

        const imgLib = document.createElement('img');
        imgLib.className = "book-img-lib";

        const span = document.createElement('span');
        span.className = "icon";
            }
                        
        function closeStorage (storage){
        if(storage == null) return
        storage.classList.remove('active')
        overlay.classList.remove('active')
           }    
                        
                        
    },//end of addtoStorage
    
    fillStorage: () => {
        if(bookList == '')return
        
    }

} //end of app (temp)


/* ------- on vérifie les inputs avec des classes css différentes si erreur le champ passe en rouge et ms d'erreur si ok on passe en vert et continue ----------*/
function checkInputs(){
    //get the values from the inputs
    let bookTitle = document.getElementById("bookTitle");
    let author = document.getElementById("author");
    titleReq = bookTitle.value.trim();
    authorReq = author.value.trim();

    let errorMsg = document.querySelector("#bookTitle_error").innerHTML;
    console.log(errorMsg);

    if (titleReq === undefined || titleReq === ""){
        setErrorFor(bookTitle, "you must enter a book title");
    } else {
        setSuccessFor(bookTitle);
    }

    if (authorReq === undefined || authorReq === ""){
        setErrorFor(author, "you must enter an author name");
    } else {
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




