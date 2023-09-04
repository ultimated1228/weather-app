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

    //   redisplay city info on .searchedCities click
    $(".searchedCities").on("click", ".searchedCityButtons", function () {
        let cityName = $(this).text();
        performSearch(cityName);
    });


    $(".is-info").on("click", function () {
        let cityName = $(".input").val();
        performSearch(cityName);
    });

    $(".input").on("keypress", function (event) {
        if (event.keyCode === 13) {
            let cityName = $(".input").val();
            performSearch(cityName);
        }
    });

    function handle404Error(cityName) {
        $("#errorCityName").text(cityName);
        $("#errorModal").css("display", "block");

        // Close the error modal when the "x" button is clicked
        $(".close").on("click", function () {
            $("#errorModal").css("display", "none");
        });

        // Close the error modal when the user clicks outside of it
        $(window).on("click", function (event) {
            if (event.target == document.getElementById("errorModal")) {
                $("#errorModal").css("display", "none");
            }
        });
    }

    function performSearch(cityName) {
        // let cityName = $(".input").val();


        if (cityName.trim() === "") {
            // Show the modal when the input is empty
            $("#myModal").css("display", "block");

            // Close the modal when the "x" button is clicked
            $(".close").on("click", function () {
                $("#myModal").css("display", "none");
            });

            // Close the modal when the user clicks outside of it
            $(window).on("click", function (event) {
                if (event.target == document.getElementById("myModal")) {
                    $("#myModal").css("display", "none");
                }
            });
            return;
        }

        // Define the API URL and city name
        const apiKey = 'ff4b270447cfc07eabd21f6a279aaaa6';
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},{state code}&units=imperial&appid=${apiKey}`;

        // Function to fetch weather data
        function getWeatherData() {
            fetch(weatherAPI)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            // Handle the 404 error and display the error modal
                            handle404Error(cityName);
                            return;
                        }
                    }
                    return response.json();
                })

                .then(data => {
                    // log weather data
                    console.log(data);

                    //set the card details
                    $(".currentWeatherHeader").empty();
                    let date = dayjs().format("(M/D/YYYY)")
                    let iconEl = $("<img />",
                        {
                            src: "'https://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png'",
                            width: 55,
                            height: 55,
                        })
                    let spanEl = $("<span>")
                    spanEl.css("vertical-align", "middle");
                    let srcPath = 'https://openweathermap.org/img/w/' + data.list[0].weather[0].icon + ".png"
                    let h2El = $("<h2 class = subtitle>")
                    h2El.text(data.city.name + date)
                    iconEl.attr("src", srcPath)
                    spanEl.append(iconEl)
                    h2El.append(spanEl)
                    $(".currentWeatherHeader").append(h2El)

                    $(".currentWeatherTemp").empty();
                    let temp = Math.ceil(data.list[0].main.temp)
                    $(".currentWeatherTemp").text("Temp: " + temp + " F")

                    $(".currentWeatherWind").empty();
                    $(".currentWeatherWind").text("Wind: " + data.list[0].wind.speed + " MPH")

                    $(".currentWeatherHumidity").empty();
                    $(".currentWeatherHumidity").text("Humidity: " + data.list[0].main.humidity + "%")

                    //for loop to update each of the 5 day weather cards
                    let cardIndex = 0;
                    for (let i = 2; i < data.list.length; i += 8) {
                        let dayData = data.list[i];
                        console.log(dayData)
                        let date = dayjs(dayData.dt_txt).format("MM/DD/YYYY");

                        let srcPathFiveDay = 'https://openweathermap.org/img/w/' + dayData.weather[0].icon + ".png";
                        let spanElFiveDay = $("<span>")
                        let pElFiveDay = $("<p>")
                        let iconElFiveDay = $("<img>", { src: srcPathFiveDay, width: 50, height: 50 });

                        spanElFiveDay.append(iconElFiveDay)
                        pElFiveDay.append(spanElFiveDay)

                        const temp = Math.ceil(dayData.main.temp) + " F";
                        const wind = dayData.wind.speed + " MPH";
                        const humidity = dayData.main.humidity + "%";

                        // Update the 5-day card at index i move up 8 on each iteration
                        const $fiveDayCard = $(".fiveDayCard").eq(cardIndex);
                        $fiveDayCard.find(".fiveDayCardHeader").text(date);
                        $fiveDayCard.find(".fiveDayCardIcon").empty().append(pElFiveDay);
                        $fiveDayCard.find(".fiveDayCardTemp").text("Temp: " + temp);
                        $fiveDayCard.find(".fiveDayCardWind").text("Wind: " + wind);
                        $fiveDayCard.find(".fiveDayCardHumidity").text("Humidity: " + humidity);

                        cardIndex++;
                    }

                    $("#showHide").css("visibility", "visible");

                    // // Save the searched city to local storage
                    // searchedCities.push(cityName);
                    // localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

                    if (!searchedCities.includes(cityName)) {
                        // Save the searched city to local storage
                        searchedCities.push(cityName);
                        localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
                    }

                    // Display the updated list of searched cities
                    displaySearchedCities();
                })
        }

        getWeatherData();
        // Clear the input field
        $(".input").val("");
        $(".input").focus();
    }
});