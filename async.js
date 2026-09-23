const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const countryInput = document.querySelector('.country-input');
const countryInfo = document.querySelector(".country-info");


    // function to invoke/display country data on the web
const renderCountry = function (data, className = '') {

     html = `
    <article class="country ${className}">
          <img class="country__img" src="${data.flag}"/>
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `

    countriesContainer.insertAdjacentHTML('beforeend', html);
    // activate the active class added manualy on the CSS
    countriesContainer.classList.add("active");
}

// function for redering error
const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.classList.add("active");
}



// GETTING COUNTRY AND NEIGHBOURING COUNTRY DATA USING ASYNC/AWAIT AND FETCH API
const getCountryData = async function (country) {
    try {
        // fetching the country data from the API and storing it in a variable(response)
        const response = await fetch(`https://countries-api-836d.onrender.com/countries/name/${country}`)
        if (!response.ok) throw new Error(`Problem getting response! country not found! ${response.status}`)
        
        // converting the response to JSON format and storing it in a variable(data)
        const data = await response.json()
        renderCountry(data[0])
        
        // getting the neighbouring country of the country that was fetched
        const neighbour = data[0].borders[0]
        console.log(neighbour)
        if (!neighbour) throw new Error(`neighbour not found! ${response.status}`)
        
        // fetching the neighbouring country data from the API and storing it in a variable(response2)
        const response2 = await fetch(`https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`)
        if (!response2.ok) throw new Error(`Problem getting response! neighbour not found! ${response2.status}`)
        console.log(response2)
        
        // converting the response to JSON format and storing it in a variable(data2)
        const data2 = await response2.json()
        renderCountry(data2, 'neighbour')

    }
    catch(err) {
        console.log(err)
        renderError(`${err.message}.Try again`)
    }
    finally {
        // changing the button text back to "Get country" after the data has been fetched or an error has occurred
        btn.innerHTML = "Get country";

        // clearing the input field after the data has been fetched
        countryInput.value = "";
    }
}


// event listener for the button click
btn.addEventListener("click", () => {

    // getting the value of the input field and storing it in a variable
    let countryName = countryInput.value;

    // if the input field is empty, display an error message and return from the function
    if (!countryName) {
        renderError(`Please enter a country name!`);
        return;
    }
    // clearing the countries container before displaying the new country data
    countriesContainer.innerHTML = "";

    // removing the country info
    countryInfo.classList.add("active1")

    // changing the button text to "Loading..." while the data is being fetched
    btn.innerHTML = "Loading...";

    // calling the getCountryData function and passing the country name as an argument
    getCountryData(countryName);

});