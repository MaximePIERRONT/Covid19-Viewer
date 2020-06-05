createDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);
    // create the "Time" table
    covid.createTable("Time", ["Date"]);

    // create the "Global" table
    covid.createTable("Global", ["NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered"]);

    // create the "EvolutionCountries" table
    covid.createTable("EvolutionCountries", ["CountryCode", "Confirmed", "Deaths", "Recovered", "Date"]);

    covid.commit();

    let settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response.Countries);
        console.log(response.Global);

        // create the table and insert records in one go
        covid.createTableWithData("Countries", response.Countries);

        covid.commit();

        // insert global stat
        covid.insert("Global", response.Global);

        const timing = response.Date;
        covid.insert("Time", {
            Date: timing
        });

        covid.commit();
    });

    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    covid.commit();
}

dbCovidExist = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    return covid.tableCount() === 4;
}

diffTime = () => {

    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll('Time');
    let lastUpdate = new Date(resQuery[0].Date);
    lastUpdate.setHours(lastUpdate.getHours() + 6);
    return Date.now() - lastUpdate > 0;
}

findNameCountry = (codeCountry) => {

    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll("Countries", {
        query: {
            CountryCode: codeCountry
        }
    });

    return resQuery[0].Country;
}

addEvoCountry = (codeCountry) => {


    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const nameCountry = findNameCountry(codeCountry);
    const apiUrl = "https://api.covid19api.com/total/country/" + nameCountry;

    var settings = {
        "url": apiUrl,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        response.forEach(element => {
            covid.insertOrUpdate("EvolutionCountries", {
                CountryCode: codeCountry,
                Confirmed: element.Confirmed,
                Deaths: element.Deaths,
                Recovered: element.Recovered,
                Date: element.Date
            });
            covid.commit();
        });
        
    });

    covid.commit();
}

updateDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    covid.deleteRows("Time");
    covid.deleteRows("Global");

    let settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        covid.dropTable("Countries")
        // create the table and insert records in one go
        covid.createTableWithData("Countries", response.Countries);

        // insert global stat
        covid.insert("Global", response.Global);

        const timing = response.Date;
        covid.insert("Time", {
            Date: timing
        });

        covid.commit();
    });

    covid.commit();

}


printAll = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Countries");
    console.log(resQuery);
    resQuery = covid.queryAll("Global");
    console.log(resQuery);
    resQuery = covid.queryAll("Time");
    console.log(resQuery);
    resQuery = covid.queryAll("EvolutionCountries");
    console.log(resQuery);
}

selectCountriesCode = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Countries");
    var tabCodeCountries = [];

    resQuery.forEach(element => {
        console.log(element.CountryCode);
        tabCodeCountries.push(element.CountryCode);
    });
    return tabCodeCountries;
}

resetBase = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    covid.dropTable("Time");
    covid.dropTable("Global");
    covid.dropTable("Countries");
    covid.dropTable("EvolutionCountries");

    covid.commit();
}

selectGlobal = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Global");
    return resQuery[0];
}

selectTime = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Time");
    const datestr = resQuery[0].Date;
    const dateAPI = new Date(datestr);

    let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const mounth = months[dateAPI.getMonth()]
    const year = dateAPI.getFullYear()
    const day = dateAPI.getDate();
    return day + " " + mounth + " " + year;
}


selectCountries = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Countries");
    return resQuery;
}