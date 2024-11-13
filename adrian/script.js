const mockApi = "https://6733ff4ba042ab85d11898ff.mockapi.io/api/v1/ToDO";
const $ = selector => document.querySelector(selector);
const $TASKNAME = $("#name-task");
const $TASKDSCRPT = $("#dscrp-task");
const $ADDTASKBTN = $("#add-task");
const $TASKCONTAINER = $("#task-container");
const $PAGEINFO = $("#page-info");
const $SEARCHTASK = $("#search-task");

let currentPage = 1;
const itemsPerPage = 10;
let allTasks = [];
let filteredTasks = [];

const loadTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    allTasks = JSON.parse(storedTasks);
    filteredTasks = allTasks;
    renderPage(currentPage);
  } else {
    fetchMock();
  }
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
};

const fetchMock = async () => {
  try {
    const response = await fetch(mockApi);
    const data = await response.json();
    allTasks = data;
    filteredTasks = allTasks;
    renderPage(currentPage);
  } catch (error) {
    console.error("Error al obtener la lista de tareas:", error);
  }
};

const renderPage = (page) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const tasksToDisplay = filteredTasks.slice(startIndex, endIndex);
  const cardTask = tasksToDisplay.map(el => `
    <div id="task-${el.id}">
      <h3>${el.name}</h3>
      <p>${el.description}</p>
    </div>`).join("");
  $TASKCONTAINER.innerHTML = cardTask;
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  $PAGEINFO.textContent = `Página ${page} de ${totalPages}`;
};

const nextPage = () => {
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
};

const $NEXTBTN = $("#next-page");
const $PREVBTN = $("#prev-page");

$NEXTBTN.addEventListener("click", e => {
  e.preventDefault();
  nextPage();
});

$PREVBTN.addEventListener("click", e => {
  e.preventDefault();
  prevPage();
});

const addTask = (name, description) => {
  if (name && description) {
    const newTask = {
      id: allTasks.length + 1,
      name: name,
      description: description
    };
    allTasks.push(newTask);
    filteredTasks = allTasks;
    saveTasksToLocalStorage();
    renderPage(currentPage);
  } else {
    alert("Por favor, complete ambos campos.");
  }
};

const clearInputs = () => {
  $TASKNAME.value = "";
  $TASKDSCRPT.value = "";
};

$ADDTASKBTN.addEventListener("click", e => {
  e.preventDefault();
  const name = $TASKNAME.value;
  const description = $TASKDSCRPT.value;
  addTask(name, description);
  clearInputs();
});

const searchTasks = (query) => {
  query = query.toLowerCase();
  filteredTasks = allTasks.filter(task => 
    task.name.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
  );
  renderPage(currentPage);
};

$SEARCHTASK.addEventListener("input", e => {
  const query = e.target.value;
  searchTasks(query);
});

loadTasksFromLocalStorage();

