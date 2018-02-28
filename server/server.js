const path = require('path');
const body = require('body-parser');
const cookie = require('cookie-parser');
const debug = require('debug');
const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const logger = debug('mylogger');
const public = __dirname + "/../public/";

class User {

    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.rate = Math.round(Math.random() * 100);
    }

    addToDate(value) {
        this.rate += value;
    }
}

const users = {
    'a_ikchurin': new User('tyoma11.95@mail.ru', 'a_ikchurin', 'pswd'),
    'cvkucherov': new User('cvkucherov@yandex.ru', 'cvkucherov', 'pswd'),
    'gabolaev': new User('gabolaev98@gmail.com', 'gabolaev', 'pswd'),
    'venger': new User('farir1408@gmail.com', 'venger', 'pswd')
};

const games = [
    {
        'type': 'Single',
        'active': true,
        'users': [
            'venger'
        ]
    },
	{
		'type': 'Single',
		'active': false,
		'users': [
			'venger'
		]
	},
	{
		'type': 'Single',
		'active': true,
		'users': [
			'gabolaev'
		]
	},
	{
		'type': 'Multi2',
		'active': false,
		'users': [
			'venger',
            'gabolaev'
		]
	},
	{
		'type': 'Multi3',
		'active': true,
		'users': [
			'venger',
            'cvkucherov',
            'a_ikchurin'
		]
	},
];

const uuidUname = {};

app.use('/static', express.static(path.join(__dirname + '/../public/static')));
app.use(body.json());
app.use(cookie());

app.get('/', (req, res) => {
    logger(`${req.url} ${req.method}`);
    res.sendFile(path.join(public + 'template/index.html'));
});


const regexes = {
    username: {
        regex: /^([a-zA-Z0-9]{7,})+$/,
        desc: "minimum lenght is 7, only digits and english symbols are allowed"
    },
    password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        desc: "minimum lenght is 6, only english symbols and at least one digit"

    },
    password_confirmation: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        desc: "should be equal to the password"
    },
    email: {
        regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        desc: "meh"
    }
};

function validateSignUp(fields) {

    for (const key of Object.keys(regexes)) {
        if (!(key in fields))
            return {
                status: 'ERROR',
                desc: `Not found ${key} argument`
            }
        if (!(fields[key].match(regexes[key].regex)))
            return {
                status: 'ERROR',
                desc: `${key} invalid format: ${regexes[key].desc}`
            }
    }

    if (fields.password !== fields.password_confirmation) {
        return {
            status: 'ERROR',
            desc: 'Passwords don\'t match'
        }
    }
    if (users[fields.username])
        return {
            status: 'ERROR',
            desc: 'User already exists'
        };

    return {
        status: 'OK',
        desc: 'User created',
        id: Object.keys(users).length
    }
};

function validateSignIn(fields) {

    for (const key of Object.keys(regexes).slice(0, 2)) {
        if (!(key in fields))
            return {
                status: 'ERROR',
                desc: `Not found ${key} argument`
            }
    }

    const candidateUser = users[fields.username];
    if (candidateUser && (fields.password === candidateUser.password)){
        return {
            status: 'OK',
            desc: 'Successfully authorized'
        }
    } else {
        return {
            status: 'Error',
            desc: 'Invalid username or password'
        }
    }
}


function ssidResponseBuilder(data, result, res) {
    if (result.status === 'OK') {
        const generatedUUID = uuid();
        uuidUname[generatedUUID] = data.username;
        res.cookie('ssid', generatedUUID, {
            expires: new Date(Date.now() + 1000 * 60 * 10)
        });
        res.status(201).json(result);
    } else {
        res.status(401).json(result);
    }
}

app.post('/signup', (req, res) => {
    data = req.body;
    ssidResponseBuilder(data, validateSignUp(data), res);
    if (res.statusCode === 201) {
        const newUser = new User(data.email, data.username, data.password, data.password_confirmation);
        users[data.username] = newUser;
    }
});

app.post('/signin', (req, res) => {
    data = req.body;
    ssidResponseBuilder(data, validateSignIn(data), res);
});

app.get('/me', (req, res) => {
    const ssidCookie = req.cookies['ssid'];
    const username = uuidUname[ssidCookie];

    (ssidCookie && username) ? res.json(users[username]): res.status(401).end();
});

app.get('/me/games', (req, res) => {
   const ssidCookie = req.cookies['ssid'];
   const username = uuidUname[ssidCookie];
   
   if (ssidCookie && username) {
       return res.json(games.filter(game => game.users.includes(username)));
   } else {
       res.status(401).end();
   }
});

app.get('/scoreboard', (req, res) => {
    logger(`${req.url} ${req.method}`);
    const sorted = Object.values(users).sort((a, b) => a.rate < b.rate);
    res.send(JSON.stringify(sorted));
});

app.listen(process.env.PORT || 5000);