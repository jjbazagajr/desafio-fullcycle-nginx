const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'db', // O host do banco. Ex: localhost
    user: 'root', // Um usuário do banco. Ex: user 
    password: 'docker', // A senha do usuário. Ex: user123
    database: 'docker_db' // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});

con.connect((err) => {
    if (err) {
        console.log('Erro connecting to database...', err)
        return
    }
    console.log('Connection established!')
})

con.query(
    'CREATE TABLE IF NOT EXISTS peaple (id int(11) NOT NULL AUTO_INCREMENT, nome varchar(255) NOT NULL,  PRIMARY KEY (id));', (err, result) => {
        if (err) throw err;

        console.log(`Cria tabela, caso não exista`);
    }
);

con.query(
    'DELETE FROM peaple;', (err, result) => {
        if (err) throw err;

        console.log(`Limpa registros`);
    }
);
let count = 1;
let peaples = [];

function criaPessoa() {
    const novaPessoa = {
        nome: 'Maria_' + count
    }

    con.query(
        'INSERT INTO peaple SET ?', novaPessoa, (err, res) => {
            if (err) throw err

            console.log(`Nova pessoa adicionada ID: ${res.insertId}`)
        });
    count++;
}

function listaPessoas() {
    con.query('SELECT * FROM peaple', (err, rows) => {
        if (err) throw err
        peaples = JSON.parse(JSON.stringify(rows.map(row => row.nome)));
    })
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if (req.url !== '/favicon.ico') {
        criaPessoa();
        listaPessoas();
        let peapleHtml = '';
        peaples.forEach(peaple => peapleHtml += `<li>${peaple}</li>\n`);
        const listaHtml = `<ul>${peapleHtml}</ul>`;
        res.end('<h1>Full Cycle Rocks!</h1> \n' + listaHtml);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});