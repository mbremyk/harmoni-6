class DefaultMail {
    constructor() {
        this.hilsen = `\nMed vennlig hilsen\nHarmoni team 6 support team`;
        this.user;
        this.date;
        this.text;
        this.subject;
        this.email;
        this.password;
    }

    get bugText() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt din rapport og har satt våre fremste utviklere på saken.\n` +
            `\nDitt support-nummer er ${Math.floor(Math.random() * 1000000)}\n` +
            `På ${this.date} skrev du: \n\n${this.text}\n\n` +
            `Hvis du har spørsmål eller mer informasjon kan du sende det som svar på denne mailen\n` +
            this.hilsen;
    }

    get passwordText() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt en forespørsel om nytt passord fra din bruker. Hvis du ikke har sendt en forespørsel om nytt passord, kan du se bort ifra denne mailen.\n\n` +
            `Ditt engangspassord er: ${this.password}\n\n` +
            `Dette passordet virker kun én gang, og det anbefales å bytte passord på Min Side så fort du har logget inn.\n` +
            this.hilsen;
    }


    get contactText() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt din epost og ser på den så fort vi har tid.\n\n` +
            `Ditt support-nummer er ${Math.floor(Math.random() * 1000000)}\n\n` +
            `På ${this.date} skrev du: \n\n${this.text}\n\n` +
            `Hvis du har flere spørsmål eller informasjon som er relevant for denne saken kan du sende det som et svar på denne mailen\n` +
            this.hilsen;
    }

    get infoText() {
        return `Den ${this.date} skrev ${this.user}:\n\n${this.text}\n\n${this.user} kan nåes på ${this.email}`;
    }
}

module.exports = {DefaultMail};