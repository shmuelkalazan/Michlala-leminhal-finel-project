export default {
    "routs": {
        "login": {
            "jobRequest": "login",
            "pollingRequest": "loginStatus",
            "setInterval": 5000
        },
        "data": {
            "jobRequest": "fetchData",
            "pollingRequest": "dataStatus",
            "setInterval": 3000
        }
    }
};