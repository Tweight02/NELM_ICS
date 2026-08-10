export const environment = {
    production: false,
    apiUrl: {
        main: 'http://localhost:8000/api/v1',        // main-api (auth, admin)
        pastor: 'http://localhost:8001/api/v1',      // pastor-api
        secretary: 'http://localhost:8002/api/v1',   // secretary-api
        director: 'http://localhost:8003/api/v1',    // directors-api
        participant: 'http://localhost:8004/api/v1'  // participant-api
    }
};