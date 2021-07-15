class Book{
    constructor(id, title, author, image, description){
    this.id = id;
    this.title = title;
    this.author = author;
    this.image = image;
    this.description = description;
    }
}

/* variable for the fetch */
let books = [];
let titleReq;
let authorReq;
let bookList = '';

/* global variables for the library construction */
let bookItemStorage = '';
let bookIdStorage = '';
let bookTitleStorage = '';
let bookAuthorStorage = '';
let bookDescriptionStorage = '';
let bookImageStorage = '';
let livreHTML = '';


const app = {
    init: () => {
        document.addEventListener("DOMContentLoaded", app.load);
        console.log("HTML Loaded");
    },
    load: () => {
        //the page has finished loading
        app.showLoading();
    },

    startSearch: () => {
        let bookdel = document.getElementById("bookTitle");
        bookdel.value = "";
        let authordel = document.getElementById("author");
        authordel.value = "";
        const rech = document.querySelector("#rechercheId");
        rech.classList.add('active')
        const index = document.querySelector("#indexId");
        index.classList.add('hidden');
        const lib = document.querySelector("#myLib");
        lib.classList.add('active');
        app.fillLibrary();
    },

    cancelSearch : () => {
        const rech = document.querySelector(".recherche");
        rech.classList.remove('active');
        const index = document.querySelector("#indexId");
        index.classList.remove('hidden');
        const lib = document.querySelector("#myLib");
        lib.classList.remove('active');
        app.emptyStore();
        app.emptyLibrary();
    },

    showLoading: () => {
        let div_loading = document.querySelector("#output_div");
        let div_intra = document.createElement("div");
        div_intra.textContent = "loading ...";
        div_intra.className = "loadingList";
        div_loading.appendChild(div_intra);
        div_intra.innerHTML = "liste chargée";
        console.log("div_intra = " + div_intra.innerHTML);
    },

    getBooks: () => {

        //titleReq et authorReq sont passés comme arguments via la fonction checkInputs
        let url = "https://www.googleapis.com/books/v1/volumes?q=" + titleReq +"+inauthor:" + authorReq;
        let req = new Request(url, {
            method : 'GET',
            mode : 'cors'
        })
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
        if(books === undefined){
            app.err("aucun livre n'a été trouvé!");
        }

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

            if (livre.description === null || livre.description === undefined){
                livre.description = "information manquante";
            }

            let bookHTML =         "<div class=\"book_box\" id=\"book-item"+book+"\">"
                                + "<a href=\"#\" onclick=\"app.addToSessionStorage("+book+")\"class=\"fas fa-solid fa-bookmark\" id=\"bookmark"+book+"\"></a>"
                                + "<h3 id=\"title\">Titre : <span id=\"book_title_span\">"+livre.title+"</span></h3>"
                                + "<p>id : <span id=\"book_id_span\">"+livre.id+"</span></p>"
                                + "<p>auteur : <span id=\"book_author_span\">"+livre.author+"</span></p>"
                                + "<p>Description : <br><br><span class=\"book_desc_span\" id=\"book_desc\">"+livre.description.substring(0, 199)+"</span></p>"
                                + "<img src="+sourceImg+" id = \"img-unav\" alt=\"image non disponible\"></img>"
                                + "</div>";

            bookList.innerHTML += bookHTML;

        }//end of "for" showbooks

    },//end of showbooks

    err: (err) => {
        let list_err = document.querySelector("#error_section");
        //display an error
        let div = document.createElement("div");
        div.className = "error_msg";
        div.classList.add("active");
        div.innerHTML += err;
        console.log(div.textContent);
        list_err.appendChild(div);
        setTimeout(() => {
            let div = document.querySelector(".error_msg");
            div.parentElement.removeChild(div);
        }, 3000);
        
    },//end of err



    addToSessionStorage: (bk) =>  {
        console.log("addToSessionStorage ok : " + bk);

        // on charge les variables à utiliser pour le sessionStorage
        bookItemStorage = JSON.stringify(bookList.children[bk].id);
        bookIdStorage = JSON.stringify(bookList.children[bk].querySelector('#book_id_span').firstChild.data);
        bookTitleStorage = JSON.stringify(bookList.children[bk].querySelector('#book_title_span').firstChild.data);
        bookAuthorStorage = JSON.stringify(bookList.children[bk].querySelector('#book_author_span').firstChild.data);
        bookDescriptionStorage = JSON.stringify(bookList.children[bk].querySelector('#book_desc').firstChild.data);
        bookImageStorage = JSON.stringify(bookList.children[bk].querySelector('img').getAttribute('src'));

        let bookIdStorageReplaced = bookIdStorage.replace(/^"(.*)"$/, '$1');
        
        //"+JSON.parse(bookIdStorage)+" -> to be inserted in livreHTML as parameter to removeFromSessionStorage but has a scoping error.
                        
                        
        livreHTML =  "<div class=\"book_box_lib\" id="+bookItemStorage+">" //TODO check if id is correct later
                            + "<a href=\"#\" onclick=\"app.removeFromSessionStorage(\'"+bookIdStorageReplaced+"\')\" class=\"fas fa-solid fa-trash\" id=\'bookmark"+bookItemStorage+"\'></a>"
                            + "<h3 id=\"title\">Titre : <span data-title=\"title\" id=\"book_title_span\">"+bookTitleStorage+"</span></h3>"
                            + "<p>id : <span id=\"book_id_span_lib\">"+bookIdStorage+"</span></p>"
                            + "<p>auteur : <span id=\"book_author_span\">"+bookAuthorStorage+"</span></p>"
                            + "<p>Description : <br><br><span class=\"book_desc_span\">"+bookDescriptionStorage+"</span></p>"
                            + "<img src="+bookImageStorage+" id = \"img-unav\" alt=\"image non disponible\"></img>"
                            + "</div>";


        //on vérifie que l'id du livre n'existe pas déjà dans le sessionStorage
        if(sessionStorage.length==0){
            sessionStorage.setItem(bookIdStorage, livreHTML);
            app.addToLibrary(sessionStorage.getItem(bookIdStorage));            
        }else {
           for (let i = 0; i < sessionStorage.length; i++){
                let sessionKey = sessionStorage.key(i);
                console.log("key = " + sessionKey);
                if (sessionKey == bookIdStorage){
                console.log('error : item already exist');
                app.err("le livre sélectionné est déjà dans votre librairie");
                break;
                    }
                else if(sessionKey != sessionStorage && (i === (sessionStorage.length)-1)) {//ajouté 07/04
                    sessionStorage.setItem(bookIdStorage, livreHTML);
                    app.addToLibrary(sessionStorage.getItem(bookIdStorage));
                    break;
                    }
                }
            }
        

        
    },//end of addtoSessionStorage

    addToLibrary: (storageItem) => {

        //console.log("storageItem = " + storageItem);
    
        const bookInLib = document.createElement('div');
        bookInLib.className = 'book_box__lib';
        let elt = document.getElementById('library_body');
        elt.appendChild(bookInLib);
    
        bookInLib.innerHTML += storageItem;
        let libElement = bookInLib.querySelector('.book_box_lib');
        libElement.setAttribute('id', 'book_box_Id_lib');
    
        //to test added on 07/02 to open library automatically
        const library = document.querySelector('#storId');
        openLibrary(library);
        },//end of addToLibrary

    removeFromSessionStorage: (bookIdStorageReplaced) =>{
        console.log("bookIdStorage = " + bookIdStorageReplaced);
        
        
        //let bookToDel = sessionStorage.getItem(JSON.stringify(bookIdStorageReplaced));
        //console.log("bookToDel = " + bookToDel);

        const library = document.getElementById("storId");
        console.log("library = " + JSON.stringify(library));
        closeLibrary(library)

        let libBody = document.getElementById('library_body');
        console.log("libBody element count = " + libBody.childElementCount);
        let children = libBody.children;
        //const numberOfChilds = libBody.childElementCount;
        for (let i = 0 ; i < libBody.childElementCount ; i){
        libBody.removeChild(children[i]);
        console.log("libBody element count after remove child = " + libBody.childElementCount);
        if(libBody.childElementCount == 0){break;}
        }

        sessionStorage.removeItem(JSON.stringify(bookIdStorageReplaced));

        for (let item in sessionStorage){
            let storageItem = sessionStorage.getItem(item);
            if (storageItem == null){
                break;
            }else {

            const bookInLib = document.createElement('div');
            bookInLib.className = 'book_box__lib';
            let elt = document.getElementById('library_body');
            elt.appendChild(bookInLib);
        
            bookInLib.innerHTML += storageItem;
            //let libElement = bookInLib.querySelector('.book_box__lib');
            bookInLib.setAttribute('id', 'book_box_Id_lib');
            }

        }
            openLibrary(library);
        },

        fillLibrary: () => {

            for (let item in sessionStorage){
                let storageItem = sessionStorage.getItem(item);
                if (storageItem == null){
                    break;
                }else {
    
                const bookInLib = document.createElement('div');
                bookInLib.className = 'book_box__lib';
                let elt = document.getElementById('library_body');
                elt.appendChild(bookInLib);
            
                bookInLib.innerHTML += storageItem;
                //let libElement = bookInLib.querySelector('.book_box__lib');
                bookInLib.setAttribute('id', 'book_box_Id_lib');
                }
    
            }
        },

        emptyStore: () => {
            let storeBody = document.getElementById('output_div');
            console.log("storeBody element count = " + storeBody.childElementCount);
            let children = storeBody.children;
            //const numberOfChilds = libBody.childElementCount;
            for (let i = 0 ; i < storeBody.childElementCount ; i){
            storeBody.removeChild(children[i]);
            console.log("storeBody element count after remove child = " + storeBody.childElementCount);
            if(storeBody.childElementCount == 0){break;}
            }
    
        },

        emptyLibrary: () => {
            let libraryBody = document.getElementById('library_body');
            console.log("libraryBody element count = " + libraryBody.childElementCount);
            let children = libraryBody.children;
            //const numberOfChilds = libBody.childElementCount;
            for (let i = 0 ; i < libraryBody.childElementCount ; i){
            libraryBody.removeChild(children[i]);
            console.log("libraryBody element count after remove child = " + libraryBody.childElementCount);
            if(libraryBody.childElementCount == 0){break;}
            }

        }

    } // end of app
            
    /*------------EVENT LISTENERS DU SESSION STORAGE -------------------------------------*/
    //eventListeners pour ouvrir ou fermer la librairie et changer l'overlay (semi-opaque).
    // sélection de l'interface graphique de la librairie

    //on écoute les boutons et l'overlay
    const openLibraryButton = document.querySelectorAll('[data-storage-target]');
    const closeLibraryButton = document.querySelectorAll('[data-close-button]');
    const overlay = document.getElementById('library__overlay');

    overlay.addEventListener('click',() => {
    const libraries = document.querySelectorAll('.library.active')
    libraries.forEach(library => {
    closeLibrary(library);
        })
    });
         
    openLibraryButton.forEach(button => {
    button.addEventListener('click', () => {
    const library = document.querySelector('#storId')
    openLibrary(library)
                })
            });
                        
    closeLibraryButton.forEach(button => {
    button.addEventListener('click', () => {
    const library = button.closest('.library')
    closeLibrary(library)
        })
    });
                        
    function openLibrary (library)  {
    if(library == null) return
        
    library.classList.add('active')
    overlay.classList.add('active')

        }
                        
    function closeLibrary (library)  {
    if(library == null) return
    library.classList.remove('active')
    overlay.classList.remove('active')
           } 

    /* ------- on vérifie les inputs avec des classes css différentes si erreur le champ passe en rouge et ms d'erreur si ok on passe en vert et continue ----------*/
    function checkInputs () {
    //get the values from the inputs
    let bookTitle = document.getElementById("bookTitle");
    let author = document.getElementById("author");
    titleReq = bookTitle.value.trim();
    authorReq = author.value.trim();

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


    function setErrorFor (input, message) {
    const inputControl = input.parentElement; // .input-control - get the input-control class name
    const small = inputControl.querySelector("small");
    //we add the error message inside the small tag
    small.innerHTML=message;
    //add error class
    inputControl.className="input-control error";

}

    function setSuccessFor (input)  {
    const inputControl = input.parentElement;
    inputControl.className = "input-control success";
}
/*------------ FIN DE CHECKINPUTS / SETERROR / SETSUCCESS --------------------------------------------------------*/

app.init();

document.querySelector("#addBook").addEventListener("click", app.startSearch, false);

document.querySelector("#bookSearch").addEventListener("click", checkInputs, false);

document.querySelector("#cancelSearch").addEventListener("click", app.cancelSearch, false);
