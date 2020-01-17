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

    get subject() {
        return this.subject;
    }

    constructor() {

    }
}

module.exports = {DefaultMail};