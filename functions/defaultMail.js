class DefaultMail {
    user;
    date;
    text;
    subject;
    email;
    password;

    hilsen = `Med vennlig hilsen\nHarmoni team 6 support team`;

    set hilsen(hilsen) {
    }

    get bugText() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt din rapport og har satt våre fremste utviklere på saken.\n` +
            `På ${this.date} skrev du: \n\n${this.text}\n\n` +
            `Hvis du har spørsmål eller mer informasjon kan du sende det som svar på denne mailen\n\n` +
            this.hilsen;
    }

    get passwordText() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt en forespørsel om nytt passord fra din bruker. Hvis du ikke har sendt en forespørsel om nytt passord, kan du se bort ifra denne mailen.\n` +
            `Ditt engangspassord er: ${this.password}\n` +
            `Dette passordet virker kun én gang, og det anbefales å bytte passord på Min Side så fort du har logget inn.\n\n` +
            this.hilsen;
    }

    get subject() {
        return this.subject;
    }

    constructor() {

    }
}

module.exports = {DefaultMail};