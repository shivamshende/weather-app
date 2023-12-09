const locationInput = document.getElementById('locationInput')
const searchButton = document.getElementById('searchButton')

function createPropertyElement(key, value, parentElement) {
    const propertyElement = document.createElement('div');
    propertyElement.classList.add('property');
    propertyElement.innerHTML = `<strong>${key}:</strong> ${value}`;
    parentElement.appendChild(propertyElement);
}

function fetchData(location) {
    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '30a8fbf5ccmshe82b868a3d0a85dp15f4aejsne52a84ac119b',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            const currentDataElement = document.getElementById('currentData');
            const currentElement = currentDataElement.querySelector('.current');
            const locationElement = currentDataElement.querySelector('.location');
            const weatherImage = document.getElementById('weatherImage')
            const windElement = currentDataElement.querySelector('.wind')
            const timeElement = currentDataElement.querySelector('.time')
            const humidityElement = currentDataElement.querySelector('.humidity')
            const conditionElement = currentDataElement.querySelector('.condition')

            // Displaying current weather data
            createPropertyElement('Temperature', `${result.current.temp_c}°C`, currentElement)

            // Displaying location data
            createPropertyElement('Location', result.location.name, locationElement);
            createPropertyElement('Country', result.location.country, locationElement);

            //Displaying more weather data as you needed
            createPropertyElement('wind speed', `${result.current.wind_kph}kp/h`, windElement)
            createPropertyElement('localTime', result.location.localtime, timeElement)
            createPropertyElement('Humidity', `${result.current.humidity}%`, humidityElement)
            createPropertyElement('Condition', result.current.condition.text, conditionElement)
        })
        .catch(error => {
            console.error(error);
        });
}

function showData() {
    const location = locationInput.value
    if (location) {
        fetchData(location)
    }
    document.getElementById('note').innerHTML = "Refresh the page first for next location"
}

locationInput.addEventListener("keydown", function(event){
    if(event.key === 'Enter'){
        showData()
    }
})

searchButton.addEventListener("click", function () {
    showData()
})