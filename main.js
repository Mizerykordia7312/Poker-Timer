// Main page - left list
const nextBlinds = document.querySelector('.next-blinds');
const averageStack = document.querySelector('.average-stack');
const buyIns = document.querySelector('.buy-ins');
const rebuys = document.querySelector('.rebuys');
const totalChips = document.querySelector('.total-chips');
// Main page - timer
const timerCounter = document.querySelector('.timer__counter');
const currentBlinds = document.querySelector('.current-blinds');
const currentBlindsP = document.querySelector('.current-blinds-text');
const currentAnte = document.querySelector('.current-ante');
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const settingsBtn = document.querySelector('.settings-btn');
const rewindBtn = document.querySelector('.rewind-btn');
const forwardBtn = document.querySelector('.forward-btn');
const playIcon = document.querySelector('#play-icon');
// Main page - right list
const playersIn = document.querySelector('.players-in');
const totalMoney = document.querySelector('.total-money');
const firstReward = document.querySelector('.first-reward');
const secondReward = document.querySelector('.second-reward');
//  Settings
const settings = document.querySelector('.settings');
const settingsContainer = document.querySelector('.settings-container');
const buyInsInput = document.querySelector('.buy-ins-input');
const buyInValueInput = document.querySelector('.buy-in-value-input');
const rebuysInput = document.querySelector('.rebuys-input');
const startingStackInput = document.querySelector('.starting-stack-input');
const playersInInput = document.querySelector('.players-in-input');
const confirmBtn = document.querySelector('.confirm-btn');
const addBtn = document.querySelector('.add-btn');
// Blind settings
const deleteBtn = document.querySelector('.delete-btn');
const bigBlindInput = document.querySelector('.big-blind-input');
const smallBlindInput = document.querySelector('.small-blind-input');
// Btns adding blinds and breaks
const addBlindBtn = document.querySelector('.settings-container__add-blind');
const addBreakBtn = document.querySelector('.settings-container__add-break ');

const blindsData = {
	bigBlind: [],
	ante: [],
	smallBlind: [],
	duration: [],
};

const audioPokerChips = document.querySelector('.audio');
const audioChangeBlind = document.querySelector('.ding-audio');

let i = 0;
let time = 25 * 60;
let timerInterval;
let isValid = true;

// Funkcja pokazuje ustawienia
const showSettings = () => {
	settings.classList.remove('animation-hide-start');
	settings.classList.add('animation-start');
};

// Funkcja uzupełnia tablice z blindami i ich długością, nadpisuje zmienną time
const fillBlindsObject = () => {
	blindsData.bigBlind = [];
	blindsData.ante = [];
	blindsData.smallBlind = [];
	blindsData.duration = [];

	const validInput = (input, min) => {
		if (!input.value || input.value < min) {
			isValid = false;
			return min;
		} else {
			return input.value;
		}
	};

	const allBigBlindInputs = document.querySelectorAll('.big-blind-input');
	allBigBlindInputs.forEach((input) => {
		blindsData.bigBlind.push(validInput(input, 1));
	});

	const allAnteInputs = document.querySelectorAll('.ante-input');
	allAnteInputs.forEach((input) => {
		blindsData.ante.push(validInput(input, 0));
	});

	const allSmallBlindInputs = document.querySelectorAll('.small-blind-input');
	allSmallBlindInputs.forEach((input) => {
		blindsData.smallBlind.push(validInput(input, 1));
	});

	const allDurationInputs = document.querySelectorAll('.duration-input');
	allDurationInputs.forEach((input) => {
		blindsData.duration.push(validInput(input, 1));
	});

	time = blindsData.duration[i] * 60;
};

// Funkcja sprawdza czy w tablicach już coś jest, jeśli nie to wyłącza btn do ich cofania
const checkRewindBtn = () => {
	if (i == 0) {
		rewindBtn.disabled = true;
	}
};

// Funkcja chowa ustawienia, sprawdza czy można je dalej edytować, jeśli tak to pokazuje je na strone. Daje też zabezpieczenie że jeżeli następny blind nie jest określony to dodaje ostrzeżenie
const hideSettings = () => {
	if (currentBlinds.classList.contains('editable')) {
		fillBlindsObject();

		if (!isValid) {
			console.log('Fill the inputs');
			isValid = true;
			return;
		}

		settings.classList.remove('animation-start');
		setValues();
		settings.classList.add('animation-hide-start');

		timerCounter.textContent = `${blindsData.duration[0]}:00`;

		currentBlinds.textContent = `${blindsData.bigBlind[0]}/${blindsData.smallBlind[0]}`;

		currentAnte.textContent = blindsData.ante[0];

		nextBlinds.textContent = `${blindsData.bigBlind[1]} / ${blindsData.smallBlind[1]}`;

		currentBlinds.classList.remove('editable');
	}

	if (i == blindsData.bigBlind.length - 1) {
		nextBlinds.textContent = 'Add new blinds';
	}
};

// Funkcja umieszcza wartości po bokach timera
const setValues = () => {
	buyIns.textContent = buyInsInput.value;
	rebuys.textContent = rebuysInput.value;
	playersIn.textContent = playersInInput.value;

	totalChips.textContent =
		(+buyInsInput.value + +rebuysInput.value) * startingStackInput.value;

	if (playersInInput.value == 0) {
		averageStack.textContent = 'Complete the data';
	} else {
		averageStack.textContent = Math.floor(
			+totalChips.textContent / playersInInput.value
		);
	}

	totalMoney.textContent = `${
		(+buyInsInput.value + +rebuysInput.value) * buyInValueInput.value
	}zł`;

	const totalMoneyValue = parseFloat(totalMoney.textContent);

	firstReward.textContent = `1. ${Math.round(totalMoneyValue * 0.7)}zł`;
	secondReward.textContent = `2. ${Math.round(totalMoneyValue * 0.3)}zł`;
};

