const express = require('express');
const cors = require('cors')
const testConnection = require('./database').testConnection;
const handleInsertRecord = require('./Movie.service').handleInsertRecord;
const handleSelectRecords = require('./Movie.service').handleSelectRecords;
const handleSelectRecordsById = require('./Movie.service').handleSelectRecordsById;
const handleUpdateRecord = require('./Movie.service').handleUpdateRecord;
const handleSelectRecordsWithQuery = require('./Movie.service').handleSelectRecordsWithQuery;
const handleDelete = require('./Movie.service').handleDelete;
const handleSelectRecordsPaginated = require('./Movie.service').handleSelectRecordsPaginated;
const handleSelectRecordsSorted = require('./Movie.service').handleSelectRecordsSorted;
const handleSelectRecordsFiltered = require('./Movie.service').handleSelectRecordsFiltered;

const Movie = require('./database').Movie;
const CrewMember = require('./database').CrewMember;
const sequelize = require('./database').sequelize;

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.get('/about', (req, res) => {
    res.send('This is my app. Nu face prea multe ...');
});

app.get('/movie', async (request, response) => {
    try {
        await handleSelectRecords(Movie, response);
        response.status(200).json(records).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

// ------------ filter, sort, pagination ---------

app.get('/movie/paginate', async (request, response) => {
    const page = request.query.page;
    const pageSize = request.query.pageSize;

    try {
        await handleSelectRecordsPaginated(Movie, page, pageSize, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.get('/movie/sort', async (request, response) => {
    const { field, direction } = request.query;
    if (!field || !direction || (direction != 'ASC' && direction != 'DESC')) {
        return response.status(400).json({
            message: "Bad request",
        });
    }

    try {
        await handleSelectRecordsSorted(Movie, field, direction, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.get('/movie/filter', async (request, response) => {
    const fields = request.query;
    console.log(fields);
    try {
        await handleSelectRecordsFiltered(Movie, fields, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});


// ----- rest of CRUD -----

app.get('/movie/:id', async (req, response) => {
    try {
        const record = await handleSelectRecordsById(Movie, req.params.id);
        if (record == null) {
            return response.status(404).send();
        }
        response.json(record).status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
})

app.post('/movie', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleInsertRecord(Movie, request, response);
        response.status(201).json({
            message: "Created successfully a new Movie",
            data: record
        });
    }
    catch (err) {
        response.status(400).json({
            message: "Bad request",
        });;
    }
})


app.put('/movie/:id', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleUpdateRecord(Movie, request.params.id, request.body);
        if (record == null) {
            return response.status(404).send();
        }

        response.status(200).json({
            message: "Updated successfully the Movie",
            data: record
        });
    }
    catch (err) {
        console.log(err)
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.delete('/movie/:id', async (request, response) => {
    try {
        await handleDelete(Movie, request.params.id, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});


// -------------------------- subresource ----------------- // 

app.get('/movie/:id/crewMember', async (req, response) => {
    try {
        await handleSelectRecordsWithQuery(CrewMember, { MovieId: req.params.id }, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

//  ----------- BASIC CRUD -----------

app.get('/crewMember/:id', async (req, response) => {
    try {
        const record = await handleSelectRecordsById(CrewMember, req.params.id, response);
        if (record == null) {
            return response.status(404).send();
        }
        response.status(200).json(record).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
})

app.post('/crewMember', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleInsertRecord(CrewMember, request, response);
        response.status(201).json({
            message: "Created successfully a new CrewMember",
            data: record
        });
    }
    catch (err) {
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.put('/crewMember/:id', async (request, response) => {
    console.log(request.body);
    try {
        const record = await handleUpdateRecord(CrewMember, request.params.id, request.body);
        if (record == null) {
            return response.status(404).send();
        }

        response.status(200).json({
            message: "Updated successfully the CrewMember",
            data: record
        });
    }
    catch (err) {
        console.log(err)
        response.status(400).json({
            message: "Bad request",
        });;
    }
})

app.delete('/crewMember/:id', async (request, response) => {
    try {
        await handleDelete(CrewMember, request.params.id, response);
        response.status(200).send();
    }
    catch (err) {
        console.log(err);
        response.status(400).json({
            message: "Bad request",
        });
    }
});

app.listen(4000, async () => {
    console.log('Started on port 4000...');
    try {

        await sequelize.sync()
    } catch (err) {
        console.log(err);
    }
    testConnection();
});