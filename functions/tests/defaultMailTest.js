const defaultMail = require('../defaultMail.js');
const moment = require('moment');

let dm = new defaultMail.DefaultMail();

beforeEach(done => {
    dm.user = "user";
    dm.date = moment(new Date(2020, 0, 1)).format('YYYY-MM-DD');
    dm.text = "text";
    dm.subject = "subject";
    dm.email = "email";
    dm.password = "password";
    done();
});

describe('Test of DefaultMail', () => {
    it("has the correct properties", done => {
        expect(dm).toEqual({
            user: "user",
            date: moment(new Date(2020, 0, 1)).format('YYYY-MM-DD'),
            text: "text",
            subject: "subject",
            email: "email",
            password: "password",
            hilsen: `\nMed vennlig hilsen\nHarmoni team 6 support team`
        });
        done();
    });

    it("generates correct texts", done => {
        expect(dm.bugText).toBe(`Hei, user\n\n` +
            `Vi har mottatt din rapport og har satt våre fremste utviklere på saken.\n` +
            `\nDitt support-nummer er 123456\n` +
            `På 2020-01-01 skrev du: \n\ntext\n\n` +
            `Hvis du har spørsmål eller mer informasjon kan du sende det som svar på denne mailen\n` +
            `\nMed vennlig hilsen\nHarmoni team 6 support team`);
        expect(dm.passwordText).toBe(`Hei, user\n\n` +
            `Vi har mottatt en forespørsel om nytt passord fra din bruker. Hvis du ikke har sendt en forespørsel om nytt passord, kan du se bort ifra denne mailen.\n\n` +
            `Ditt engangspassord er: password\n\n` +
            `Dette passordet virker kun én gang, og det anbefales å bytte passord på Min Side så fort du har logget inn.\n` +
            `\nMed vennlig hilsen\nHarmoni team 6 support team`);
        expect(dm.contactText).toBe(`Hei, user\n\n` +
            `Vi har mottatt din epost og ser på den så fort vi har tid.\n\n` +
            `Ditt support-nummer er 123456\n\n` +
            `På 2020-01-01 skrev du: \n\ntext\n\n` +
            `Hvis du har flere spørsmål eller informasjon som er relevant for denne saken kan du sende det som et svar på denne mailen\n` +
            `\nMed vennlig hilsen\nHarmoni team 6 support team`);
        expect(dm.infoText).toBe(`Den 2020-01-01 skrev user:\n\ntext\n\nuser kan nåes på email`);
        done();
    })
});