let cl = console.log;

const productBody = document.getElementById("productBody");
const backDrop = document.getElementById("backDrop");
const myModal = document.getElementById("myModal");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const ratingControl = document.getElementById("rating");
const discriptionControl = document.getElementById("discription");
const statusControl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const productClose = [...document.querySelectorAll(".productClose")];
const loader = document.getElementById("loader");
const showModalBtn = document.getElementById("showModalBtn");

const baseUrl = `https://batch-12-fetch-movie-default-rtdb.asia-southeast1.firebasedatabase.app`;

const productUrl = `${baseUrl}/product.json`;

const snackBarMsg = (msg,iconName,time) => {
    Swal.fire({
        title:msg,
        icom:iconName,
        timer:time
    })
}

const onShowHideHandler = () => {
    backDrop.classList.toggle("active");
    myModal.classList.toggle("active");
    productForm.reset();
}

const addCard = (ele) => {
    let card = document.createElement("div");
    card.id = ele.id;
    card.className = "col-md-4";
    card.innerHTML = `
  
            <div class="card mb-4">
                <figure class="productContainer" id="${ele.id}">
                    <img src="${ele.imgUrl}" alt="${ele.title}">
                    <figcaption>
                        <div class="heading">
                            <div class="row">
                                <div class="col-sm-9">
                                    <h4>
                                        ${ele.title}
                                    </h4>
                                    ${ele.status = "In Stock..!!" ? `<h5 class="text-white">${ele.status}</h5>`:
                                     `<h5 class="text-danger">${ele.status}</h5>`}
                                </div>
                                <div class="col-sm-3 d-flex align-items-center ">
                                 ${ele.rating >= 4 ?`<span class="badge badge-success">${ele.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                 ele.rating < 4 && ele.rating >= 2 ? `<span class="badge badge-warning">${ele.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                 `<span class="badge badge-danger">${ele.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`}
                                </div>
                                
                            </div>
                        </div>
                       <div class="discription">
                        <h4>
                            Discription  : 
                        </h4>
                        <p>${ele.discription}</p>
                        <div class="d-flex d-flex justify-content-between">
                            <button class="btn btn-success" onclick="onProductEdit(this)" type="button">Edit</button>
                            <button class="btn btn-danger" onclick="onProductDelete(this)" type="button">Delete</button>
                        </div>
                       </div>
                    </figcaption>
                </figure>
            </div>
     
    `
    productBody.prepend(card);
}

const templating = (ele) => {
    productBody.innerHTML = ele.map(obj => {
        return `
        <div class="col-md-4">
            <div class="card mb-4">
                <figure class="productContainer" id="${obj.id}">
                    <img src="${obj.imgUrl}" alt="${obj.title}">
                    <figcaption>
                        <div class="heading">
                            <div class="row">
                                <div class="col-sm-9">
                                    <h4>
                                        ${obj.title}
                                    </h4>
                                    ${obj.status = "In Stock..!!" ? `<h5 class="text-white">${obj.status}</h5>`:
                                    `<h5 class="text-danger">${obj.status}</h5>`}
                                </div>
                                <div class="col-sm-3 d-flex align-items-center ">
                                 ${obj.rating >= 4 ?`<span class="badge badge-success">${obj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                 obj.rating < 4 && obj.rating >= 2 ? `<span class="badge badge-warning">${obj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                 `<span class="badge badge-danger">${obj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`}
                                </div>
                                
                            </div>
                        </div>
                       <div class="discription">
                        <h4>
                            Discription  : 
                        </h4>
                        <p>${obj.discription}</p>
                        <div class="d-flex d-flex justify-content-between">
                            <button class="btn btn-success" onclick="onProductEdit(this)" type="button">Edit</button>
                            <button class="btn btn-danger" onclick="onProductDelete(this)" type="button">Delete</button>
                        </div>
                       </div>
                    </figcaption>
                </figure>
            </div>
        </div>
    
    `
        
    }).join("")
}

const objToarr = (obj) => {
    let arr = [];
    for (const key in obj) {
        arr.push({...obj[key], id:key})
    }
    return arr
}

const makeApiCall = async (apiUrl,methodName,msgBody = null) => {
    try{
        if(msgBody){
            msgBody = JSON.stringify(msgBody)
        }
        loader.classList.remove("d-none")
       let res = await fetch(apiUrl,{
            method:methodName,
            body:msgBody
        })
        return res.json()
    }
    catch(err){
        cl(err)
    }
    finally{
        loader.classList.add("d-none")
    }
    
}

const fetchData =async () => {
    try{
        let res = await makeApiCall(productUrl,"GET")
        arr = objToarr(res)
        templating(arr.reverse())
    }
    catch(err){
        cl(err)
    }
}
fetchData();

const onAddProduct = async (ele) => {
   try{
    ele.preventDefault();
    let product = {
        title : titleControl.value,
        imgUrl : imgUrlControl.value,
        discription:discriptionControl.value,
        status:statusControl.value,
        rating:ratingControl.value
    }
    cl(product)
    onShowHideHandler()
    let res = await makeApiCall(productUrl,"POST",product)
    product.id = res.name;
    cl(product)
    addCard(product);
    snackBarMsg(`The Product ${product.title} is Added Successfully..!!`,`success`,2000)
   }
   catch(err){
    cl(err)
    snackBarMsg(`Something went wrong..!!`,`error`,2000)
   }
   finally{
    productForm.reset();
   }

}

const onProductEdit = async (ele) => {
   try{
    let editId = ele.closest (".productContainer").id;
    localStorage.setItem("editId",editId);
    let editUrl = `${baseUrl}/product/${editId}.json`;
    onShowHideHandler()
    let res = await makeApiCall(editUrl,"GET")
    titleControl.value = res.title;
    imgUrlControl.value = res.imgUrl;
    discriptionControl.value = res.discription;
    statusControl.value = res.status;
    ratingControl.value = res.rating;
    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none");
   }
   catch(err){
    cl(err)
   }

}

const onUpdateProduct = async (ele) => {
   try{
    let updatedId = localStorage.getItem("editId");
    let updatedUrl = `${baseUrl}/product/${updatedId}.json`;
    let updatedObj = {
        title : titleControl.value,
        imgUrl : imgUrlControl.value,
        discription:discriptionControl.value,
        status:statusControl.value,
        rating:ratingControl.value,
        id:updatedId
    }
    cl(updatedObj)
    onShowHideHandler()
    let res = await makeApiCall(updatedUrl,"PATCH",updatedObj)
    let card = document.getElementById(updatedId)
    card.innerHTML= `
                
                <div class="card mb-4">
                    <figure class="productContainer" id="${updatedObj.id}">
                        <img src="${updatedObj.imgUrl}" alt="${updatedObj.title}">
                        <figcaption>
                            <div class="heading">
                                <div class="row">
                                    <div class="col-sm-9">
                                        <h4>
                                            ${updatedObj.title}
                                        </h4>
                                        ${updatedObj.status = `In Stock..!!` ? `<h5 class="text-white">${updatedObj.status}</h5>`:
                                         `<h5 class="text-danger">${updatedObj.status}</h5>`}
                                    </div>
                                    <div class="col-sm-3 d-flex align-items-center ">
                                    ${updatedObj.rating >= 4 ?`<span class="badge badge-success">${updatedObj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                    updatedObj.rating < 4 && updatedObj.rating >= 2 ? `<span class="badge badge-warning">${updatedObj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`:
                                    `<span class="badge badge-danger">${updatedObj.rating} <i class="fa-solid fa-star-half-stroke"></i></span>`}
                                    </div>
                                    
                                </div>
                            </div>
                        <div class="discription">
                            <h4>
                                Discription  : 
                            </h4>
                            <p>${updatedObj.discription}</p>
                            <div class="d-flex d-flex justify-content-between">
                                <button class="btn btn-success" onclick="onProductEdit(this)" type="button">Edit</button>
                                <button class="btn btn-danger" onclick="onProductDelete(this)" type="button">Delete</button>
                            </div>
                        </div>
                        </figcaption>
                    </figure>
                </div>
           

            `
            updateBtn.classList.add("d-none")
            submitBtn.classList.remove("d-none")
            productForm.reset()
            snackBarMsg(`The Product ${updatedObj.title} is Updated Succesfully..!!`,`success`,2000)
                
   }
   catch(err){
    cl(err)
    snackBarMsg(`Something Went Wrong While Updating..!!`,`error`,2000)
   }
}

const onProductDelete = async (ele) => {
   try{
   let result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      })
        if (result.isConfirmed) {
            let deleteId = ele.closest(".productContainer").id;
            let deleteUrl = `${baseUrl}/product/${deleteId}.json`;
            let res = await makeApiCall(deleteUrl,"DELETE")
            ele.closest(".col-md-4").remove()
            snackBarMsg(`The Product Deleted Successfully..!!`,`success`,2000)
        }
   }
   catch(err){
    cl(err)
   }

}

productForm.addEventListener("submit",onAddProduct)
showModalBtn.addEventListener("click",onShowHideHandler)
productClose.forEach(e=>e.addEventListener("click",onShowHideHandler))
updateBtn.addEventListener("click",onUpdateProduct);

