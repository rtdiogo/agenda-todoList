const form = document.querySelector("#itemForm");
const itemInput = document.querySelector("#itemInput");
const itemList = document.querySelector("#itemList");
const messageDiv = document.querySelector("#menssagem");
const clearButton = document.querySelector("#clearBtn");
const filters = document.querySelectorAll(".nav-item");

let agendaItens = [];

// Cria uma lista vazia para armazenar
const mostrarAlerta = function (menssagem, msgClass) {
  console.log("msg");
  messageDiv.innerHTML = menssagem;
  messageDiv.classList.add(msgClass, "show");
  messageDiv.classList.remove("hide");
  setTimeout(() => {
    messageDiv.classList.remove("show",msgClass);
    messageDiv.classList.add("hide");
  }, 3500);
  return;
};
// filtrar os itens nas abas que foram selecionadas
const getItemsFilter = function (type) {
  let filtrarItens = [];
  console.log(type);
  switch (type) {
    case "pendentes":
      filtrarItens = agendaItens.filter((item) => !item.isDone);
      break;
    case "feitas":
      filtrarItens = agendaItens.filter((item) => item.isDone);
      break;
    default:
      filtrarItens = agendaItens;
  }
  getList(filtrarItens);
};

// edita o item
const updateItem = function (itemIndex, novo) {
  console.log(itemIndex);
  const novoItem = agendaItens[itemIndex];
  novoItem.name = novo;
  agendaItens.splice(itemIndex, 1, novoItem);
  setLocalStorage(agendaItens);
};

// deleta o item
const removeItem = function (item) {
  const removeIndex = agendaItens.indexOf(item);
  agendaItens.splice(removeIndex, 1);
};

//checar itens com bootstrap
const handleItem = function (itemData) {
  const items = document.querySelectorAll(".list-group-item");
  items.forEach((item) => {
    if (
      item.querySelector(".title").getAttribute("data-time") == itemData.addedAt
    ) {
      item.querySelector("[data-done]").addEventListener("click", function (e) {
        e.preventDefault();
        const itemIndex = agendaItens.indexOf(itemData);
        const currentItem = agendaItens[itemIndex];
        const currentClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";
        currentItem.isDone = currentItem.isDone ? false : true;
        agendaItens.splice(itemIndex, 1, currentItem);
        setLocalStorage(agendaItens);

        const iconClass = currentItem.isDone
          ? "bi-check-circle-fill"
          : "bi-check-circle";

        this.firstElementChild.classList.replace(currentClass, iconClass);
        const filterType = document.querySelector("#filterType").value;
        getItemsFilter(filterType);
      });
      // edita
      item.querySelector("[data-edit]").addEventListener("click", function (e) {
        e.preventDefault();
        itemInput.value = itemData.name;
        document.querySelector("#citem").value = agendaItens.indexOf(itemData);
        return agendaItens;
      });

      //deleta
      item
        .querySelector("[data-delete]")
        .addEventListener("click", function (e) {
          e.preventDefault();
          if (confirm("Excluir item??")) {
            itemList.removeChild(item);
            removeItem(item);
            setLocalStorage(agendaItens);
            mostrarAlerta("Tarefa excluída.", "alert-success");
            return agendaItens.filter((item) => item != itemData);
          }
        });
    }
  });
};
// listar itens com bootstrap
const getList = function (agendaItens) {
  itemList.innerHTML = "";
  if (agendaItens.length > 0) {
    agendaItens.forEach((item) => {
      const iconClass = item.isDone
        ? "bi-check-circle-fill"
        : "bi-check-circle";
      itemList.insertAdjacentHTML(
        "beforeend",
        `<li class="list-group-item d-flex justify-content-between align-items-center">
          <span class="title" data-time="${item.addedAt}">${item.name}</span> 
          <span>
              <a href="#" data-done><i class="bi ${iconClass} green"></i></a>
              <a href="#" data-edit><i class="bi bi-pencil-square blue"></i></a>
              <a href="#" data-delete><i class="bi bi-x-circle red"></i></a>
          </span>
        </li>`
      );
      handleItem(item);
    });
  } else {
    itemList.insertAdjacentHTML(
      "beforeend",
      `<li class="list-group-item d-flex justify-content-between align-items-center">
        No record found.
      </li>`
    );
  }
};

const getLocalStorage = function () {
  const todoStorage = localStorage.getItem("agendaItens");
  if (todoStorage === "undefined" || todoStorage === null) {
    agendaItens = [];
  } else {
    agendaItens = JSON.parse(todoStorage);
  }
  getList(agendaItens);
};
const setLocalStorage = function (agendaItens) {
  localStorage.setItem("agendaItens", JSON.stringify(agendaItens));
};

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const itemName = itemInput.value.trim();
    if (itemName.length === 0) {
      mostrarAlerta("Por favor digite uma tarefa válida.", "alert-danger");
      return;
    } else {
      const currenItemIndex = document.querySelector("#citem").value;
      if (currenItemIndex) {
        updateItem(currenItemIndex, itemName);
        document.querySelector("#citem").value = "";
        mostrarAlerta("Tarefa alterada.", "alert-success");
      } else {
      
        const itemObj = {
          name: itemName,
          isDone: false,
          addedAt: new Date().getTime(),
        };
        agendaItens.push(itemObj);
       
        setLocalStorage(agendaItens);
        mostrarAlerta("Tarefa adicionada com sucesso.", "alert-success");
      }

      getList(agendaItens);
      // pega a lista de todos os itens
    }
    console.log(agendaItens);
    itemInput.value = "";
  });

  
  filters.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const tabType = this.getAttribute("data-type");
      document.querySelectorAll(".nav-link").forEach((nav) => {
        nav.classList.remove("active");
      });
      this.firstElementChild.classList.add("active");
      document.querySelector("#filterType").value = tabType;
      getItemsFilter(tabType);
    });
  });

  // carrega os itens
  getLocalStorage();
});
