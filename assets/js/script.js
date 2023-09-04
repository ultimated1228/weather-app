// Attach an event listener left nav submit button
$(document).ready(function () {
    const searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];

    function displaySearchedCities() {
        const searchedCitiesList = $(".searchedCities");
        searchedCitiesList.empty();

        searchedCities.forEach(city => {
            const cityItem = $("<li>");
            cityItem.addClass("button searchedCityButtons is-responsive");
            cityItem.text(city);
            searchedCitiesList.append(cityItem);
        });
    }

    displaySearchedCities();


$(".is-info").on("click", function () {
    performSearch();
});

$(".input").on("keypress", function (event) {
    if (event.keyCode === 13) {
        performSearch();
    }
});

    function performSearch() {
        let cityName = $(".input").val();

        if (cityName.trim() === "") {
            alert("Please enter a valid city name.")
            return;
        }

        // Define the API URL and city name
        const apiKey = 'ff4b270447cfc07eabd21f6a279aaaa6';
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        // Function to fetch weather data
        function getWeatherData() {
            fetch(weatherAPI)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // log weather data
                    console.log(data);

                    // Save the searched city to local storage
                    searchedCities.push(cityName);
                    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

                    // Display the updated list of searched cities
                    displaySearchedCities();
                })
                .catch(error => {
                    // Handle errors
                    console.error('There was a problem fetching weather data:', error);

                });
        }

        getWeatherData();
        // Clear the input field
        $(".input").val("");
        $(".input").focus();
    }
});