let inp1 = $('.add-name')
let inp2 = $('.add-price')
let inp3 = $('.add-text')
let inp4 = $('.img')
let editInp = $('.edit-name')
let editPrice = $('.edit-price')
let editText = $('.edit-text')
let editImg = $('.edit-img')
let editItemId = null;
let pageCount = 1;
let page = 1;
let searchText = '';
let list = $(".list")


$('#search-inp').on('input', function(e){
    searchText = e.target.value
    render()
    page = 1
})

let promise = fetch('http://localhost:8000/Kawasaki')
promise.then((response) => response.json())
    .then((data) => {
        console.log(data);



    })

$('.btn-addElem').on('click', function () {
    $('.main-modal').css('display', 'block')
})



$('.btn-save').on('click', function () {
    let newGood = {
        name: inp1.val(),
        price: inp2.val(),
        descr: inp3.val(),
        img: inp4.val()
    }
    inp1.val('')
    inp2.val('')
    inp3.val('')
    inp4.val('')
    addGoods(newGood)
    $('.main-modal').css('display', 'none')


})

function addGoods(newGood) {
    fetch('http://localhost:8000/Kawasaki', {
        method: "POST",
        body: JSON.stringify(newGood),
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }
    })
        .then(() => render())
}

async function render() {
    let res = await fetch(`http://localhost:8000/Kawasaki?_page=${page}&_limit=6&q=${searchText}`)
    let data = await res.json()
    list.html('')
    console.log(data)
    getPagination()
    data.forEach(item => {
        list.append(`
                <div class="card m-4" style="width: 18rem;">
  <img class="card-img-top" src=${item.img} alt="Card image cap">
  <div id=${item.id} class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <p class="card-text">${item.descr}</p>
    <a href="#" class="btn btn-success">${item.price}</a>
    <button type="button" id="delete${item.id}" class="btn btn-sm btn-outline-secondary">Delete</button>
    <button type="button" id="edit-btn" class="btn btn-sm btn-outline-secondary">Edit</button>
  </div>
</div>
        `)

        $('body').on('click', `#delete${item.id}`, function(e){            
        fetch(`http://localhost:8000/Kawasaki/${item.id}`, {
            method: "DELETE"
        })
        .then(() => render())
        })
        $('body').on('click', `#edit-btn`, function(event){
            console.log(event.target.parentNode.id)
            editItemId = event.target.parentNode.id
            console.log(editItemId);
            $('.main-modal1').css('display', 'block')
            fetch(`http://localhost:8000/Kawasaki/${editItemId }`)
            .then(res => res.json())
            .then(data => {
                $('.edit-name').val(data.name)
                $(".edit-price").val(data.price)
                $('.edit-text').val(data.descr)
                $('.edit-img').val(data.img)
        
            })

        } )
        
        $('.btn-save1').on('click', function(e){
            console.log(item.id)
            let obj = {
                name: $('.edit-name').val(),
                price: $('.edit-price').val(),
                descr: $('.edit-text').val(),
                img: $('.edit-img').val()
            }
            fetch(`http://localhost:8000/Kawasaki/${editItemId}`, {
                method: "PUT",
                body: JSON.stringify(obj),
                headers: {
                    "Content-type": 'application/json'
                }
                
            }).then(render())
            $('.main-modal1').css('display', 'none')

            
        })
    });

}

function getPagination (){
    fetch(`http://localhost:8000/Kawasaki?q=${searchText}`)
    .then(res => res.json())
    .then(data => {
        pageCount = Math.ceil(data.length /6)
        $('.pagination-page').remove();
        for(let i = pageCount; i >=1; i--){
            $('.previous-btn').after(`
            <span class="pagination-page">
            <a href="#">${i}</a>
            </span>
            `)
        }
    })
}


$('.next-btn').on('click', function(){
    if(page >= pageCount) return
    page++
    render()
})

$('.previous-btn').on('click', function(){
    if(page <= 1) return
    page--
    render()
})

$('body').on('click', '.pagination-page', function(e){
    page = e.target.innerText
    render()
})

$('.btn-close').on("click", function () {
    $('.main-modal').css('display', 'none')
})
$('.btn-close').on("click", function () {
    $('.main-modal1').css('display', 'none')
})
render()
$(document).ready(render);