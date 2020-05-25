window.addEventListener('load', start);

let preloader = null;
let formSearch = null;
let inputSearch = null;
let containerNotFound = null;
let containerUsers = null;
let containerNotStatistics = null;
let containerStatistics = null;

let users = [];

async function start() {
  preloader = document.querySelector('#preloader');
  inputSearch = document.querySelector('#input-search');
  formSearch = document.querySelector('#form-search');
  containerNotFound = document.querySelector('#container-not-found');
  containerUsers = document.querySelector('#container-users');
  containerNotStatistics = document.querySelector('#container-not-statistics');
  containerStatistics = document.querySelector('#container-statistics');

  await loadUsers();

  preloader.style.display = 'none';

  formSearch.addEventListener('submit', render);

  render();
}

async function loadUsers() {
  const response = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const res = await response.json();
  users = res.results.map((obj) => {
    return {
      name: `${obj.name.first} ${obj.name.last}`,
      age: obj.dob.age,
      picture: obj.picture.thumbnail,
      gender: obj.gender,
    };
  });
  // users = results.
}

function showNotFound() {
  containerUsers.style.display = 'none';
  containerStatistics.style.display = 'none';
  containerNotFound.style.display = 'block';
  containerNotStatistics.style.display = 'block';
}

function showContainerData() {
  containerNotFound.style.display = 'none';
  containerNotStatistics.style.display = 'none';
  containerUsers.style.display = 'block';
  containerStatistics.style.display = 'block';
}

function getStatistics(users) {
  const male = users.filter((obj) => obj.gender === 'male').length;
  const female = users.filter((obj) => obj.gender === 'female').length;
  const sumAges = users.reduce((total, obj) => (total += obj.age), 0);
  const avgAges = (sumAges / users.length).toFixed(2);

  return {
    male,
    female,
    sumAges,
    avgAges,
  };
}

function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function render(event) {
  if (event) {
    event.preventDefault();
  }

  const searchText = inputSearch.value.toLowerCase();

  let foundUsers = [];

  if (searchText) {
    foundUsers = users.filter((obj) => {
      return removeAccents(obj.name).toLowerCase().search(searchText) >= 0;
    });
  }

  if (foundUsers.length) {
    renderUsers(foundUsers);
    renderStatistics(foundUsers);
    showContainerData();
  } else {
    showNotFound();
  }
}

function renderUsers(users) {
  const contentUsers = users
    .map(
      (obj) => `
      <div class="flex flex-center user-item">
        <div style="margin-right: 10px;">
          <img src="${obj.picture}" alt="" class="circle responsive-img">
        </div>
        <div class="flex-full">
          <span>
            ${obj.name}, ${obj.age} anos
          </span>
        </div>
      </div>
      `
    )
    .join('');

  containerUsers.innerHTML = `
    <h4>${users.length} usuário(s) encontrado(s)</h4>
    ${contentUsers}
  `;
}

function renderStatistics(users) {
  const statistics = getStatistics(users);

  containerStatistics.innerHTML = `
    <h4>Estatísticas</h4>
    <p>Sexo masculino: <b>${statistics.male}</b></p>
    <p>Sexo feminino: <b>${statistics.female}</b></p>
    <p>Soma das idades: <b>${statistics.sumAges}</b></p>
    <p>Média das idades: <b>${statistics.avgAges}</b></p>
  `;

  const canvas = document.createElement('canvas');

  canvas.style.maxWidth = '500px';

  new Chart(canvas, {
    type: 'pie',
    data: {
      labels: ['Sexo feminino', 'Sexo masculino'],
      datasets: [
        {
          label: 'Qtd de usuários',
          data: [statistics.female, statistics.male],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    },
  });

  containerStatistics.appendChild(canvas);
}
