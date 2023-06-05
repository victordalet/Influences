const mysql = require('mysql');

class Main{
    constructor() {
        this.connect_to_db();
        fetch('https://data.iledefrance.fr/api/records/1.0/search/?dataset=principaux-sites-touristiques-en-ile-de-france0&q=&rows=20')
            .then(r => r.json())
            .then(r => this.data = r)
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

    async separate_data() {
        const max_iter = this.data['nhits'];
        for (let i = 0 ; i < max_iter ; i+= 20){
            for (let j = 0 ; j < 20 ; j++) {
                this.give_data_to_db(j+i, this.data['records'][j]['fields']['typo_niv3'], this.data['records'][j]['fields']['adresse'], this.data['records'][j]['geometry']['coordinates'][0].toString()+this.data['records'][j]['geometry']['coordinates'][1].toString())
            }
            this.data = await fetch('https://data.iledefrance.fr/api/records/1.0/search/?dataset=principaux-sites-touristiques-en-ile-de-france0&q=&rows=20&start='+(i+20).toString())
            this.data = await this.data.json();
        }
    }


    give_data_to_db(id,name,address,coo) {
        this.conn.query("INSERT INTO SITE(ID,NAME,ADDRESS,COORDINATES) VALUES(?,?,?,?)",
            [id,name,address,coo]);
    }

}


new Main();