// Funkcja obsługuje zarządzenie btn play/pause
const handlePlayBtn = () => {
	if (playIcon.classList.contains('fa-play')) {
		playIcon.classList.remove('fa-play');
		playIcon.classList.add('fa-pause');
		timerInterval = setInterval(countTime, 1000);
	} else {
		playIcon.classList.remove('fa-pause');
		playIcon.classList.add('fa-play');
		timerInterval = clearInterval(timerInterval);
	}
};

// Funkcja odpowiada za dzaiałanie timera
const countTime = () => {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;

	seconds = seconds < 10 ? '0' + seconds : seconds;

	timerCounter.textContent = `${minutes}:${seconds}`;

	if (minutes === 1 && seconds == 0) {
		audioPokerChips.play();
	}

	if (time > 0) {
		time--;
	} else {
		clearInterval(timerInterval);
		audioChangeBlind.play();
		i++;
		changeBlinds();
	}
};

// Funkcja obsługuje rewindBtn
const handleRewidnBtn = () => {
	if (i <= 0) {
		return;
	} else {
		clearInterval(timerInterval);
		forwardBtn.disabled = false;
		i--;
		changeBlinds();
		if (playIcon.classList.contains('fa-play')) {
			playIcon.classList.remove('fa-play');
			playIcon.classList.add('fa-pause');
		}
	}

	checkRewindBtn();
};

// Funkcja obsługuje forwardBtn
const handleForwardBtn = () => {
	if (i + 1 >= blindsData.duration.length) {
		return;
	} else {
		clearInterval(timerInterval);
		i++;
		changeBlinds();
		if (playIcon.classList.contains('fa-play')) {
			playIcon.classList.remove('fa-play');
			playIcon.classList.add('fa-pause');
		}
	}

	if (i + 1 == blindsData.duration.length) {
		nextBlinds.textContent = 'Add new blinds';
		forwardBtn.disabled = true;
	}

	if (i !== 0) {
		rewindBtn.disabled = false;
	}
};

// Funkcja przełącza blindy na następne
const changeBlinds = () => {
	if (i >= blindsData.bigBlind.length && i > 0) {
		timerCounter.textContent = 'GAME OVER';
		currentBlinds.textContent = '';
		currentBlindsP.textContent = '';
		nextBlinds.textContent = 'Add new blinds';
		clearInterval(timerInterval);
	} else {
		currentBlinds.textContent = `${blindsData.bigBlind[i]}/${blindsData.smallBlind[i]}`;

		currentAnte.textContent = blindsData.ante[i];

		nextBlinds.textContent = `${blindsData.bigBlind[i + 1]} / ${
			blindsData.smallBlind[i + 1]
		}`;

		time = blindsData.duration[i] * 60;
		timerInterval = setInterval(countTime, 1000);
		currentBlindsP.textContent = 'Current Blinds';

		if (i == blindsData.bigBlind.length - 1) {
			nextBlinds.textContent = 'Add new blinds';
		}
	}
};

// Funkcja dodaje nową przerwe
const addBreak = () => {
	let newBlinds = document.createElement('div');
	newBlinds.setAttribute('class', 'settings-container__break');
	newBlinds.innerHTML = `<div class="input-field"><label for="break-length" class="break-label">Break length:</label>
                    <input type="number" id="break-length" class="break-input" placeholder="Minutes">
                </div>
                <button class="settings-container__break-btn delete-btn">
                    <i class="fa-solid fa-xmark"></i>
                </button>`;
	settingsContainer.appendChild(newBlinds);
	settingsContainer.scrollTop = settingsContainer.scrollHeight;

	const allBreaksBtn = document.querySelectorAll(
		'.settings-container__break-btn'
	);

	allBreaksBtn.forEach((btn) => btn.addEventListener('click', deleteBreak));
};

// Funkcja usuwa przerwe
const deleteBreak = (e) => {
	e.target.closest('.settings-container__break').remove();
};

// Funkcja dodaje nowe blindy w ustawieniach
const addNewBlinds = () => {
	let newBlinds = document.createElement('div');
	newBlinds.setAttribute('class', 'blinds-settings');
	newBlinds.innerHTML = `<label>
                    <p>Big Blind:</p>
                    <input type="number" class="big-blind-input" >
                </label>
                <label>
                    <p>Ante:</p>
                    <input type="number" class="ante-input" >
                </label>
                <label>
                    <p>Small Blind:</p>
                    <input type="number" class="small-blind-input" m>
                </label>
                <label>
                    <p>Duration:</p>
                    <input type="number" class="duration-input"  step="10">
                </label>

                <button class="blinds-settings__btn delete-btn"><i class="fa-solid fa-xmark"></i></button>`;
	settingsContainer.appendChild(newBlinds);
	settingsContainer.scrollTop = settingsContainer.scrollHeight;

	const allDeleteBtns = document.querySelectorAll('.blinds-settings__btn');
	allDeleteBtns.forEach((deleteBtn) => {
		deleteBtn.addEventListener('click', removeBlinds);
	});
};

// Funkcja usuwa blindy w ustawieniach ale tylko wizualnie
const removeBlinds = (e) => {
	e.target.closest('div').remove();
};

checkRewindBtn();
settingsBtn.addEventListener('click', showSettings);
confirmBtn.addEventListener('click', hideSettings);
playBtn.addEventListener('click', handlePlayBtn);
forwardBtn.addEventListener('click', handleForwardBtn);
rewindBtn.addEventListener('click', handleRewidnBtn);
addBlindBtn.addEventListener('click', addNewBlinds);
addBreakBtn.addEventListener('click', addBreak);
