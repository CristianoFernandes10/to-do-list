const input = document.querySelector('#inputTarefa')
const btn = document.querySelector('#btnTarefa')
let msn = document.querySelector('#msnTarefa')
const lista = document.querySelector('#listaTarefa')

let tarefas = []
function salvarLocalStorage(){
    const arrayParaString = JSON.stringify(tarefas)
    localStorage.setItem('tarefas', arrayParaString)
}

function carregarLocalStorage(){
    const stringParaArray = localStorage.getItem('tarefas')
    if(!stringParaArray){
        return
    }
    
    tarefas = JSON.parse(stringParaArray)
    
    tarefas.forEach(tarefa =>{
        renderizarLista(tarefa)
    })
}

function formataString(){
    let inputValue = input.value.trim()
    let formata = inputValue.split(' ').map(elemento =>{
        return elemento.charAt(0).toUpperCase() + elemento.slice(1)
    }).join(' ')
    return formata
}


function formataInputEditar(texto){
    let formatada = texto.split(' ').map(elemento =>{
        return elemento.charAt(0).toUpperCase() + elemento.slice(1)
    }).join(' ')
    return formatada
}

function validaString(texto){
    if(texto === "" || !isNaN(texto)){
        return false
    }else{
        return true
    }
}

function validaDuplicada(formatado){
    let duplicada = tarefas.some(elemento => elemento.texto === formatado)
    return duplicada
}


input.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        executar()
    }
})

btn.addEventListener('click', executar)

function executar(){
    let formatado = formataString()
    let validado = validaString(formatado)
    if(!validado){
        msn.textContent = `Preencha o campo corretamente`
        msn.style.color = 'red'
        return
    }
    
    let duplicado = validaDuplicada(formatado)
    if(duplicado){
        msn.textContent = 'Tarefa já existe'
        msn.style.color = 'red'
        input.value = ""
        return
    }
    
    limpar()
    
    let objetoCriado = criarObjeto(formatado)
    
    atualizarLista(objetoCriado)
    
    renderizarLista(objetoCriado)
    
}

function criarObjeto(texto){
    let objeto = {
        id : Date.now(),
        texto: texto,
        concluida: false
    }
    return objeto
}

function renderizarLista(tarefa){
    input.focus()
    let item = document.createElement('li')
    item.classList.add('itemTarefa')
    let spanItem = document.createElement('span')
    spanItem.classList.add('spanItem')
    const btnEditar = document.createElement('button')
    const btnRemove = document.createElement('button')
    btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    btnEditar.classList.add('btnEditar')
    btnEditar.dataset.idEditar = tarefa.id
    btnEditar.dataset.modo = 'editar'
    btnRemove.innerHTML = '<i class="fa-solid fa-delete-left"></i>'
    btnRemove.classList.add('btnRemove')
    btnRemove.dataset.idRemove = tarefa.id
    const btnConcluida = document.createElement('button')
    btnConcluida.innerHTML = '<i class="fa-solid fa-check"></i>'
    btnConcluida.classList.add('btnConcluida')
    btnConcluida.dataset.idConcluida = tarefa.id
    
    let div = document.createElement('div')
    div.classList.add('botoes')
    div.appendChild(btnEditar)
    div.appendChild(btnRemove)
    div.appendChild(btnConcluida)
    
    spanItem.textContent = tarefa.texto
    
    if(tarefa.concluida === true){
        item.classList.add('concluida')
        btnConcluida.innerHTML = '<i class="fa-solid fa-x"></i>'
        btnEditar.disabled = true
    }
    
    
    btnEditar.addEventListener('click', function(){
        let id = Number(btnEditar.dataset.idEditar)
        
        let tarefa = tarefas.find(elemento => elemento.id === id)
        
        if(btnEditar.dataset.modo === 'editar'){
            let inputSpan = document.createElement('input')
            inputSpan.classList.add('inputSpan')
            let spanValue = spanItem.textContent
            inputSpan.value = spanValue
            spanItem.style.display = 'none'
            item.insertBefore(inputSpan, div)
            inputSpan.focus()
            btnEditar.innerHTML = '<i class="fa-solid fa-check"></i>'
            btnConcluida.classList.add('disabled')
            btnConcluida.disabled = true
            btnEditar.dataset.modo = 'salvar'
        }else{
            btnConcluida.classList.remove('disabled')
            btnConcluida.disabled = false
            let inputSpan = item.querySelector('input')
            let inputValue = inputSpan.value.trim()
            
            let formatado = formataInputEditar(inputValue)
            
            
            let validado = validaString(formatado)
            if(!validado){
                msn.textContent = `Preencha o campo corretamente`
                msn.style.color = 'red'
                inputSpan.focus()
                return
            }
            limpar()
            
            let duplicada = tarefas.some(elemento =>{
                return elemento.texto === formatado && elemento.id !== id
            })
            
            if(duplicada){
                msn.textContent = 'Tarefa já existe'
                msn.style.color = 'red'
                inputSpan.value = ""
                inputSpan.focus()
                return
            }
            limpar()
            spanItem.style.display = 'inline-block'
            spanItem.textContent = formatado
            inputSpan.remove()
            tarefa.texto = formatado
            btnEditar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
            btnEditar.dataset.modo = 'editar'
            salvarLocalStorage()
        }
    })
    
    
    
    
    btnRemove.addEventListener('click', function(){
        div.parentElement.remove()
        
        let removeId = Number(btnRemove.dataset.idRemove)
        
        tarefas = tarefas.filter(elemento =>{
            return elemento.id !== removeId
        })

        salvarLocalStorage()
    })
    
    
    
    
    
    btnConcluida.addEventListener('click', function(){
        let concluidaId = Number(btnConcluida.dataset.idConcluida)

        let tarefa = tarefas.find(elemento =>{
            return elemento.id === concluidaId
        })
        
        
        tarefa.concluida = !tarefa.concluida
        
        if(tarefa.concluida === true){
            item.classList.add('concluida')
            btnConcluida.innerHTML = '<i class="fa-solid fa-x"></i>'
            btnEditar.disabled = true
            btnEditar.classList.add('disabled')
        }else{
            item.classList.remove('concluida')
            btnConcluida.innerHTML = '<i class="fa-solid fa-check"></i>'
            btnEditar.disabled = false
            btnEditar.classList.remove('disabled')
        }

        salvarLocalStorage()
    })
    
    item.appendChild(spanItem)
    item.appendChild(div)
    lista.appendChild(item)
}

function atualizarLista(tarefa){
    tarefas.push(tarefa)
    salvarLocalStorage()
}


function limpar(){
    msn.textContent = ""    
    msn.style.color = 'black'
    input.value = ""
}

carregarLocalStorage()














































