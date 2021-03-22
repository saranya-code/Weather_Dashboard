$(document).ready (function(){
    var APIKey = '&appid=801182514b92da3aaf2ac60d3b116bb8'
    var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q='
    var uvUrl = 'http://api.openweathermap.org/data/2.5/uvi?lat='
    var latitude
    var longitude


    var storedCities =  JSON.parse(localStorage.getItem('cities')) || []

    if(storedCities.length > 0){
        var lastSearchCity = storedCities[storedCities.length-1]
        currrentWeather(lastSearchCity)
    }

    $.each(storedCities,function(index, value){
        $(".cityList").append("<li class='list-group-item'>"+value+"</li>")
    })
      
  $(".cityList li").click(function(e){           //Selecting city from the list
      var selectedCity = $(e.target).text()
    currrentWeather(selectedCity)
  })
    
    //search Button
    $("#searchButton").click(function(){     //Getting searhbox value
        var search = $("#citySearch").val()   
        if (search == ''){                  //checking searhbox value is empty     
            return
        }
        $("#citySearch").val('')
        currrentWeather(search)
    });

    //Fetching weather API
    function currrentWeather(cityName){
        var url= weatherUrl+cityName+APIKey
        //console.log(url)
        fetch(url)
        .then(function(response) { 
            return response.json()
        })
        .then(function(data) { 
            // console.log(data)
            // var temperature = data.main.temp
            // temperature = (temperature - 273.15) * 1.80 + 32;
            if(data.cod != 200){
                $(".alert").removeClass("d-none")
            } else {
                $(".alert").addClass("d-none")
                //check searchbox value is present in localstorag(storecities)
                var cityExist = storedCities.find(function(city){      
                    // console.log(city)
                    return city.toLowerCase() == cityName.toLowerCase()
                })

                if(!cityExist) {
                    storedCities.push(cityName)
                    $(".cityList").append("<li class='list-group-item'>"+cityName+"</li>")
                    localStorage.setItem('cities', JSON.stringify(storedCities))
                }

                var temp = fahrenheit(data.main.temp)
                $(".currCityName").text(data.name +' ('+moment().format('l')+')')
                $("#temp").text(temp)
                $("#humidity").text(data.main.humidity)
                $("#windSpeed").text(data.wind.speed)
                latitude=data.coord.lat
                longitude=data.coord.lon
                uvIndex()
                foreCast(cityName)
                $("#currWeather").removeClass('d-none')
            }
        });

    }

    //function UV
    function uvIndex(){
        var url= "http://api.openweathermap.org/data/2.5/uvi?lat="+latitude+"&lon="+longitude+APIKey
        console.log(url,latitude,longitude)
        fetch(url)
        .then(function(response) { 
            return response.json()
        })
        .then(function(data) { 
            // console.log(data)
            $("#uvIndex").text(data.value)
        });
    }

    //function forecast cards
    function foreCast(cityName){
        var url= "http://api.openweathermap.org/data/2.5/forecast?q="+cityName+APIKey
        fetch(url)
        .then(function(response) { 
            return response.json()
        })
        .then(function(data) { 
            var fiveDayforecasts = data.list
            fiveDayforecasts = fiveDayforecasts.filter(function(forecast){
                //console.log(forecast.dt_txt)
                return forecast.dt_txt.includes("00:00:00")
            })
            console.log(fiveDayforecasts)
            $(".forecast").empty()
            $.each(fiveDayforecasts, function(index,forecast){
                // console.log(forecast.dt_txt,forecast.main.temp,forecast.main.humidity,forecast.weather[0].icon)
                var temp = fahrenheit(forecast.main.temp)
                var cardDate = moment(forecast.dt_txt).format('l');

                $(".forecast").append(
                `<div class='card bg-primary text-white m-3 p-3 '>
                    <div class='card-text date font-weight-bold mb-2'>${cardDate}</div>
                    <img class="mb-2" src="123.png" width="40" height="40" alt="Icon"/>
                    <div class='card-text temperature mb-2'>Temp: ${temp} °F</div>
                    <div class='card-text humidity'>Humidity: ${forecast.main.humidity}%</div>
                </div>`)
            })
        });
    }

    //fahrenheit conversion
    function fahrenheit(temperature){
        return ((temperature - 273.15) * 1.80 + 32).toFixed(1);
    }

});