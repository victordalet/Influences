const mysql = require('mysql');
const utf8 = require('utf8');

class Main{
    constructor() {
        this.connect_to_db();
        fetch('https://data.iledefrance.fr/api/records/1.0/search/?dataset=principaux-sites-touristiques-en-ile-de-france0&q=&rows=20')
            .then(r => r.text())
            .then(r=>this.data = r)
            .then(()=>this.separate_data())
    }


    connect_to_db() {
         this.conn = mysql.createConnection({
            host: "localhost",
            user: "victor",
            password: "victor",
            database : 'affluences'
        });
        this.conn.connect((err) => {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    create_table() {
        this.conn.query('CREATE TABLE SITE(ID INTEGER PRIMARY KEY, NAME VARCHAR(220),ADDRESS VARCHAR(220),COORDINATES VARCHAR(220))')
    }


     separate_data() {
        this.data = this.data.split('datasetid');
        for (let i = 1 ; i < this.data.length ; i++) {
            const name = this.data[i].split('typo_niv3": "')[1].split('",')[0]
            let adrrese = "";
            adrrese += this.data[i].split('adresse": "')[1].split('"')[0]
            adrrese += this.data[i].split('nomcom": "')[1].split('",')[0];
            const coo = this.data[i].split('coordinates": [')[1].split(']')[0]
            this.give_data_to_db(i,utf8.decode(name),utf8.decode(adrrese),coo)
        }
        this.get_data();
    }


    give_data_to_db(id,name,address,coo) {
        this.conn.query("INSERT INTO SITE(ID,NAME,ADDRESS,COORDINATES) VALUES(?,?,?,?)",
            [id,name,address,coo]);
    }

    get_data() {
        this.conn.query("SELECT * FROM SITE",(e,r)=>console.log(r));
    }
}


new Main();
