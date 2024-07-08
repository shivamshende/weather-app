const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const suggestionsList = document.getElementById('suggestions');

let autocompleteResults = [];

locationInput.focus();

function createPropertyElement(key, value, parentElement) {
    const propertyElement = document.createElement('div');
    propertyElement.classList.add('property');

    if (key === 'Condition') {
        const conditionText = document.createElement('div');
        conditionText.innerHTML = `<strong>${key}:</strong> ${value.text}`;
        parentElement.appendChild(conditionText);

        // const conditionImage = document.createElement('div');
        // conditionImage.innerHTML = `<img id="weatherIcon" src="${value.icon}" alt="${value.text}" />`;
        // parentElement.appendChild(conditionImage);
    } else {
        propertyElement.innerHTML = `<strong>${key}:</strong> ${value}`;
        parentElement.appendChild(propertyElement);
    }
}

function clearData() {
    const currentDataElement = document.getElementById('currentData');
    currentDataElement.querySelector('.current').innerHTML = '<h5>Weather:</h5>';
    currentDataElement.querySelector('.location').innerHTML = '<h5>Location:</h5>';
    currentDataElement.querySelector('.wind').innerHTML = '';
    currentDataElement.querySelector('.time').innerHTML = '';
    currentDataElement.querySelector('.humidity').innerHTML = '';
    currentDataElement.querySelector('.condition').innerHTML = '';
    currentDataElement.querySelector('.condition-image').innerHTML = '';
}

async function fetchPlaceSuggestions(query) {
    const url = `https://google-place-autocomplete-and-place-info.p.rapidapi.com/maps/api/place/autocomplete/json?input=${query}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '30a8fbf5ccmshe82b868a3d0a85dp15f4aejsne52a84ac119b',
            'x-rapidapi-host': 'google-place-autocomplete-and-place-info.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result.predictions || [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchData(location) {
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '30a8fbf5ccmshe82b868a3d0a85dp15f4aejsne52a84ac119b',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error.message);
        }

        const currentDataElement = document.getElementById('currentData');
        const currentElement = currentDataElement.querySelector('.current');
        const locationElement = currentDataElement.querySelector('.location');
        const windElement = currentDataElement.querySelector('.wind');
        const timeElement = currentDataElement.querySelector('.time');
        const humidityElement = currentDataElement.querySelector('.humidity');
        const conditionElement = currentDataElement.querySelector('.condition');
        const conditionImageElement = currentDataElement.querySelector('.condition-image');

        clearData();

        createPropertyElement('Temperature', `${result.current.temp_c}°C`, currentElement);

        createPropertyElement('Location', result.location.name, locationElement);
        createPropertyElement('Country', result.location.country, locationElement);

        createPropertyElement('Wind Speed', `${result.current.wind_kph} kp/h`, windElement);
        createPropertyElement('Local Time', result.location.localtime, timeElement);
        createPropertyElement('Humidity', `${result.current.humidity}%`, humidityElement);
        createPropertyElement('Condition', result.current.condition, conditionElement, conditionImageElement);

        const iconUrl = `https:${result.current.condition.icon}`;
        conditionImageElement.innerHTML = `<img id="weatherIcon" src="${iconUrl}" alt="${result.current.condition.text}" />`;

    } catch (error) {
        alert('Enter a valid place name');
        console.error(error);
    }
}

locationInput.addEventListener("input", async function(event) {
    const query = event.target.value;
    if (query.length > 2) {
        autocompleteResults = await fetchPlaceSuggestions(query);
        suggestionsList.innerHTML = '';
        autocompleteResults.forEach(result => {
            const option = document.createElement('option');
            option.value = result.description;
            suggestionsList.appendChild(option);
        });
    }
});

locationInput.addEventListener("keydown", async function(event) {
    if (event.key === 'Enter') {
        const selectedOption = suggestionsList.querySelector('option:checked');
        if (selectedOption) {
            const selectedPlace = autocompleteResults.find(result => result.description === selectedOption.value);
            if (selectedPlace) {
                fetchPlaceDetails(selectedPlace.place_id)
                    .then(placeDetails => {
                        const locationName = placeDetails.name || selectedOption.value;
                        fetchData(locationName);
                    })
                    .catch(error => {
                        console.error(error);
                        alert('Error fetching place details');
                    });
            }
        } else {
            const location = locationInput.value;
            if (location) {
                fetchData(location);
            } else {
                alert('Please enter a place name');
            }
        }
    }
});

searchButton.addEventListener("click", function() {
    const location = locationInput.value;
    if (location) {
        fetchData(location);
    } else {
        alert('Please enter a place name');
    }
});