(function () {
	function HttpRequest(method, url, data = null) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();

			xhr.open(method, url);

			xhr.onload = function () {
				if(this.status === 200) {
					resolve(this.response);
				} else {
					reject(new Error(this.statusText));
				}
			};

			xhr.send(data);
		});
	}

	function HttpGet(url) {
		return HttpRequest('GET', url);
	}

	function HttpPost(url, data) {
		return HttpRequest('POST', url, data);
	}

	let photoLoaderPanel = document.getElementById('photo-loader-panel');
	let resultPanel = document.getElementById('result-panel');
	let selectButton = document.getElementById('photo-loader-panel__button');
	let fileInput = document.getElementById('file-input');
	let imagePreview = document.getElementById('image-preview');
	let checkButton = document.getElementById('check-button');
	let resultText = document.getElementById('result-text');
	console.log('fileInput', fileInput);

	let firstTime = true;
	let base64ImageToUpload = null;
	let statusText = {
		'modified': 'Modified',
		'original': 'Original'
	};

	selectButton.addEventListener('click', () => fileInput.click());
	fileInput.addEventListener('change', selectedFilesChanged);
	checkButton.addEventListener('click', startImageCheck);

	function attachImagePreview(base64Image) {
		base64ImageToUpload = base64Image;
		imagePreview.src = base64ImageToUpload;
	}

	function clearResultPanel() {
		checkButton.classList.remove('loading');
		checkButton.classList.remove('hide-loading');

		checkButton.classList.add('invisible');
		resultText.classList.add('invisible');
	}

	function selectedFilesChanged() {
		clearResultPanel();
		selectButton.disabled = true;
		base64ImageToUpload = null;

		let files = this.files;
		if(files.length === 0) {
			imagePreview.src = '';
		} else {
			let file = files[0];

			let reader = new FileReader();
			reader.onload = onPhotoLoaded;
			reader.readAsDataURL(file);
		}
	}

	function onPhotoLoaded(event) {
		selectButton.disabled = false;
		attachImagePreview(event.target.result);
		checkButton.classList.remove('invisible');
		if(firstTime) {
			animatePanels();
			firstTime = false;
		}
	}

	function startImageCheck() {
		startWait();


		let promise = HttpPost('/check', JSON.stringify({'image': base64ImageToUpload}));

		promise.then(
			(response) => {
				let imageStatus = JSON.parse(response).status;
				resultReady(imageStatus);
			},
			(error) => {
                // TODO: show smth meaningful
            }
            );
	}

	function startWait() {
		checkButton.classList.add("loading");
	}

	function resultReady(imageStatus) {
		checkButton.classList.add("hide-loading");
		checkButton.classList.add('invisible');

		resultText.classList.remove('invisible');
		resultText.innerText = statusText[imageStatus];
	}

	function animatePanels() {
		photoLoaderPanel.classList.remove('width-100');
		photoLoaderPanel.classList.add('width-transition');
		photoLoaderPanel.classList.add('width-50');

		resultPanel.classList.remove('width-0');
		resultPanel.classList.add('width-transition');
		resultPanel.classList.add('width-50');

		setTimeout(() => {
			let resultContent = document.getElementById('result-panel__content');
			resultContent.classList.remove('invisible');
		}, 700);
	}

})();
