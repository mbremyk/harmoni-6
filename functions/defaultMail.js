class DefaultMail {
    user;
    date;
    text;
    subject;
    email;

    get bug() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt din rapport og har satt våre fremste utviklere på saken.\n` +
            `På ${this.date} skrev du: \n\n${this.text}\n\n` +
            `Hvis du har spørsmål eller mer informasjon kan du sende det som svar på denne mailen\n\n` +
            `Med vennlig hilsen\nHarmoni team 6 support team`;
    }

    get password() {
        return `Hei, ${this.user}\n\n` +
            `Vi har mottatt en forespørsel om nytt passord fra din bruker. Hvis du ikke har sendt en forespørsel om nytt passord, kan du se bort ifra denne mailen.\n` +
            ``
    }

    get subject() {
        return this.subject;
    }

    constructor() {

    }
}

module.exports = {DefaultMail};